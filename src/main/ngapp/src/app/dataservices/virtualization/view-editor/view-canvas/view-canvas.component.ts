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
import { LoggerService } from "@core/logger.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { Subscription } from "rxjs/Subscription";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewStateChangeId } from "@dataservices/virtualization/view-editor/event/view-state-change-id.enum";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-canvas",
  templateUrl: "./view-canvas.component.html",
  styleUrls: ["./view-canvas.component.css"]
})
export class ViewCanvasComponent implements OnInit, OnDestroy {

  // used by html
  public readonly noSourcesAlert = ViewEditorI18n.noSourcesAlert;

  private readonly logger: LoggerService;
  private readonly editorService: ViewEditorService;
  private subscription: Subscription;

  constructor( editorService: ViewEditorService,
               logger: LoggerService ) {
    this.editorService = editorService;
    this.logger = logger;
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    // TODO implement
    this.logger.debug( "ViewCanvasComponent received event: " + event.toString() );
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
      return view.getSources().length > 0;
    }
    return false;
  }

  /**
   * Get the sources for the view
   * @returns {SchemaNode[]} the view sources
   */
  public get viewSources(): SchemaNode[] {
    const view = this.editorService.getEditorView();
    if (view !== null) {
      return view.getSources();
    }
    return [];
  }

  /**
   * Handle removal of View Source
   * @param {SchemaNode} source the view source to be removed
   */
  public onViewSourceRemoved( source: SchemaNode ): void {
    this.editorService.getEditorView().setSources([]);
    this.editorService.fireViewStateHasChanged( ViewEditorPart.CANVAS, ViewStateChangeId.SOURCES_CHANGED, [] );
  }

}
