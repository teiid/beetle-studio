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
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { NewConnection } from "@connections/shared/new-connection.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockConnectionService extends ConnectionService {

  private newConnection = new NewConnection();
  private conn1 = new Connection();
  private conn2 = new Connection();
  private conn3 = new Connection();
  private conns: Connection[] = [this.conn1, this.conn2, this.conn3];
  private templ1 = new TemplateDefinition();
  private templ2 = new TemplateDefinition();
  private templ3 = new TemplateDefinition();
  private templs: TemplateDefinition[] = [this.templ1, this.templ2, this.templ3];

  constructor( http: Http, appSettings: AppSettingsService, logger: LoggerService ) {
    super(http, appSettings, logger);
    this.conn1.setId("conn1");
    this.conn2.setId("conn2");
    this.conn3.setId("conn3");
  }

  /**
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return Observable.of(this.conns);
  }

  /**
   * Create a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<boolean>}
   */
  public createConnection(connection: NewConnection): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {string} connectionId
   * @returns {Observable<boolean>}
   */
  public deleteConnection(connectionId: string): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Get the connection templates from the komodo rest interface
   * @returns {Observable<Array<TemplateDefinition<any>>>}
   */
  public getConnectionTemplates(): Observable<TemplateDefinition[]> {
    return Observable.of(this.templs);
  }

}
