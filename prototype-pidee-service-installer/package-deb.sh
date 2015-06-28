#!/bin/bash

# package-deb.sh
# 
# Script to automate the creation of a .deb package for distribution
#
# Usage
# =====
# 
# $ package-deb.sh [pidee source path]
# > /path/to/pidee.tar.gz

## Enable extended globbing (eg: dir/{a,b}/*)
shopt -s extglob;


# Iterate on all arguments passed
# for var in "$@"
# do
#     echo "$var"
# done

# .deb destination dir (arg or current dir)
deb_destination_dir=${1:-./~debs}

# Get the absolute parent dir of this file
# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in?page=1&tab=votes#tab-top
this_script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Run ./prepackage.sh and store location of pidee.tar.gz file
tar_file=$(source $this_script_dir/prepackage.sh)

# Exit with error and line number
# error_exit "$LINENO: An error has occurred."
function error_exit {
	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2 && exit 1;
}

# Here we commence
{
	# get named arguments
	while getopts ":v:o:" opt; do
		case $opt in
			v) package_version="$OPTARG"
			;;
			o) deb_destination_dir="$OPTARG"
			;;
			\?) echo "Invalid option -$OPTARG" >&2
			;;
		esac
	done

	# Check args
	# stub

	# Check core dependency
	hash fpm 2>/dev/null || { printf >&2 "Ruby gem \"fpm\" is required, but it's not installed. Aborting. Please run:\n$ gem install fpm\n"; exit 1; }
	hash gtar 2>/dev/null || { printf >&2 "\"gtar\" is required, but it's not installed. It's available in brew as \"gnu-tar\" if you are on OS X\n"; exit 1; }

	# Temporary work dir
	temp_fpm_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" )

	# Extract pidee.tar.gz
	tar xzf $tar_file -C $temp_fpm_dir

	# Ensure we have a destination dir
	mkdir -p $deb_destination_dir

	# Start FPM
	pushd $deb_destination_dir
	fpm \
		-s dir \
		-t deb \
		-a amd64 \
		--force \
		--verbose \
		--name "pidee" \
		--version "1.0" \
		--vendor "The Workers" \
		--url "http://theworkers.net/pidee" \
		--maintainer "Tommaso Lanza <pidee@theworkers.net>" \
		--provides "pidee" \
		--license "MIT" \
		--description "Support package for the Pidee Raspberry Pi add-on board" \
		--deb-init $this_script_dir/assets/pidee.init \
		--before-install $this_script_dir/assets/preinst \
		--after-install $this_script_dir/assets/postinst \
		--before-remove $this_script_dir/assets/prerm \
		--after-remove $this_script_dir/assets/postrm \
		-C $temp_fpm_dir
	popd

	# Cleanup after yourself!
	open $temp_fpm_dir
	open $(dirname "$tar_file")
	# rm -rf $temp_fpm_dir $(dirname "$tar_file")

	>&2 echo "—— Did you a Debian package!"
} > /dev/null

# echo "$DOTFILES_PATH"
exit 0