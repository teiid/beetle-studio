import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { AddConnectionWizardComponent } from "@connections/add-connection-wizard/add-connection-wizard.component";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddConnectionComponent } from "./add-connection.component";

describe("AddConnectionComponent", () => {
  let component: AddConnectionComponent;
  let fixture: ComponentFixture<AddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule, SharedModule ],
      declarations: [ AddConnectionComponent, AddConnectionWizardComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: Figure out how to setup this test.
  // it("should be created", () => {
  //   expect(component).toBeTruthy();
  // });
});
