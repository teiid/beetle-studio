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
import { CardAction, CardConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-selected-table",
  templateUrl: "./selected-table.component.html",
  styleUrls: ["./selected-table.component.css"]
})
export class SelectedTableComponent implements OnInit {

  @Input() public table: Table;
  @Output() public selectionListTableRemoved: EventEmitter<Table> = new EventEmitter<Table>();

  public columnDefinitions: Column[];
  public config: CardConfig;
  public showColumns = false;

  public readonly customClasses = {
    sortAscending: "fa fa-sort-asc",
    sortDescending: "fa fa-sort-desc",
    pagerLeftArrow: "fa fa-chevron-left",
    pagerRightArrow: "fa fa-chevron-right",
    pagerPrevious: "fa fa-step-backward",
    pagerNext: "fa fa-step-forward"
  };

  constructor() {
    // nothing to do
  }

  public ngOnInit(): void {
    this.columnDefinitions = [
      { name: "name", selected: true, type: "string", size: 25 },
      { name: "age", selected: true, type: "integer", size: 3 },
      { name: "street", selected: true, type: "string", size: 50 },
      { name: "state", selected: true, type: "string", size: 2 },
      { name: "zipcode", selected: true, type: "string", size: 9 },
      { name: "company", selected: true, type: "string", size: 50 },
      { name: "married", selected: true, type: "boolean", size: 1 },
      { name: "gender", selected: true, type: "string", size: 1 }
    ];

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

  public get columnCount(): number {
    return this.columnDefinitions.length;
  }

  public handleActionSelect( $event: CardAction ): void {
    this.showColumns = !this.showColumns;
    $event.hypertext = this.showColumnsActionTitle;
  }

  public selectedColumnChanged( column: Column ): void {
    column.selected = !column.selected;
  }

  public get selectedColumnCount(): number {
    return this.columnDefinitions.filter( ( column ) => column.selected ).length;
  }

  public get showColumnsActionTitle(): string {
    return this.showColumns ? "Hide Columns"
      : "Show Columns (" + this.selectedColumnCount + " of " + this.columnCount + " selected)";
  }

  public onRemove(): void {
    this.table.selected = false;
    this.selectionListTableRemoved.emit(this.table);
  }

}
