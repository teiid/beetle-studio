#!/bin/bash

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
  ng serve --host 0.0.0.0 --port 8080 --disable-host-check
else
  ng build && node ./server.js
fi
