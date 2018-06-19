import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertyEditorsComponent } from './view-property-editors.component';
import { TabsModule } from "ngx-bootstrap";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { HttpModule } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { AppSettingsService } from "@core/app-settings.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { NotifierService } from "@dataservices/shared/notifier.service";

describe('ViewPropertyEditorsComponent', () => {
  let component: ViewPropertyEditorsComponent;
  let fixture: ComponentFixture<ViewPropertyEditorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        TabsModule.forRoot()
      ],
      declarations: [ ViewPropertyEditorsComponent ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        LoggerService,
        NotifierService,
        { provide: VdbService, useClass: MockVdbService },
        ViewEditorService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPropertyEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
