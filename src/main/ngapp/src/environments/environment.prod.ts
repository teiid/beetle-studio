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

import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";

export const komodoEngine = "vdb-builder";

export const komodoRestVersion = "v1";

export const environment = {

  production: true,

  komodoEngine: komodoEngine,

  komodoRestVersion: komodoRestVersion,

  // the home page path
  homePagePath: DataservicesConstants.dataservicesRootPath,

  // REST URL - Komodo import export url
  komodoImportExportUrl: "/" + komodoEngine + "/" + komodoRestVersion + "/importexport",

  // REST URL - Komodo workspace
  komodoWorkspaceUrl: "/" + komodoEngine + "/" + komodoRestVersion + "/workspace",

  // REST URL - Komodo teiid server
  komodoTeiidUrl: "/" + komodoEngine + "/" + komodoRestVersion + "/metadata",

  // REST URL - Komodo service
  komodoServiceUrl: "/" + komodoEngine + "/" + komodoRestVersion + "/service"

};
