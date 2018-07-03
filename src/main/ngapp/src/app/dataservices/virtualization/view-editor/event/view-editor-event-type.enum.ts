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

import { QueryResults } from "@dataservices/shared/query-results.model";
import { View } from "@dataservices/shared/view.model";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { ViewEditorSaveProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";

export enum ViewEditorEventType {

  /**
   * An event indicating the selection of objects in the canvas has changed.
   *
   * @type {string}
   */
  CANVAS_SELECTION_CHANGED = "CANVAS_SELECTION_CHANGED",

  /**
   * An event indicating a source should be created
   */
  CREATE_SOURCE = "CREATE_SOURCE",

  /**
   * An event indicating a composition should be created
   */
  CREATE_COMPOSITION = "CREATE_COMPOSITION",

  /**
   * An event indicating the view being edited has been set. This will only be fired one time one the view editor is
   * opened. The one event argument is the {@link View} being set.
   *
   * @type {string}
   */
  EDITED_VIEW_SET = "EDITED_VIEW_SET",

  /**
   * An event indicating the editor configuration has changed. The one event argument is the name of the editor CSS
   * class that was set.
   *
   * @type {string}
   */
  EDITOR_CONFIG_CHANGED = "EDITOR_CONFIG_CHANGED",

  /**
   * An event indicating the view save progress has changed. The one event argument is the
   * {@link ViewEditorSaveProgressChangeId} value.
   *
   * @type {string}
   */
  EDITOR_VIEW_SAVE_PROGRESS_CHANGED = "EDITOR_VIEW_SAVE_PROGRESS_CHANGED",

  /**
   * An event indicating a log message has been added. The one event argument is the {@link Message} that was added.
   *
   * @type {string}
   */
  LOG_MESSAGE_ADDED = "LOG_MESSAGE_ADDED",

  /**
   * An event indicating a log message has been deleted. The one event argument is the {@link Message} that was deleted.
   *
   * @type {string}
   */
  LOG_MESSAGE_DELETED = "LOG_MESSAGE_DELETED",

  /**
   * An event indicating all log messages have been deleted. An event of this type may have a string context as an
   * event argument.
   *
   * @type {string}
   */
  LOG_MESSAGES_CLEARED = "LOG_MESSAGES_CLEARED",

  /**
   * An event indicating the preview results have changed. The one event argument is the {@link QueryResults}.
   *
   * @type {string}
   */
  PREVIEW_RESULTS_CHANGED = "PREVIEW_RESULTS_CHANGED",

  /**
   * An event indication the editor's readonly property has changed. The one event argument is the new readonly state.
   *
   * @type {string}
   */
  READONLY_CHANGED = "READONLY_CHANGED",

  /**
   * An event indicating an editor part should become visible. The one event argument is the editor part that should
   * be shown. See {@link ViewEditorPart}.
   */
  SHOW_EDITOR_PART = "SHOW_EDITOR_PART",

  /**
   * An event indicating the view has changed. The one event argument is the {@link Command} that was used to change
   * the view state.
   *
   * @type {string}
   */
  VIEW_STATE_CHANGED = "VIEW_STATE_CHANGED",

}
