import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Table } from "@dataservices/shared/table.model";

@Component({
  selector: "app-selected-table",
  templateUrl: "./selected-table.component.html",
  styleUrls: ["./selected-table.component.css"]
})
export class SelectedTableComponent implements OnInit {

  @Input() public table: Table;
  @Output() public selectionListTableRemoved: EventEmitter<Table> = new EventEmitter<Table>();

  constructor() {
    // nothing to do
  }

  public ngOnInit(): void {
    // nothing to do
  }

  public onRemove(): void {
    this.table.selected = false;
    this.selectionListTableRemoved.emit(this.table);
  }
}
