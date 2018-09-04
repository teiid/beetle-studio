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
  public static readonly finishButtonText = "Finish";
  public static readonly wizardNextButtonText = "Next >";

  // commands
  public static readonly addSourcesCommandName = "Add Sources";
  public static readonly addCompositionCommandName = "Add Composition";
  public static readonly sampleDataCommandName = "Sample Data";
  public static readonly noOpCommandName = "No operation";
  public static readonly removeCompositionCommandName = "Remove Composition";
  public static readonly removeSourcesCommandName = "Remove Sources";
  public static readonly updateViewNameCommandName = "Update View Name";
  public static readonly updateViewDescriptionCommandName = "Update View Description";

  // connection table dialog
  public static readonly connectionTableSelectionDialogMessage = "Expand connection and select a source for your view";
  public static readonly connectionTableSelectionDialogTitle = "Select Source for View";
  public static readonly currentSelection = "Current Selection:";
  public static readonly noSelection = "Nothing selected";

  // create virtualization dialog
  public static readonly createVirtualizationDialogMessage = "Enter name and optional description for the virtualization and view";
  public static readonly createVirtualizationDialogTitle = "Create Virtualization";

  // create view dialog
  public static readonly createViewDialogMessage = "Enter name and description(optional) for the new view";
  public static readonly createViewDialogTitle = "Create View";

  // Add Composition Wizard
  public static readonly addCompositionWizardTitle = "Add Composition";
  public static readonly addCompositionWizardSelectSourceMessage = "Expand connection and select a source for the composition";
  public static readonly addCompositionWizardCriteriaStepMessage = "Select the left and right columns, and define the criteria";
  public static readonly addCompositionWizardStep1Text = "Select Source";
  public static readonly addCompositionWizardStep2Text = "Define Composition";
  public static readonly addCompositionWizardLoadingPrimaryText = "Add Composition Wizard loading";
  public static readonly addCompositionWizardLoadingSecondaryText = "Please wait for the wizard to finish loading...";

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
  public static readonly error0130 = "A view with two or more sources must have at least one composition.";

  public static readonly warn0100 = "The view contains an orphan source which will be ignored";

  // property editors
  public static readonly columnPropsTabName = "Column";
  public static readonly viewPropsTabName = "View";

  // view canvas
  public static readonly noSourcesAlert = "Select a source for the view";

  // view editor
  public static readonly addCompositionActionTitle = "Add Composition";
  public static readonly addCompositionActionTooltip = "Add Composition";
  public static readonly sampleDataActionTitle = "Sample Data";
  public static readonly sampleDataActionTooltip = "Sample data from selected view or source";
  public static readonly addSourceDialogTitle = "Select View Source";
  public static readonly addSourceActionTitle = "Add Source";
  public static readonly addSourceActionTooltip = "Add Source";
  public static readonly deleteActionTitle = "Delete";
  public static readonly deleteActionTooltip = "Delete the selection(s)";
  public static readonly errorsActionTitle = "Errors";
  public static readonly errorsActionTooltip = "Show error messages";
  public static readonly errorRestoringViewEditorState = "There was an error restoring the view editor state: ";
  public static readonly infosActionTitle = "Infos";
  public static readonly infosActionTooltip = "Show info messages";
  public static readonly redoActionTitle = "Redo";
  public static readonly redoActionTooltip = "Redo";
  public static readonly saveActionTitle = "Save";
  public static readonly saveActionTooltip = "Save";
  public static readonly serverError = "Server Error";
  public static readonly showEditorCanvasAndViewsActionTooltip = "Show full editor";
  public static readonly showEditorCanvasOnlyActionTooltip = "Show canvas and properties only";
  public static readonly showEditorViewsOnlyActionTooltip = "Show information views only";
  public static readonly undoActionTitle = "Undo";
  public static readonly undoActionTooltip = "Undo";
  public static readonly warningsActionTitle = "Warnings";
  public static readonly warningsActionTooltip = "Show warning messages";

  // view editor header
  public static readonly viewDescriptionLabel = "Selected View Description";
  public static readonly viewDescriptionPlaceholder = "Enter a view description";
  public static readonly noViewsDefined = "No views defined";

  // view preview
  public static readonly previewDataUnavailable = "Preview data unavailable";
  public static readonly rowNumberColumnName = "ROW #";

}
