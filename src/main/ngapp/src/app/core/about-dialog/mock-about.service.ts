import { Http } from "@angular/http";
import { Injectable } from '@angular/core';
import { AboutService } from "@core/about-dialog/about.service";
import { Observable } from "rxjs/Observable";
import { About } from "@core/about-dialog/about.model";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";

@Injectable()
export class MockAboutService extends AboutService {

  public static readonly json = {
    "Information": {
      "App Name": "vdb-builder",
      "App Title": "Vdb Builder",
      "App Description": "A tool that allows creating, editing and managing dynamic VDBs and their contents",
      "App Version": "0.0.4-SNAPSHOT"
    }
  };

  constructor( http: Http,
               appSettings: AppSettingsService,
               logger: LoggerService ) {
    super( http, appSettings, logger );
  }

  public getAboutInformation(): Observable< About > {
    const about = About.create( MockAboutService.json );
    return Observable.of( about );
  }

}
