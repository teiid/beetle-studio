# BeETLe Studio (Web-based tooling for the Teiid project)

## Summary

This is the official Git repository for the _BeETLe Studio_ project. _BeETLe Studio_ is a development effort 
intended to become, or at least influence, the next generation of _Teiid_ web-based tooling. As a
first step, an ETL feature is being developed. See the [Teiid](http://teiid.jboss.org/) project
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

The `beetle-studio.war` file can then be found in the `target/` directory.

### Deploy to a Komodo Server

1. Install a _Komodo_ server. The _Data Service Builder_ kit comes with a _Komodo_ server. 
Download the kit [here](https://developer.jboss.org/wiki/GettingStartedWithDataServicesBuilder). 
Then extract the zipfile into the directory you want to install the server.

1. Start the _Komodo_ server by issuing the following commands:

    ```bash
      $ cd <komodo-server-install-dir>/teiid-8.12.4/bin/
      $ ./standalone.sh -c standalone-teiid.xml
    ```

1. Copy the `beetle-studio.war` file into the _Komodo_ server's `standalone/deployments` directory.

### Test

In a browser, navigate to `http://localhost:8080/beetle-studio` to test _BeETLe Studio_.

## Contribute fixes and features

_BeETLe Studio_ is open source, and we welcome anybody who wants to participate and contribute!

TBD

## Developer Guidelines

- IDE - The [WebStorm IDE](https://www.jetbrains.com/webstorm/) is the preferred development environment. See our
[BeETLe Studio WebStorm IDE Guide](https://github.com/teiid/beetle-studio/blob/master/documentation/ide/webstorm-guide.md) 
for IDE development practices.
- Style and Coding Guide - In general, we try to follow the style outlined by Angular defined
in their [style guide](https://angular.io/guide/styleguide). More specific syntax, conventions,
project structure, and formatting can be found in our [BeETLe Studio Style Guide](https://github.com/teiid/beetle-studio/blob/master/documentation/style-guide/style-guide.md).
- Internationalization (i18n) - All text visible to the user should be internationlized.
The [Internalization in BeETLe Studio](https://github.com/teiid/beetle-studio/blob/master/documentation/i18n/README.md)
document describes the internationalization practices that should be followed.
- The [BeETLe Studio Developer Notes](https://github.com/teiid/beetle-studio/blob/master/documentation/dev-notes/dev-notes.md)
document contains information that developers may find useful in performing their daily tasks. For 
instance, there might be a note on how to track down a certain problem, or a note on common issues
with unit tests.