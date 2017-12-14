import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { About } from "@core/about-dialog/about.model";
import { MockAboutService } from "@core/about-dialog/mock-about.service";
import { AboutDialogComponent } from "./about-dialog.component";

describe("AboutDialogComponent", () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
    component.info = About.create( MockAboutService.json );
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [AboutDialogComponent] should be created");
    expect(component).toBeTruthy();
  });
});
