import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConnectionTreeSelectorComponent } from "./connection-tree-selector.component";
import { LoggerService } from "@core/logger.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { ConnectionService } from "@connections/shared/connection.service";
import { TreeModule } from "angular-tree-component";
import { HttpModule } from "@angular/http";
import { VdbService } from "@dataservices/shared/vdb.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { AppSettingsService } from "@core/app-settings.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";

describe("ConnectionTreeSelectorComponent", () => {
  let component: ConnectionTreeSelectorComponent;
  let fixture: ComponentFixture<ConnectionTreeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, TreeModule ],
      declarations: [ ConnectionTreeSelectorComponent ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        LoggerService,
        NotifierService,
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTreeSelectorComponent);
    component = fixture.componentInstance;

    // const node = {
    //   "connectionName": "pgConn",
    //   "name": "restaurants",
    //   "type": "collection",
    //   "queryable": true,
    //   "children": [
    //     {
    //       "connectionName": "pgConn",
    //       "name": "grades",
    //       "type": "embedded",
    //       "queryable": true,
    //       "children": []
    //     },
    //     {
    //       "connectionName": "pgConn",
    //       "name": "location",
    //       "type": "embedded",
    //       "queryable": true,
    //       "children": []
    //     }
    //   ]
    // };
    //
    // component.nodes = [ SchemaNode.create( node ) ];
    // component.options = {};
    fixture.detectChanges();
  });

  // it("should be created", () => {
  //   expect(component).toBeTruthy();
  // });
});
