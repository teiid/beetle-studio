import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalModule } from "ngx-bootstrap";
import { ConfirmDeleteComponent } from "./confirm-delete.component";

describe("ConfirmDeleteComponent", () => {
  let component: ConfirmDeleteComponent;
  let fixture: ComponentFixture<ConfirmDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalModule.forRoot()],
      declarations: [ ConfirmDeleteComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
