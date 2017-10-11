import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {AddConnectionFormComponent} from "./add-connection-form.component";
import { LoggerService } from "@core/logger.service";

describe("AddConnectionFormComponent", () => {
  let component: AddConnectionFormComponent;
  let fixture: ComponentFixture<AddConnectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      declarations: [ AddConnectionFormComponent ],
      providers: [ LoggerService ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", inject([ LoggerService ], ( logger: LoggerService ) => {
    expect(component).toBeTruthy();
  }));
});
