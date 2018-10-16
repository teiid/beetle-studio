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
import { ViewEditorState } from "@dataservices/shared/view-editor-state.model";

@Injectable()
export class MockDataserviceService extends DataserviceService {

  private readonly services: Dataservice[];
  private readonly queryResults: QueryResults;
  private editorViewStateMap = new Map<string, ViewEditorState>();

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
   * Update a dataservice via the komodo rest interface
   * @param {NewDataservice} dataservice
   * @returns {Observable<boolean>}
   */
  public updateDataservice(dataservice: NewDataservice): Observable<boolean> {
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

  /**
   * @param {ViewEditorState[]} editorStates the view editor state array
   * @returns {Observable<boolean>} `true` if the editor state was successfully saved
   */
  public saveViewEditorStates( editorStates: ViewEditorState[] ): Observable< boolean > {
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
   * @param {ViewEditorState[]} editorStates the view editor state array
   * @param {string} dataserviceName the name of the dataservice
   * @returns {Observable<boolean>} `true` if the editor state was successfully saved
   */
  public saveViewEditorStatesRefreshViews( editorStates: ViewEditorState[], dataserviceName: string ): Observable< boolean > {
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

  /**
   * Query a Dataservice's published virtualization using odata protocol
   * @param {string} url the odata url string
   * @returns {Observable<any>}
   */
  public odataGet(url: string): Observable<any> {
    const result = this.getMetadata();

    return Observable.of(result);
  }
  private getMetadata(): string {
    const metadata = "<?xml version='1.0' encoding='UTF-8'?>" +
      "<edmx:Edmx Version=\"4.0\" xmlns:edmx=\"http://docs.oasis-open.org/odata/ns/edmx\">" +
      "<edmx:Reference Uri=\"http://virttwovdb-odata-beetle-studio.192.168.42.112.nip.io/odata4/static/org.teiid.v1.xml\">" +
      "  <edmx:Include Namespace=\"org.teiid.v1\" Alias=\"teiid\"/>" +
      "</edmx:Reference>" +
      "<edmx:Reference Uri=\"http://virttwovdb-odata-beetle-studio.192.168.42.112.nip.io/odata4/static/org.apache.olingo.v1.xml\">" +
      " <edmx:Include Namespace=\"org.apache.olingo.v1\" Alias=\"olingo-extensions\"/>" +
      "</edmx:Reference>" +
      "<edmx:DataServices>" +
    "  <Schema xmlns=\"http://docs.oasis-open.org/odata/ns/edm\" Namespace=\"virttwovdb.1.views\" Alias=\"views\">" +
    "     <EntityType Name=\"view1\">" +
    "       <Key><PropertyRef Name=\"RowId\"/></Key>" +
    "       <Property Name=\"RowId\" Type=\"Edm.Int32\" Nullable=\"false\"/>" +
    "       <Property Name=\"_id\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "         <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "           <Bool>true</Bool>" +
    "         </Annotation>" +
    "         <Annotation Term=\"teiid.SIGNED\">" +
    "           <Bool>false</Bool>" +
    "         </Annotation>" +
    "       </Property>" +
    "       <Property Name=\"borough\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "         <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "           <Bool>true</Bool>" +
    "         </Annotation>" +
    "         <Annotation Term=\"teiid.SIGNED\">" +
    "           <Bool>false</Bool>" +
    "         </Annotation>" +
    "       </Property>" +
    "       <Property Name=\"cuisine\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "         <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "           <Bool>true</Bool>" +
    "         </Annotation>" +
    "         <Annotation Term=\"teiid.SIGNED\">" +
    "           <Bool>false</Bool>" +
    "         </Annotation>" +
    "       </Property>" +
    "       <Property Name=\"name\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "         <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "           <Bool>true</Bool>" +
    "         </Annotation>" +
    "         <Annotation Term=\"teiid.SIGNED\">" +
    "           <Bool>false</Bool>" +
    "         </Annotation>" +
    "       </Property>" +
    "       <Property Name=\"restaurant_id\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "         <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "           <Bool>true</Bool>" +
    "         </Annotation>" +
    "         <Annotation Term=\"teiid.SIGNED\">" +
    "           <Bool>false</Bool>" +
    "         </Annotation>" +
    "       </Property>" +
    "   </EntityType>" +
    "   <EntityType Name=\"view2\">" +
    "     <Key><PropertyRef Name=\"RowId\"/></Key>" +
    "     <Property Name=\"RowId\" Type=\"Edm.Int32\" Nullable=\"false\"/>" +
    "     <Property Name=\"id\" Type=\"Edm.Int32\"/>" +
    "     <Property Name=\"symbol\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "       <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "       <Bool>true</Bool></Annotation><Annotation Term=\"teiid.SIGNED\"><Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "     <Property Name=\"company_name\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "       <Annotation Term=\"teiid.CASE_SENSITIVE\"><Bool>true</Bool></Annotation>" +
    "       <Annotation Term=\"teiid.SIGNED\"><Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "   </EntityType>" +
    "   <EntityType Name=\"view3\">" +
    "     <Key><PropertyRef Name=\"RowId\"/></Key>" +
    "     <Property Name=\"RowId\" Type=\"Edm.Int32\" Nullable=\"false\"/>" +
    "     <Property Name=\"account_id\" Type=\"Edm.Int32\"/>" +
    "     <Property Name=\"ssn\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "       <Annotation Term=\"teiid.CASE_SENSITIVE\"><Bool>true</Bool></Annotation>" +
    "       <Annotation Term=\"teiid.SIGNED\"><Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "     <Property Name=\"status\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "       <Annotation Term=\"teiid.CASE_SENSITIVE\"><Bool>true</Bool></Annotation>" +
    "       <Annotation Term=\"teiid.SIGNED\"><Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "     <Property Name=\"type\" Type=\"Edm.String\" MaxLength=\"4000\">" +
    "       <Annotation Term=\"teiid.CASE_SENSITIVE\">" +
    "         <Bool>true</Bool>" +
    "       </Annotation>" +
    "       <Annotation Term=\"teiid.SIGNED\"><Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "     <Property Name=\"dateopened\" Type=\"Edm.DateTimeOffset\" Precision=\"4\">" +
    "       <Annotation Term=\"teiid.SIGNED\">" +
    "       <Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "     <Property Name=\"dateclosed\" Type=\"Edm.DateTimeOffset\" Precision=\"4\">" +
    "       <Annotation Term=\"teiid.SIGNED\"><Bool>false</Bool></Annotation></Property>" +
    "     <Property Name=\"transaction_id\" Type=\"Edm.Int32\"/>" +
    "     <Property Name=\"product_id\" Type=\"Edm.Int32\"/>" +
    "     <Property Name=\"purchase_date\" Type=\"Edm.DateTimeOffset\" Precision=\"4\">" +
    "       <Annotation Term=\"teiid.SIGNED\">" +
    "       <Bool>false</Bool></Annotation>" +
    "     </Property>" +
    "     <Property Name=\"shares_count\" Type=\"Edm.Int32\"/>" +
      " </EntityType>" +
    "   <EntityContainer Name=\"views\">" +
    "     <EntitySet Name=\"view1\" EntityType=\"views.view1\"/>" +
    "    <EntitySet Name=\"view2\" EntityType=\"views.view2\"/>" +
    "      <EntitySet Name=\"view3\" EntityType=\"views.view3\"/>" +
    "   </EntityContainer>" +
    "</Schema>" +
    "</edmx:DataServices>" +
      "</edmx:Edmx>";

    return metadata;
  }
}
