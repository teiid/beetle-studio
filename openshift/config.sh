#!/bin/bash

# OS settings
OS_TEMPLATE=beetle-studio-s2i

OPENSHIFT_PROJECT=beetle-studio

SERVICES=(vdb-builder-persistence das vdb-builder beetle-studio)
ROUTES=(das vdb-builder jdbc-vdb-builder beetle-studio)
BUILD_CONFIGS=(wildfly-swarm-build vdb-builder-build beetle-studio-build)
DEPLOY_CONFIGS=(vdb-builder-persistence vdb-builder beetle-studio)
DEPLOYMENTS=(das)
SERVICE_ACCOUNTS=(das)
