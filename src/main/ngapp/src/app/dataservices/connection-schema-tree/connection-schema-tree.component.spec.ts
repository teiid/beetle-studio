import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { TreeModule } from "angular-tree-component";
import { ConnectionSchemaTreeComponent } from "./connection-schema-tree.component";

describe("ConnectionSchemaTreeComponent", () => {
  let component: ConnectionSchemaTreeComponent;
  let fixture: ComponentFixture<ConnectionSchemaTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, TreeModule ],
      declarations: [ ConnectionSchemaTreeComponent ],
      providers: [ LoggerService, NotifierService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionSchemaTreeComponent);
    component = fixture.componentInstance;

    component.nodes = [];
    component.options = {};
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
