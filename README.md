# BeETLe Studio (Web-based tooling for the Teiid project)

## Summary

This is the official Git repository for the BeETLe Studio project. BeETLe Studio is a development effort 
intended to become, or at least influence, the next generation of Teiid web-based tooling. As a
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
The general idea is to keep your 'master' branch in-sync with the 'upstream/master'.

## Building, Deploying, and Testing Beetle Studio

### Requirements

- Maven 3.x
- Java 8+
- Running Komodo Server (an easy way to install a Komodo server is by using 
a [Data Service Builder kit](https://developer.jboss.org/wiki/GettingStartedWithDataServicesBuilder))

### Maven Build

Run the following command in the project's root dirrectory to generate the `beetle-studio.war` file:
```bash
  $ mvn clean install
```

The `beetle-studio.war` file can be found in the `target/` directory.

### Deploy to Komodo Server

In order to test BeETLe Studio, copy the `beetle-studio.war` file into the Komodo server's `standalone/deployments` directory.

### Test

In a browser, navigate to `http://localhost:8080/beetle-studio` to test BeETLe Studio.

## Contribute fixes and features

BeETLe Studio is open source, and we welcome anybody who wants to participate and contribute!

TBD

## Developer Guidelines

- IDE - The [WebStorm IDE](https://www.jetbrains.com/webstorm/) is the preferred development environment. See our
[BeETLe Studio WebStorm IDE Guide](https://github.com/teiid/beetle-studio/documentation/ide/webstorm-guide.md) for IDE development practices.
- Style and Coding Guide - In general, we try to follow the style outlined by Angular defined
in their [style guide](https://angular.io/guide/styleguide). More specific syntax, conventions,
project structure, and formatting can be found in our [BeETLe Studio Style Guide](https://github.com/teiid/beetle-studio/documentation/style-guide/style-guide.md).
- Internationalization (i18n) - All text visible to the user should be internationlized.
The [Internalization in BeETLe Studio](https://github.com/teiid/beetle-studio/documentation/i18n/README.md)
document describes the internationalization practices that should be followed.
- The [BeETLe Studio Developer Notes](https://github.com/teiid/beetle-studio/blob/master/documentation/dev-notes/dev-notes.md)
document contains information that developers may find useful in performing their daily tasks. For 
instance, there might be a note on how to track down a certain problem, or a note on common issues
with unit tests.