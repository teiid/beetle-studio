#!/bin/bash

if [ -z "$1" ]; then
  echo "$0 <pod-name>"
  exit 1
fi

oc port-forward "$1" 5432:5432
