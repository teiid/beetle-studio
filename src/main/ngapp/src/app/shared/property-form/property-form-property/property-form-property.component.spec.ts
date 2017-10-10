import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PropertyFormPropertyComponent } from "./property-form-property.component";

describe("PropertyFormPropertyComponent", () => {
  let component: PropertyFormPropertyComponent;
  let fixture: ComponentFixture<PropertyFormPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyFormPropertyComponent ]
    })
    .compileComponents();
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
