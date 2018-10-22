import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsListComponent } from './views-list.component';
import {SelectionService} from "@core/selection.service";
import {Dataservice} from "@dataservices/shared/dataservice.model";
import {ViewEditorService} from "@dataservices/virtualization/view-editor/view-editor.service";
import {MockAppSettingsService} from "@core/mock-app-settings.service";
import {LoggerService} from "@core/logger.service";
import {AppSettingsService} from "@core/app-settings.service";
import {DataserviceService} from "@dataservices/shared/dataservice.service";
import {MockVdbService} from "@dataservices/shared/mock-vdb.service";
import {BsModalService, ComponentLoaderFactory} from "ngx-bootstrap";
import {MockDataserviceService} from "@dataservices/shared/mock-dataservice.service";
import {NotifierService} from "@dataservices/shared/notifier.service";
import {VdbService} from "@dataservices/shared/vdb.service";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {TableModule} from "patternfly-ng";
import {RouterTestingModule} from "@angular/router/testing";

describe('ViewsListComponent', () => {
  let component: ViewsListComponent;
  let fixture: ComponentFixture<ViewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        RouterTestingModule,
        TableModule
      ],
      declarations: [ ViewsListComponent ],
      providers: [
        BsModalService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: DataserviceService, useClass: MockDataserviceService },
        LoggerService,
        NotifierService,
        SelectionService,
        { provide: VdbService, useClass: MockVdbService },
        ComponentLoaderFactory,
        ViewEditorService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsListComponent);
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
