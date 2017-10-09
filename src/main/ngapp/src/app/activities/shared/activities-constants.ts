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

export class ActivitiesConstants {

  public static readonly activitiesRootRoute = "activities";
  public static readonly activitiesRootPath = "/" + ActivitiesConstants.activitiesRootRoute;

  public static readonly addActivityRoute = ActivitiesConstants.activitiesRootRoute + "/add-activity";
  public static readonly addActivityPath = ActivitiesConstants.activitiesRootPath + "/add-activity";

  public static readonly editActivityroute = ActivitiesConstants.activitiesRootRoute + "/edit-activity";
  public static readonly editActivityPath = ActivitiesConstants.activitiesRootPath + "/edit-activity";

}
