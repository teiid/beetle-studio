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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoggerService } from "@core/logger.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { EmptyStateConfig, NgxDataTableConfig, TableConfig } from "patternfly-ng";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.css']
})
export class MessageLogComponent implements OnInit {

  public columns: any[];
  private emptyStateConfig: EmptyStateConfig;
  public ngxConfig: NgxDataTableConfig;
  public tableConfig: TableConfig;

  private readonly editorService: ViewEditorService;
  private readonly logger: LoggerService;

  constructor( logger: LoggerService,
               editorService: ViewEditorService ) {
    this.logger = logger;
    this.editorService = editorService;
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.columns = [
      {
        name: "ID",
        prop: Message.ID_PROP_NAME
      },
      {
        name: "Type",
        prop: Message.TYPE_PROP_NAME
      },
      {
        name: "Description",
        prop: Message.DESCRIPTION_PROP_NAME
      },
      {
        name: "Context",
        prop: Message.CONTEXT_PROP_NAME
      },
    ];

    this.ngxConfig = {
      headerHeight: 30,
      rowHeight: 20,
      scrollbarH: true,
      scrollbarV: true
    } as NgxDataTableConfig;

    this.emptyStateConfig = {
      title: "No messages found"
    } as EmptyStateConfig;

    this.tableConfig = {
      emptyStateConfig: this.emptyStateConfig
    } as TableConfig;
  }

  /**
   * @returns {Message[]} the log messages
   */
  public get rows(): Message[] {
    return this.editorService.getMessages();
  }

}
