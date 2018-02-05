import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Connection } from "@connections/shared/connection.model";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PatternFlyNgModule } from "patternfly-ng";
import { Table } from "../shared/table.model";
import { SelectedTableComponent } from "./selected-table.component";

describe("SelectedTableComponent", () => {
  let component: SelectedTableComponent;
  let fixture: ComponentFixture<SelectedTableComponent>;
  let htmlElem: HTMLElement;

  const connectionName = "testConnection";
  const tableName = "testTable";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgxDatatableModule, PatternFlyNgModule ],
      declarations: [ SelectedTableComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedTableComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;

    const connection = new Connection();
    connection.setId( connectionName );

    const table = new Table();
    table.setConnection(connection);
    table.setName( tableName );
    component.table = table;

    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [SelectedTableComponent] should be created");
    expect(component).toBeTruthy();
  });

  it("should have correct table name", () => {
    const heading = fixture.debugElement.nativeElement.querySelector( ".selected-table-name" );
    expect( heading.textContent ).toContain( tableName );
  });

  it("should have correct connector name", () => {
    const heading = fixture.debugElement.nativeElement.querySelector( ".selected-table-connection" );
    expect( heading.textContent ).toContain( connectionName );
  });

});
