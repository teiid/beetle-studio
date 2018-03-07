/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { About } from "@core/about-dialog/about.model";
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { environment } from "@environments/environment";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AboutService extends ApiService {

  private static readonly aboutUrl = environment.komodoServiceUrl + "/about";

  private http: Http;

  constructor( http: Http,
               appSettings: AppSettingsService,
               logger: LoggerService ) {
    super( appSettings, logger );
    this.http = http;
  }

  public getAboutInformation(): Observable<About> {
    return this.http.get( AboutService.aboutUrl, this.getAuthRequestOptions() )
      .map( ( response ) => {
        const aboutInfo = response.json();
        return About.create( aboutInfo );
      } )
      .catch( ( error ) => this.handleError( error ) );
  }
}
