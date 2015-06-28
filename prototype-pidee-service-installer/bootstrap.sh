#!/bin/bash
shopt -s extglob;

# this file is a stub. Needs a full change :)
exit

# PACKAGE=$1
# URI=`apt-cache show $PACKAGE | grep "Filename:" | cut -f 2 -d " "`
PROGNAME=$(basename $0)

function error_exit {
# http://stackoverflow.com/questions/64786/error-handling-in-bash
#   ----------------------------------------------------------------
#   Function for exit due to fatal program error
#   	Accepts 1 argument:
#   		string containing descriptive error message
#   ----------------------------------------------------------------
# echo "Example of error with line number and message"
# error_exit "$LINENO: An error has occurred."

    echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2
    exit 1
}

# Exit if not running as root
# if [ "$EUID" -ne 0 ]
#   then error_exit "Please run as root user."
# fi


# Create temporary directory
temp_dir=$( mktemp -dt "$(basename -- "$0").$$.XXXX" );

# Download Node JS from Joyent. Last precompiled Raspberry Pi version is 0.10.28. Then they stopped.
wget http://nodejs.org/dist/$node_version/node-$node_version-$node_architecture.tar.gz --output-document="$temp_dir/node.tar.gz"

# Extract node.tar.gz
mkdir -p $temp_dir/node
tar xf $temp_dir/node.tar.gz --directory $temp_dir/node --strip 1

# Test Node is finetemp_dir
if [ $($temp_dir/node/bin/node --version) == $node_version ]; then
	echo "Node works. Continuing…"
else
	rm -rf $temp_dir
	error_exit "Node installation failed."
fi

