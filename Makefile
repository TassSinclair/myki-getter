build:
	docker build -t myki-getter .
run:
	docker run -ti --rm --cap-add=SYS_ADMIN --shm-size 2G -p 8764:8764 myki-getter
debug:
	docker run -ti --rm --cap-add=SYS_ADMIN --shm-size 2G -p 8764:8764 myki-getter /bin/sh
