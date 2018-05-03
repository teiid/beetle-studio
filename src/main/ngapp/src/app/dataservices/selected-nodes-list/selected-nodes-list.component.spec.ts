import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { PatternFlyNgModule } from "patternfly-ng";
import { SelectedNodesListComponent } from "./selected-nodes-list.component";

describe("SelectedNodesListComponent", () => {
  let component: SelectedNodesListComponent;
  let fixture: ComponentFixture<SelectedNodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule ],
      declarations: [ SelectedNodesListComponent, SelectedNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedNodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
