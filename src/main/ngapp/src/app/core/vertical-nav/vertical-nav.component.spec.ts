import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from "@angular/router/testing";
import { AboutDialogComponent } from "@core/about-dialog/about-dialog.component";
import { AboutService } from "@core/about-dialog/about.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { VerticalNavComponent } from "@core/vertical-nav/vertical-nav.component";
import { BsModalService, ModalModule } from "ngx-bootstrap";
import { PatternFlyNgModule } from "patternfly-ng";

describe("VerticalNavComponent", () => {
  let component: VerticalNavComponent;
  let fixture: ComponentFixture<VerticalNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, ModalModule.forRoot(), PatternFlyNgModule, RouterTestingModule ],
      declarations: [ VerticalNavComponent, AboutDialogComponent ],
      providers: [ AboutService, AppSettingsService, BsModalService, LoggerService ]
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
    console.log("========== [VerticalNavComponent] should be created");
    expect(component).toBeTruthy();
  }));
});
