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
import * as X2JS from 'x2js';

export abstract class ApiService {

  protected appSettings: AppSettingsService;
  protected logger: LoggerService;

  protected constructor( appSettings: AppSettingsService, logger: LoggerService) {
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

  protected isXML(xml: string): boolean {
    try {
      const parser = new X2JS();
      const xmlDoc = parser.xml2js(xml); //is valid XML
      return xmlDoc != null;
    } catch (err) {
      // was not XML
      return false;
    }
  }

  protected tryXMLParse(xml: string): any {
    try {
      const parser = new X2JS();
      const xmlDoc = parser.xml2js(xml); //is valid XML
      return xmlDoc;
    } catch (err) {}

    return null;
  }

  protected tryNumberParse(jsonString: string): number {
    try {
      var n = parseInt(jsonString);
      if (n && typeof n === "number") {
        return n;
      }
    } catch (e) {}

    return null;
  }

  /**
   * Try to parse the given string and if parseable
   * then return the object
   */
  protected tryJsonParse (jsonString: string): any {
    try {
      var o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
        return o;
      }
    } catch (e) {}

    return null;
  }

  /**
   * @returns true if the item is parseable
   */
  protected isJSON(item: string): boolean {
    item = typeof item !== "string" ? JSON.stringify(item) : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === "object" && item !== null) {
      return true;
    }

    return false;
  }

  protected msgFromResponse(response: Response): string {
    let msg = "";

    if (! this.isJSON(response.text())) {
      msg = response.text();
    } else {
      const body = response.json();

      if (body.message) {
        msg = body.message;
      } else if (body.error) {
        msg = body.error;
      } else if (body.Information && body.Information.ErrorMessage1) {
        msg = body.Information.ErrorMessage1;
      }
    }

    if (msg.length === 0 ) {
      return "unknown error";
    }

    return msg;
  }

  protected handleError(error: Response): ErrorObservable {
    this.logger.error( this.constructor.name + "::handleError => " + this.msgFromResponse(error));
    return Observable.throw(error);
  }

}
