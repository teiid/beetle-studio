#!/bin/bash

#################
#
# Script for removing a generated vdb service from openshift
#
#
#################



#################
#
# Show help and exit
#
#################
function show_help {
        echo "Usage: $0 -v <vdb>"
        echo "-h show this help"
        echo "-v the vdb to delete"
  exit 1
}

#
# Determine the command line options
#
while getopts "hv:" opt;
do
        case $opt in
        h) show_help ;;
        v) VDB=$OPTARG ;;
        *) show_help ;;
        esac
done

if [ -z "${VDB}" ]; then
  echo "Error... No VDB name specified"
  exit 1
fi

DELETE="oc delete"

#
# ROUTES
#
ROUTES=`oc get routes | grep ${VDB} | awk '{print $1}'`
for route in ${ROUTES}
do
  ${DELETE} routes/${route}
done

#
# SERVICES
#
SVCS=`oc get svc | grep ${VDB} | awk '{print $1}'`
for svc in ${SVCS}
do
  ${DELETE} svc/${svc}
done

#
# IMAGE STREAMS
#
ISS=`oc get is | grep ${VDB} | awk '{print $1}'`
for is in ${ISS}
do
  ${DELETE} is/${is}
done

#
# REPLICATION CONTROLLERS
#
RCS=`oc get rc | grep ${VDB} | awk '{print $1}'`
for rc in ${RCS}
do
  ${DELETE} rc/${rc}
done

#
# DEPLOYMENT CONFIGS
#
DCS=`oc get dc | grep ${VDB} | awk '{print $1}'`
for dc in ${DCS}
do
  ${DELETE} dc/${dc}
done

#
# BUILDS
#
BUILDS=`oc get builds | grep ${VDB} | awk '{print $1}'`
for build in ${BUILDS}
do
  ${DELETE} builds/${build}
done

#
# BUILD CONFIGS
#
BCS=`oc get bc | grep ${VDB} | awk '{print $1}'`
for bc in ${BCS}
do
  ${DELETE} bc/${bc}
done

#
# PODS
#
PODS=`oc get pods | grep ${VDB} | awk '{print $1}'`
for pod in ${PODS}
do
  ${DELETE} po/${pod}
done
