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
import { SchemaNode } from "@connections/shared/schema-node.model";
import { Column } from "@dataservices/shared/column.model";
import { CardAction, CardConfig, TableConfig, TableEvent } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-selected-node",
  templateUrl: "./selected-node.component.html",
  styleUrls: ["./selected-node.component.css"]
})
export class SelectedNodeComponent implements OnInit {

  @Input() public node: SchemaNode;
  @Output() public selectionNodeRemoved: EventEmitter<SchemaNode> = new EventEmitter<SchemaNode>();

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
      { prop: "name" },
      { prop: "type" },
      { prop: "size" }
    ];

    // TODO: replace with call to get the column metadata
    const c1 = new Column();
    const c2 = new Column();
    const c3 = new Column();
    const c4 = new Column();
    const c5 = new Column();
    const c6 = new Column();
    const c7 = new Column();
    const c8 = new Column();
    c1.setName("name");
    c2.setName("age");
    c3.setName("street");
    c4.setName("state");
    c5.setName("zipcode");
    c6.setName("company");
    c7.setName("married");
    c8.setName("gender");
    c1.setDatatype("string");
    c2.setDatatype("integer");
    c3.setDatatype("string");
    c4.setDatatype("string");
    c5.setDatatype("string");
    c6.setDatatype("string");
    c7.setDatatype("boolean");
    c8.setDatatype("string");
    c1.setSize(25);
    c2.setSize(3);
    c3.setSize(30);
    c4.setSize(2);
    c5.setSize(9);
    c6.setSize(50);
    c7.setSize(1);
    c8.setSize(1);
    this.columns = [ c1, c2, c3, c4, c5, c6, c7, c8 ];

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
    this.node.selected = false;
    this.selectionNodeRemoved.emit(this.node);
  }

}
