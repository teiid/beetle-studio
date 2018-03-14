#!/bin/bash

if [ -z "$1" ]; then
  echo "$0 <pod-name>"
  exit 1
fi

oc port-forward "$1" 8787:8787
