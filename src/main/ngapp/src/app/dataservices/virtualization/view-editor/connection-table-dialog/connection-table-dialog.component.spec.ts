import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConnectionTableDialogComponent } from "./connection-table-dialog.component";
import { ConnectionTreeSelectorComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-tree-selector/connection-tree-selector.component";
import { TreeModule } from "angular-tree-component";
import { HttpModule } from "@angular/http";
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
import { BsModalRef, ModalModule } from "ngx-bootstrap";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NotifierService } from "@dataservices/shared/notifier.service";

describe("ConnectionTableDialogComponent", () => {
  let component: ConnectionTableDialogComponent;
  let fixture: ComponentFixture<ConnectionTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        TreeModule,
        ModalModule.forRoot(),
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        TableModule,
        WizardModule
      ],
      declarations: [ ConnectionTableDialogComponent, ConnectionTreeSelectorComponent ],
      providers: [ AppSettingsService, BsModalRef, LoggerService, NotifierService,
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
