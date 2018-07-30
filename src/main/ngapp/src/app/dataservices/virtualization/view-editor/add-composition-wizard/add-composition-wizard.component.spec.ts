import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompositionWizardComponent } from './add-composition-wizard.component';
import {
  CardModule,
  TableModule,
  WizardModule
} from "patternfly-ng";
import { ConnectionTreeSelectorComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-tree-selector/connection-tree-selector.component";
import { TreeModule } from "angular-tree-component";
import { FormsModule } from "@angular/forms";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { ConnectionService } from "@connections/shared/connection.service";
import { HttpModule } from "@angular/http";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NotifierService } from "@dataservices/shared/notifier.service";

describe('AddCompositionWizardComponent', () => {
  let component: AddCompositionWizardComponent;
  let fixture: ComponentFixture<AddCompositionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        CardModule,
        FormsModule,
        TableModule,
        TreeModule,
        WizardModule
      ],
      declarations: [ ConnectionTreeSelectorComponent, AddCompositionWizardComponent ],
      providers: [ AppSettingsService, LoggerService, NotifierService,
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompositionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
});
