# Openshift Setup

_Beetle Studio_ requires an Openshift instance for deployment. A number of Openshift installations are available to install and any one can be used as the application platform. _Beetle Studio_ can then access datasources provisioned from the Openshift Service Catalog.  If you already have a shared Openshift installation, you can install _Beetle Studio_ to the shared installation.

## Openshift CDK Installation

A self-contained installation of the Openshift container platform has been published: [Openshift CDK Installation](http://www.schabell.org/2017/12/cloud-happiness-how-to-install-new-openshift-v37-in-minutes.html) .  This is an excellent option for getting an Openshift installation up-and-running quickly.

## Minishift

[Minishift](https://github.com/minishift/minishift) can also be used to provide your local installation.  See the [Minishift README](https://github.com/minishift/minishift/blob/master/README.adoc) for installation instructions.

By default, minishift is configured to use 2GB of memory and 20GB of storage space. For serious development, since 4 pods are required to be deployed (requiring 0.5GB each), this has proven insufficient. Therefore, it is recommended to configure minishift with 6GB of memory and 50GB of storage space. If this proves problematic then lower values may be sufficient but will require some experimentation. These configuration options can only be configured when minishift is not running. They can be set with the following commands:
```bash
  $ minishift config set disk-size 60GB
  $ minishfit config set memory 6GB
```
Minishift provides a virtual machine (VM) with the Openshift installation installed and configured. Once installed, all that remains is to start minishift. The configuration options should be observed when minishift is started. Once the VM has started, it is possible to remote-login to the VM using the command:
```bash
  $ minishift ssh
```
This is useful for problem-finding. 

To update to minishift’s latest release requires executing the update command.
```bash
  $ minishift update
```
Once minishift has been started, Openshift should be available for access on the ip address assigned, eg. https://192.168.42.143:8443.
To ensure command-line access to Openshift, the oc application should be added to the PATH environment variable. A copy of this binary is available from minishift for example at ${HOME}/.minishift/cache/oc/v3.6.1/linux/oc.

