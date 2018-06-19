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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { LoggerService } from "@core/logger.service";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { Subscription } from "rxjs/Subscription";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-view-property-editors',
  templateUrl: './view-property-editors.component.html',
  styleUrls: ['./view-property-editors.component.css']
})
export class ViewPropertyEditorsComponent implements OnInit, OnDestroy {

  private columnEditorIsEnabled = true;
  private readonly editorService: ViewEditorService;
  private readonly logger: LoggerService;
  private subscription: Subscription;
  private viewEditorIsEnabled = true;

  public readonly tabs: any[] = [
    {
      active: true,
      content: "View properties",
      customClass: "property-editors-tab-heading",
      disabled: !this.viewEditorIsEnabled,
      removable: false,
      title: ViewEditorI18n.viewPropsTabName
    },
    {
      content: "Column editor",
      customClass: "property-editors-tab-heading",
      disabled: !this.columnEditorIsEnabled,
      removable: false,
      title: ViewEditorI18n.columnPropsTabName
    }
  ];

  constructor( editorService: ViewEditorService,
               logger: LoggerService ) {
    this.editorService = editorService;
    this.logger = logger;
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ViewPropertyEditorsComponent received event: " + event.toString() );

    if ( event.typeIsCanvasSelectionChanged() ) {
      // TODO set this.viewEditorIsEnabled to true if all canvas selections are views
      // TODO set this.columnEditorIsEnabled to true if all canvas selections are columns
    }
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
   * @param tab the editor tab being removed
   */
  public removeTab( tab: any ): void {
    this.tabs.splice( this.tabs.indexOf( tab ), 1);
  }

}
