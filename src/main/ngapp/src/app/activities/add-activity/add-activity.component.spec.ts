import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddActivityWizardComponent } from "@activities/add-activity-wizard/add-activity-wizard.component";
import { ActivityService } from "@activities/shared/activity.service";
import { MockActivityService } from "@activities/shared/mock-activity.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { SharedModule } from "@shared/shared.module";
import { WizardModule } from "patternfly-ng";
import { AddActivityComponent } from "./add-activity.component";

describe("AddActivityComponent", () => {
  let component: AddActivityComponent;
  let fixture: ComponentFixture<AddActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, WizardModule, FormsModule, ReactiveFormsModule, RouterTestingModule, SharedModule ],
      declarations: [ AddActivityComponent, AddActivityWizardComponent ],
      providers: [
        NotifierService,
        { provide: ActivityService, useClass: MockActivityService },
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });

    TestBed.overrideComponent(
      MockActivityService, {
        set: {
          providers: [ { provide: AppSettingsService, useClass: MockAppSettingsService } ]
        }
      }
    );

    TestBed.overrideComponent(
      MockConnectionService, {
        set: {
          providers: [ { provide: AppSettingsService, useClass: MockAppSettingsService } ]
        }
      }
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [AddActivityComponent] should be created");
    expect(component).toBeTruthy();
  });
});
