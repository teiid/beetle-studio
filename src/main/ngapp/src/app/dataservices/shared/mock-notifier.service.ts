import { Injectable } from "@angular/core";
import { NotifierService } from "@dataservices/shared/notifier.service";

@Injectable()
export class MockNotifierService extends NotifierService {

  constructor() {
    super();
  }

}
