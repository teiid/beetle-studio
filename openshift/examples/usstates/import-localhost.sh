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
  echo "WARNING: No Database specified. Assuming 'usstates'"
  DB="usstates"
fi

if [ -z "${DB_USER}" ]; then
  echo "WARNING: No Database User specified. Assuming 'komodo'"
  DB_USER="komodo"
fi

#
# Check whether the DB has been created
#
if psql -h localhost -U ${DB_USER} -lqt | cut -d \| -f 1 | grep -qw ${DB}; then
  #
  # Found database so conduct the import
  #
  psql -h localhost -d ${DB} -U ${DB_USER} -f us-states-postgresql.sql
else
  #
  # No usstates database found
  #
  echo "ERROR: The database '${DB}' has not yet been created. Create with the superuser and rerun."
  exit 1
fi

