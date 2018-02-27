# Beetle Studio (Web-based tooling for the Teiid project)

## Summary

This is the official Git repository for the _Beetle Studio_ project. _Beetle Studio_ is a development effort 
intended to become, or at least influence, the next generation of _Teiid_ web-based tooling. As a
first step, capability to deploy Data Access Services is being developed. See the [Teiid](http://teiid.jboss.org/) project
for more information.

## Get the code

The easiest way to get started with the code is to [create your own fork](http://help.github.com/forking/)
 of this repository, and then clone your fork:

```bash
  $ git clone git@github.com:teiid/beetle-studio.git
  $ cd beetle-studio
  $ git remote add upstream git@github.com:teiid/beetle-studio.git
```
At any time, you can pull changes from the upstream and merge them onto your master:
```bash
  $ git checkout master       # switches to the 'master' branch
  $ git pull upstream master  # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
  $ git push origin           # pushes all the updates to your fork, which should be in-sync with 'upstream'
```
The general idea is to keep your `master` branch in-sync with the `upstream/master`.

## Building, Deploying, and Testing Beetle Studio

### Requirements

- Node.js (OS X 8.4.x, Fedora 6.11.x) - go [here](https://nodejs.org/en/download/) for installation
instructions
- Angular CLI (OS X 1.3.x, Fedora 1.4.x) - after installing Node.js, open a terminal and execute:

    ```bash
      $ npm install -g @angular/cli
    ```

    _Note: If this command fails you might need to run it as `sudo`. See these [installation instructions](https://github.com/angular/angular-cli/wiki) 
    for more details._
- Maven 3.x ([installation instructions](https://maven.apache.org/install.html))
- Java 8.x

### Maven Build

Prior to running a build:

1. Make sure [Node.js]((https://nodejs.org/en/download/)) and [Angular CLI](https://github.com/angular/angular-cli/wiki) 
are installed. See **Requirements** section above.

1. Install the dependent JavaScript libraries by running these commands from the project root directory:

    ```bash
      $ cd src/main/ngapp
      $ npm install
    ```

1. Then **at the project root** run the build by issuing this command:

    ```bash
      $ mvn clean install
    ```

This will run the build and all of the unit tests.

### Deploy _Beetle Studio_ to Openshift

1. Utilize an existing Openshift installation, or install your own local Openshift.  Refer to [Openshift Setup]((https://github.com/teiid/beetle-studio/blob/master/documentation/openshift-setup/openshift-setup.md)).  

1. Login to Openshift, then initiate the _Beetle Studio_ deployment:

    ```bash
      $ cd <BEETLE_STUDIO_REPO_DIR>/openshift
      $ ./beetle-os-setup.sh -h <OPENSHIFT_IP>
    ```

1. Monitor the pod deployments in your Openshift console.  When all pods have successfully been started, you are ready to access _Beetle Studio_.

### Access _Beetle Studio_

In the Openshift console, go to the _beetle studio_ project.  View the routes: __'Application > Routes'__.  To access _Beetle Studio_, navigate to the route for `das`.

## Contribute fixes and features

_Beetle Studio_ is open source, and we welcome anybody who wants to participate and contribute!

If you want to fix a bug or make any changes, please log an issue in the [Teiid Tools JIRA](https://issues.jboss.org/browse/TEIIDTOOLS) describing the bug or new feature. Then we highly recommend making the changes on a topic branch named with the JIRA issue number. For example, this command creates
a branch for the TEIIDTOOLS-1234 issue:

	$ git checkout -b teiidtools-1234

After you're happy with your changes and a full build (with unit tests) runs successfully, commit your changes on your topic branch
(using really good comments). Then it's time to check for and pull any recent changes that were made in the official repository:

	$ git checkout master               # switches to the 'master' branch
	$ git pull upstream master          # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
	$ git checkout teiidtools-1234      # switches to your topic branch
	$ git rebase master                 # reapplies your changes on top of the latest in master
	                                      (i.e., the latest from master will be the new base for your changes)

If the pull grabbed a lot of changes, you should rerun your build to make sure your changes are still good.
You can then either [create patches](http://progit.org/book/ch5-2.html) (one file per commit, saved in `~/teiidtools-1234`) with 

	$ git format-patch -M -o ~/teiidtools-1234 orgin/master

and upload them to the JIRA issue, or you can push your topic branch and its changes into your public fork repository

	$ git push origin teiidtools-1234   # pushes your topic branch into your public fork of beetle-studio

and [generate a pull-request](http://help.github.com/pull-requests/) for your changes. 

We prefer pull-requests, because we can review the proposed changes, comment on them,
discuss them with you, and likely merge the changes right into the official repository.

## Developer Guidelines

- IDE - The [WebStorm IDE](https://www.jetbrains.com/webstorm/) is the preferred development environment. See our
[Beetle Studio WebStorm IDE Guide](https://github.com/teiid/beetle-studio/blob/master/documentation/ide/webstorm-guide.md) 
for IDE development practices.
- Openshift environment - Openshift is required for Beetle Studio deployment.  More detail can be found in our [Openshift Setup](https://github.com/teiid/beetle-studio/blob/master/documentation/openshift-setup/openshift-setup.md).
- Style and Coding Guide - In general, we try to follow the style outlined by Angular defined
in their [style guide](https://angular.io/guide/styleguide). More specific syntax, conventions,
project structure, and formatting can be found in our [Beetle Studio Style Guide](https://github.com/teiid/beetle-studio/blob/master/documentation/style-guide/style-guide.md).
- Internationalization (i18n) - All text visible to the user should be internationlized.
The [Internalization in Beetle Studio](https://github.com/teiid/beetle-studio/blob/master/documentation/i18n/README.md)
document describes the internationalization practices that should be followed.
- The [Beetle Studio Developer Notes](https://github.com/teiid/beetle-studio/blob/master/documentation/dev-notes/dev-notes.md)
document contains information that developers may find useful in performing their daily tasks. For 
instance, there might be a note on how to track down a certain problem, or a note on common issues
with unit tests.
