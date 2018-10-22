import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { AppSettingsService } from "@core/app-settings.service";
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
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { ViewPropertyEditorsComponent } from "@dataservices/virtualization/view-editor/view-property-editors/view-property-editors.component";
import { TabsModule} from "ngx-bootstrap";
import { GraphVisualComponent, LinkVisualComponent, NodeVisualComponent } from "@dataservices/virtualization/view-editor/view-canvas/visuals";
import { CanvasService } from "@dataservices/virtualization/view-editor/view-canvas/canvas.service";
import { SelectionService } from "@core/selection.service";
import { PropertyEditorComponent } from "@dataservices/virtualization/view-editor/view-property-editors/property-editor/property-editor.component";
import { ProjectedColumnsEditorComponent } from "@dataservices/virtualization/view-editor/view-property-editors/projected-columns-editor/projected-columns-editor.component";
import { ViewsListComponent } from "@dataservices/virtualization/view-editor/views-list/views-list.component";
import { BsModalService } from "ngx-bootstrap";
import { Dataservice } from "@dataservices/shared/dataservice.model";

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
        GraphVisualComponent,
        LinkVisualComponent,
        NodeVisualComponent,
        ProjectedColumnsEditorComponent,
        PropertyEditorComponent,
        ViewCanvasComponent,
        ViewPropertyEditorsComponent,
        ViewsListComponent
      ],
      providers: [
        BsModalService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: DataserviceService, useClass: MockDataserviceService },
        CanvasService,
        LoggerService,
        NotifierService,
        SelectionService,
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

    const selService = TestBed.get( SelectionService );
    const ds: Dataservice = new Dataservice();
    ds.setId("testDs");
    ds.setServiceVdbName("testDsVdb");
    // noinspection JSUnusedAssignment
    selService.setSelectedVirtualization( ds );

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
