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
import { QueryResults } from "@dataservices/shared/query-results.model";
import { Table } from "@dataservices/shared/table.model";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
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
  private cachedDataserviceStates: Map<string, DeploymentState> = new Map<string, DeploymentState>();
  private updatesSubscription: Subscription;
  private wizardSelectedTablesArray: Table[] = [];

  constructor(http: Http, vdbService: VdbService, appSettings: AppSettingsService,
              notifierService: NotifierService, logger: LoggerService ) {
    super( appSettings, logger  );
    this.http = http;
    this.notifierService = notifierService;
    this.vdbService = vdbService;
    this.appSettingsService = appSettings;
    // Polls to fire Dataservice state updates every minute
    this.pollDataserviceStatus(60);
  }

  /**
   * Set the current Dataservice selection
   * @param {Dataservice} service the Dataservice
   */
  public setSelectedDataservice(service: Dataservice): void {
    this.selectedDataservice = service;
  }

  /**
   * Get the current Dataservice selection
   * @returns {Dataservice} the selected Dataservice
   */
  public getSelectedDataservice( ): Dataservice {
    return this.selectedDataservice;
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
   * @param {string} tablePath,
   * @param {string} modelSourcePath,
   * @returns {Observable<boolean>}
   */
  public setServiceVdbForSingleTable(dataserviceName: string, tablePath: string, modelSourcePath: string): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + DataservicesConstants.dataservicesRootPath + "/ServiceVdbForSingleTable",
        { dataserviceName, tablePath, modelSourcePath}, this.getAuthRequestOptions())
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
   * @param {Table} sourceTable
   * @returns {Observable<boolean>}
   */
  public createDataserviceForSingleTable(dataservice: NewDataservice, sourceTable: Table): Observable<boolean> {
    const connectionName = sourceTable.getConnection().getId();
    const sourceVdbName = connectionName + VdbsConstants.SOURCE_VDB_SUFFIX;
    const sourceModelName = connectionName;
    const vdbPath = this.getKomodoUserWorkspacePath() + "/" + sourceVdbName;
    const tablePath = vdbPath + "/" + sourceModelName + "/" + sourceTable.getName();
    const modelSourcePath = vdbPath + "/" + sourceModelName + "/vdb:sources/" + sourceModelName;

    // Chain the individual calls together in series to build the DataService
    return this.createDataservice(dataservice)
      .flatMap((res) => this.vdbService.updateVdbModelFromTeiid(sourceVdbName, sourceModelName,
                                                                sourceVdbName, sourceModelName))
      .flatMap((res) => this.setServiceVdbForSingleTable(dataservice.getId(), tablePath, modelSourcePath))
      .flatMap((res) => this.createReadonlyDataRole(dataservice.getId(), sourceModelName))
      .flatMap((res) => this.vdbService.undeployVdb(sourceVdbName))
      .flatMap((res) => this.vdbService.deleteVdb(sourceVdbName));
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
    this.getAllDataservices()
      .subscribe(
        (dataservices) => {
          self.updateServiceStateMap(dataservices);
        },
        (error) => {
          // On error, broadcast the cached states
          this.notifierService.sendDataserviceStateMap(this.cachedDataserviceStates);
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

  /**
   * Get the wizard table selections
   * @returns {Table[]} the selections
   */
  public getWizardSelectedTables( ): Table[] {
    return this.wizardSelectedTablesArray;
  }

  /**
   * Clears the list of wizard table selections
   */
  public clearWizardSelectedTables( ): void {
    this.wizardSelectedTablesArray = [];
  }

  /**
   * Determine if the supplied table is one of the current selections in the wizard
   * @param {Table} table the table
   */
  public isWizardSelectedTable(table: Table): boolean {
    return this.getWizardTableIndex(table) > -1;
  }

  /**
   * Add a table to the current wizard selections
   * @param {Table} tableToAdd table to add
   */
  public addToWizardSelectionTables(tableToAdd: Table): void {
    if (!this.isWizardSelectedTable(tableToAdd)) {
      this.wizardSelectedTablesArray.push(tableToAdd);
    }
  }

  /**
   * Remove a table from the current wizard selections
   * @param {Table} tableToRemove
   * @returns {boolean}
   */
  public removeFromWizardSelectionTables(tableToRemove: Table): boolean {
    let wasRemoved = false;

    const index = this.getWizardTableIndex(tableToRemove);
    if (index > -1) {
      this.wizardSelectedTablesArray.splice(index, 1);
      wasRemoved = true;
    }

    return wasRemoved;
  }

  /**
   * Find index of the table in the wizard selected tables list.  -1 if not found
   * @param {Table} table
   * @returns {number}
   */
  private getWizardTableIndex(table: Table): number {
    // supplied table and connection
    const connName = table.getConnection().getId();
    const tableName = table.getName();
    let i = 0;
    for (const wizTable of this.wizardSelectedTablesArray) {
      const wizTableName = wizTable.getName();
      const wizConnName = wizTable.getConnection().getId();
      if (wizTableName === tableName && wizConnName === connName) {
        return i;
      }
      i++;
    }
    return -1;
  }

  /*
   * Get updates for the provided array of Dataservices and broadcast the map of states
   * @param {Dataservice[]} services the array of Dataservices
   */
  private updateServiceStateMap(services: Dataservice[]): void {
    const self = this;
    this.vdbService.getTeiidVdbStatuses()
      .subscribe(
        (vdbStatuses) => {
          self.cachedDataserviceStates = self.createDeploymentStateMap(services, vdbStatuses);
          this.notifierService.sendDataserviceStateMap(self.cachedDataserviceStates);
        },
        (error) => {
          // On error, broadcast the cached states
          this.notifierService.sendDataserviceStateMap(self.cachedDataserviceStates);
        }
      );
  }

  /*
   * Creates a Map of dataservice name to DeploymentState, given the list of dataservices and vdbStatuses
   * @param {Dataservice[]} dataservices the Dataservice array
   * @param {VdbStatus[]} vdbStatuses the VdbStatus array
   * @returns {Map<string,DeploymentState>} the map of dataservice name to DeploymentState
   */
  private createDeploymentStateMap(dataservices: Dataservice[], vdbStatuses: VdbStatus[]): Map<string, DeploymentState> {
    const dsStateMap: Map<string, DeploymentState> = new Map<string, DeploymentState>();

    // For each dataservice, find the corresponding VDB status.  Add the map entry
    for ( const dService of dataservices ) {
      const serviceId = dService.getId();
      const serviceVdbName = dService.getServiceVdbName();
      let statusFound = false;
      for ( const vdbStatus of vdbStatuses ) {
        if ( vdbStatus.getName() === serviceVdbName ) {
          statusFound = true;
          if ( vdbStatus.isActive() ) {
            dsStateMap.set(serviceId, DeploymentState.ACTIVE);
          } else if ( vdbStatus.isFailed() ) {
            dsStateMap.set(serviceId, DeploymentState.FAILED);
          } else if ( vdbStatus.isLoading() ) {
            dsStateMap.set(serviceId, DeploymentState.LOADING);
          } else {
            dsStateMap.set(serviceId, DeploymentState.INACTIVE);
          }
        }
      }
      if ( !statusFound ) {
        dsStateMap.set(serviceId, DeploymentState.NOT_DEPLOYED);
      }
    }

    return dsStateMap;
  }

}
