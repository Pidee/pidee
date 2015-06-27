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

## error_exit "$LINENO: An error has occurred."
function error_exit {
	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2 && exit 1;
}

{
	# Check core dependencies
	hash md2man-roff 2>/dev/null || { printf >&2 "Ruby gem \"md2man\" is required, but it's not installed. Aborting. Please run:\n$ gem install md2man\n"; exit 1; }

	## Set the pidee service dir
	pidee_source_dir=${1:-~/Sources/pidee/prototype-pidee-service}

	## Get a temporary directory to work in
	temp_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )

	## Create the package's directory tree
	>&2 echo "—— Create directory tree"
	mkdir -p $temp_dir/usr/{local/{lib/{node,pidee},bin,sbin,share/man/{man1,man8}},share/doc/pidee}

	## Copy Pidee source files to /usr/local/lib/pidee
	>&2 echo "—— Copy source files"
	cp -r $pidee_source_dir/* $temp_dir/usr/local/lib/pidee
	pushd $temp_dir
	find . -name ".npm-debug.log" -print0 | xargs -0 rm -f
	find . -name ".DS_Store" -print0 | xargs -0 rm -f
	popd

	## Make the node scripts executable (possibly not needed)
	chmod +x $temp_dir/usr/local/lib/pidee/bin/*

	## Symlink bin/* to sbin/*
	>&2 echo "—— Symlink bin/* to sbin/*"
	pushd $temp_dir/usr/local/sbin
	ln -s ../lib/pidee/bin/pidee-service pidee-service
	popd
	pushd $temp_dir/usr/local/bin
	ln -s ../lib/pidee/bin/pidee-cli pidee
	popd


	## Copy README.md to /usr/local/doc/pidee/README.md
	>&2 echo "—— Copy README"
	cp -r $temp_dir/usr/local/lib/pidee/README* $temp_dir/usr/share/doc/pidee

	## Create and copy manpages
	>&2 echo "—— Manpages…"
	pushd $pidee_source_dir/man
	md2man-roff pidee.1.md > $temp_dir/usr/local/share/man/man1/pidee.1
	md2man-roff pidee-service.8.md > $temp_dir/usr/local/share/man/man8/pidee-service.8
	popd

	## Download, untar and copy Node JS from Joyent. Last precompiled Raspberry Pi version is 0.10.28. Then they stopped.
	>&2 echo "—— Download Node from Joyent"
	node_temp_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )
	pushd $node_temp_dir
	node_version="v0.10.28"
	# node_version="v0.12.5"
	node_architecture="linux-arm-pi"
	# node_architecture="linux-x64"
	wget \
		--server-response=off \
		--no-verbose \
		--quiet \
		--output-document="node.tar.gz" \
		"http://nodejs.org/dist/$node_version/node-$node_version-$node_architecture.tar.gz"
	mkdir -p node
	tar xf node.tar.gz --directory node --strip 1
	cp -r node/* $temp_dir/usr/local/lib/node
	popd


	## Tarball it!
	>&2 echo "—— Tarball!"
	archive_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )
	pushd $temp_dir
	tar czf $archive_dir/pidee.tar.gz .
	popd;

	>&2 echo "—— Done! Returning tarball dir"
} > /dev/null

echo $archive_dir/pidee.tar.gz
exit 0
