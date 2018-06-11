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

export enum ViewStateChangeId {

  /**
   * Indicates the view description has changed. The event fired contains the new description.
   */
  DESCRIPTION = "DESCRIPTION",

  /**
   * Indicates the view name has changed. The event fired contains the new name.
   */
  NAME = "NAME",

  /**
   * Indicates that the view sources have changed. The event fired contains the new sources.
   */
  SOURCES_CHANGED = "SOURCES_CHANGED",

}
