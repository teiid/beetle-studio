import { inject, TestBed } from "@angular/core/testing";

import { WizardService } from "./wizard.service";

describe("WizardService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WizardService]
    });
  });

  it("should be created", inject([WizardService], (service: WizardService) => {
    console.log("========== [WizardService] should be created");
    expect(service).toBeTruthy();
  }));
});
