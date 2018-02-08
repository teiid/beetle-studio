import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { ModalModule } from "ngx-bootstrap";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule, ModalModule.forRoot() ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AppSettingsService, useClass: MockAppSettingsService }
      ]
    }).compileComponents().then(() => {
      // nothing to do
    });
  }));

  it("should create the app", async(() => {
    console.log("========== [AppComponent] should be created");
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
