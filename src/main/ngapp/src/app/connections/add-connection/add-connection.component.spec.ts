import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { AddConnectionWizardComponent } from "@connections/add-connection-wizard/add-connection-wizard.component";
import { CoreModule } from "@core/core.module";
import { AddConnectionComponent } from "./add-connection.component";

describe("AddConnectionComponent", () => {
  let component: AddConnectionComponent;
  let fixture: ComponentFixture<AddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule ],
      declarations: [ AddConnectionComponent, AddConnectionWizardComponent ]
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
