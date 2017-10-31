import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddActivityWizardComponent } from "@activities/add-activity-wizard/add-activity-wizard.component";
import { ActivityService } from "@activities/shared/activity.service";
import { MockActivityService } from "@activities/shared/mock-activity.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddActivityComponent } from "./add-activity.component";

describe("AddActivityComponent", () => {
  let component: AddActivityComponent;
  let fixture: ComponentFixture<AddActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, PatternFlyNgModule, FormsModule, ReactiveFormsModule, RouterTestingModule, SharedModule ],
      declarations: [ AddActivityComponent, AddActivityWizardComponent ],
      providers: [
        { provide: ActivityService, useClass: MockActivityService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ]
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

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
