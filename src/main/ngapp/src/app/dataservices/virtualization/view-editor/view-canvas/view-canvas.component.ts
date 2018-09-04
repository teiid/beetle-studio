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

import { Component, OnDestroy, OnInit, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { LoggerService } from "@core/logger.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { ViewEditorProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { PathUtils } from "@dataservices/shared/path-utils";
import { NotificationType } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";
import { CanvasNode, CanvasLink } from '@dataservices/virtualization/view-editor/view-canvas/models';
import { CanvasConstants } from '@dataservices/virtualization/view-editor/view-canvas/canvas-constants';
import { CanvasService } from '@dataservices/virtualization/view-editor/view-canvas/canvas.service';
import { ViewCanvasEvent } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event";
import { ViewCanvasEventType } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event-type.enum";
import * as _ from "lodash";
import { AddCompositionCommand } from "@dataservices/virtualization/view-editor/command/add-composition-command";
import { RemoveCompositionCommand } from "@dataservices/virtualization/view-editor/command/remove-composition-command";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-canvas",
  templateUrl: "./view-canvas.component.html",
  styleUrls: ["./view-canvas.component.css"]
})
export class ViewCanvasComponent implements OnInit, AfterViewInit, OnDestroy {

  // used by html
  public readonly noSourcesAlert = ViewEditorI18n.noSourcesAlert;
  public readonly viewSaveInProgressHeader: string = "Save In Progress:  ";
  public readonly viewSaveSuccessHeader: string = "Save Succeeded:  ";
  public readonly viewSaveFailedHeader: string = "Save Failed:  ";

  private readonly logger: LoggerService;
  private readonly editorService: ViewEditorService;
  private readonly canvasService: CanvasService;

  private saveViewNotificationHeader: string;
  private saveViewNotificationMessage: string;
  private saveViewNotificationType = NotificationType.SUCCESS;
  private saveViewNotificationVisible = false;

  private editorSubscription: Subscription;
  private canvasSubscription: Subscription;
  private viewNameSaveInProgress: string;

  constructor( editorService: ViewEditorService,
               logger: LoggerService,
               canvasService: CanvasService) {
    this.editorService = editorService;
    this.logger = logger;
    this.canvasService = canvasService;
  }

  private viewStateChanged(source: ViewEditorPart, args: any[]): void {
    if (args.length === 0)
      return;

    if (args[0] instanceof AddSourcesCommand) {
      const cmd = args[0] as AddSourcesCommand;
      this.createSourceNodes(cmd);
    } else if (args[0] instanceof RemoveSourcesCommand) {
      const cmd = args[0] as RemoveSourcesCommand;
      this.removeSourceNodes(cmd);
    } else if (args[0] instanceof AddCompositionCommand) {
      const cmd = args[0] as AddCompositionCommand;
      this.createComposition(cmd);
    } else if (args[0] instanceof RemoveCompositionCommand) {
      const cmd = args[0] as RemoveCompositionCommand;
      this.removeComposition(cmd);
    }
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ViewCanvasComponent received event: " + event.toString() );

    // Initialize the canvas when set - using the ViewDefinition
    if ( event.typeIsEditedViewSet()) {
      const viewDefn = this.editorService.getEditorView();
      this.initCanvas(viewDefn);
    } else if ( event.typeIsEditorViewSaveProgressChanged() ) {
      if ( event.args.length !== 0 ) {
        // Detect changes in view editor save progress
        if ( event.args[ 0 ] === ViewEditorProgressChangeId.IN_PROGRESS ) {
          this.viewNameSaveInProgress = this.editorService.getEditorView().getName();
          this.saveViewNotificationHeader = this.viewSaveInProgressHeader;
          this.saveViewNotificationMessage = this.getViewNotificationMessage(ViewEditorProgressChangeId.IN_PROGRESS,
                                                                             this.viewNameSaveInProgress);
          this.saveViewNotificationType = NotificationType.INFO;
          this.saveViewNotificationVisible = true;
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_SUCCESS ) {
          this.saveViewNotificationHeader = this.viewSaveSuccessHeader;
          this.saveViewNotificationMessage = this.getViewNotificationMessage(ViewEditorProgressChangeId.COMPLETED_SUCCESS,
                                                                             this.viewNameSaveInProgress);

          this.saveViewNotificationType = NotificationType.SUCCESS;
          // After 8 seconds, the notification is dismissed
          setTimeout(() => this.saveViewNotificationVisible = false, 8000);
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_FAILED ) {
          this.saveViewNotificationHeader = this.viewSaveFailedHeader;
          this.saveViewNotificationMessage = this.getViewNotificationMessage(ViewEditorProgressChangeId.COMPLETED_FAILED,
                                                                             this.viewNameSaveInProgress);
          this.saveViewNotificationType = NotificationType.DANGER;
          // After 8 seconds, the notification is dismissed
          setTimeout(() => this.saveViewNotificationVisible = false, 8000);
        }
      }
    }
    else if (event.typeIsViewStateChanged()) {
      this.viewStateChanged(event.source, event.args);
    }
    else {
      this.logger.debug( "ViewCanvasComponent not handling received editor event: " + event.toString());
    }
  }

  /**
   * Generates a view notification message based on the progress type and viewName
   * @param {ViewEditorProgressChangeId} viewProgressId the progress type
   * @param {string} viewName the view name
   */
  private getViewNotificationMessage(viewProgressId: ViewEditorProgressChangeId, viewName: string): string {
    let msg = "";
    const viewStr = ( viewName && viewName !== null ) ? "'" + viewName + "'" : "";
    if ( viewProgressId === ViewEditorProgressChangeId.IN_PROGRESS ) {
      msg = "View save in progress for " + viewStr;
    } else if ( viewProgressId === ViewEditorProgressChangeId.COMPLETED_SUCCESS ) {
      msg = "View save SUCCESS for " + viewStr;
    } else if ( viewProgressId === ViewEditorProgressChangeId.COMPLETED_FAILED ) {
      msg = "View save FAILED for " + viewStr;
    }
    return msg;
  }

  private handleCanvasEvent(event: ViewCanvasEvent): void {
    switch (event.type) {
      case ViewCanvasEventType.CREATE_SOURCE:
        const srcEvent = ViewEditorEvent.create(ViewEditorPart.CANVAS, ViewEditorEventType.CREATE_SOURCE, event.args);
        this.editorService.editorEvent.emit(srcEvent);
        break;
      case ViewCanvasEventType.CREATE_COMPOSITION:
        const compEvent = ViewEditorEvent.create(ViewEditorPart.CANVAS, ViewEditorEventType.CREATE_COMPOSITION, event.args);
        this.editorService.editorEvent.emit(compEvent);
        break;
      case ViewCanvasEventType.DELETE_NODE:
        const deleteEvt = ViewEditorEvent.create(ViewEditorPart.CANVAS, ViewEditorEventType.DELETE_NODE, event.args);
        this.editorService.editorEvent.emit(deleteEvt);
        break;
      case ViewCanvasEventType.CANVAS_SELECTION_CHANGED:
        const selectEvent = ViewEditorEvent.create(ViewEditorPart.CANVAS, ViewEditorEventType.CANVAS_SELECTION_CHANGED, event.args);
        this.editorService.editorEvent.emit(selectEvent);
        break;
      default:
        this.logger.debug("ViewCanvasComponent not handling received canvas event: " + event.toString());
    }
  }
  /**
   * Cleanup code when destroying the canvas and properties parts.
   */
  public ngOnDestroy(): void {
    this.editorSubscription.unsubscribe();
    this.canvasSubscription.unsubscribe();
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.editorSubscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );

    this.canvasSubscription = this.canvasService.canvasEvent.subscribe((event) => this.handleCanvasEvent(event));
  }

  public ngAfterViewInit(): void {
    // const labels:string[] = ['Employee', 'Admin', 'Payroll', 'EmployeeAdmin', 'EmployeePayDay'];
    // const type:string[] = [
    //   CanvasConstants.SOURCE_TYPE,
    //   CanvasConstants.SOURCE_TYPE,
    //   CanvasConstants.SOURCE_TYPE,
    //   CanvasConstants.COMPOSITION_TYPE,
    //   CanvasConstants.COMPOSITION_TYPE
    // ];
    //
    // /** constructing the nodes array */
    // const nodeIds: string[] = [];
    // for (let i = 0; i < 5; i++) {
    //   const id = this.canvasService.createNode(type[i], labels[i]);
    //   nodeIds.push(id);
    // }
    //
    // this.canvasService.createLink(nodeIds[0], nodeIds[3]);
    // this.canvasService.createLink(nodeIds[1], nodeIds[3]);
    // this.canvasService.createLink(nodeIds[2], nodeIds[4]);
    // this.canvasService.createLink(nodeIds[3], nodeIds[4], true);

    this.canvasService.canvasEvent.subscribe((nodes) => {
      if (_.isEmpty(nodes)) {
        console.log("No nodes selected");
        return;
      }

      for (const node of nodes) {
        console.log("Node " + node.label + " selected");
      }
    });
  }

  /**
   * @returns {boolean} `true` if view being edited is readonly
   */
  public get readOnly(): boolean {
    return this.editorService.isReadOnly();
  }

  //
  // /**
  //  * Handle removal of View Source
  //  * @param {SchemaNode} source the view source to be removed
  //  */
  // public onViewSourceRemoved( source: SchemaNode ): void {
  //   const cmd = CommandFactory.createRemoveSourcesCommand( [ source ] );
  //   this.editorService.fireViewStateHasChanged( ViewEditorPart.CANVAS, cmd );
  // }

  /**
   * @returns {boolean} true if save view notification is to be shown
   */
  public get showSaveViewNotification(): boolean {
    return this.saveViewNotificationVisible;
  }

  /**
   * Initialize the canvas with the provided ViewDefinition
   * @param {ViewDefinition} viewDefn the ViewDefinition
   */
  private initCanvas( viewDefn: ViewDefinition ): void {
    // Make sure canvas is cleared
    this.canvasService.clear();

    if (viewDefn && viewDefn !== null) {
      // ------------------------
      // Create the source nodes
      // ------------------------
      const sourcePaths = viewDefn.getSourcePaths();
      if (sourcePaths && sourcePaths.length > 0) {
        let sourcesStr = "";
        for (let i = 0; i < sourcePaths.length; i++) {
          sourcesStr += sourcePaths[i];
          if (i !== sourcePaths.length - 1) {
            sourcesStr += ", ";
          }
        }
        const cmd = CommandFactory.createAddSourcesCommand(sourcesStr) as AddSourcesCommand;
        this.createSourceNodes(cmd);
      }
      // --------------------------
      // Create the compositions
      // --------------------------
      const compositions = viewDefn.getCompositions();
      if (compositions && compositions.length > 0) {
        for (const composition of compositions) {
          const cmd = CommandFactory.createAddCompositionCommand(composition) as AddCompositionCommand;
          this.createComposition(cmd);
        }
      }
    }

    this.canvasService.update(true);
  }

  /**
   * Create canvas nodes using the provided AddSourcesCommand
   * @param {AddSourcesCommand} command the AddSourcesCommand
   */
  private createSourceNodes(command: AddSourcesCommand): void {
    const sourcePaths: string[] = command.getSourcePaths();
    for (let i = 0; i < sourcePaths.length; ++i) {
      const srcPath = sourcePaths[i];
      const update = (i === (sourcePaths.length - 1));
      const id = command.getId(srcPath);
      const label = "[" + PathUtils.getConnectionName(srcPath) +
        "]: " + PathUtils.getSourceName(srcPath);
      this.canvasService.createNode(id, CanvasConstants.SOURCE_TYPE, label, update);
    }
  }

  /**
   * Remove canvas nodes using the provided RemoveSourcesCommand
   * @param {RemoveSourcesCommand} command the RemoveSourcesCommand
   */
  private removeSourceNodes(command: RemoveSourcesCommand): void {
    const srcPaths = command.getSourcePaths();
    for (let i = 0; i < srcPaths.length; ++i) {
      const srcPath = srcPaths[i];
      const update = (i === (srcPaths.length - 1));
      const id = command.getId(srcPath);
      this.canvasService.deleteNode(id, update);
    }
  }

  /**
   * Create canvas nodes using the provided AddCompositionCommand
   * @param {AddCompositionCommand} command the AddCompositionCommand
   */
  private createComposition(command: AddCompositionCommand): void {
    const composition = command.getComposition();
    const compNodeId = this.canvasService.createNode(command.getId(composition.getName()), CanvasConstants.COMPOSITION_TYPE, composition.getName(), true);
    // Create links to source nodes if not found
    this.createLink(compNodeId, composition.getLeftSourcePath());
    this.createLink(compNodeId, composition.getRightSourcePath());
  }

  /**
   * Remove canvas nodes using the provided RemoveCompositionCommand
   * @param {RemoveCompositionCommand} command the RemoveCompositionCommand
   */
  private removeComposition(command: RemoveCompositionCommand): void {
    const composition = command.getComposition();
    this.canvasService.deleteNode(command.getId(composition), true);
  }

  /**
   * Generate a links between the compositionNode and CanvasNode for the supplied path, if not found
   * @param {string} compositionNodeId
   * @param {string} sourcePath
   */
  private createLink(compositionNodeId: string, sourcePath: string): void {
    const sourceNode = this.getCanvasNodeForSourcePath(sourcePath);
    if (sourceNode && sourceNode !== null) {
      const sourceNodeId = sourceNode.id;

      // See if link exists
      let linkExists = false;
      const canvasLinks: CanvasLink[] = this.canvasService.links();
      for (const link of canvasLinks) {
        const end1Id = link.source.id;
        const end2Id = link.target.id;
        if (end1Id === compositionNodeId && end2Id === sourceNodeId) {
          linkExists = true;
          break;
        } else if (end1Id === sourceNodeId && end2Id === compositionNodeId) {
          linkExists = true;
          break;
        }
      }

      if (!linkExists) {
        this.canvasService.createLink(sourceNodeId, compositionNodeId, true);
      }
    }
  }

  private getCanvasNodeForSourcePath( sourcePath: string ): CanvasNode {
    let nodeForPath: CanvasNode = null;
    const canvasNodes: CanvasNode[] = this.canvasService.nodes();
    for (const canvasNode of canvasNodes) {
      const nodeId = canvasNode.decodedId;
      if (nodeId.startsWith(AddSourcesCommand.id)) {
        const identBits = nodeId.split(Command.identDivider);
        const path = identBits[1];
        if (path === sourcePath) {
          nodeForPath = canvasNode;
          break;
        }
      }
    }
    return nodeForPath;
  }

}
