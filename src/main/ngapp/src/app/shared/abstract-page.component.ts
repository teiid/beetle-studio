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

import { OnInit } from "@angular/core";
import { Response } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/combineLatest";
import { Observable } from "rxjs/Observable";

export abstract class AbstractPageComponent implements OnInit {

  public dataLoaded: Map<string, boolean> = new Map<string, boolean>();
  public pageError: Response;
  protected route: ActivatedRoute;
  public logger: LoggerService;

  /**
   * C'tor.
   * @param {ActivatedRoute} route
   * @param {LoggerService} logger the logging service
   */
  protected constructor(route: ActivatedRoute, logger: LoggerService) {
    this.route = route;
    this.logger = logger;
  }

  /**
   * Called when the page is initialized.  Triggers the loading of asynchronous
   * page data.
   */
  public ngOnInit(): void {
    const combined = Observable.combineLatest(this.route.params, this.route.queryParams, (params, qparams) => ({params, qparams}));
    const self = this;
    combined.subscribe( (ap) => {
      self.loadAsyncPageData(ap.params, ap.qparams);
    });
  }

  /**
   * Called to kick off loading the page's async data.  Subclasses should
   * override to provide page-specific data loading.
   *
   * If you are referencing the component instance in the callback handler code, make sure to save the component
   * reference in a constant and use that object in the handler code.
   * @param pathParams
   * @param queryParams
   */
  public loadAsyncPageData(pathParams: any, queryParams: any): void {
    // nothing to do
  }

  /**
   * Called by a subclass (page) to report an error during loading of data.
   * @param error
   * @param errorMsg optional message for the logger
   */
  public error(error: Response, errorMsg?: string): void {
    let logMessage = "[" + this.constructor.name + "] ";
    if (errorMsg) {
      logMessage = logMessage.concat(errorMsg + ": %o");
    } else {
      logMessage = logMessage.concat(" Error: %o");
    }
    this.logger.error(logMessage, error);
    this.pageError = error;
  }

  /**
   * Called when page data has been loaded.
   * @param key
   */
  public loaded(key: string): void {
    this.dataLoaded[key] = true;
  }

  /**
   * Called to determine whether some page data has been loaded yet.
   * @param key
   * @return {boolean}
   */
  public isLoaded(key: string): boolean {
    return !!this.dataLoaded[ key ];
  }

}
