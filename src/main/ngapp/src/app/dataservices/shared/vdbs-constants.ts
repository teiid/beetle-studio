/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, /
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class VdbsConstants {

  public static readonly SERVICE_VIEW_MODEL_NAME = "views";  // ** must match KomodoDataserviceService.SERVICE_VDB_VIEW_MODEL **
  public static readonly SCHEMA_VDB_SUFFIX = "schemavdb";
  public static readonly SCHEMA_MODEL_SUFFIX = "schemamodel";
  public static readonly DATASERVICE_VDB_SUFFIX = "vdb";
  public static readonly DEFAULT_READONLY_DATA_ROLE = "DefaultReadOnlyDataRole";

  public static readonly statusPath = "/status";

  public static readonly vdbRootRoute = "vdb";
  public static readonly vdbRootPath = "/" + VdbsConstants.vdbRootRoute;

  public static readonly vdbsRootRoute = "vdbs";
  public static readonly vdbsRootPath = "/" + VdbsConstants.vdbsRootRoute;

  public static readonly vdbModelsRootRoute = "Models";
  public static readonly vdbModelsRootPath = "/" + VdbsConstants.vdbModelsRootRoute;

  public static readonly vdbModelSourcesRootRoute = "VdbModelSources";
  public static readonly vdbModelSourcesRootPath = "/" + VdbsConstants.vdbModelSourcesRootRoute;

  public static readonly vdbPublish = "publish";
}
