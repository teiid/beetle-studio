import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { AddConnectionWizardComponent } from "@connections/add-connection-wizard/add-connection-wizard.component";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddConnectionComponent } from "./add-connection.component";

describe("AddConnectionComponent", () => {
  let component: AddConnectionComponent;
  let fixture: ComponentFixture<AddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, PatternFlyNgModule, FormsModule, ReactiveFormsModule, RouterTestingModule, SharedModule ],
      declarations: [ AddConnectionComponent, AddConnectionWizardComponent ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
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

  it("should be created", () => {
    console.log("========== [AddConnectionComponent] should be created");
    expect(component).toBeTruthy();
  });
});
