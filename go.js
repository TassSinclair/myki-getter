const low = require('lowdb');
const _ = require('lodash');
const FileAsync = require('lowdb/adapters/FileAsync');

(async () => {
    console.log('starting app...');
    db = await low(new FileAsync('db.json'));
    await db.defaults({ accounts: [] }).write();

    db._.mixin({
        upsert: (collection, obj, matcher) => {
            const found = _.find(collection, matcher);
            if (found) {
                _.assign(found, obj);
                return collection;
            }
            return collection.push(obj);
        }
    });

    require('./serve')(db);
    require('./scrape')(db);
    console.log('started')
})();
