/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConnectionsConstants } from "@connections/shared/connections-constants";

export const environment = {

  production: true,

  // the home page path
  homePagePath: ConnectionsConstants.connectionsRootPath,

  // REST URL - Komodo workspace
  komodoWorkspaceUrl: "https://localhost:8443/vdb-builder/v1/workspace",

  // REST URL - Komodo teiid server
  komodoTeiidUrl: "https://localhost:8443/vdb-builder/v1/teiid",

};
