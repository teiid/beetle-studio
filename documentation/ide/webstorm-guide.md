# Beetle Studio WebStorm IDE Guide

## Settings and Preferences:

- Enable TSLint. Select menu item `WebStorm > Preferences... > Languages & Frameworks > Typescript > TSLint` 
Make sure the `Enabled` checkbox is selected.
- Exclude the `target/` directory from being looked at by TSLint. Go to menu item `WebStorm > Preferences... > Directories`.
Add the `target/` directory as being `Excluded`. If the directory does not exist, run a maven build 
first.

## TSLint

TSLint is a code analysis tool used during development to facilitate the improvement of TypeScript 
code quality. TSLint should be run before checking in any code. Any errors or warnings that TSLint 
identifies should be fixed prior to promoting any code to the Github repository. Errors and warnings
in the `Spelling` category can generally be ignored though can be fixed if it would improve code quality.

To run TSLint, select the `Code > Inspect Code...` menu item. Make sure `Whole project` and
`Include test sources` are both selected and then `OK` the dialog. The errors and warnings found will
be displayed in the `Inspection Results` panel which is displayed at the bottom of the IDE window.

The TSLint rule configuration file is located here: `.../beetle-studio/src/main/ngapp/tslint.json`. See
our [Beetle Studio Style Guide](https://github.com/teiid/beetle-studio/documentation/style-guide/style-guide.md)
for more information on our TypeScript style guidelines.

## Angular CLI

_WebStorm_ has builtin support for [Angular CLI](https://cli.angular.io). As the name suggests _Angular CLI_ 
is a command line interface for Angular. _Beetle Studio_ has been created as an _Angular CLI_ project so using
_Angular CLI_ commands is something you will do daily. These CLI commands will be executed in the
_.../beetle-studio/src/main/ngapp_ directory.

Here are 2 commands that are used a lot:

- **ng serve** - runs the debug test server.
- **ng test** - runs the tests found in the project

_WebStorm_ has a menu that uses other CLI commands to create components, services, modules, and 
other object types. Select _File > New > Angular CLI..._ when needing to create a new object. Then
select the appropriate type. _WebStorm_ then executes the appropriate _Angular CLI_ command to create
the object and related objects (test, css, html) in the recommended directories.

## Debugging

1. Create Debug Configuration. To create a debug configuration, select the menu item `Run > Edit Configurations...`. In the
`Run/Debug Configurations` dialog, select the `+` in the menubar and then the `JavaScript Debug` type. Name the 
configuration and set the `URL` to `http://localhost:4200/`.
1. Start the debug server by opening a terminal in the `.../beetle-studio/src/main/ngapp` directory 
and running the following command: `ng serve`.
1. Set your breakpoints by clicking in the left margin of the line of code you want the breakpoint to be on.
1. Open browser to `http://localhost:4200/` to see _Beetle Studio_.
1. Select the `Run > Debug...` menu item and then on the popup select your debug configuration. _Shortcut: the "bug"
in the toolbar starts the last debug configuration that was run._
1. Now interact with _Beetle Studio_ so that your breakpoints are hit.

## TODO Comments

`TODO` comments should be used when there is some task that should be done at a future date. If the 
task is a blocker or critical to the software a Jira issue should be created instead of, or in addition 
to, this type of comment. The format of a `TODO` comment is this:

`// TODO description of task goes here`
