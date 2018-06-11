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
import { View } from "@dataservices/shared/view.model";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { Problem } from "@dataservices/virtualization/view-editor/editor-views/message-log/problem";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ConnectionTableDialogComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-table-dialog.component";
import { ViewStateChangeId } from "@dataservices/virtualization/view-editor/event/view-state-change-id.enum";
import { ViewValidator } from "@dataservices/virtualization/view-editor/view-validator";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Action, ActionConfig, ToolbarConfig, ToolbarView } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";
import { ViewEditorSaveProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { ProgressDialogComponent } from "@shared/progress-dialog/progress-dialog.component";

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
  private fatalErrorOccurred = false;
  private isNewView = false;
  private readonly logger: LoggerService;
  private modalService: BsModalService;
  private progressModalRef: BsModalRef;
  private subscription: Subscription;

  public toolbarConfig: ToolbarConfig;
  public readonly virtualizationsLink = DataservicesConstants.dataservicesRootPath;

  //
  // Editor CSS types.
  //
  private readonly canvasOnlyCssType = "view-editor-canvas-only";
  private readonly fullEditorCssType = "view-editor-full";
  private readonly resultsOnlyCssType = "view-editor-views-only";

  //
  // Toolbar action IDs
  //
  private readonly addCompositionActionId = "addCompositionActionId";
  private readonly addSourceActionId = "addSourceActionId";
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
  private readonly saveActionIndex = 2;
  private readonly redoActionIndex = 3;
  private readonly undoActionIndex = 4;
  private readonly deleteActionIndex = 5;
  private readonly errorsActionIndex = 6;
  private readonly infosActionIndex = 7;
  private readonly warningsActionIndex = 8;

  constructor( connectionService: ConnectionService,
               selectionService: SelectionService,
               logger: LoggerService,
               editorService: ViewEditorService,
               modalService: BsModalService ) {
    this.connectionService = connectionService;
    this.logger = logger;
    this.modalService = modalService;

    // this is the service that is injected into all the editor parts
    this.editorService = editorService;
    this.editorService.setEditorVirtualization( selectionService.getSelectedVirtualization() );
    this.editorService.setEditorView( selectionService.getSelectedView(), ViewEditorPart.EDITOR );
  }

  private canAddComposition(): boolean {
    // TODO implement canAddComposition
    return !this.fatalErrorOccurred && !this.editorService.isReadOnly() && this.isShowingCanvas;
  }

  private canAddSource(): boolean {
    // TODO implement canAddSource
    return !this.fatalErrorOccurred && !this.editorService.isReadOnly() && this.isShowingCanvas;
  }

  private canDelete(): boolean {
    // TODO implement canDelete
    return !this.fatalErrorOccurred && !this.editorService.isReadOnly() && this.isShowingCanvas;
  }

  private canRedo(): boolean {
    // TODO implement canRedo
    return !this.fatalErrorOccurred && !this.editorService.isReadOnly() && this.isShowingCanvas;
  }

  private canSave(): boolean {
    return !this.fatalErrorOccurred
           && !this.editorService.isReadOnly()
           && this.editorService.getErrorMessageCount() === 0
           && this.editorService.hasChanges();
  }

  private canUndo(): boolean {
    // TODO implement canUndo
    return !this.fatalErrorOccurred && !this.editorService.isReadOnly() && this.isShowingCanvas;
  }

  private doAddComposition(): void {
    // TODO implement doAddComposition
    alert( "Display add composition dialog" );
  }

  private doAddSource(): void {
    // Open Source selection dialog
    const initialState = {
      title: "Select View Source",
      cancelButtonText: "Cancel",
      okButtonText: "OK"
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(ConnectionTableDialogComponent, {initialState});
    modalRef.content.okAction.take(1).subscribe((selectedNodes) => {
      this.editorService.getEditorView().setSources( selectedNodes );
      this.editorService.fireViewStateHasChanged( ViewEditorPart.EDITOR,
                                                  ViewStateChangeId.SOURCES_CHANGED,
                                                  [ selectedNodes ] );
    });
  }

  private doDelete(): void {
    // TODO implement doDelete
    alert( "Display delete canvas object confirmation dialog" );
    // // Dialog Content
    // const message = "Do you really want to delete View '" + this.editorService.getEditorView().getName() + "'?";
    // const initialState = {
    //   title: "Confirm Delete",
    //   bodyContent: message,
    //   cancelButtonText: "Cancel",
    //   confirmButtonText: "Delete"
    // };
    //
    // // Show Dialog, act upon confirmation click
    // const modalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    // modalRef.content.confirmAction.take(1).subscribe((value) => {
    //   this.deleteView();
    // });
  }

  private deleteView( ): void {
    alert("Delete the view!");
  }

  private doDisplayLogMessages( actionId: string ): void {
    this.editorService.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                                     ViewEditorEventType.SHOW_EDITOR_PART,
                                                     [ ViewEditorPart.MESSAGE_LOG ] ) );
  }

  private doRedo(): void {
    // TODO implement doRedo
    this.logger.debug( "doRedo() here" );
  }

  private doSave(): void {
    this.editorService.saveView(this.connections);
  }

  private doUndo(): void {
    // TODO implement doUndo
    this.logger.debug( "doUndo() here" );
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
   * @returns {number} the number of error messages
   */
  public get errorMsgCount(): number {
    return this.editorService.getErrorMessageCount();
  }

  /**
   * Callback for when the toolbar is configured.
   *
   * @param {TemplateRef<any>} addSourceTemplate the template for the add source toolbar button
   * @param {TemplateRef<any>} addCompositionTemplate the template for the add composition toolbar button
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
            title: "Add Source",
            tooltip: "Add Source"
          },
          {
            disabled: !this.canAddComposition(),
            id: this.addCompositionActionId,
            template: addCompositionTemplate,
            title: "Add Composition",
            tooltip: "Add Composition"
          },
          {
            disabled: !this.canSave(),
            id: this.saveActionId,
            styleClass: "view-editor-toolbar-end-group",
            template: saveTemplate,
            title: "Save",
            tooltip: "Save"
          },
          {
            disabled: !this.canUndo(),
            id: this.undoActionId,
            template: undoTemplate,
            title: "Undo",
            tooltip: "Undo"
          },
          {
            disabled: !this.canRedo(),
            id: this.redoActionId,
            styleClass: "view-editor-toolbar-end-group",
            template: redoTemplate,
            title: "Redo",
            tooltip: "Redo"
          },
          {
            disabled: !this.canDelete(),
            id: this.deleteActionId,
            styleClass: "view-editor-toolbar-end-group",
            template: deleteTemplate,
            title: "Delete",
            tooltip: "Delete the selection"
          },
          {
            disabled: !this.hasErrors(),
            id: this.errorsActionId,
            template: errorsTemplate,
            title: "Errors",
            tooltip: "Error messages"
          },
          {
            disabled: !this.hasWarnings(),
            id: this.warningsActionId,
            template: warningsTemplate,
            title: "Warnings",
            tooltip: "Warning messages"
          },
          {
            disabled: !this.hasInfos(),
            id: this.infosActionId,
            template: infosTemplate,
            title: "Infos",
            tooltip: "Info messages"
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
        this.doAddComposition();
        break;
      case this.addSourceActionId:
        this.doAddSource();
        break;
      case this.deleteActionId:
        this.doDelete();
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
    } else if ( event.typeIsEditorViewSaveProgressChanged() ) {
      if ( event.args.length !== 0 ) {
        // When save in progress, open the progress modal dialog.  On completion, hide it
        if ( event.args[ 0 ] === ViewEditorSaveProgressChangeId.IN_PROGESS ) {
          // Dialog Content
          const message = "Saving View in Progress...";
          const initialState = {
            title: "Saving View",
            bodyContent: message,
          };

          this.progressModalRef = this.modalService.show(ProgressDialogComponent, {initialState});
        } else if ( event.args[ 0 ] === ViewEditorSaveProgressChangeId.COMPLETED_SUCCESS ) {
          setTimeout(() => this.progressModalRef.hide(), 2000);
        } else if ( event.args[ 0 ] === ViewEditorSaveProgressChangeId.COMPLETED_FAILED ) {
          setTimeout(() => { this.progressModalRef.hide(); alert("Save view failed!"); } , 2000);
        }
      }
    } else if ( event.typeIsViewStateChanged() ) {
      this.validateView( "ViewEditorEvent.VIEW_STATE_CHANGED" );
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
    return this.editorCssType === this.resultsOnlyCssType || this.editorCssType === this.fullEditorCssType;
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
   * Executed by javascript framework when something changes. Used to set then enable state of the toolbar buttons.
   */
  public ngDoCheck(): void {
    if (this.actionConfig ) {
      this.actionConfig.primaryActions[ this.addCompositionActionIndex ].disabled = !this.canAddComposition();
      this.actionConfig.primaryActions[ this.addSourceActionIndex ].disabled = !this.canAddSource();
      this.actionConfig.primaryActions[ this.deleteActionIndex ].disabled = !this.canDelete();
      this.actionConfig.primaryActions[ this.errorsActionIndex ].disabled = !this.hasErrors();
      this.actionConfig.primaryActions[ this.infosActionIndex ].disabled = !this.hasInfos();
      this.actionConfig.primaryActions[ this.redoActionIndex ].disabled = !this.canRedo();
      this.actionConfig.primaryActions[ this.saveActionIndex ].disabled = !this.canSave();
      this.actionConfig.primaryActions[ this.undoActionIndex ].disabled = !this.canUndo();
      this.actionConfig.primaryActions[ this.warningsActionIndex ].disabled = !this.hasWarnings();
    }
  }

  /**
   * Cleanup code when destroying the editor.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.editorService.setEditorConfig( this.fullEditorCssType ); // this could be set via preference or last used config
    this.subscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );

    this.toolbarConfig = {
      views: [
        {
          id: this.fullEditorCssType,
          iconStyleClass: "fa fa-file-text-o",
          tooltip: "Show editor and results"
        },
        {
          id: this.canvasOnlyCssType,
          iconStyleClass: "fa fa-file-image-o",
          tooltip: "Show editor only"
        },
        {
          id: this.resultsOnlyCssType,
          iconStyleClass: "fa fa-table",
          tooltip: "Show results only"
        }
      ]
    } as ToolbarConfig;

    // must have a virtualization parent
    if ( this.editorService.getEditorVirtualization() ) {
      // check to see if creating a new view
      if ( !this.editorService.getEditorView() ) {
        this.isNewView = true;
        this.editorService.setEditorView( new View(), ViewEditorPart.EDITOR );
      }

      // validate view
      this.validateView( "ngOnInit" );
    } else {
      // must have a virtualization selected
      this.editorService.addMessage( Message.create( Problem.ERR0100 ), ViewEditorPart.EDITOR );
      this.fatalErrorOccurred = true;
    }

    // Load the connections
    const self = this;
    this.connectionService
      .getConnections(true, true)
      .subscribe(
        (connectionSummaries) => {
          const conns = [];
          const treeNodes = [];
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

  }

  private validateView( context?: string ): void {
    this.editorService.clearMessages( ViewEditorPart.EDITOR, context );

    const messages = ViewValidator.validate( this.editorService.getEditorView() );

    if ( messages.length !== 0 ) {
      for ( const msg of messages ) {
        this.editorService.addMessage( msg, ViewEditorPart.EDITOR );
      }
    }
  }

  /**
   * @returns {string} the router link of the virtualization
   */
  public get virtualizationLink(): string {
    return this.editorService.getVirtualizationLink();
  }

  /**
   * @returns {number} the number of warning messages
   */
  public get warningMsgCount(): number {
    return this.editorService.getWarningMessageCount();
  }

}
