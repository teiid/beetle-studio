#!/bin/bash

#################
#
# Show help and exit
#
#################
function show_help {
        echo "Usage: $0 -d <db> -u <user>"
        echo "-h show this help"
        echo "-d the target database"
        echo "-u the executing user"
  exit 1
}

#
# Determine the command line options
#
while getopts "hd:u:" opt;
do
        case $opt in
        h) show_help ;;
        d) DB=$OPTARG ;;
        u) DB_USER=$OPTARG ;;
        *) show_help ;;
        esac
done

if [ -z "${DB}" ]; then
  echo "No Database specified. Assuming 'usstates'"
  DB="usstates"
fi

if [ -z "${DB_USER}" ]; then
  echo "No Database User specified. Assuming 'komodo'"
  DB_USER="komodo"
fi

psql -h localhost -d ${DB} -U ${DB_USER} -f us-states-postgresql.sql
