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
import { SchemaNode } from "@connections/shared/schema-node.model";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { LoggerService } from "@core/logger.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { ViewEditorProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { PathUtils } from "@dataservices/shared/path-utils";
import { NotificationType } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";
import { CanvasNode, CanvasLink } from '@dataservices/virtualization/view-editor/view-canvas/models';
import { CanvasConstants } from '@dataservices/virtualization/view-editor/view-canvas/canvas-constants';
import { CanvasService } from '@dataservices/virtualization/view-editor/view-canvas/canvas.service';
import { ViewCanvasEvent } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event";
import { ViewCanvasEventType } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event-type.enum";
import * as _ from "lodash";

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
      const cmd: AddSourcesCommand = <AddSourcesCommand> args[0];
      const srcPaths = cmd.getSourcePaths();
      for (let i = 0; i < srcPaths.length; ++i) {
        const srcPath = srcPaths[i];
        const update = (i === (srcPaths.length - 1));
        const id = cmd.getId(srcPath);
        this.canvasService.createNode(id, CanvasConstants.SOURCE_TYPE, srcPath, update);
      }
    } else if (args[0] instanceof RemoveSourcesCommand) {
      const cmd: RemoveSourcesCommand = <RemoveSourcesCommand> args[0];
      const srcPaths = cmd.getSourcePaths();
      for (let i = 0; i < srcPaths.length; ++i) {
        const srcPath = srcPaths[i];
        const update = (i === (srcPaths.length - 1));
        const id = cmd.getId(srcPath);
        this.canvasService.deleteNode(id, update);
      }
    }
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ViewCanvasComponent received event: " + event.toString() );

    if ( event.typeIsEditorViewSaveProgressChanged() ) {
      if ( event.args.length !== 0 ) {
        const viewName = this.editorService.getEditorView().getName();

        // Detect changes in view editor save progress
        if ( event.args[ 0 ] === ViewEditorProgressChangeId.IN_PROGRESS ) {
          this.saveViewNotificationHeader = this.viewSaveInProgressHeader;
          this.saveViewNotificationMessage = "Saving View '" + viewName + "'...";
          this.saveViewNotificationType = NotificationType.INFO;
          this.saveViewNotificationVisible = true;
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_SUCCESS ) {
          this.saveViewNotificationHeader = this.viewSaveSuccessHeader;
          this.saveViewNotificationMessage = "View '" + viewName + "' save successful";
          this.saveViewNotificationType = NotificationType.SUCCESS;
          // After 8 seconds, the notification is dismissed
          setTimeout(() => this.saveViewNotificationVisible = false, 8000);
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_FAILED ) {
          this.saveViewNotificationHeader = this.viewSaveFailedHeader;
          this.saveViewNotificationMessage = "View '" + viewName + "' save failed";
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
    //   CanvasConstants.COMPONENT_TYPE,
    //   CanvasConstants.COMPONENT_TYPE
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

  /**
   * Determine if the view has sources defined
   * @returns {boolean} 'true' if sources defined for the view
   */
  public get hasViewSources(): boolean {
    const view = this.editorService.getEditorView();
    if (view) {
      return view.getSourcePaths().length > 0;
    }
    return false;
  }

  /**
   * Get the source paths for the view
   * @returns {SchemaNode[]} the view sources
   */
  public get viewSources(): SchemaNode[] {
    const view = this.editorService.getEditorView();
    if (view !== null) {
      const schemaNodes: SchemaNode[] = [];
      const sourcePaths = view.getSourcePaths();
      for (const sourcePath of sourcePaths) {
        const sNode = new SchemaNode();
        const connName = PathUtils.getConnectionName(sourcePath);
        // If path contains connection - remove it for setting SchemaNode path
        if (connName && connName !== null && connName.length > 0) {
          const sPath = sourcePath.substring(sourcePath.indexOf("/") + 1);
          sNode.setConnectionName(connName);
          sNode.setPath(sPath);
        } else {
          sNode.setConnectionName(null);
          sNode.setPath(sourcePath);
        }
        sNode.setName(PathUtils.getSourceName(sourcePath));
        sNode.setType(PathUtils.getSourceType(sourcePath));
        schemaNodes.push(sNode);
      }
      return schemaNodes;
    }
    return [];
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

}
