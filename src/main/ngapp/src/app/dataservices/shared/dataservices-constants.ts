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

export class DataservicesConstants {

  public static readonly dataservicesExport = "export";

  public static readonly dataserviceRootRoute = "dataservice";
  public static readonly dataserviceRootPath = "/" + DataservicesConstants.dataserviceRootRoute;

  public static readonly dataservicesRootRoute = "dataservices";
  public static readonly dataservicesRootPath = "/" + DataservicesConstants.dataservicesRootRoute;

  public static readonly addDataserviceRoute = DataservicesConstants.dataservicesRootRoute + "/add-dataservice";
  public static readonly addDataservicePath = DataservicesConstants.dataservicesRootPath + "/add-dataservice";

  public static readonly testDataserviceRoute = DataservicesConstants.dataservicesRootRoute + "/test-dataservice";
  public static readonly testDataservicePath = DataservicesConstants.dataservicesRootPath + "/test-dataservice";
}
