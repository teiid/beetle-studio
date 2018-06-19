import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { AppSettingsService } from "@core/app-settings.service";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { ViewCanvasComponent } from '@dataservices/virtualization/view-editor/view-canvas/view-canvas.component';
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
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
import { ViewPropertyEditorsComponent } from "@dataservices/virtualization/view-editor/view-property-editors/view-property-editors.component";
import { TabsModule } from "ngx-bootstrap";

describe('ViewCanvasComponent', () => {
  let component: ViewCanvasComponent;
  let fixture: ComponentFixture<ViewCanvasComponent>;

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
        TabsModule.forRoot()
      ],
      declarations: [
        SelectedNodeComponent,
        ViewCanvasComponent,
        ViewPropertyEditorsComponent
      ],
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
    fixture = TestBed.createComponent(ViewCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
