import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { AppSettingsService } from "@core/app-settings.service";
import { SelectionService } from "@core/selection.service";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { ViewEditorComponent } from '@dataservices/virtualization/view-editor/view-editor.component';
import { ViewCanvasComponent } from "@dataservices/virtualization/view-editor/view-canvas/view-canvas.component";
import { ConnectionTableDialogComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-table-dialog.component";
import { ConnectionTreeSelectorComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-tree-selector/connection-tree-selector.component";
import { EditorViewsComponent } from "@dataservices/virtualization/view-editor/editor-views/editor-views.component";
import { MessageLogComponent } from "@dataservices/virtualization/view-editor/editor-views/message-log/message-log.component";
import { ViewPreviewComponent } from "@dataservices/virtualization/view-editor/editor-views/view-preview/view-preview.component";
import { ViewEditorHeaderComponent } from "@dataservices/virtualization/view-editor/view-editor-header/view-editor-header.component";
import { TreeModule } from "angular-tree-component";
import { TabsModule } from "ngx-bootstrap";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  TableModule,
  ToolbarModule,
  WizardModule } from "patternfly-ng";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";

describe('ViewEditorComponent', () => {
  let component: ViewEditorComponent;
  let fixture: ComponentFixture<ViewEditorComponent>;

  beforeEach(async(() => {
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
        ToolbarModule,
        WizardModule,
        RouterTestingModule,
        TabsModule.forRoot(),
        TreeModule
      ],
      declarations: [
        ConnectionTableDialogComponent,
        ConnectionTreeSelectorComponent,
        EditorViewsComponent,
        MessageLogComponent,
        SelectedNodeComponent,
        ViewCanvasComponent,
        ViewEditorComponent,
        ViewEditorHeaderComponent,
        ViewPreviewComponent
      ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        NotifierService,
        SelectionService,
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
