import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { CoreModule } from "@core/core.module";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { EditConnectionComponent } from "./edit-connection.component";

describe("EditConnectionComponent", () => {
  let component: EditConnectionComponent;
  let fixture: ComponentFixture<EditConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, HttpModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ EditConnectionComponent, PropertyFormComponent, PropertyFormPropertyComponent ],
      providers: [
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
