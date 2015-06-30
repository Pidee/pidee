# Pidee Service Package

This is the Raspian / Debian package for the Pidee board system driver and API provider service.

## Installation

There are various ways to install the Pidee service. If you are unsure, use the first option below.

### Via apt-get

To get started, edit the file  in `/etc/apt/sources.list` and paste or type the following:

If necessary, replace `wheezy` with the name of your Raspbian distribution.

```plain
deb http://pidee.theworkers.net/raspbian wheezy main
```
If you don't know how, you can simply copy-paste the following in the terminal:

```shell
sudo echo "deb http://pidee.theworkers.net/raspbian wheezy main" >> /etc/apt/sources.list
```

Then add the GPG key, so you can have some confidence that the packages come from the correct server. Again, copy-paste the following in the terminal:

```shell
wget -qO - http://pidee.theworkers.net/pidee@theworkers.net.gpg.key | sudo apt-key add -
```

The above downloads (with `wget`) our public key ([just a text file](http://pidee.theworkers.net/pidee@theworkers.net.gpg.key)) and calls the Debian/Raspbian command `apt-key add` (with `sudo` and getting the key from the result of `wget`)

Once you are done with the steps above, run:

```shell
sudo apt-get update
sudo apt-get install pidee
```

Wait a little and enjoy!

### Via remote shell script

Alternatively you can run the following line in your console

<!--
Inspired by:
http://stackoverflow.com/questions/5735666/execute-bash-script-from-url
-->

```shell
bash <(wget -q https://pidee.theworkers.net/bootstrap.sh -O -)
```

### By manually downloading and installing the package with apt-get

<!--
from https://raspberry-hosting.com/en/faq/where-can-i-find-actual-haproxy-and-keepalived-deb-packages-raspberry-pi-and-how-i-install-high
-->

```shell
# as root
$ apt-get update && apt-get -y upgrade
$ wget http://pidee.theworkers.net/raspbian/pool/main/p/pidee/pidee_1.0.0_armhf.deb
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
