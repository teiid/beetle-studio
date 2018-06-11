import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { AppSettingsService } from "@core/app-settings.service";
import { SelectionService } from "@core/selection.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { VirtualizationComponent } from "@dataservices/virtualization/virtualization.component";
import { ViewCardsComponent } from "@dataservices/virtualization/view-cards/view-cards.component";
import { ViewCardComponent } from "@dataservices/virtualization/view-cards/view-card/view-card.component";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  TableModule,
  WizardModule } from "patternfly-ng";

describe("VirtualizationComponent", () => {
  let component: VirtualizationComponent;
  let fixture: ComponentFixture<VirtualizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        FormsModule,
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        TableModule,
        WizardModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [
        PropertyFormPropertyComponent,
        ViewCardComponent,
        ViewCardsComponent,
        VirtualizationComponent
      ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: DataserviceService, useClass: MockDataserviceService },
        NotifierService,
        SelectionService,
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
