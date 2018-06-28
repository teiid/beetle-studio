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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { LoggerService } from "@core/logger.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { ViewEditorSaveProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { PathUtils } from "@dataservices/shared/path-utils";
import { NotificationType } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-canvas",
  templateUrl: "./view-canvas.component.html",
  styleUrls: ["./view-canvas.component.css"]
})
export class ViewCanvasComponent implements OnInit, OnDestroy {

  // used by html
  public readonly noSourcesAlert = ViewEditorI18n.noSourcesAlert;
  public readonly viewSaveInProgressHeader: string = "Save In Progress:  ";
  public readonly viewSaveSuccessHeader: string = "Save Succeeded:  ";
  public readonly viewSaveFailedHeader: string = "Save Failed:  ";

  private readonly logger: LoggerService;
  private readonly editorService: ViewEditorService;
  private subscription: Subscription;
  private saveViewNotificationHeader: string;
  private saveViewNotificationMessage: string;
  private saveViewNotificationType = NotificationType.SUCCESS;
  private saveViewNotificationVisible = false;

  constructor( editorService: ViewEditorService,
               logger: LoggerService ) {
    this.editorService = editorService;
    this.logger = logger;
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
        if ( event.args[ 0 ] === ViewEditorSaveProgressChangeId.IN_PROGRESS ) {
          this.saveViewNotificationHeader = this.viewSaveInProgressHeader;
          this.saveViewNotificationMessage = "Saving View '" + viewName + "'...";
          this.saveViewNotificationType = NotificationType.INFO;
          this.saveViewNotificationVisible = true;
        } else if ( event.args[ 0 ] === ViewEditorSaveProgressChangeId.COMPLETED_SUCCESS ) {
          this.saveViewNotificationHeader = this.viewSaveSuccessHeader;
          this.saveViewNotificationMessage = "View '" + viewName + "' save successful";
          this.saveViewNotificationType = NotificationType.SUCCESS;
          // After 8 seconds, the notification is dismissed
          setTimeout(() => this.saveViewNotificationVisible = false, 8000);
        } else if ( event.args[ 0 ] === ViewEditorSaveProgressChangeId.COMPLETED_FAILED ) {
          this.saveViewNotificationHeader = this.viewSaveFailedHeader;
          this.saveViewNotificationMessage = "View '" + viewName + "' save failed";
          this.saveViewNotificationType = NotificationType.DANGER;
          // After 8 seconds, the notification is dismissed
          setTimeout(() => this.saveViewNotificationVisible = false, 8000);
        }
      }
    }
  }

  /**
   * Cleanup code when destroying the canvas and properties parts.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.subscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );
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
        sNode.setPath(sourcePath);
        sNode.setName(PathUtils.getSourceName(sourcePath));
        sNode.setType(PathUtils.getSourceType(sourcePath));
        sNode.setConnectionName(PathUtils.getConnectionName(sourcePath));
        schemaNodes.push(sNode);
      }
      return schemaNodes;
    }
    return [];
  }

  /**
   * Handle removal of View Source
   * @param {SchemaNode} source the view source to be removed
   */
  public onViewSourceRemoved( source: SchemaNode ): void {
    const cmd = CommandFactory.createRemoveSourcesCommand( [ source ] );
    this.editorService.fireViewStateHasChanged( ViewEditorPart.CANVAS, cmd );
  }

  /**
   * @returns {boolean} true if save view notification is to be shown
   */
  public get showSaveViewNotification(): boolean {
    return this.saveViewNotificationVisible;
  }

}
