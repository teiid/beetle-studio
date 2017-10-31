import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpModule, Response, ResponseOptions } from "@angular/http";
import { PageErrorComponent } from "@shared/page-error/page-error.component";

describe("PageErrorComponent", () => {
  let component: PageErrorComponent;
  let fixture: ComponentFixture<PageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ PageErrorComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageErrorComponent);
    component = fixture.componentInstance;
    component.error = new Response( new ResponseOptions( { status: 404 } ) );
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
