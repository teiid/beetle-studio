#!/bin/bash

# Check node is available
command -v node >/dev/null 2>&1 || { echo >&2 "Requires 'node' but it's not installed.  Aborting."; exit 1; }

# Check ng is available - should be post 'npm install'
NG=`find . -type f -name ng | head -1`
if [ ! -f ${NG} ]; then
  echo "Error: cannot find 'ng' so nothing can be executed... exiting"
  exit 1
fi

#################
#
# Show help and exit
#
#################
function show_help {
        echo "Usage: $0 [-d] [-h]"
        echo "-d: run in development mode"
  echo ""
  echo "To passthrough additional arguments, enter '--' followed by the extra arguments"
  exit 1
}

#
# Determine the command line options
#
while getopts ":d" opt;
do
  case $opt in
  d) DEV=1 ;;
  h) show_help ;;
  esac
done
shift "$(expr $OPTIND - 1)"

if [ "${DEV}" == "1" ]; then
  ${NG} serve --host 0.0.0.0 --port 8080 --disable-host-check
else
  ${NG} build && node ./server.js
fi
