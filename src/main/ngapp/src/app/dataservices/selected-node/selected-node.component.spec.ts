import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { PatternFlyNgModule } from "patternfly-ng";
import { SelectedNodeComponent } from "./selected-node.component";

describe("SelectedNodeComponent", () => {
  let component: SelectedNodeComponent;
  let fixture: ComponentFixture<SelectedNodeComponent>;
  let htmlElem: HTMLElement;

  const nodeName = "testNode";
  const connectionName = "testConnection";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule ],
      declarations: [ SelectedNodeComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedNodeComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;

    const node = new SchemaNode();
    node.setConnectionName(connectionName);
    node.setName(nodeName);
    component.node = node;

    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [SelectedNodeComponent] should be created");
    expect(component).toBeTruthy();
  });

  it("should have correct table name", () => {
    console.log("========== [SelectedNodeComponent] should have correct table name");
    const heading = fixture.debugElement.nativeElement.querySelector( ".object-card-title" );
    expect( heading.textContent ).toContain( nodeName );
  });

  it("should have correct connector name", () => {
    console.log("========== [SelectedNodeComponent] should have correct connector name");
    // const heading = fixture.debugElement.nativeElement.querySelector( ".text-info" );
    // expect( heading.textContent ).toContain( connectionName );
  });

});
