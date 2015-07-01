# Pidee Service Package

This is the Raspian / Debian package for the Pidee board system driver and API provider service.

## Installation

There are various ways to install the Pidee service. If you are unsure, use the first option below.

### Option 1: via apt-get

To get started, edit the file  in `/etc/apt/sources.list` and paste or type the following:

If necessary, replace `wheezy` with the name of your Raspbian distribution.

```plain
deb http://pidee.theworkers.net/raspbian wheezy main
```

If you don't know how, you can simply copy-paste the following in the terminal:

```shell
sudo echo "deb http://pidee.theworkers.net/raspbian wheezy main" >> /etc/apt/sources.list
```

Then add Pidee's GPG key, so you can have some confidence that the packages come from the correct server. Again, copy-paste the following in the terminal:

```shell
wget -qO - http://pidee.theworkers.net/pidee.public.key | sudo apt-key add -
```

The above downloads (with `wget`) our public key ([just a text file](http://pidee.theworkers.net/pidee.public.key)) and calls the Debian/Raspbian command `apt-key add` (with `sudo` and getting the key from the result of `wget`)

Once you are done with the steps above, run:

```shell
sudo apt-get update
sudo apt-get install pidee
```

Wait a little and enjoy!

### Option 2: by manually downloading and installing the package with dpkg

Go to [http://pidee.theworkers.net/raspbian/pool/main/p/pidee/](http://pidee.theworkers.net/raspbian/pool/main/p/pidee/) and download the latest version you can find in the list. You can also copy the link and download directly on the Pi via `wget`. See example below.

<!--
from https://raspberry-hosting.com/en/faq/where-can-i-find-actual-haproxy-and-keepalived-deb-packages-raspberry-pi-and-how-i-install-high
-->

```shell
$ wget http://pidee.theworkers.net/raspbian/pool/main/p/pidee/pidee_VERSION_armhf.deb
$ sudo dpkg -i ./pidee_VERSION_armhf.deb
```

Replace `pidee_VERSION_armhf` with an actual version number. For example `pidee_1.0.0_armhf` or whatever is the latest.

## Installation directories

For the curious, the software will be installed into the directory tree below.

    .
    ├── etc
    │   └── pidee
    │       └── pidee.conf
    ├── usr
    │   ├── bin
    │   │   └── pidee
    │   ├── lib
    │   │   └── pidee
    │   │       ├── node
    │   │       │   ├── bin
    │   │       │   │   ├── node
    │   │       │   │   └── npm
    │   │       │   ├── include
    │   │       │   ├── lib
    │   │       │   └── share
    │   │       ├── pidee
    │   │       │   ├── README.md
    │   │       │   ├── bin
    │   │       │   │   ├── pidee-cli
    │   │       │   │   └── pidee-service
    │   │       │   ├── conf
    │   │       │   │   └── pidee.conf
    │   │       │   ├── libs
    │   │       │   │   ├── pidee-config.js
    │   │       │   │   ├── pidee-gpio-connect.js
    │   │       │   │   ├── pidee-service.js
    │   │       │   │   └── pidee-utils.js
    │   │       │   ├── man
    │   │       │   │   ├── pidee-service.8.md
    │   │       │   │   └── pidee.1.md
    │   │       │   ├── node_modules
    │   │       │   └── package.json
    │   │       ├── pidee.init
    │   │       └── pidee.service
    │   ├── sbin
    │   │   └── pidee-service
    │   └── share
    │       ├── doc
    │       │   └── pidee
    │       │       └── README.md
    │       └── man
    │           ├── man1
    │           │   └── pidee.1
    │           └── man8
    │               └── pidee-service.8
    └── var
        └── lib
            └── pidee
                └── pidee.sock
