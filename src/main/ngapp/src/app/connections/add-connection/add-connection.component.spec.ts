import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from "@angular/router/testing";
import { AddConnectionComponent } from "@connections/add-connection/add-connection.component";
import { AddConnectionFormComponent } from "@connections/shared/add-connection-form/add-connection-form.component";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { CoreModule } from "@core/core.module";

describe("AddConnectionComponent", () => {
  let component: AddConnectionComponent;
  let fixture: ComponentFixture<AddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, RouterTestingModule ],
      declarations: [ AddConnectionComponent, AddConnectionFormComponent ],
      providers: [
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
