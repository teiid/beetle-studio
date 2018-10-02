#!/bin/bash

#
# Enable service catalog
# 
# NOTE: THIS WILL CHANGE IN VERISON 1.16 (BUT STILL WORK IN PROGRESS)
#
export MINISHIFT_ENABLE_EXPERIMENTAL=true
minishift start --service-catalog &
