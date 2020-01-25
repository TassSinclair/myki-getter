const puppeteer = require('puppeteer');
const config = require('./data/config.js');

function startBrowser() {
    return puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: [
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
}

async function updateBalances(balances) {
    let table = await db.get('balances');
    for (const balance of balances) {
        await table.upsert(balance, { card: balance.card, balance: balance.balance }).write();
    }
}

const REGEX = /^(\d+)\t([\w ]+)\t(-?\$[\d.]+)/;

function toBalance(row) {
    const values = row.match(REGEX);
    return {
        card: values[1],
        owner: values[2],
        balance: values[3].replace(/[^0-9.-]+/g, ''),
    };
}

async function scrape(db, browser) {
    const page = await browser.newPage();
    page.on('console', msg => {
        if (!['info', 'warning'].includes(msg.type())) {
            console.log(`${msg.type()}: ${msg.text()}`);
        }
    });
    page.setDefaultTimeout(1000 * 60 * 2);

    console.log('getting myki balances')
    await page.goto('https://www.mymyki.com.au/NTSWebPortal/Login.aspx');
    await page.click('#ctl00_uxContentPlaceHolder_uxUsername');
    await page.keyboard.type(config.username);
    await page.click('#ctl00_uxContentPlaceHolder_uxPassword');
    await page.keyboard.type(config.password);
    await page.click('#ctl00_uxContentPlaceHolder_uxLogin');

    await page.waitForSelector('#ctl00_uxContentPlaceHolder_uxMyCards');


    const listItems = await page.$$eval('#ctl00_uxContentPlaceHolder_uxMyCards tr',
        trs => trs.slice(1).map(tr => tr.innerText)
    );

    const balances = listItems.map(toBalance);
    console.log('updating', balances.length, 'balances');
    await updateBalances(balances);
    console.log('stopping browser');
    await page.close();
}

function timeToMinutes(time) {
    return `${time / 1000 / 60} minutes`;
}

function delay(time) {
    return new Promise(function (resolve) {
        console.log(`sleeping for ${timeToMinutes(time)}...`);
        setTimeout(() => resolve(`sleep for ${timeToMinutes(time)} finished, waking up`), time);
    });
}

function timeout(time) {
    return new Promise(function (resolve, reject) {
        console.log(`setting timeout of ${timeToMinutes(time)}...`)
        setTimeout(() => reject(new Error(`reached timeout of ${timeToMinutes(time)}`)), time)
    });
}

async function iterate(browser) {
    try {
        await Promise.race([
            timeout(1000 * 60 * 5),
            scrape(db, browser),
        ]);
    } catch (e) {
        console.log(`failed to lookup balances`, e);
    }

}

module.exports = async (db) => {
    while (true) {
        try {
            const browser = await startBrowser();
            await iterate(browser);
            await browser.close();
            await delay(1000 * 60 * 10);
        } catch (e) {
            console.log(`browser crashed, restarting`, e);
        }
    }
};
