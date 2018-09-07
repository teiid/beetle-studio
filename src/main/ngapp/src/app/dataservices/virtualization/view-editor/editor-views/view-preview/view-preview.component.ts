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
import { QueryResults } from "@dataservices/shared/query-results.model";
import { ColumnData } from "@dataservices/shared/column-data.model";
import { RowData } from "@dataservices/shared/row-data.model";
import { EmptyStateConfig, NgxDataTableConfig, TableConfig } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { ViewEditorProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { AddCompositionCommand } from "@dataservices/virtualization/view-editor/command/add-composition-command";
import { RemoveCompositionCommand } from "@dataservices/virtualization/view-editor/command/remove-composition-command";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-preview",
  templateUrl: "./view-preview.component.html",
  styleUrls: ["./view-preview.component.css"]
})
export class ViewPreviewComponent implements OnInit, OnDestroy {

  public columns: any[] = [];
  private emptyStateConfig: EmptyStateConfig;
  public ngxConfig: NgxDataTableConfig;
  public tableConfig: TableConfig;
  public rows: any[] = [];
  public saveInProgress = false;

  private readonly editorService: ViewEditorService;
  private readonly logger: LoggerService;
  private subscription: Subscription;
  private _previewSql = null;

  /**
   * @param {ViewEditorService} editorService the editor service
   * @param {LoggerService} logger the logger
   */
  constructor( editorService: ViewEditorService,
               logger: LoggerService ) {
    this.logger = logger;
    this.editorService = editorService;
  }

  private clearResults(): void {
    if ( this.rows && this.columns ) {
      if ( this.rows.length !== 0 || this.columns.length !== 0 ) {
        this.rows = [];
        this.columns = [];
      }
    }
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ViewPreviewComponent received event: " + event.toString() );

    if ( event.typeIsPreviewResultsChanged() ) {
      const results = this.editorService.getPreviewResults();
      this._previewSql = this.editorService.getPreviewSql();

      if ( results && results !== null ) {
        this.reload( results );
      } else {
        this.clearResults();
      }
    } else if (event.typeIsViewStateChanged()) {
      // Clear results if sources were changed
      if ( event.args.length === 1 && event.args[ 0 ] instanceof Command ) {
        const cmd = event.args[ 0 ] as Command;

        if ( cmd instanceof AddSourcesCommand || cmd instanceof RemoveSourcesCommand ||
             cmd instanceof AddCompositionCommand || cmd instanceof RemoveCompositionCommand ) {
          this.clearResults();
          this._previewSql = null;
        }
      }
    } else if ( event.typeIsEditorViewSaveProgressChanged() ) {
      if ( event.args.length !== 0 ) {
        // Detect changes in view editor save progress
        if ( event.args[ 0 ] === ViewEditorProgressChangeId.IN_PROGRESS ) {
          this.saveInProgress = true;
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_SUCCESS ) {
          this.saveInProgress = false;
        } else if ( event.args[ 0 ] === ViewEditorProgressChangeId.COMPLETED_FAILED ) {
          this.saveInProgress = false;
        }
      }
    }
  }

  /**
   * Cleanup code when destroying the preview part.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
    this.subscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );

    this.ngxConfig = {
      headerHeight: 40,
      rowHeight: 20,
      scrollbarH: true,
      scrollbarV: true
    } as NgxDataTableConfig;

    this.emptyStateConfig = {
      title: ViewEditorI18n.previewDataUnavailable
    } as EmptyStateConfig;

    this.tableConfig = {
      emptyStateConfig: this.emptyStateConfig
    } as TableConfig;

    const results = this.editorService.getPreviewResults();
    this.reload( results );
  }

  private reload( results: QueryResults ): void {
    if ( !results ) {
      this.logger.debug( "ViewPreviewComponent.reload called with no results" );
      this.clearResults();
      return;
    }

    this.columns.length = 0;
    this.rows.length = 0;

    const columnData: ColumnData[] = results.getColumns();
    const rowData: RowData[] = results.getRows();
    this.logger.debug( "ViewPreviewComponent.reload called with " + rowData.length + " result rows" );

    // Define the row data
    let firstTime = true;
    const rowNumHeader = ViewEditorI18n.rowNumberColumnName;

    for ( let rowIndex = 0; rowIndex < rowData.length; rowIndex++ ) {
      const row = rowData[ rowIndex ];
      const data = row.getData();

      const dataRow = {};
      dataRow[ rowNumHeader ] = rowIndex + 1;

      for ( let colIndex = 0; colIndex < data.length; colIndex++ ) {
        const label = columnData[ colIndex ].getLabel();
        dataRow[ label ] = data[ colIndex ];
      }

      this.rows.push( dataRow );
      firstTime = false;
    }

    // setup row number column
    const column = {
      canAutoResize: true,
      draggable: false,
      maxWidth: 60,
      minWidth: 60,
      name: rowNumHeader,
      prop: rowNumHeader,
      resizable: true,
      sortable: true,
      width: 60,
      cellClass: "row-number-column" };
    this.columns.push( column );

    // Setup data columns
    for ( const colData of columnData ) {
      const label = colData.getLabel();
      const col = {
        canAutoResize: true,
        draggable: false,
        name: label.toUpperCase(),
        prop: label,
        resizable: true,
        sortable: true };
      this.columns.push( col );
    }
  }

}
