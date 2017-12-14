import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { AboutDialogComponent } from "@core/about-dialog/about-dialog.component";
import { AboutService } from "@core/about-dialog/about.service";
import { MockAboutService } from "@core/about-dialog/mock-about.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NavHeaderComponent } from "@core/nav-header/nav-header.component";
import { ModalModule } from "ngx-bootstrap";
import { BsModalService } from "ngx-bootstrap/modal";

describe("NavHeaderComponent", () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, ModalModule.forRoot() ],
      declarations: [ NavHeaderComponent, AboutDialogComponent ],
      providers: [ AboutService, AppSettingsService, BsModalService, LoggerService ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  // use mock service
  TestBed.overrideComponent( AboutDialogComponent, {
    set: {
      providers: [
        { provide: AboutService, useClass: MockAboutService },
      ]
    }
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", inject([ LoggerService ],
                                            (logger: LoggerService ) => {
    console.log("========== [NavHeaderComponent] should be created");
    expect(component).toBeTruthy();
  }));
});
