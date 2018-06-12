# Beetle Studio Style Guide

_Beetle Studio_'s TypeScript style conventions are based on the [angular.io style guide](https://angular.io/guide/styleguide).
The _Beetle Studio_'s [tslint.json](https://github.com/teiid/beetle-studio/src/main/ngapp/tslint.json) file describes the 
rules used to "enforce" the guidelines and project structure recommended by the _angular.io_ document.

The goal of having style guidelines and conventions is to increase maintainability and readability.

## Project Structure

_Beetle Studio_ has tried to use the file structure recommended by _angular.io_, with minor
modifications due to facilitating a maven build process.

So _Beetle Studio_ has feature modules (connections, dataservices), a _CoreModule_ (for singletons and
single use objects), and a _SharedModule_ (for reusable objects). Within each feature
module there may be a _shared_ folder for services and other shared objects). See the 
_Overall structural guidelines_ section of the [angular.io style guide](https://angular.io/guide/styleguide)
for more details.

## Naming Conventions

In general, file names have the following syntax: <feature>.<type>.ts. _Note: if <feature> has
multiple words, separate words by dashes. Uppercase letters should not be used._

Here are some examples:

- connection.service.ts - a service name `ConnectionService`.
- connection.service.spec.ts - a test for the `ConnectionService`.
- connections.module.ts - a feature module called `ConnectionsModule`.
- add-connection.component.ts - a component called `AddConnectionComponent`.
- connection.model.ts - a class called `Connection`.

See the _Naming_ section of the [angular.io style guide](https://angular.io/guide/styleguide)
for more details.

## TSLint Settings

Our _TSLint_ configuration file (`tslint.json`) inherits recommended rules. We also have included added and overwritten 
rules. _Note: Rules can be overridden on a case by case if needed by adding a special comment to the 
offending line of code. WebStorm has a quick fix that will do this for you._

Here are a **few** of the TSLint rules defined in our configuration file used:

- **align** - used to align member properties and statements.
- **component-class-suffix** - all components need to have `Component` as the name suffix.
- **directive-class-suffix** - all directives need to have `Directive` as the name suffix.
- **max-classes-per-file** - value is set to one so that classes, enums, types, etc. can easily be found.
- **max-line-length** - set to 140. (which is plenty long!)
- **member-ordering** - public declarations must come before private declarations, static declarations
must come before instance declarations, and variables must come before functions.
- **no-consecutive-blank-lines** - only one blank line can appear together.
- **no-empty** - empty blocks are not allowed. Fill in with a comment like `// nothing to do` if you 
really need an empty block.
- **one-variable-per-declaration** - promotes better readability and maintenance.
- **ordered-imports** - imports are ordered alphabetically so that they can be found easier.
- **quotemark** - set to use double quotes. Prevents both single and double being used and mixed within the codebase.
- **typedef** - return type, parameter type, property type must be explicitly set if an initializer is not used.

## Notable Style Guidelines

- **Style 01-01** - Limit files to 400 lines.
- **Style 01-02** - Limit functions to 75 lines.
- **Style 02-01** - Use consistent names for all symbols.
- **Style 03-01** - Use upper camel case when naming classes.
- **Style 03-02** - Spell `const` variables in lower camel case.
- **Style 03-03** - Do not name with an `I` prefix.
- **Style 03-04** - Do use lower camel case to name properties and methods.
- **Style 05-04** - Extract templates and styles into a separate file, when more than 3 lines.
- **Style 05-16** - Do name events without the prefix `on`. Do name event handler methods with the 
prefix `on` followed by the event name.
- **Style 05-17** - 
