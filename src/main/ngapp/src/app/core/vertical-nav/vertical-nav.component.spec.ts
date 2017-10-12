import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@core/logger.service";
import { VerticalNavComponent } from "@core/vertical-nav/vertical-nav.component";

describe("VerticalNavComponent", () => {
  let component: VerticalNavComponent;
  let fixture: ComponentFixture<VerticalNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ VerticalNavComponent ],
      providers: [ LoggerService ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", inject([ LoggerService ],
    (logger: LoggerService ) => {
    expect(component).toBeTruthy();
  }));
});
