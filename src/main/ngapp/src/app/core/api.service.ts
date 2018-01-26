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

import { RequestOptions, Response } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

export abstract class ApiService {

  protected appSettings: AppSettingsService;
  protected logger: LoggerService;

  constructor( appSettings: AppSettingsService, logger: LoggerService) {
    this.appSettings = appSettings;
    this.logger = logger;
  }

  /**
   * @returns the base url of the application
   */
  protected getBaseUrl(): string {
    return window.location.protocol + "://" + window.location.hostname;
  }

  /**
   * Get the Auth RequestOptions if any
   * Note: Since usage of the oauth-proxy no additional auth request options are necessary
   *
   * @returns {RequestOptions}
   */
  protected getAuthRequestOptions(): RequestOptions {
    return this.appSettings.getAuthRequestOptions();
  }

  /**
   * Get the current user workspace path
   * @returns {string} the current user workspace path
   */
  protected getKomodoUserWorkspacePath(): string {
    return this.appSettings.getKomodoUserWorkspacePath();
  }

  protected handleError(error: Response): ErrorObservable {
    this.logger.error( this.constructor.name + "::handleError" );
    return Observable.throw(error);
  }

}
