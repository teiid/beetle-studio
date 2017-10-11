import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ReactiveFormsModule } from "@angular/forms";
import { PropertyFormPropertyComponent } from "./property-form-property.component";

describe("PropertyFormPropertyComponent", () => {
  let component: PropertyFormPropertyComponent;
  let fixture: ComponentFixture<PropertyFormPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ PropertyFormPropertyComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFormPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
