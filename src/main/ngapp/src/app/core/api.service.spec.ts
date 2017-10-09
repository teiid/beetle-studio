import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { ApiService } from "@core/api.service";

describe("ApiService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ApiService]
    });
  });

  it("should be created", inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});
