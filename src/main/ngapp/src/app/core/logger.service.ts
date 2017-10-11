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
import { environment } from "@environments/environment";

@Injectable()
export class LoggerService {

  constructor() {
    // nothing to do
  }

  /**
   * Logs a debug console message only if not in production mode.
   *
   * @param {string} msg the message being logged
   * @param optional any optional parameters
   */
  public debug( msg: string, ...optional: any[] ): void {
    if ( !environment.production ) {
      console.error( msg, optional );
    }
  }

  /**
   * @param {string} msg the error message being logged
   * @param optional any optional parameters
   */
  public error( msg: string, ...optional: any[] ): void {
    console.error( msg, optional );
  }

  /**
   * Same as log method.
   *
   * @param {string} msg the info message being logged
   * @param optional any optional parameters
   */
  public info( msg: string, ...optional: any[] ): void {
    this.log( msg, optional );
  }

  /**
   * @param {string} msg the message being logged
   * @param optional any optional parameters
   */
  public log( msg: string, ...optional: any[] ): void {
    console.log( msg, optional );
  }

  /**
   * @param {string} msg the warning message being logged
   * @param optional any optional parameters
   */
  public warn( msg: string, ...optional: any[] ): void {
    console.warn( msg, optional );
  }

}
