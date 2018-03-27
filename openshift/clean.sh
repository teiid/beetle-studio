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

echo -e '\n\n=== Logging into oc tool as developer ==='
oc login https://$OS_HOST:8443 -u developer -p developer
oc whoami 2>&1 > /dev/null || { echo "Cannot log in ... exiting" && exit 1; }

# Access the project if it exists
oc project ${OPENSHIFT_PROJECT} || { echo "ERROR: Project ${OPENSHIFT_PROJECT} does not exist" && exit 1; }

# Delete openshift template
oc delete template ${OS_TEMPLATE} || { echo "WARNING: Could not delete application template" ; }

echo

# Delete services
for i in "${SERVICES[@]}"
do
	echo "Deleting service: $i"
	oc delete service $i || { echo "WARNING: Service $i not found" ; }
done

echo

# Delete routes
for i in "${ROUTES[@]}"
do
	echo "Deleting route: $i"
	oc delete route $i || { echo "WARNING: Route $i not found" ; }
done

echo

# Delete deployment configs
for i in "${DEPLOY_CONFIGS[@]}"
do
	echo "Deleting deployment config: $i"
	oc delete dc $i || { echo "WARNING: Deployment Config $i not found" ; }
done

echo

# Delete deployments
for i in "${DEPLOYMENTS[@]}"
do
	echo "Deleting deployment: $i"
	oc delete deploy $i || { echo "WARNING: Deployment $i not found" ; }
done

echo

# Delete build configs
for i in "${BUILD_CONFIGS[@]}"
do
	echo "Deleting build config: $i"
	oc delete bc $i || { echo "WARNING: Build Config $i not found" ; }
done

echo

# Delete service accounts
for i in "${SERVICE_ACCOUNTS[@]}"
do
	echo "Deleting service account: $i"
	oc delete sa $i || { echo "WARNING: Service Account $i not found" ; }
done

echo

# Delete the project
if [ -n "${KILL_PROJECT}" ]; then
	oc delete project ${OPENSHIFT_PROJECT}
else
	echo "== Skipping project deletion =="
fi

echo

echo "Done"
