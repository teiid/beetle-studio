# BeETLe Studio Developer Notes

This document is intended to be the "landing place" for information that would make a BeETLe Studio 
developer's life easier. Each note should highlight in **bold** the keywords. Developers should add 
to this document  any task steps, processes, debugging steps, URLs, or anything else to save the 
"next" developer time and effort. 

- When upgrading `patternfly-ng`, you will also need to update the version of the **Patternfly** stylesheets referenced
in `src/index.html`. One thing that may happen when the stylesheet version and the library version 
are not in sync is the components may not display.

- If running tests in the **IDE** and the **test** immediately aborts, kill the **Karma** server and rerun
the test.
