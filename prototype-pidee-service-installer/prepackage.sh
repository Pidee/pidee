#!/bin/bash

# prepackage.sh
# 
# Script to automate colelction all files needed to distribute pidee or to package it into a .deb file
# If successful it returns the path to the tarball
#
# Usage
# =====
# 
# $ prepackage.sh [pidee source path]
# > /path/to/pidee.tar.gz
#
# Notes
# =====
#
# The script silences stdout by wrapping all commands into a { command group } and redirecting to /dev/null like so:
# { command1; command2; } > /dev/null
# stderr is printed to the console
# error_exit can be used to control exit status


## Enable extended globbing (eg: dir/{a,b}/*)
shopt -s extglob;

# Get the absolute parent dir of this file
# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in?page=1&tab=votes#tab-top
this_script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

script_name=$(basename $0)

## error_exit "$LINENO: An error has occurred."
function error_exit {
	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2 && exit 1;
}

{
	>&2 echo "Started $script_name"

	# Check core dependency on md2man utility
	hash md2man-roff 2>/dev/null || { printf >&2 "Ruby gem \"md2man\" is required, but it's not installed. Aborting. Please run:\n$ gem install md2man\n"; exit 1; }

	## Set the pidee service dir to argument or default
	pidee_source_dir=${1:-$this_script_dir/../prototype-pidee-service}

	## Get a temporary directory to work in
	temp_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )

	## Create the package directory tree
	>&2 echo "—— Creating directory tree…"
	mkdir -p $temp_dir/etc/pidee
	mkdir -p $temp_dir/usr/bin
	mkdir -p $temp_dir/usr/sbin
	mkdir -p $temp_dir/usr/lib/pidee/node
	mkdir -p $temp_dir/usr/lib/pidee/pidee
	mkdir -p $temp_dir/usr/share/doc/pidee
	mkdir -p $temp_dir/usr/share/man/man1
	mkdir -p $temp_dir/usr/share/man/man8

	## Copy Pidee source files to /usr/lib/pidee/pidee
	>&2 echo "—— Copying source files…"
	cp -r $pidee_source_dir/* $temp_dir/usr/lib/pidee/pidee
	pushd $temp_dir
	find . -name ".npm-debug.log" -print0 | xargs -0 rm -f
	find . -name ".DS_Store" -print0 | xargs -0 rm -f
	popd

	## Copy default configuration file
	>&2 echo "—— Copying default configuraton files…"
	cp -r $temp_dir/usr/lib/pidee/pidee/conf/* $temp_dir/etc/pidee

	## Copy proxy bin(s) to destination
	>&2 echo "—— Copying proxy binaries…"
	cp -r $this_script_dir/assets/pidee-cli-proxy.js $temp_dir/usr/bin/pidee
	cp -r $this_script_dir/assets/pidee-service-proxy.js $temp_dir/usr/sbin/pidee-service
	chmod +x $temp_dir/usr/bin/pidee
	chmod +x $temp_dir/usr/sbin/pidee-service

	## Copy README.md to /usr/doc/pidee/README.md
	>&2 echo "—— Copying docs…"
	cp -r $temp_dir/usr/lib/pidee/pidee/README* $temp_dir/usr/share/doc/pidee

	## Create man pages
	>&2 echo "—— Generating man pages…"
	pushd $pidee_source_dir/man
	md2man-roff pidee.1.md > $temp_dir/usr/share/man/man1/pidee.1
	md2man-roff pidee-service.8.md > $temp_dir/usr/share/man/man8/pidee-service.8
	popd

	## Download, untar and copy Node JS from Joyent. Last precompiled Raspberry Pi version is 0.10.28. Then they stopped.
	>&2 echo "—— Unpacking node_armhf tarball…"
	node_temp_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )
	pushd $node_temp_dir
	mkdir -p node
	tar xf $this_script_dir/assets/node_armhf.tar.gz --directory node --strip 1
	cp -r node/* $temp_dir/usr/lib/pidee/node
	popd


	## Tarball it!
	>&2 echo "—— Creating pidee tarball…"
	archive_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )
	pushd $temp_dir
	tar czf $archive_dir/pidee.tar.gz .
	popd;

	>&2 echo "—— $script_name completed successfully."
	>&2 echo " "
} > /dev/null

## Return the path to the archive
echo $archive_dir/pidee.tar.gz
exit 0
