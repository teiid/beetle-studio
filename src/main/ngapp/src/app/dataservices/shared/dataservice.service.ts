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
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { NewDataservice } from "@dataservices/shared/new-dataservice.model";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { ObjectVdbStatus } from "@dataservices/shared/object-vdb-status.model";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { Table } from "@dataservices/shared/table.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { environment } from "@environments/environment";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class DataserviceService extends ApiService {

  private static readonly nameValidationUrl = environment.komodoWorkspaceUrl
                                              + DataservicesConstants.dataservicesRootPath
                                              + "/nameValidation/";

  // Observable dataservice state changes
  // Using replay status with cache of 1, so subscribers dont get an initial value on subscription
  public dataserviceStateChange: Subject< Map<string, DeploymentState> > = new ReplaySubject< Map<string, DeploymentState> >(1);

  public serviceVdbSuffix = "VDB";  // Don't change - must match komodo naming convention

  private http: Http;
  private notifierService: NotifierService;
  private appSettingsService: AppSettingsService;
  private vdbService: VdbService;
  private selectedDataservice: Dataservice;
  private dataserviceCurrentView: Table[] = [];
  private cachedDataserviceStates: Map<string, DeploymentState> = new Map<string, DeploymentState>();
  private updatesSubscription: Subscription;

  constructor(http: Http, vdbService: VdbService, appSettings: AppSettingsService,
              notifierService: NotifierService, logger: LoggerService ) {
    super( appSettings, logger  );
    this.http = http;
    this.notifierService = notifierService;
    this.vdbService = vdbService;
    this.appSettingsService = appSettings;
    // Polls to fire Dataservice state updates every 15 sec
    this.pollDataserviceStatus(15);
  }

  /**
   * Create and return a NewDataservice instance
   * @param {string} name the dataservice name
   * @param {string} description the dataservice description
   * @returns {NewDataservice} the NewDataservice object
   */
  public newDataserviceInstance(name: string, description: string ): NewDataservice {
    const ds: NewDataservice = new NewDataservice(this.appSettingsService.getKomodoUserWorkspacePath());

    // Set provided name and description
    ds.setId(name);
    ds.setDescription(description);

    return ds;
  }

  /**
   * Set the current Dataservice selection
   * @param {Dataservice} service the Dataservice
   */
  public setSelectedDataservice(service: Dataservice): void {
    this.selectedDataservice = service;
    // When the dataservice is selected, init the selected view
    const views: Table[] = this.getSelectedDataserviceViews();
    this.dataserviceCurrentView = [];
    if (views && views.length > 0) {
      this.dataserviceCurrentView.push(views[0]);
    }
  }

  /**
   * Get the current Dataservice selection
   * @returns {Dataservice} the selected Dataservice
   */
  public getSelectedDataservice( ): Dataservice {
    return this.selectedDataservice;
  }

  /**
   * Get the current Dataservice selection's views.  The table object is used for the view,
   * with the Table name set to the full "modelName"."viewName" of the view.
   * @returns {Table[]} the selected Dataservice views
   */
  public getSelectedDataserviceViews( ): Table[] {
    if (!this.selectedDataservice || this.selectedDataservice === null) {
      return [];
    }

    const modelName = this.selectedDataservice.getServiceViewModel();
    const serviceViews = this.selectedDataservice.getServiceViewNames();

    // build the views using the model and view names
    const allViews: Table[] = [];
    for ( const serviceView of serviceViews ) {
      const aView: Table = new Table();
      aView.setName(modelName + "." + serviceView);

      allViews.push(aView);
    }

    return allViews;
  }

  /**
   * Get the current Dataservice current view.  The table object is used for the view,
   * with the Table name set to the full "modelName"."viewName" of the view.
   * @returns {Table[]} the Dataservice current view
   */
  public getSelectedDataserviceCurrentView( ): Table[] {
    return this.dataserviceCurrentView;
  }

  /**
   * Set the current Dataservice current view.  The table object is used for the view,
   * with the Table name set to the full "modelName"."viewName" of the view.
   * @param {Table[]} view the current view
   */
  public setSelectedDataserviceCurrentView( view: Table[] ): void {
    this.dataserviceCurrentView = view;
  }

  /**
   * Validates the specified data service name. If the name contains valid characters and the name is unique, the
   * service returns 'null'. Otherwise, a 'string' containing an error message is returned.
   *
   * @param {string} name the dataservice name
   * @returns {Observable<String>}
   */
  public isValidName( name: string ): Observable< string > {
    if ( !name || name.length === 0 ) {
      return Observable.of( "Dataservice name cannot be empty" );
    }

    const url = DataserviceService.nameValidationUrl + encodeURIComponent( name );

    return this.http.get( url, this.getAuthRequestOptions() )
      .map( ( response ) => {
        if ( response.ok ) {
          if ( response.text() ) {
            return response.text();
          }

          return "";
        } } )
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the dataservices from the komodo rest interface
   * @returns {Observable<Dataservice[]>}
   */
  public getAllDataservices(): Observable<Dataservice[]> {
    return this.http
      .get(environment.komodoWorkspaceUrl + DataservicesConstants.dataservicesRootPath, this.getAuthRequestOptions())
      .map((response) => {
        const dataservices = response.json();
        return dataservices.map((dataservice) => Dataservice.create( dataservice ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the dataservice VdbStatuses from the komodo rest interface
   * @returns {Observable<ObjectVdbStatus[]>}
   */
  public getDataserviceVdbStatuses(): Observable<ObjectVdbStatus[]> {
    return this.http
      .get(environment.komodoWorkspaceUrl + DataservicesConstants.dataservicesStatusPath, this.getAuthRequestOptions())
      .map((response) => {
        const statuses = response.json();
        return statuses.map((dataserviceStatus) => ObjectVdbStatus.create( dataserviceStatus ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a dataservice via the komodo rest interface
   * @param {NewDataservice} dataservice
   * @returns {Observable<boolean>}
   */
  public createDataservice(dataservice: NewDataservice): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + DataservicesConstants.dataservicesRootPath + "/" + dataservice.getId(),
        dataservice, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Deploy a dataservice via the komodo rest interface
   * @param {string} dataserviceName
   * @returns {Observable<boolean>}
   */
  public deployDataservice(dataserviceName: string): Observable<boolean> {
    const servicePath = this.getKomodoUserWorkspacePath() + "/" + dataserviceName;
    return this.http
      .post(environment.komodoTeiidUrl + DataservicesConstants.dataserviceRootPath,
        { path: servicePath}, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a dataservice via the komodo rest interface
   * @param {string} dataserviceName,
   * @param {string[]} tablePaths,
   * @param {string} modelSourcePath,
   * @returns {Observable<boolean>}
   */
  public setServiceVdbForSingleSourceTables(dataserviceName: string, tablePaths: string[], modelSourcePath: string): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + DataservicesConstants.dataservicesRootPath + "/ServiceVdbForSingleSourceTables",
        { dataserviceName, tablePaths, modelSourcePath}, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a readonly datarole for the dataservice
   * @param {string} dataserviceName,
   * @param {string} model1Name,
   * @returns {Observable<boolean>}
   */
  public createReadonlyDataRole(dataserviceName: string, model1Name: string): Observable<boolean> {
    const serviceVdbName = dataserviceName + this.serviceVdbSuffix;
    const READ_ONLY_DATA_ROLE_NAME = VdbsConstants.DEFAULT_READONLY_DATA_ROLE;
    const VIEW_MODEL = VdbsConstants.SERVICE_VIEW_MODEL_NAME;
    const userWorkspacePath = this.getKomodoUserWorkspacePath();

    // The payload for the rest call
    const payload = {
      "keng__id": READ_ONLY_DATA_ROLE_NAME,
      "keng__kType": "VdbDataRole",
      "keng__dataPath": userWorkspacePath + "/" + serviceVdbName + "/vdb:dataRoles/" + READ_ONLY_DATA_ROLE_NAME,
      "vdb__dataRole": READ_ONLY_DATA_ROLE_NAME,
      "vdb__description": "The default read-only access data role.",
      "vdb__grantAll": false,
      "vdb__anyAuthenticated": true,
      "vdb__allowCreateTemporaryTables": false,
      "vdb__permissions": [
        {
          "keng__id": VIEW_MODEL,
          "keng__kType": "VdbPermission",
          "keng__dataPath": userWorkspacePath + "/" + serviceVdbName + "/vdb:dataRoles/" + READ_ONLY_DATA_ROLE_NAME
                                              + "/vdb:permissions/" + VIEW_MODEL,
          "vdb__permission": VIEW_MODEL,
          "vdb__allowAlter": false,
          "vdb__allowCreate": false,
          "vdb__allowDelete": false,
          "vdb__allowExecute": false,
          "vdb__allowRead": true,
          "vdb__allowUpdate": false
        },
        {
          "keng__id": model1Name,
          "keng__kType": "VdbPermission",
          "keng__dataPath": userWorkspacePath + "/" + serviceVdbName + "/vdb:dataRoles/" + READ_ONLY_DATA_ROLE_NAME
                                              + "/vdb:permissions/" + model1Name,
          "vdb__permission": model1Name,
          "vdb__allowAlter": false,
          "vdb__allowCreate": false,
          "vdb__allowDelete": false,
          "vdb__allowExecute": false,
          "vdb__allowRead": true,
          "vdb__allowUpdate": false
        }
      ]
    };
    const url = environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath + "/" + serviceVdbName
                                               + "/VdbDataRoles/" + READ_ONLY_DATA_ROLE_NAME;
    const paystr = JSON.stringify(payload);

    return this.http
      .post(url, paystr, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Delete a dataservice via the komodo rest interface
   * @param {string} dataserviceId
   * @returns {Observable<boolean>}
   */
  public deleteDataservice(dataserviceId: string): Observable<boolean> {
    return this.http
      .delete(environment.komodoWorkspaceUrl + DataservicesConstants.dataservicesRootPath + "/" + dataserviceId,
               this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a dataservice which is a straight passthru to the supplied tables
   * @param {NewDataservice} dataservice
   * @param {Table[]} sourceTables
   * @returns {Observable<boolean>}
   */
  public createDataserviceForSingleSourceTables(dataservice: NewDataservice, sourceTables: Table[]): Observable<boolean> {
    // All tables from same connection
    const connectionName = sourceTables[0].getConnection().getId();
    const sourceVdbName = connectionName + VdbsConstants.SOURCE_VDB_SUFFIX;
    const sourceModelName = connectionName;
    const vdbPath = this.getKomodoUserWorkspacePath() + "/" + sourceVdbName;
    const tablePaths = [];
    for ( const sourceTable of sourceTables ) {
      const tablePath = vdbPath + "/" + sourceModelName + "/" + sourceTable.getName();
      tablePaths.push(tablePath);
    }
    const modelSourcePath = vdbPath + "/" + sourceModelName + "/vdb:sources/" + sourceModelName;

    // Chain the individual calls together in series to build the DataService
    return this.createDataservice(dataservice)
      .flatMap((res) => this.vdbService.updateVdbModelFromTeiid(sourceVdbName, sourceModelName,
                                                                sourceVdbName, sourceModelName))
      .flatMap((res) => this.setServiceVdbForSingleSourceTables(dataservice.getId(), tablePaths, modelSourcePath))
      .flatMap((res) => this.createReadonlyDataRole(dataservice.getId(), sourceModelName))
      .flatMap((res) => this.vdbService.undeployVdb(sourceVdbName))
      .flatMap((res) => this.vdbService.deleteVdb(sourceVdbName));
  }

  /**
   * Updates a dataservice with single table source.  This is simply a create, with the added step of
   * deleting the existing workspace dataservice first.
   * @param {NewDataservice} dataservice
   * @param {Table[]} sourceTables
   * @returns {Observable<boolean>}
   */
  public updateDataserviceForSingleSourceTables(dataservice: NewDataservice, sourceTables: Table[]): Observable<boolean> {
    return this.deleteDataservice(dataservice.getId())
      .flatMap((res) => this.createDataserviceForSingleSourceTables(dataservice, sourceTables));
  }

  /**
   * Export a dataservice to a git repository
   * @param {string} dataserviceName the dataservice name
   * @returns {Observable<boolean>}
   */
  public exportDataservice(dataserviceName: string): Observable<boolean> {
    const repoPathKey = this.appSettings.GIT_REPO_PATH_KEY;
    const repoBranchKey = this.appSettings.GIT_REPO_BRANCH_KEY;
    const repoUsernameKey = this.appSettings.GIT_REPO_USERNAME_KEY;
    const repoPasswordKey = this.appSettings.GIT_REPO_PASSWORD_KEY;
    const repoAuthorEmailKey = this.appSettings.GIT_REPO_AUTHOR_EMAIL_KEY;
    const repoAuthorNameKey = this.appSettings.GIT_REPO_AUTHOR_NAME_KEY;
    const repoFilePathKey = this.appSettings.GIT_REPO_FILE_PATH_KEY;

    // The payload for the rest call
    const payload = {
      "storageType": "git",
      "dataPath": "/" + this.getKomodoUserWorkspacePath() + "/" + dataserviceName,
      "parameters":
        {
          [repoPathKey] : this.appSettings.getGitRepoProperty(repoPathKey),
          [repoBranchKey] : this.appSettings.getGitRepoProperty(repoBranchKey),
          [repoFilePathKey] : dataserviceName,
          [repoUsernameKey] : this.appSettings.getGitRepoProperty(repoUsernameKey),
          [repoPasswordKey] : btoa(this.appSettings.getGitRepoProperty(repoPasswordKey)),
          [repoAuthorNameKey] : this.appSettings.getGitRepoProperty(repoAuthorNameKey),
          [repoAuthorEmailKey] : this.appSettings.getGitRepoProperty(repoAuthorEmailKey)
        }
    };

    const url = environment.komodoImportExportUrl + "/" + DataservicesConstants.dataservicesExport;

    return this.http
      .post(url, payload, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
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
    // The payload for the rest call
    const payload = {
      "query": query,
      "target": dataserviceName,
      "limit": limit,
      "offset": offset
    };

    const url = environment.komodoTeiidUrl + "/query";

    return this.http
      .post(url, payload, this.getAuthRequestOptions())
      .map((response) => {
        const queryResults = response.json();
        return new QueryResults(queryResults);
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Updates the current Dataservice states - triggers update to be broadcast to interested components
   */
  public updateDataserviceStates(): void {
    const self = this;
    this.getDataserviceVdbStatuses()
      .subscribe(
        (dataserviceVdbStatuses) => {
          console.log("[ConnectionService] Sending valid dataservice vdbStatuses: " + new Date(Date.now()).toLocaleString());
          self.cachedDataserviceStates = self.createDeploymentStateMap(dataserviceVdbStatuses);
          this.notifierService.sendDataserviceStateMap(self.cachedDataserviceStates);
        },
        (error) => {
          console.log("[ConnectionService] Error getting dataservice vdbStatuses, sending cached: "
                      + new Date(Date.now()).toLocaleString());
          // On error, broadcast the cached states
          this.notifierService.sendDataserviceStateMap(self.cachedDataserviceStates);
        }
      );
  }

  /**
   * Polls the server and sends Dataservice state updates at the specified interval
   * @param {number} pollIntervalSec the interval (sec) between polling attempts
   */
  public pollDataserviceStatus(pollIntervalSec: number): void {
    const pollIntervalMillis = pollIntervalSec * 1000;

    const self = this;
    // start the timer
    const timer = Observable.timer(500, pollIntervalMillis);
    this.updatesSubscription = timer.subscribe((t: any) => {
      self.updateDataserviceStates();
    });
  }

  /*
   * Creates a Map of dataservice name to DeploymentState
   * @param {ObjectVdbStatus[]} objectVdbStatuses the object VdbStatus array
   * @returns {Map<string,DeploymentState>} the map of dataservice name to DeploymentState
   */
  private createDeploymentStateMap(objectVdbStatuses: ObjectVdbStatus[]): Map<string, DeploymentState> {
    const dataserviceStateMap: Map<string, DeploymentState> = new Map<string, DeploymentState>();

    // For each dataservice, use the corresponding VDB status to create the map entry
    for ( const objectVdbStatus of objectVdbStatuses ) {
      const dataserviceName = objectVdbStatus.getName();
      const dataserviceStatus = objectVdbStatus.getVdbStatus();
      if ( !dataserviceStatus || dataserviceStatus === null ) {
        dataserviceStateMap.set(dataserviceName, DeploymentState.NOT_DEPLOYED);
      } else if ( dataserviceStatus.isFailed() ) {
        dataserviceStateMap.set(dataserviceName, DeploymentState.FAILED);
      } else if ( dataserviceStatus.isActive() ) {
        dataserviceStateMap.set(dataserviceName, DeploymentState.ACTIVE);
      } else if ( dataserviceStatus.isLoading() ) {
        dataserviceStateMap.set(dataserviceName, DeploymentState.LOADING);
      } else {
        dataserviceStateMap.set(dataserviceName, DeploymentState.INACTIVE);
      }
    }

    return dataserviceStateMap;
  }

}
