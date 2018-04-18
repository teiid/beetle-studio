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

import { Injectable, ReflectiveInjector } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { NewDataservice } from "@dataservices/shared/new-dataservice.model";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { View } from "@dataservices/shared/view.model";
import { TestDataService } from "@shared/test-data.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

@Injectable()
export class MockDataserviceService extends DataserviceService {

  private services: Dataservice[];
  private queryResults: QueryResults;

  constructor(http: Http, vdbService: VdbService, appSettings: AppSettingsService,
              notifierService: NotifierService, logger: LoggerService ) {
    super(http, vdbService, appSettings, notifierService, logger);

    // Inject service for test data
    const injector = ReflectiveInjector.resolveAndCreate([TestDataService]);
    const testDataService = injector.get(TestDataService);

    // Get test data
    this.services = testDataService.getDataservices();
    this.queryResults = testDataService.getQueryResults();
  }

  /**
   * Get the dataservices from the komodo rest interface
   * @returns {Observable<Dataservice[]>}
   */
  public getAllDataservices(): Observable<Dataservice[]> {
    return Observable.of(this.services);
  }

  /**
   * Create a dataservice via the komodo rest interface
   * @param {NewDataservice} dataservice
   * @returns {Observable<boolean>}
   */
  public createDataservice(dataservice: NewDataservice): Observable<boolean> {
    const ds = new Dataservice();
    ds.setId( dataservice.getId() );
    ds.setDescription( dataservice.getDescription() );

    this.services.push( ds );
    return Observable.of(true);
  }

  /**
   * Delete a dataservice via the komodo rest interface
   * @param {string} dataserviceId
   * @returns {Observable<boolean>}
   */
  public deleteDataservice(dataserviceId: string): Observable<boolean> {
    return Observable.of(true);
  }

  public downloadDataservice( dataserviceName: string ): Observable< boolean > {
    alert( "Download of " + dataserviceName + " happens here" );
    return Observable.of( true );
  }

  /**
   * Get the views for the selected Dataservice
   * @returns {View[]} the views
   */
  public getSelectedDataserviceViews(): View[] {
    const table: View = new View();
    table.setName("views.View1");
    const tables: View[] = [];
    tables.push(table);

    return tables;
  }

  /**
   * Query a Dataservice via the komodo rest interface
   * @param {string} query the SQL query
   * @param {string} dataserviceName the dataservice name
   * @param {number} limit the limit for the number of result rows
   * @param {number} offset the offset for the result rows
   * @returns {Observable<boolean>}
   */
  public queryDataservice(query: string, dataserviceName: string, limit: number, offset: number): Observable<any> {
    return Observable.of(this.queryResults);
  }

  protected handleError(error: Response): ErrorObservable {
    return Observable.throw(error);
  }

  public createReadonlyDataRole( dataserviceName: string,
                                 model1Name: string ): Observable< boolean > {
    return Observable.of( true );
  }

  public isValidName( name: string ): Observable<string> {
    if ( !name || name.length === 0 ) {
      return Observable.of( "Dataservice name cannot be empty" );
    }

    // make sure no dataservice exists with that name
    for ( const ds of this.services ) {
      if ( ds.getId() === name ) {
        return Observable.of( "Dataservice with that name already exists" );
      }
    }

    // just implement a case where no special characters allowed
    for ( let i = 0; i < name.length; i++ ) {
      const c = name.charAt( i );

      // special characters have the same upper and lower case values
      if ( c.toUpperCase() === c.toLowerCase() ) {
        return Observable.of( "No special characters allowed" );
      }
    }

    // valid
    return Observable.of( "" );
  }

  public setServiceVdbForSingleSourceTables( dataserviceName: string,
                                             tablePaths: string[],
                                             modelSourcePath: string ): Observable< boolean > {
    return Observable.of( true );
  }

}
