#!/bin/bash

#################
#
# Show help and exit
#
#################
function show_help {
	echo "Usage: $0 -h"
	echo "-d - delete the project"
	echo "-h - ip|hostname of Openshift host"
  exit 1
}

if [ ! -f config.sh ]; then
    echo "No config file found .. exiting"
    exit 1
fi

#
# Source the configuration
#
. ./config.sh

#
# Determine the command line options
#
while getopts "dh:" opt;
do
	case $opt in
	d) KILL_PROJECT=1 ;;
	h) OS_HOST=$OPTARG ;;
	*) show_help ;;
	esac
done

if [ -z "$OS_HOST" ]; then
  echo "No Openshift host specified. Use -h <host|ip>"
  exit 1
fi

echo -e '\n\n=== Logging into oc tool as admin ==='
oc login https://$OS_HOST:8443 -u admin -p admin
oc whoami 2>&1 > /dev/null || { echo "Cannot log in ... exiting" && exit 1; }

# Delete openshift template
oc delete template ${OS_TEMPLATE} || { echo "WARNING: Could not delete old application template" ; }

# Delete service account
oc project ${OPENSHIFT_PROJECT}
oc delete sa ${OPENSHIFT_SERVICE_ACCOUNT} || { echo "WARNING: Could not delete old service account" ; }

# Delete secrets
oc delete secret ${OPENSHIFT_APP_SECRET} || { echo "WARNING: Could not delete old secrets" ; }

# Delete application resources
oc delete all -l app=${OPENSHIFT_APPLICATION_NAME}  || { echo "WARNING: Could not delete old application resources" ; }

# Delete the project
if [ -n "${KILL_PROJECT}" ]; then
	oc delete project ${OPENSHIFT_PROJECT}
else
	echo "== Skipping project deletion =="
fi

oc whoami ||  echo `oc whoami` "still logged in; use 'oc logout' to logout of openshift"
echo "Done"
