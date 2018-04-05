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
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NameValue } from "@dataservices/shared/name-value.model";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbModelSource } from "@dataservices/shared/vdb-model-source.model";
import { VdbModel } from "@dataservices/shared/vdb-model.model";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { Vdb } from "@dataservices/shared/vdb.model";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { Virtualization } from "@dataservices/shared/virtualization.model";
import { environment } from "@environments/environment";
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";

@Injectable()
/**
 * VdbService
 */
export class VdbService extends ApiService {

  protected deploymentSubscription: Subscription;
  protected notifierService: NotifierService;
  private http: Http;

  constructor(http: Http, appSettings: AppSettingsService,
              notifierService: NotifierService, logger: LoggerService ) {
    super( appSettings, logger  );
    this.http = http;
    this.notifierService = notifierService;
  }

  /**
   * Get the vdbs from the komodo rest interface
   * @returns {Observable<Vdb[]>}
   */
  public getVdbs(): Observable<Vdb[]> {
    return this.http
      .get(environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath, this.getAuthRequestOptions())
      .map((response) => {
        const vdbs = response.json();
        return vdbs.map((vdb) => Vdb.create( vdb ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Determine if the workspace has a vdb with the supplied name
   * @param {string} vdbName the name of the VDB
   * @returns {Observable<Vdb[]>}
   */
  public hasWorkspaceVdb(vdbName: string): Observable<boolean> {
    return this.http
      .get(environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath + "/" + vdbName, this.getAuthRequestOptions())
      .map((response) => {
          return response.ok;
      })
      .catch((error) => {
        // VDB not found returns a 404
        if (error.status === 404) {
          return Observable.of(false);
        }
        this.handleError( error );
      } );
  }

  /**
   * Get the status of any deployed vdbs
   * @returns {Observable<Vdb[]>}
   */
  public getTeiidVdbStatuses(): Observable<VdbStatus[]> {
    return this.http
      .get(environment.komodoTeiidUrl + VdbsConstants.statusPath + VdbsConstants.vdbsRootPath, this.getAuthRequestOptions())
      .map((response) => {
        const vdbStatuses = response.json();
        return vdbStatuses.vdbs.map((vdbStatus) => VdbStatus.create( vdbStatus ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the status of all published vdbs (virtualizations)
   * @returns {Observable<Vdb[]>}
   */
  public getVirtualizations(): Observable<Virtualization[]> {
    return this.http
      .get(environment.komodoTeiidUrl + "/" + VdbsConstants.vdbPublish, this.getAuthRequestOptions())
      .map((response) => {
        const virtuals = response.json();
        return virtuals.map((virtualStatus) => Virtualization.create( virtualStatus ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Derive the source vdb name from the given connection
   *
   * @param {Connection} connection
   * @returns {string}
   */
  public deriveSourceVdbName(connection: Connection): string {
    const name = connection.getId() + VdbsConstants.SOURCE_VDB_SUFFIX;
    return name.toLowerCase();
  }

  /**
   * Derive the vdb model name from the given connection
   *
   * @param {Connection} connection
   * @returns {string}
   */
  public deriveVdbModelName(connection: Connection): string {
    return connection.getId().toLowerCase();
  }

  /**
   * Derive the vdb model source name from the given connection
   *
   * @param {Connection} connection
   * @returns {string}
   */
  public deriveVdbModelSourceName(connection: Connection): string {
    return connection.getServiceCatalogSourceName() ?
                connection.getServiceCatalogSourceName() : connection.getId().toLowerCase();
  }

  /**
   * Create a vdb via the komodo rest interface
   * @param {Vdb} vdb
   * @returns {Observable<boolean>}
   */
  public createVdb(vdb: Vdb): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath + "/" + vdb.getId(),
        vdb, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a vdb via the komodo rest interface
   * @param {string} vdbName
   * @param {VdbModel} vdbModel
   * @returns {Observable<boolean>}
   */
  public createVdbModel(vdbName: string, vdbModel: VdbModel): Observable<boolean> {
    const str = JSON.stringify(vdbModel);
    return this.http
      .post(environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath + "/" + vdbName
                                               + VdbsConstants.vdbModelsRootPath + "/" + vdbModel.getId(),
        str, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a vdbModelSource via the komodo rest interface
   * @param {string} vdbName the vdb name
   * @param {string} modelName the model name
   * @param {VdbModelSource} vdbModelSource the modelsource name
   * @returns {Observable<boolean>}
   */
  public createVdbModelSource(vdbName: string, modelName: string, vdbModelSource: VdbModelSource): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath + "/" + vdbName
                                               + VdbsConstants.vdbModelsRootPath + "/" + modelName
                                               + VdbsConstants.vdbModelSourcesRootPath + "/" + vdbModelSource.getId(),
        vdbModelSource, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Delete a vdb via the komodo rest interface
   * @param {string} vdbId
   * @returns {Observable<boolean>}
   */
  public deleteVdb(vdbId: string): Observable<boolean> {
    return this.http
      .delete(environment.komodoWorkspaceUrl + VdbsConstants.vdbsRootPath + "/" + vdbId,
               this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Deploys the workspace VDB with the provided name
   * @param {string} vdbName
   * @returns {Observable<boolean>}
   */
  public deployVdb(vdbName: string): Observable<boolean> {
    const vdbPath = this.getKomodoUserWorkspacePath() + "/" + vdbName;
    return this.http
      .post(environment.komodoTeiidUrl + VdbsConstants.vdbRootPath,
        { path: vdbPath}, this.getAuthRequestOptions())
      .map((response) => {
        const status = response.json();
        if (status.Information.deploymentSuccess !== "true") {
          this.handleError(response);
        }

        return status.Information.deploymentSuccess === "true";
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Undeploy a vdb from the teiid server
   * @param {string} vdbId
   * @returns {Observable<boolean>}
   */
  public undeployVdb(vdbId: string): Observable<boolean> {
    return this.http
      .delete(environment.komodoTeiidUrl + VdbsConstants.vdbsRootPath + "/" + vdbId,
        this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Update the specified repo VDB Model using the DDL from the specified Teiid VDB
   * @param {string} vdbName the VDB in the repo to update
   * @param {string} modelName the Model withing the specified repo VDB
   * @param {string} teiidVdbName the deployed teiid VDB name
   * @param {string} teiidModelName the teiid VDB Model name
   * @returns {Observable<boolean>}
   */
  public updateVdbModelFromTeiid(vdbName: string, modelName: string,
                                 teiidVdbName: string, teiidModelName: string): Observable<boolean> {
    return this.http
      .post(environment.komodoTeiidUrl + VdbsConstants.vdbsRootPath + "/ModelFromTeiidDdl",
        { vdbName, modelName, teiidVdbName, teiidModelName }, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Polls the server for the specified VDB.  Polling will terminate if
   * (1) The VDB is active
   * (2) The VDB is in a failed state
   * (3) The polling duration has lapsed
   * @param {string} vdbName the name of the VDB
   * @param {number} pollDurationSec the duration (sec) to poll the server
   * @param {number} pollIntervalSec the interval (sec) between polling attempts
   */
  public pollForActiveVdb(vdbName: string, pollDurationSec: number, pollIntervalSec: number): void {
    const pollIntervalMillis = pollIntervalSec * 1000;
    const pollIterations = pollDurationSec / pollIntervalSec;

    let pollCount = 0;
    const self = this;
    // start a timer after one second
    const timer = Observable.timer(1000, pollIntervalMillis);
    this.deploymentSubscription = timer.subscribe((t: any) => {
      this.getTeiidVdbStatuses()
        .subscribe(
          (resp) => {
            for ( const vdbStatus of resp ) {
              if ( vdbStatus.getName() !== vdbName ) {
                continue;
              }
              if ( vdbStatus.isActive() ) {
                this.notifierService.sendVdbDeploymentStatus(vdbStatus);
                self.deploymentSubscription.unsubscribe();
              } else if ( vdbStatus.isFailed() ) {
                this.notifierService.sendVdbDeploymentStatus(vdbStatus);
                self.deploymentSubscription.unsubscribe();
              }
            }
            pollCount++;
            if (pollCount > pollIterations) {
              // Timed out status
              const status: VdbStatus = new VdbStatus();
              status.setName(vdbName);
              status.setActive(false);
              status.setLoading(false);
              status.setFailed(true);
              const errors: string[] = [];
              errors.push("Deployment polling timed out");
              status.setErrors(errors);
              // broadcast the status
              this.notifierService.sendVdbDeploymentStatus(status);
              self.deploymentSubscription.unsubscribe();
            }
          },
          (error) => {
            // Error status
            const status: VdbStatus = new VdbStatus();
            status.setName(vdbName);
            status.setActive(false);
            status.setLoading(false);
            status.setFailed(true);
            const errors: string[] = [];
            errors.push("Deployment failed");
            status.setErrors(errors);
            // Broadcast the status
            this.notifierService.sendVdbDeploymentStatus(status);
            self.deploymentSubscription.unsubscribe();
          }
        );
    });
  }

  /**
   * Create and deploy a VDB for the provided connection.
   * @param {Connection} connection
   * @returns {Observable<boolean>}
   */
  public deployVdbForConnection(connection: Connection): Observable<boolean> {
    const vdbName = this.deriveSourceVdbName(connection);
    const vdbModelName = this.deriveVdbModelName(connection);
    const vdbModelSourceName = this.deriveVdbModelSourceName(connection);

    // VDB to create
    const vdb = new Vdb();
    vdb.setName(vdbName);
    vdb.setId(vdbName);
    const vdbPath = this.getKomodoUserWorkspacePath() + "/" + vdbName;
    vdb.setDataPath(vdbPath);
    vdb.setOriginalFile(vdbPath);
    vdb.setDescription(vdbName + " description");

    // VDB Model to create
    const vdbModel = new VdbModel();
    vdbModel.setId(vdbModelName);
    vdbModel.setDataPath(vdbPath + "/" + vdbModelName);
    vdbModel.setModelType("PHYSICAL");

    // Set the importer properties for the physical model
    const props: NameValue[] = [];
    props.push(new NameValue("importer.TableTypes", "TABLE"));
    props.push(new NameValue("importer.UseQualifiedName", "true"));
    props.push(new NameValue("importer.UseCatalogName", "false"));
    props.push(new NameValue("importer.UseFullSchemaName", "false"));
    vdbModel.setProperties(props);

    // VdbModelSource to create
    const vdbModelSource = new VdbModelSource();
    vdbModelSource.setId(vdbModelSourceName);
    vdbModelSource.setDataPath(vdbPath + "/" + vdbModelName + "/vdb:sources/" + vdbModelSourceName);
    vdbModelSource.setJndiName(connection.getJndiName());
    vdbModelSource.setTranslatorName(connection.getDriverName());
    vdbModelSource.setOriginConnection(connection.getDataPath());

    // Chain the individual calls together in series to build the Vdb and deploy it
    return this.deleteVdbIfFound(vdb.getId())
      .flatMap((res) => this.createVdb(vdb))
      .flatMap((res) => this.createVdbModel(vdb.getId(), vdbModel))
      .flatMap((res) => this.createVdbModelSource(vdb.getId(), vdbModel.getId(), vdbModelSource))
      .flatMap((res) => this.deployVdb(vdb.getId()));
  }

  /**
   * Deletes the workspace VDB if found.  Checks the workspace first, before attempting the delete.
   * If the VDB is not found the delete attempt is skipped.
   * @param {string} vdbName the name of the vdb
   * @returns {Observable<boolean>}
   */
  public deleteVdbIfFound(vdbName: string): Observable<boolean> {
    return this.hasWorkspaceVdb(vdbName)
      .switchMap( (resp) => {
        if (resp === true) {
          return this.deleteVdb(vdbName);
        } else {
          return Observable.of(true);
        }
      });
  }

}
