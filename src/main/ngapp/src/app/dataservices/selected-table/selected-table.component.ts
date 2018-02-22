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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Column } from "@dataservices/selected-table/column";
import { Table } from "@dataservices/shared/table.model";
import { CardAction, CardConfig, TableConfig, TableEvent } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-selected-table",
  templateUrl: "./selected-table.component.html",
  styleUrls: ["./selected-table.component.css"]
})
export class SelectedTableComponent implements OnInit {

  @Input() public table: Table;
  @Output() public selectionListTableRemoved: EventEmitter<Table> = new EventEmitter<Table>();

  public config: CardConfig;
  public columnDefinitions: any[];
  public columns: Column[];
  public showColumns = false;
  public tableConfig: TableConfig;

  constructor() {
    // nothing to do
  }

  public ngOnInit(): void {
    this.columnDefinitions = [
      {
        draggable: false,
        prop: "name",
        name: "Name",
        resizeable: false
      }, {
        draggable: false,
        prop: "type",
        name: "Type",
        resizeable: false
      }, {
        draggable: false,
        prop: "size",
        name: "Size",
        resizeable: false
      }
    ];

    // TODO: replace with call to get the column metadata
    this.columns = [
      new Column( "name", true, "string", 25 ),
      new Column( "age", true, "integer", 3 ),
      new Column( "street", true, "string", 30 ),
      new Column( "state", true, "string", 2 ),
      new Column( "zipcode", true, "string", 9 ),
      new Column( "company", true, "string", 50 ),
      new Column( "married", true, "boolean", 1 ),
      new Column( "gender", true, "string", 1 ),
    ];

    this.tableConfig = {
      showCheckbox: true
    } as TableConfig;

    this.config = {
      action: {
        id: "showColumns",
        hypertext: this.showColumnsActionTitle,
        iconStyleClass: "fa fa-columns"
      },
      titleBorder: true,
      noPadding: true,
      topBorder: true
    } as CardConfig;
  }

  private get columnCount(): number {
    return this.columns.length;
  }

  public handleActionSelect( $event: CardAction ): void {
    this.showColumns = !this.showColumns;
    $event.hypertext = this.showColumnsActionTitle;
  }

  public handleSelectionChange( $event: TableEvent ): void {
    // need to update footer action link label
    this.config.action.hypertext = this.showColumnsActionTitle;
  }

  public get selectedColumnCount(): number {
    return this.columns.filter( ( column ) => column.selected ).length;
  }

  public get showColumnsActionTitle(): string {
    return this.showColumns ? "Hide Columns (" + this.selectedColumnCount + " of " + this.columnCount + " selected)"
                            : "Show Columns";
  }

  public onRemove(): void {
    this.table.selected = false;
    this.selectionListTableRemoved.emit(this.table);
  }

}
