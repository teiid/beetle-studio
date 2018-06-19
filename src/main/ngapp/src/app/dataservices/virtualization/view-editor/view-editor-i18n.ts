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

export class ViewEditorI18n {

  // shared
  public static readonly cancelButtonText = "Cancel";
  public static readonly okButtonText = "OK";

  // commands
  public static readonly addSourceCommandName = "Add Source";
  public static readonly removeSourceCommandName = "Remove Source";
  public static readonly updateViewNameCommandName = "Update View Name";
  public static readonly updateViewDescriptionCommandName = "Update View Description";

  // connection table dialog
  public static readonly connectionTableSelectionDialogMessage = "Expand connection and select a source for your view";
  public static readonly connectionTableSelectionDialogTitle = "Select Source for View";
  public static readonly currentSelection = "Current Selection:";
  public static readonly noSelection = "Nothing selected";

  // editor views
  public static readonly messagesTabName = "Messages";
  public static readonly previewTabName = "Preview";

  // message log
  public static readonly contextColumnName = "Context";
  public static readonly descriptionColumnName = "Description";
  public static readonly idColumnName = "ID";
  public static readonly noMessagesFound = "No messages found";
  public static readonly typeColumnName = "Type";

  // problems
  public static readonly error0100 = "There must be a virtualization selected in order to use this editor.";
  public static readonly error0110 = "A view must have a name.";
  public static readonly error0120 = "A view must have at least one source.";

  // property editors
  public static readonly columnPropsTabName = "Column";
  public static readonly viewPropsTabName = "View";

  // view canvas
  public static readonly noSourcesAlert = "Select a source for the view";

  // view editor
  public static readonly addCompositionActionTitle = "Add Composition";
  public static readonly addCompositionActionTooltip = "Add Composition";
  public static readonly addSourceDialogTitle = "Select View Source";
  public static readonly addSourceActionTitle = "Add Source";
  public static readonly addSourceActionTooltip = "Add Source";
  public static readonly deleteActionTitle = "Delete";
  public static readonly deleteActionTooltip = "Delete the selection(s)";
  public static readonly errorsActionTitle = "Errors";
  public static readonly errorsActionTooltip = "Show error messages";
  public static readonly infosActionTitle = "Infos";
  public static readonly infosActionTooltip = "Show info messages";
  public static readonly redoActionTitle = "Redo";
  public static readonly redoActionTooltip = "Redo";
  public static readonly saveActionTitle = "Save";
  public static readonly saveActionTooltip = "Save";
  public static readonly saveProgressDialogMessage = "Saving View in Progress...";
  public static readonly saveProgressDialogTitle = "Saving View";
  public static readonly showEditorCanvasAndViewsActionTooltip = "Show full editor";
  public static readonly showEditorCanvasOnlyActionTooltip = "Show canvas and properties only";
  public static readonly showEditorViewsOnlyActionTooltip = "Show information views only";
  public static readonly undoActionTitle = "Undo";
  public static readonly undoActionTooltip = "Undo";
  public static readonly warningsActionTitle = "Warnings";
  public static readonly warningsActionTooltip = "Show warning messages";

  // view editor header
  public static readonly descriptionLabel = "Description:";
  public static readonly descriptionPlaceholder = "Enter a view description";
  public static readonly showDescriptionCheckbox = "Show Description";
  public static readonly viewNameLabel = "View Name:";
  public static readonly viewNamePlaceholder = "Enter a view name";

  // view preview
  public static readonly previewDataUnavailable = "Preview data unavailable";
  public static readonly rowNumberColumnName = "ROW #";

}
