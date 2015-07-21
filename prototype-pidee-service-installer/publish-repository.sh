#!/bin/bash

## Keys and such
## On the server (after having imported the GPG public/private keys)
## Export the public key for APT import
## $ cd ~/webapps/theworkers_net_pidee
## $ gpg --armor --export pidee@theworkers.net --output pidee.public.key > pidee.public.key
## On the client:
## $ wget -qO - http://pidee.theworkers.net/pidee.public.key | sudo apt-key add -

## Note add a ~passphrase file (text file with your password) to unlock gpg

## Enable extended globbing (eg: dir/{a,b}/*)
shopt -s extglob;

hash aptly 2>/dev/null || { printf >&2 "\"aptly\" is required. See http://aptly.info or \`brew install aptly\`. Aborting.\n"; exit 1; }

# Get the absolute parent dir of this file
# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in?page=1&tab=votes#tab-top
this_script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

script_name=$(basename $0)

## Create repos if not already there
## One per distribution / component …
aptly repo create -distribution=wheezy  -component=main pidee-wheezy-main 2> /dev/null
aptly repo create -distribution=jessie  -component=main pidee-jessie-main 2> /dev/null
aptly repo create -distribution=stretch -component=main pidee-stretch-main 2> /dev/null

## Gobble the .deb files and add-replace to the repos
## pass -force-replace to replace all debs:
## aptly repo add -force-replace pidee-wheezy-main  ./~debs
pushd $this_script_dir
aptly repo add pidee-wheezy-main  ./~debs
aptly repo add pidee-jessie-main  ./~debs
aptly repo add pidee-stretch-main ./~debs
popd

## I you feel things are too simple, you can improve complication with snapshots
# aptly snapshot create pidee-1.0.1-wheezy-main from repo pidee-wheezy-main
# aptly snapshot create pidee-1.0.1-jessie-main from repo pidee-jessie-main
# aptly snapshot create pidee-1.0.1-stretch-main from repo pidee-stretch-main

## Create a repo publication
## This needs to run only once
aptly publish repo -passphrase-file="~passphrase" pidee-wheezy-main 2> /dev/null
aptly publish repo -passphrase-file="~passphrase" pidee-jessie-main 2> /dev/null
aptly publish repo -passphrase-file="~passphrase" pidee-stretch-main 2> /dev/null

## Update the repo publication
aptly publish update -passphrase-file="~passphrase" wheezy
aptly publish update -passphrase-file="~passphrase" jessie
aptly publish update -passphrase-file="~passphrase" stretch

## Rsync the changes to the server
rsync -azP --delete ~/.aptly/public/ theworkers@theworkers.net:~/webapps/theworkers_net_pidee/raspbian
