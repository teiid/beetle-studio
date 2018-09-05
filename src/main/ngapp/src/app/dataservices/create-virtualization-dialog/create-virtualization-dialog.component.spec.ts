import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule } from "@angular/http";
import { BsModalRef, ModalModule } from "ngx-bootstrap";
import {
  ActionModule,
  NotificationModule
} from "patternfly-ng";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { CreateVirtualizationDialogComponent } from "./create-virtualization-dialog.component";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { SelectionService } from "@core/selection.service";

describe('CreateVirtualizationDialogComponent', () => {
  let component: CreateVirtualizationDialogComponent;
  let fixture: ComponentFixture<CreateVirtualizationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ActionModule,
        NotificationModule
      ],
      declarations: [ CreateVirtualizationDialogComponent ],
      providers: [ AppSettingsService, BsModalRef, LoggerService, NotifierService, SelectionService,
        { provide: DataserviceService, useClass: MockDataserviceService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVirtualizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
