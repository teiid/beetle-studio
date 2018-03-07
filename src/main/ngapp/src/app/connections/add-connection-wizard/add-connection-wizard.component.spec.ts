import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionTypeCardComponent } from "@connections/connection-type-cards/connection-type-card/connection-type-card.component";
import { ConnectionTypeCardsComponent } from "@connections/connection-type-cards/connection-type-cards.component";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddConnectionWizardComponent } from "./add-connection-wizard.component";

describe("AddConnectionWizardComponent", () => {
  let component: AddConnectionWizardComponent;
  let fixture: ComponentFixture<AddConnectionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ AddConnectionWizardComponent, PropertyFormComponent, PropertyFormPropertyComponent,
                      ConnectionTypeCardComponent, ConnectionTypeCardsComponent ],
      providers: [
        WizardService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [AddConnectionWizardComponent] should be created");
    expect(component).toBeTruthy();
  });
});
