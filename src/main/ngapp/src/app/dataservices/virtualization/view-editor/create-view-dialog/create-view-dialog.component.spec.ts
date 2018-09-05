import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateViewDialogComponent } from './create-view-dialog.component';
import { HttpModule } from "@angular/http";
import { BsModalRef, ModalModule } from "ngx-bootstrap";
import {
  ActionModule,
  NotificationModule
} from "patternfly-ng";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { SelectionService } from "@core/selection.service";

describe('CreateViewDialogComponent', () => {
  let component: CreateViewDialogComponent;
  let fixture: ComponentFixture<CreateViewDialogComponent>;

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
      declarations: [ CreateViewDialogComponent ],
      providers: [ AppSettingsService, BsModalRef, LoggerService, NotifierService, SelectionService,
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
