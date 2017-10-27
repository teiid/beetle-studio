import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { AddActivityWizardComponent } from "@activities/add-activity-wizard/add-activity-wizard.component";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddActivityComponent } from "./add-activity.component";

describe("AddActivityComponent", () => {
  let component: AddActivityComponent;
  let fixture: ComponentFixture<AddActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule, SharedModule ],
      declarations: [ AddActivityComponent, AddActivityWizardComponent ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: Figure out how to setup this test.
  // it("should be created", () => {
  //   expect(component).toBeTruthy();
  // });
});
