import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { NavHeaderComponent } from "@core/nav-header/nav-header.component";
import { LoggerService } from "@core/logger.service";

describe("NavHeaderComponent", () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavHeaderComponent ],
      providers: [ LoggerService ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", inject([ LoggerService ],
                                            (logger: LoggerService ) => {
    expect(component).toBeTruthy();
  }));
});
