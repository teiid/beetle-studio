import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Connection } from "@connections/shared/connection.model";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PatternFlyNgModule } from "patternfly-ng";
import { Table } from "../shared/table.model";
import { SelectedTableComponent } from "./selected-table.component";

describe("SelectedTableComponent", () => {
  let component: SelectedTableComponent;
  let fixture: ComponentFixture<SelectedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgxDatatableModule, PatternFlyNgModule ],
      declarations: [ SelectedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedTableComponent);
    component = fixture.componentInstance;
    const connection = new Connection();
    connection.setId("testConn");
    const table = new Table();
    table.setConnection(connection);
    component.table = table;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
