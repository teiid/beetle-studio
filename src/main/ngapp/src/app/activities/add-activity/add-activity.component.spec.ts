import { AddActivityComponent } from "@activities/add-activity/add-activity.component";
import { ActivityService } from "@activities/shared/activity.service";
import { AddActivityFormComponent } from "@activities/shared/add-activity-form/add-activity-form.component";
import { MockActivityService } from "@activities/shared/mock-activity.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";

describe("AddActivityComponent", () => {
  let component: AddActivityComponent;
  let fixture: ComponentFixture<AddActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, RouterTestingModule ],
      declarations: [ AddActivityComponent, AddActivityFormComponent ],
      providers: [
        { provide: ActivityService, useClass: MockActivityService },
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
