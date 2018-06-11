import { HttpModule } from "@angular/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { AppSettingsService } from "@core/app-settings.service";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { ViewPreviewComponent } from "@dataservices/virtualization/view-editor/editor-views/view-preview/view-preview.component";
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
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";

describe("ViewPreviewComponent", () => {
  let component: ViewPreviewComponent;
  let fixture: ComponentFixture<ViewPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        TableModule,
        WizardModule,
        HttpModule,
        RouterTestingModule
      ],
      declarations: [ ViewPreviewComponent ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        LoggerService,
        NotifierService,
        { provide: VdbService, useClass: MockVdbService },
        ViewEditorService
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
