# Pidee Service Package

This is the Raspian / Debian package for the Pidee board system driver and API provider service.

## Installation

There are various ways to install the Pidee service. If you are unsure, use the first option below.

### Via apt-get

To get started, edit the file  in `/etc/apt/sources.list` and paste or type the following:

```plain
deb http://pidee.herokuapp.com/raspbian wheezy main contrib non-free
deb-src http://pidee.herokuapp.com/raspbian wheezy main contrib non-free
```
### Via remote shell script

Alternatively you can run the following line in your console

<!--
Inspired by:
http://stackoverflow.com/questions/5735666/execute-bash-script-from-url
-->

```shell
bash <(wget -q https://pidee.herokuapp.com/bootstrap -O -)
```

### By manually downloading and installing the package with apt-get

<!--
from https://raspberry-hosting.com/en/faq/where-can-i-find-actual-haproxy-and-keepalived-deb-packages-raspberry-pi-and-how-i-install-high
-->

```shell
# as root
$ apt-get update && apt-get -y upgrade
$ wget https://pidee.herokuapp.com/pidee-raspberry-pi/pidee_1.0.0_armhf.deb
$ dpkg -i ./pidee_1.0.0_armhf.deb
$ /etc/init.d/pidee restart
```


## Installation directories

The software will be installed into the directory tree below.

    .
    ├── etc
    │   └── pidee
    │       ├── default.js
    │       └── index.js
    └── usr
        ├── bin
        │   └── pidee
        ├── lib
        │   └── pidee
        │       ├── node
        │       │   ├── ChangeLog
        │       │   ├── LICENSE
        │       │   ├── README.md
        │       │   ├── bin/…
        │       │   ├── include/…
        │       │   ├── lib/…
        │       │   └── share/…
        │       └── pidee
        │           ├── README.md
        │           ├── bin/…
        │           ├── conf/…
        │           ├── libs/…
        │           ├── man/…
        │           ├── node_modules/…
        │           └── package.json
        ├── sbin
        │   └── pidee-service
        └── share
            ├── doc
            │   └── pidee
            │       └── README.md
            └── man
                ├── man1
                │   └── pidee.1
                └── man8
                    └── pidee-service.8
