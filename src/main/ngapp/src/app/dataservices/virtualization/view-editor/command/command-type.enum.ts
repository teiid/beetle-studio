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

/**
 * Enumerates the available commands
 */
export enum CommandType {

  /**
   * Command id for Add Composition
   */
  ADD_COMPOSITION_COMMAND = "AddCompositionCommand",

  /**
   * Command id for Add Sources
   */
  ADD_SOURCES_COMMAND = "AddSourcesCommand",

  /**
   * Command id for No op
   */
  NO_OP_COMMAND = "NoOpCommand",

  /**
   * Command id for Remove Composition
   */
  REMOVE_COMPOSITION_COMMAND = "RemoveCompositionCommand",

  /**
   * Command id for Remove Sources
   */
  REMOVE_SOURCES_COMMAND = "RemoveSourcesCommand",

  /**
   * Command id for Add Composition
   */
  UPDATE_VIEW_DESCRIPTION_COMMAND = "UpdateViewDescriptionCommand",

  /**
   * Command id for Add Composition
   */
  UPDATE_VIEW_NAME_COMMAND = "UpdateViewNameCommand"

}
