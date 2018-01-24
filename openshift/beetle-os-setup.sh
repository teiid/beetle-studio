#!/bin/bash

###
#
# Installs and configures a beetle-studio & vdb-builder-teiid-wildfly instance
#
# Based on scripts from:
#
# * https://github.com/teiid/teiid-komodo
# * https://github.com/michaelepley/openshift-demo-jdv
# * https://github.com/cvanball/jdv-ose-demo
#
###

#################
#
# Show help and exit
#
#################
function show_help {
	echo "Usage: $0 -h [-r]"
	echo "-h ip|hostname: location of Openshift host"
	echo "-m url: maven mirror url"
	echo "-k url: komodo source repository location url"
    echo "-b url: beetle studio repository location url"
	echo "-r local mvn repo: provides an additional nexus repository"
  exit 1
}

if [ ! -f 'config.sh' ]; then
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
while getopts "h:m:r:k:b:" opt;
do
	case $opt in
	h) OS_HOST=$OPTARG ;;
	m) MVN_MIRROR=$OPTARG ;;
	r) LOCAL_MVN_REPO=$OPTARG ;;
	k) KOMODO_SOURCE_REPO=$OPTARG ;;
    b) BEETLE_SOURCE_REPO=$OPTARG ;;
	*) show_help ;;
	esac
done

if [ -z "$OS_HOST" ]; then
  echo "No Openshift host specified. Use -h <host|ip>"
  exit 1
fi

echo -e '\n\n=== Logging into oc tool as admin ==='
oc login https://${OS_HOST}:8443 -u admin -p admin
oc whoami 2>&1 > /dev/null || { echo "Cannot log in ... exiting" && exit 1; }

echo "Switch to the new project, creating it if necessary"
{ oc get project ${OPENSHIFT_PROJECT} 2>&1 >/dev/null && \
	oc project ${OPENSHIFT_PROJECT}; } || \
	oc new-project ${OPENSHIFT_PROJECT} || \
	{ echo "FAILED: Could not use indicated project ${OPENSHIFT_PROJECT}" && exit 1; }

echo -e '\n\n=== Creating the template. ==='
oc get template ${OS_TEMPLATE} 2>&1 > /dev/null || \
	oc create -f ${OS_TEMPLATE}.json || \
	{ echo "FAILED: Could not create application template" && exit 1; }

if [ -n "${MVN_MIRROR}" ]; then
  echo "Appending value for MVN_MIRROR ... ${MVN_MIRROR}"
  APP_ARGS="${APP_ARGS} --param=MVN_MIRROR_URL=${MVN_MIRROR}"
fi

if [ -n "${LOCAL_MVN_REPO}" ]; then
  echo "Appending value for LOCAL_MVN_REPO ... ${LOCAL_MVN_REPO}"
  APP_ARGS="${APP_ARGS} --param=MVN_LOCAL_REPO=${LOCAL_MVN_REPO}"
fi

if [ -n "${KOMODO_SOURCE_REPO}" ]; then
  echo "Appending value for KOMODO_SOURCE_REPO ... ${KOMODO_SOURCE_REPO}"
  APP_ARGS="${APP_ARGS} --param=KOMODO_GIT_URL=${KOMODO_SOURCE_REPO}"
fi

if [ -n "${BEETLE_SOURCE_REPO}" ]; then
  echo "Appending value for BEETLE_SOURCE_REPO ... ${BEETLE_SOURCE_REPO}"
  APP_ARGS="${APP_ARGS} --param=BEETLE_GIT_URL=${BEETLE_SOURCE_REPO}"
fi

echo -e "\n\n=== Deploying ${OS_TEMPLATE} template with default values ==="
oc get dc/vdb-builder 2>&1 >/dev/null || \
	oc new-app ${OS_TEMPLATE} \
		${APP_ARGS} \
		-l app=beetle-studio

echo "==============================================="
echo -e "\n\n=== Start the following builds if not already started:"
echo -e "\n\n=== 	1. oc start-build vdb-builder"
echo -e "\n\n=== 	2. oc start-build beetle-studio"
echo "==============================================="

echo "Done."
