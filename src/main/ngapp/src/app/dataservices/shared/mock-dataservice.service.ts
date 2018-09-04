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
import { TestDataService } from "@shared/test-data.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { SqlView } from "@dataservices/shared/sql-view.model";
import { ViewEditorState } from "@dataservices/shared/view-editor-state.model";

@Injectable()
export class MockDataserviceService extends DataserviceService {

  private readonly services: Dataservice[];
  private readonly queryResults: QueryResults;
  private editorViewStateMap = new Map<string, ViewEditorState>();
  private selectedDs: Dataservice;

  constructor(http: Http, vdbService: VdbService, appSettings: AppSettingsService,
              notifierService: NotifierService, logger: LoggerService ) {
    super(http, vdbService, appSettings, notifierService, logger);

    // Inject service for test data
    const injector = ReflectiveInjector.resolveAndCreate([TestDataService]);
    const testDataService = injector.get(TestDataService);

    // Get test data
    this.services = testDataService.getDataservices();
    this.queryResults = testDataService.getQueryResults();

    this.editorViewStateMap = testDataService.getViewEditorStateMap();

    // set selected dataservice, so it's not empty
    const ds = new Dataservice();
    ds.setId("testDs");
    ds.setServiceVdbName("testDsVdb");
    this.setSelectedDataservice(ds);
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
   * Set the current Dataservice selection
   * @param {Dataservice} service the Dataservice
   */
  public setSelectedDataservice(service: Dataservice): void {
    this.selectedDs = service;
  }

  /**
   * Get the current Dataservice selection
   * @returns {Dataservice} the selected Dataservice
   */
  public getSelectedDataservice( ): Dataservice {
    return this.selectedDs;
  }

  /**
   * Get the view definitions for the selected Dataservice
   * @returns {ViewDefinition[]} the view definitions
   */
  public getSelectedDataserviceViews(): ViewDefinition[] {
    const table: ViewDefinition = new ViewDefinition();
    table.setName("views.View1");
    const tables: ViewDefinition[] = [];
    tables.push(table);

    return tables;
  }

  /**
   * Get the views for the selected Dataservice
   * @returns {SqlView[]} the views
   */
  public getSelectedDataserviceViewNames(): SqlView[] {
    const views: SqlView[] = [];
    views.push(new SqlView("views.View1"));

    return views;
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
      return Observable.of( "Data virtualization name cannot be empty" );
    }

    // make sure no dataservice exists with that name
    for ( const ds of this.services ) {
      if ( ds.getId() === name ) {
        return Observable.of( "Data virtualization with that name already exists" );
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

  /**
   * @param {ViewEditorState} editorState the view editor state
   * @returns {Observable<boolean>} `true` if the editor state was successfully saved
   */
  public saveViewEditorState( editorState: ViewEditorState ): Observable< boolean > {
    return Observable.of(true);
  }

  /**
   * @param {string} editorId the ID of the editor state being requested
   * @returns {Observable<ViewEditorState>} the view editor state or empty object if not found
   */
  public getViewEditorState( editorId: string ): Observable< ViewEditorState > {
    return Observable.of(this.editorViewStateMap.get(editorId));
  }

  /**
   * @param {string} editorStatePattern the editorState name pattern
   * @returns {Observable<ViewEditorState[]>} the view editor state array
   */
  public getViewEditorStates( editorStatePattern?: string ): Observable< ViewEditorState[] > {
    const editorStates = [];

    this.editorViewStateMap.forEach( ( value, key ) => {
      if (editorStatePattern && editorStatePattern.length > 0) {

        // Just match the first few chars with this test method
        const patternTrimmed = editorStatePattern.substring(0, 5);
        const keyTrimmed = key.substring(0, 5);
        if (keyTrimmed.startsWith(patternTrimmed)) {
          editorStates.push(value);
        }
      } else {
        editorStates.push(value);
      }
    } );

    return Observable.of(editorStates);
  }

  /**
   * @param {string} editorId the ID of the editor state being deleted
   * @returns {Observable<boolean>} `true` if the editor state was successfully deleted
   */
  public deleteViewEditorState( editorId: string ): Observable< boolean > {
    return Observable.of(true);
  }

  /**
   * @param {ViewEditorState} editorState the view editor state
   * @param {string} dataserviceName the name of the dataservice
   * @returns {Observable<boolean>} `true` if the editor state was successfully saved
   */
  public saveViewEditorStateRefreshViews( editorState: ViewEditorState, dataserviceName: string ): Observable< boolean > {
    return Observable.of(true);
  }

  /**
   * @param {string} editorId the ID of the editor state being deleted
   * @param {string} dataserviceName the name of the dataservice
   * @returns {Observable<boolean>} `true` if the editor state was successfully saved
   */
  public deleteViewEditorStateRefreshViews( editorId: string, dataserviceName: string ): Observable< boolean > {
    return Observable.of(true);
  }

}
