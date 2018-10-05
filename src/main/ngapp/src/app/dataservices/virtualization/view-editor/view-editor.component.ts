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

import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { SelectionService } from "@core/selection.service";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ConnectionTableDialogComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-table-dialog.component";
import { ViewEditorProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { BsModalService } from "ngx-bootstrap";
import { Action, ActionConfig, ToolbarConfig, ToolbarView } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { ConfirmDialogComponent } from "@shared/confirm-dialog/confirm-dialog.component";
import { AddCompositionWizardComponent } from "@dataservices/virtualization/view-editor/add-composition-wizard/add-composition-wizard.component";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { AddCompositionCommand } from "@dataservices/virtualization/view-editor/command/add-composition-command";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { Composition } from "@dataservices/shared/composition.model";
import { Router } from "@angular/router";
import { NavigationStart } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-editor",
  templateUrl: "./view-editor.component.html",
  styleUrls: ["./view-editor.component.css"],
  providers: [ ViewEditorService ]
})
export class ViewEditorComponent implements DoCheck, OnDestroy, OnInit {

  private actionConfig: ActionConfig;
  private connections: Connection[] = [];
  private connectionService: ConnectionService;
  private readonly editorService: ViewEditorService;
  private readonly logger: LoggerService;
  private modalService: BsModalService;
  private readonly router: Router;
  private selectionService: SelectionService;
  private subscription: Subscription;
  private saveInProgress = false;
  private routeSub: Subscription;

  public toolbarConfig: ToolbarConfig;
  public readonly virtualizationsLink = DataservicesConstants.dataservicesRootPath;

  //
  // Editor CSS types.
  //
  private readonly canvasOnlyCssType = "view-editor-canvas-only";
  private readonly fullEditorCssType = "view-editor-full";
  private readonly viewsOnlyCssType = "view-editor-views-only";

  //
  // Toolbar action IDs
  //
  private readonly addCompositionActionId = "addCompositionActionId";
  private readonly addSourceActionId = "addSourceActionId";
  private readonly sampleDataActionId = "sampleDataActionId";
  private readonly deleteActionId = "deleteActionId";
  private readonly errorsActionId = "errorsActionId";
  private readonly infosActionId = "infosActionId";
  private readonly redoActionId = "redoActionId";
  private readonly saveActionId = "saveActionId";
  private readonly undoActionId = "undoActionId";
  private readonly warningsActionId = "warningsActionId";

  //
  // Toolbar action indexes (must stay in sync with the ActionConfig)
  //
  private readonly addSourceActionIndex = 0;
  private readonly addCompositionActionIndex = 1;
  private readonly sampleDataActionIndex = 2;
  private readonly saveActionIndex = 3;
  private readonly undoActionIndex = 4;
  private readonly redoActionIndex = 5;
  private readonly deleteActionIndex = 6;
  private readonly errorsActionIndex = 7;
  private readonly warningsActionIndex = 8;
  private readonly infosActionIndex = 9;

  constructor( connectionService: ConnectionService,
               selectionService: SelectionService,
               logger: LoggerService,
               editorService: ViewEditorService,
               modalService: BsModalService,
               router: Router ) {
    this.connectionService = connectionService;
    this.logger = logger;
    this.modalService = modalService;
    this.router = router;
    this.selectionService = selectionService;

    // this is the service that is injected into all the editor parts
    this.editorService = editorService;
    this.editorService.setEditorVirtualization( selectionService.getSelectedVirtualization() );
  }

  /**
   * Executed by javascript framework when something changes. Used to set then enable state of the toolbar buttons.
   */
  public ngDoCheck(): void {
    if (this.actionConfig ) {
      this.actionConfig.primaryActions[ this.addCompositionActionIndex ].disabled = !this.canAddComposition();
      this.actionConfig.primaryActions[ this.addSourceActionIndex ].disabled = !this.canAddSource();
      this.actionConfig.primaryActions[ this.sampleDataActionIndex ].disabled = !this.canSampleData();
      this.actionConfig.primaryActions[ this.deleteActionIndex ].disabled = !this.canDelete();
      this.actionConfig.primaryActions[ this.errorsActionIndex ].disabled = !this.hasErrors();
      this.actionConfig.primaryActions[ this.infosActionIndex ].disabled = !this.hasInfos();
      this.actionConfig.primaryActions[ this.redoActionIndex ].disabled = !this.canRedo();
      this.actionConfig.primaryActions[ this.redoActionIndex ].tooltip = this.editorService.getRedoActionTooltip();
      this.actionConfig.primaryActions[ this.saveActionIndex ].disabled = !this.canSave();
      this.actionConfig.primaryActions[ this.undoActionIndex ].disabled = !this.canUndo();
      this.actionConfig.primaryActions[ this.undoActionIndex ].tooltip = this.editorService.getUndoActionTooltip();
      this.actionConfig.primaryActions[ this.warningsActionIndex ].disabled = !this.hasWarnings();
    }
  }

  /**
   * Cleanup code when destroying the editor.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routeSub.unsubscribe();
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.editorService.setEditorConfig( this.fullEditorCssType ); // this could be set via preference or last used config
    this.subscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );

    // Load the connections
    const self = this;
    this.connectionService
      .getConnections(true, true)
      .subscribe(
        (connectionSummaries) => {
          const conns = [];
          for ( const connectionSummary of connectionSummaries ) {
            const connStatus = connectionSummary.getStatus();
            const conn = connectionSummary.getConnection();
            conn.setStatus(connStatus);
            conns.push(conn);
            self.connections = conns;
          }
        },
        (error) => {
          // self.logger.error("[ConnectionSchemaTreeComponent] Error getting connections: %o", error);
          // self.connectionLoadingState = LoadingState.LOADED_INVALID;
        }
      );

    // Listen for event when user moves away from this page
    this.routeSub = this.router.events.pairwise().subscribe((event) => {
      if (event[1] instanceof NavigationStart) {
        if (this.editorService.hasChanges()) {
          this.editorService.saveEditorState();
        }
      }
    });
  }

  /**
   * Determine if a view is currently selected
   */
  private get hasSelectedView(): boolean {
    const selView = this.editorService.getEditorView();
    return (selView && selView !== null);
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ViewEditorComponent received event: " + event.toString() );

    if ( event.typeIsShowEditorPart() ) {
      if ( event.args.length !== 0 ) {
        // make sure the bottom area is showing if part is an additional editor view
        if ( ( event.args[ 0 ] === ViewEditorPart.PREVIEW || event.args[ 0 ] === ViewEditorPart.MESSAGE_LOG )
          && !this.isShowingAdditionalViews ) {
          this.editorService.setEditorConfig( this.fullEditorCssType );
        }
      }
    }
    else if (event.typeIsCreateSource()) {
      if (event.sourceIsCanvas()) {
        alert("Multiple compositions not yet supported");
      } else {
        this.doAddSource();
      }
    }
    else if (event.typeIsCreateComposition()) {
      this.doAddComposition(event.args);
    }
    else if (event.typeIsDeleteNode()) {
      const selection = [];
      let selectionStr = event.args[0];
      if ( event.args.length > 1 ) {
        // selection.push(event.args[1]);
        selectionStr += Command.identDivider + event.args[1];
      }
      selection.push(selectionStr);
      this.doDelete(selection);
    }
    else if (event.typeIsCanvasSelectionChanged()) {
      this.doSelection(event.args);
    }
    else if ( event.typeIsEditorViewSaveProgressChanged() ) {
      if ( event.args.length !== 0 ) {
        // Detect changes in view editor save progress
        if ( event.args[ 0 ] === ViewEditorProgressChangeId.IN_PROGRESS ) {
          this.saveInProgress = true;
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_SUCCESS ) {
          this.editorService.updatePreviewResults();
          this.saveInProgress = false;
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_FAILED ) {
          this.editorService.setPreviewResults(null, null, ViewEditorPart.EDITOR);
          this.saveInProgress = false;
        }
      }
    }
  }

  private canAddComposition(): boolean {
    return this.hasSelectedView &&
          !this.editorService.isReadOnly() &&
           this.isShowingCanvas &&
           this.canvasSingleSourceSelected;
  }

  private canAddSource(): boolean {
    return this.hasSelectedView &&
          !this.editorService.isReadOnly() &&
           this.isShowingCanvas;
  }

  private canSampleData(): boolean {
    return !this.editorService.isReadOnly() && this.isShowingCanvas && this.canvasSingleSourceSelected;
  }

  private canDelete(): boolean {
    return this.hasSelectedView &&
          !this.editorService.isReadOnly() &&
           this.isShowingCanvas &&
           this.editorService.hasSelection();
  }

  private canRedo(): boolean {
    return this.hasSelectedView &&
           this.editorService.canRedo();
  }

  private canSave(): boolean {
    return this.hasSelectedView
           && !this.editorService.isReadOnly()
           && this.editorService.canSaveView()
           && this.editorService.hasChanges()
           && !this.saveInProgress;
  }

  private canUndo(): boolean {
    return this.hasSelectedView &&
           this.editorService.canUndo();
  }

  private doAddComposition(sourcePaths: string[]): void {
    let sourcePath = null;
    if (sourcePaths && sourcePaths.length === 1) {
      sourcePath = sourcePaths[0];
    }

    // Show AddComposition Wizard, setting initial state
    const initialState = { initialSourcePath: sourcePath, editorService: this.editorService};
    const modalConfig = {};
    const addCompositionModalRef = this.modalService.show(AddCompositionWizardComponent,
      Object.assign({}, modalConfig, { class: 'modal-lg', initialState }));

    // Acts upon finish button click
    addCompositionModalRef.content.finishAction.take(1).subscribe((composition) => {
      // Check the composition and add any missing view sources
      const leftSourcePath = composition.getLeftSourcePath();
      const rightSourcePath = composition.getRightSourcePath();
      const viewHasLeftSource = this.editorService.getEditorView().hasSourcePath(leftSourcePath);
      const viewHasRightSource = this.editorService.getEditorView().hasSourcePath(rightSourcePath);
      if ( !viewHasLeftSource ) {
        this.fireAddSourcesCommand(leftSourcePath);
      }
      if ( !viewHasRightSource ) {
        this.fireAddSourcesCommand(rightSourcePath);
      }

      // Create and fire command to Add the Composition
      this.fireAddCompositionCommand(composition);

      addCompositionModalRef.hide();
    });

    // Acts upon cancel button click (closes wizard)
    addCompositionModalRef.content.cancelAction.take(1).subscribe((composition) => {
      addCompositionModalRef.hide();
    });
  }

  private doAddSource(): void {
    // Open Source selection dialog
    const initialState = {
      title: ViewEditorI18n.addSourceDialogTitle,
      cancelButtonText: ViewEditorI18n.cancelButtonText,
      okButtonText: ViewEditorI18n.okButtonText
    };

    // Show Dialog, act upon confirmation click
    const self = this;
    const modalRef = this.modalService.show(ConnectionTableDialogComponent, {initialState});
    modalRef.content.okAction.take(1).subscribe((selectedNodes) => {
      self.fireAddSourcesCommand(selectedNodes);
    });
  }

  /**
   * Generates the AddSourcesCommand for the supplied sources, and fires the viewEditor state change with the command.
   * 'addedSources' must be an array of SchemaNodes -OR-
   * string of the source paths (comma delimited) - path form: "connection=aConn/schema=aSchema/table=aTable"
   *
   * @param {string | SchemaNode} addedSources the string representation of the sources or the schema nodes of the sources
   *                              being added (cannot be `null` or empty)
   */
  private fireAddSourcesCommand(addedSources: string | SchemaNode[]): void {
    const tempCmd = CommandFactory.createAddSourcesCommand( addedSources );

    if ( tempCmd instanceof Command ) {
      const cmd = tempCmd as Command;
      this.editorService.fireViewStateHasChanged( ViewEditorPart.EDITOR, cmd );
    } else {
      this.logger.error( "Failed to create AddSourcesCommand" );
    }
  }

  /**
   * Generates the AddCompositionCommand for the supplied composition, and fires the viewEditor state change with the command.
   *
   * @param {Composition} addedComposition the Composition being added (cannot be `null` or empty)
   */
  private fireAddCompositionCommand(addedComposition: Composition): void {
    const tempCmd = CommandFactory.createAddCompositionCommand( addedComposition );

    if ( tempCmd instanceof Command ) {
      const cmd = tempCmd as Command;
      this.editorService.fireViewStateHasChanged( ViewEditorPart.EDITOR, cmd );
    } else {
      this.logger.error( "Failed to create AddCompositionCommand" );
    }
  }

  private doDelete(selectionArgs: string[]): void {

    if (!selectionArgs || selectionArgs.length === 0) {
      alert("Nothing selected for delete");
      return;
    }

    // Dialog Content
    let message = "Do you really want to delete the " + selectionArgs.length;
    if (selectionArgs.length > 1)
      message = message + " items?";
    else
      message = message + " item?";

    const initialState = {
      title: "Confirm Delete",
      bodyContent: message,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete"
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    modalRef.content.confirmAction.take(1).subscribe((value) => {
      // ------------------
      // the selection arguments contain the command object arg[0] and the metadata object arg[1]
      // 1) need to loop through each selection
      // 2) create corresponding command
      // 3) fire view state changed event for each
      // ------------------

      selectionArgs.forEach( ( nextArg ) => {

        // get command type from the selection
        const commandType = this.editorService.getSelectionCommandType(nextArg);
        // the payload for src will be the source/connection path
        // the payload for the composition will be the json representing the composition properties
        const argPart = this.editorService.getSelectionPayload(nextArg);

        if ( commandType === AddSourcesCommand.id ) {
          // Look for any composition with src paths links and remove if exist
          const comps: Composition[] = this.editorService.getEditorView().getCompositions();
          comps.forEach( (nextComp)  => {
            const leftPath = nextComp.getLeftSourcePath();
            if (leftPath && leftPath != null && argPart === leftPath) {
              const addCompCmd = CommandFactory.createRemoveCompositionCommand(nextComp.toString(), AddCompositionCommand.id);
              if (addCompCmd && addCompCmd != null) {
                this.notifyRemoved(addCompCmd);
              }
            } else {
              const rightPath = nextComp.getRightSourcePath();
              if (rightPath && rightPath != null && argPart === rightPath) {
                const addCompCmd = CommandFactory.createRemoveCompositionCommand(nextComp.toString(), AddCompositionCommand.id);
                if (addCompCmd && addCompCmd != null) {
                  this.notifyRemoved(addCompCmd);
                }
              }
            }
          });

          // Remove Source Command
          const addSrcsCmd = CommandFactory.createRemoveSourcesCommand(argPart, commandType);
          this.notifyRemoved(addSrcsCmd);

        } else if ( commandType === AddCompositionCommand.id ) {
          // Remove composition
          const addCompCmd = CommandFactory.createRemoveCompositionCommand(argPart, commandType);
          this.notifyRemoved(addCompCmd);
        }

        this.editorService.select(null);
      });
    });
  }

  private notifyRemoved(command: Command): void {
    if (command !== null ) {
      const cmd = command as Command;
      this.editorService.fireViewStateHasChanged(ViewEditorPart.EDITOR, cmd);
    } else {
      this.logger.error("Failed to create Remove Command");
    }
  }

  private doSampleData(selection: string[]): void {
    if (!selection || selection.length === 0) {
      alert("Nothing selected for sample data");
      return;
    }
    const path = selection[0];
    this.editorService.updatePreviewResults(path);
  }

  private doSelection(selection: string[]): void {
    this.editorService.select(selection);
  }

  private doDisplayLogMessages( actionId: string ): void {
    this.editorService.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                                     ViewEditorEventType.SHOW_EDITOR_PART,
                                                     [ ViewEditorPart.MESSAGE_LOG ] ) );
  }

  private doRedo(): void {
    this.editorService.redo();
  }

  private doSave(): void {
    this.editorService.saveEditorState();
  }

  private doUndo(): void {
    this.editorService.undo();
  }

  /**
   * @returns {string} argument array from the selection string
   */
  private getArgs(selection?: string): string[] {
    if ( selection !== null ) {
      return selection.split(Command.identDivider);
    }
    return null;
  }

  /**
   * Callback for when a view icon is clicked on the toolbar.
   *
   * @param {ToolbarView} toolbarView the toolbar view representing the editor configuration to display
   */
  public editorConfigChange( toolbarView: ToolbarView ): void {
    if ( toolbarView.id !== this.editorService.getEditorConfig() ) {
      this.editorService.setEditorConfig( toolbarView.id );
    }
  }

  /**
   * @returns {string} the current CSS type of the editor
   */
  public get editorCssType(): string {
    return this.editorService.getEditorConfig();
  }

  /**
   * Callback for when the toolbar is configured.
   *
   * @param {TemplateRef<any>} addSourceTemplate the template for the add source toolbar button
   * @param {TemplateRef<any>} addCompositionTemplate the template for the add composition toolbar button
   * @param {TemplateRef<any>} sampleDataTemplate the template for the sample data toolbar button
   * @param {TemplateRef<any>} undoTemplate the template for the undo toolbar button
   * @param {TemplateRef<any>} redoTemplate the template for the redo toolbar button
   * @param {TemplateRef<any>} saveTemplate the template for the save toolbar button
   * @param {TemplateRef<any>} deleteTemplate the template for the delete toolbar button
   * @param {TemplateRef<any>} errorsTemplate the template for the show errors toolbar button
   * @param {TemplateRef<any>} warningsTemplate the template for the show warnings toolbar button
   * @param {TemplateRef<any>} infosTemplate the template for the show infos toolbar button
   * @returns {ActionConfig}
   */
  public getActionConfig( addSourceTemplate: TemplateRef< any >,
                          addCompositionTemplate: TemplateRef< any >,
                          sampleDataTemplate: TemplateRef< any >,
                          undoTemplate: TemplateRef< any >,
                          redoTemplate: TemplateRef< any >,
                          saveTemplate: TemplateRef< any >,
                          deleteTemplate: TemplateRef< any >,
                          errorsTemplate: TemplateRef< any >,
                          warningsTemplate: TemplateRef< any >,
                          infosTemplate: TemplateRef< any > ): ActionConfig {
    if ( !this.actionConfig ) {
      this.actionConfig = {
        primaryActions: [
          {
            disabled: !this.canAddSource(),
            id: this.addSourceActionId,
            template: addSourceTemplate,
            title: ViewEditorI18n.addSourceActionTitle,
            tooltip: ViewEditorI18n.addSourceActionTooltip
          },
          {
            disabled: !this.canAddComposition(),
            id: this.addCompositionActionId,
            template: addCompositionTemplate,
            title: ViewEditorI18n.addCompositionActionTitle,
            tooltip: ViewEditorI18n.addCompositionActionTooltip
          },
          {
            disabled: !this.canSampleData(),
            id: this.sampleDataActionId,
            template: sampleDataTemplate,
            title: ViewEditorI18n.sampleDataActionTitle,
            tooltip: ViewEditorI18n.sampleDataActionTooltip
          },
          {
            disabled: !this.canSave(),
            id: this.saveActionId,
            styleClass: "view-editor-toolbar-end-group",
            template: saveTemplate,
            title: ViewEditorI18n.saveActionTitle,
            tooltip: ViewEditorI18n.saveActionTooltip
          },
          {
            disabled: !this.canUndo(),
            id: this.undoActionId,
            template: undoTemplate,
            title: ViewEditorI18n.undoActionTitle,
            tooltip: ViewEditorI18n.undoActionTooltip
          },
          {
            disabled: !this.canRedo(),
            id: this.redoActionId,
            styleClass: "view-editor-toolbar-end-group",
            template: redoTemplate,
            title: ViewEditorI18n.redoActionTitle,
            tooltip: ViewEditorI18n.redoActionTooltip
          },
          {
            disabled: !this.canDelete(),
            id: this.deleteActionId,
            styleClass: "view-editor-toolbar-end-group",
            template: deleteTemplate,
            title: ViewEditorI18n.deleteActionTitle,
            tooltip: ViewEditorI18n.deleteActionTooltip
          },
          {
            disabled: !this.hasErrors(),
            id: this.errorsActionId,
            template: errorsTemplate,
            title: ViewEditorI18n.errorsActionTitle,
            tooltip: ViewEditorI18n.errorsActionTooltip
          },
          {
            disabled: !this.hasWarnings(),
            id: this.warningsActionId,
            template: warningsTemplate,
            title: ViewEditorI18n.warningsActionTitle,
            tooltip: ViewEditorI18n.warningsActionTooltip
          },
          {
            disabled: !this.hasInfos(),
            id: this.infosActionId,
            template: infosTemplate,
            title: ViewEditorI18n.infosActionTitle,
            tooltip: ViewEditorI18n.infosActionTooltip
          }
        ],
        moreActions: [],
      } as ActionConfig;
    }

    return this.actionConfig;
  }

  /**
   * Callback for when a toolbar button is clicked.
   *
   * @param {Action} action the toolbar action that was clicked
   */
  public handleAction( action: Action ): void {
    switch ( action.id ) {
      case this.addCompositionActionId:
        this.doAddComposition([]);
        break;
      case this.addSourceActionId:
        this.doAddSource();
        break;
      case this.sampleDataActionId:
        const singleSelection = this.editorService.getSelection();
        this.doSampleData(singleSelection);
        break;
      case this.deleteActionId:
        const selection = this.editorService.getSelection();
        this.doDelete(selection);
        break;
      case this.errorsActionId:
        this.doDisplayLogMessages( this.errorsActionId );
        break;
      case this.infosActionId:
        this.doDisplayLogMessages( this.infosActionId );
        break;
      case this.redoActionId:
        this.doRedo();
        break;
      case this.saveActionId:
        this.doSave();
        break;
      case this.undoActionId:
        this.doUndo();
        break;
      case this.warningsActionId:
        this.doDisplayLogMessages( this.warningsActionId );
        break;
      default:
        this.logger.error( `Unhandled action '${action.id}'` );
    }
  }

  private hasErrors(): boolean {
    return this.errorMsgCount !== 0;
  }

  private hasInfos(): boolean {
    return this.infoMsgCount !== 0;
  }

  private hasWarnings(): boolean {
    return this.warningMsgCount !== 0;
  }

  /**
   * @returns {number} the number of error messages
   */
  public get errorMsgCount(): number {
    return this.editorService.getErrorMessageCount();
  }

  /**
   * @returns {number} the number of warning messages
   */
  public get warningMsgCount(): number {
    return this.editorService.getWarningMessageCount();
  }

  /**
   * @returns {number} the number of informational messages
   */
  public get infoMsgCount(): number {
    return this.editorService.getInfoMessageCount();
  }

  /**
   * Indicates if the results area should be shown.
   *
   * @returns {boolean} `true` if area should be shown
   */
  public get isShowingAdditionalViews(): boolean {
    return this.editorCssType === this.viewsOnlyCssType || this.editorCssType === this.fullEditorCssType;
  }

  /**
   * Indicates if the canvas and properties areas should be shown.
   *
   * @returns {boolean} `true` if areas should be shown
   */
  public get isShowingCanvas(): boolean {
    return this.editorCssType === this.canvasOnlyCssType || this.editorCssType === this.fullEditorCssType;
  }

  /**
   * Indicates if the canvas has a single source selected
   *
   * @returns {boolean} `true` if canvas has single source selection
   */
  public get canvasSingleSourceSelected(): boolean {
    const selections = this.editorService.getSelection();
    return selections && selections.length === 1;
  }

}
