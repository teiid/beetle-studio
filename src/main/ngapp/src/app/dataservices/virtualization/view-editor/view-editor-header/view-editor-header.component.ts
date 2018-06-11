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
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewStateChangeId } from "@dataservices/virtualization/view-editor/event/view-state-change-id.enum";
import { Subscription } from "rxjs/Subscription";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-editor-header",
  templateUrl: "./view-editor-header.component.html",
  styleUrls: ["./view-editor-header.component.css"]
})
export class ViewEditorHeaderComponent implements OnInit, OnDestroy {

  private readonly logger: LoggerService;
  private readonly editorService: ViewEditorService;
  public showDescription = false;
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
    this.logger.debug( "ViewEditorHeaderComponent received event: " + event.toString() );
  }

  /**
   * Cleanup code when destroying the view editor header.
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
    return !this.editorService.getEditorView() || this.editorService.isReadOnly();
  }

  /**
   * @returns {string} the view description
   */
  public get viewDescription(): string {
    if ( this.editorService.getEditorView() ) {
      return this.editorService.getEditorView().getDescription();
    }

    return "";
  }

  /**
   * @param {string} newDescription the new description
   */
  public set viewDescription( newDescription: string ) {
    if ( this.editorService.getEditorView() ) {
      if ( newDescription !== this.editorService.getEditorView().getDescription() ) {
        this.editorService.getEditorView().setDescription( newDescription );
        this.editorService.fireViewStateHasChanged( ViewEditorPart.HEADER,
                                                    ViewStateChangeId.DESCRIPTION,
                                                    [ newDescription ] );
      }
    } else {
      // shouldn't get here as description text input should be disabled if no view being edited
      this.logger.error( "Trying to set description but there is no view being edited" );
    }
  }

  /**
   * Called when text in the view description textarea changes.
   *
   * @param {string} newDescription the new description of the view
   */
  public viewDescriptionChanged( newDescription: string ): void {
    this.viewDescription = newDescription;
  }

  /**
   * @returns {string} the view name
   */
  public get viewName(): string {
    if ( this.editorService.getEditorView() ) {
      return this.editorService.getEditorView().getName();
    }

    return "";
  }

  /**
   * @param {string} newName the new name of the view
   */
  public set viewName( newName: string ) {
    if ( this.editorService.getEditorView() ) {
      if ( newName !== this.editorService.getEditorView().getName() ) {
        this.editorService.getEditorView().setName( newName );
        this.editorService.fireViewStateHasChanged( ViewEditorPart.HEADER,
                                                    ViewStateChangeId.NAME,
                                                    [ newName ] );
      }
    } else {
      // shouldn't get here as description text input should be disabled if no view being edited
      this.logger.error( "Trying to set name but there is no view being edited" );
    }
  }

  /**
   * Called when text in the view name texteditor changes.
   *
   * @param {string} newName the new name of the view
   */
  public viewNameChanged( newName: string ): void {
    this.viewName = newName;
  }

  /**
   * @returns {string} the router link of the virtualization
   */
  public get virtualizationLink(): string {
    return this.editorService.getVirtualizationLink();
  }

  /**
   * @returns {string} the name of the dataservice of the view being edited
   */
  public get virtualizationName(): string {
    const virtualization = this.editorService.getEditorVirtualization();

    if ( virtualization ) {
      return virtualization.getId();
    }

    // should always have a virtualization name so shouldn't get here
    return "< error >";
  }

}
