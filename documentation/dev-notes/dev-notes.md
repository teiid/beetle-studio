# Beetle Studio Developer Notes

This document is intended to be the "landing place" for information that would make a Beetle Studio 
developer's life easier. Each note should highlight in **bold** the keywords. Developers should add 
to this document  any task steps, processes, debugging steps, URLs, or anything else to save the 
"next" developer time and effort. 

- When upgrading `patternfly-ng`, you will also need to update the version of the **Patternfly** stylesheets referenced
in `src/index.html`. One thing that may happen when the stylesheet version and the library version 
are not in sync is the components may not display.

- If running tests in the **IDE** and the **test** immediately aborts, kill the **Karma** server and rerun
the test.

- If a variable of a class is `nil` when you know it really isn't, you are probably trying to
access it from a `callback` handler. Change your code to save the object reference
in a constant and use that in the handler code. Here is an example:

```typescript
    const self = this;

    this.connectionService
      .getAllConnections()
      .subscribe(
        (connections) => {
          self.allConns = connections;
          self.filteredConns = this.filterConnections();
          self.loaded("connections");
        },
        (error) => {
          self.logger.error("[ConnectionsComponent] Error getting connections.");
          self.error(error);
        }
      );
```

- When using `Response` and `ResponseOptions` classes, make sure you use the version from the 
`@angular/http` library.
