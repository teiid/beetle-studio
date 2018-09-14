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

export const localKomodoPrefix = "http://localhost:8080/";

export const openshiftKomodoPrefix = "/";

// -----------------------------------------------------------
// komodoUrlPrefix
//   - openshiftKomodoPrefix (openshift deployment)
//   - localKomodoPrefix (development on local teiid-komodo)
// -----------------------------------------------------------
export const komodoUrlPrefix = openshiftKomodoPrefix;

export const environment = {

  production: true,

  komodoEngine,

  komodoRestVersion,

  // the home page path
  homePagePath: DataservicesConstants.dataservicesRootPath,

  // REST URL - Komodo import export url
  komodoImportExportUrl: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/importexport",

  // REST URL - Komodo workspace
  komodoWorkspaceUrl: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/workspace",

  // REST URL - Komodo teiid server
  komodoTeiidUrl: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/metadata",

  // REST URL - Komodo service
  komodoServiceUrl: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/service",

  // Indicates if in UI development mode where OpenShift will not be used.
  uiDevMode: false,

  userProfileUrl: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/service/userProfile",

  viewEditorState: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/service/userProfile/viewEditorState",

  viewEditorStates: komodoUrlPrefix + komodoEngine + "/" + komodoRestVersion + "/service/userProfile/viewEditorStates"

};
