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

import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { PublishState } from "@dataservices/shared/publish-state.enum";
import { Virtualization } from "@dataservices/shared/virtualization.model";
import { VirtRoute } from "@dataservices/shared/virt-route.model";
import { Identifiable } from "@shared/identifiable";
import { SortDirection } from "@shared/sort-direction.enum";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";

export class Dataservice implements Identifiable< string > {

  private keng__id: string;
  private tko__description: string;
  private serviceVdbName: string;
  private serviceVdbVersion: string;
  private serviceViews: string[];
  private serviceViewModel: string;
  private serviceViewTables: string[];
  private deploymentState: DeploymentState = DeploymentState.LOADING;
  private virtualization: Virtualization = null;

  /**
   * @param {Object} json the JSON representation of a Dataservice
   * @returns {Dataservice} the new Dataservice (never null)
   */
  public static create( json: object = {} ): Dataservice {
    const svc = new Dataservice();
    svc.setValues( json );
    return svc;
  }

  /**
   * @param {Dataservice[]} dataservices the dataservices being sorted
   * @param {SortDirection} sortDirection the sort direction
   */
  public static sort( dataservices: Dataservice[],
                      sortDirection: SortDirection ): void {
    dataservices.sort( ( thisDataservice: Dataservice, thatDataservice: Dataservice ) => {
      const result = thisDataservice.compareTo( thatDataservice );

      if ( sortDirection === SortDirection.DESC ) {
        return result * -1;
      }

      return result;
    } );
  }

  constructor( ) {
    // nothing to do
  }

  /**
   * See {Identifiable}.
   */
  public compareTo( that: Dataservice ): number {
    let result = 0;

    if ( this.getId() ) {
      if ( that.getId() ) {
        // both have an ID
        result = this.getId().localeCompare( that.getId() );
      } else {
        // thatItem does not have an ID
        result = 1;
      }
    } else if ( that.getId() ) {
      // thisItem does not have an ID and thatItem does
      result = -1;
    }

    return result;
  }

  /**
   * @returns {string} the dataservice identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the dataservice description (can be null)
   */
  public getDescription(): string {
    return this.tko__description;
  }

  /**
   * @returns {string} the dataservice Vdb name (can be null)
   */
  public getServiceVdbName(): string {
    return this.serviceVdbName;
  }

  /**
   * @returns {string} the dataservice Vdb version (can be null)
   */
  public getServiceVdbVersion(): string {
    return this.serviceVdbVersion;
  }

  /**
   * @returns {string[]} the dataservice view names (never null or undefined)
   */
  public getServiceViewNames(): string[] {
    if ( this.serviceViews ) {
      return this.serviceViews;
    }

    return [];
  }

  /**
   * @returns {string} the dataservice view model name (can be null)
   */
  public getServiceViewModel(): string {
    return this.serviceViewModel;
  }

  /**
   * @returns {string} the dataservice view table names array (can be null)
   */
  public getServiceViewTables(): string[] {
    return this.serviceViewTables;
  }

  /**
   * @returns {string} the dataservice type name (can be null)
   */
  public getType(): string {
    return "Dataservice";
  }

  /**
   * @returns {DeploymentState} the dataservice Deployment state
   */
  public getServiceDeploymentState(): DeploymentState {
    return this.deploymentState;
  }

  /**
   * Accessor to determine if service deployment is active
   * @returns {boolean} the dataservice service deployment active state
   */
  public get serviceDeploymentActive(): boolean {
    return this.deploymentState === DeploymentState.ACTIVE;
  }

  /**
   * Accessor to determine if service deployment is inactive
   * @returns {boolean} the dataservice service deployment inactive state
   */
  public get serviceDeploymentInactive(): boolean {
    return this.deploymentState === DeploymentState.INACTIVE;
  }

  /**
   * Accessor to determine if service deployment is loading
   * @returns {boolean} the dataservice service deployment loading state
   */
  public get serviceDeploymentLoading(): boolean {
    return this.deploymentState === DeploymentState.LOADING;
  }

  /**
   * Accessor to determine if service deployment is failed
   * @returns {boolean} the dataservice service deployment failed state
   */
  public get serviceDeploymentFailed(): boolean {
    return this.deploymentState === DeploymentState.FAILED;
  }

  /**
   * Accessor to determine if service is not deployed
   * @returns {boolean} the dataservice service not deployed state
   */
  public get serviceDeploymentNotDeployed(): boolean {
    return this.deploymentState === DeploymentState.NOT_DEPLOYED;
  }

  /**
   * @returns {DeploymentState} the dataservice Deployment state
   */
  public getServicePublishState(): PublishState {
    return this.virtualization ? this.virtualization.getPublishState() : PublishState.NOT_PUBLISHED;
  }

  /**
   * Accessor to determine if service has not been published
   * @returns {boolean} the dataservice service not published state
   */
  public get serviceNotPublished(): boolean {
    return this.getServicePublishState() === PublishState.NOT_PUBLISHED;
  }

  /**
   * Accessor to determine if service submission is active
   * @returns {boolean} the dataservice service submitted active state
   */
  public get serviceSubmitted(): boolean {
    return this.getServicePublishState() === PublishState.SUBMITTED;
  }

  /**
   * Accessor to determine if service configuring is active
   * @returns {boolean} the dataservice service configuring active state
   */
  public get serviceConfiguring(): boolean {
    return this.getServicePublishState() === PublishState.CONFIGURING;
  }

  /**
   * Accessor to determine if service building is active
   * @returns {boolean} the dataservice service building active state
   */
  public get serviceBuilding(): boolean {
    return this.getServicePublishState() === PublishState.BUILDING;
  }

  /**
   * Accessor to determine if service deploying is active
   * @returns {boolean} the dataservice service deploying active state
   */
  public get serviceDeploying(): boolean {
    return this.getServicePublishState() === PublishState.DEPLOYING;
  }

  /**
   * Accessor to determine if service has been published
   * @returns {boolean} the dataservice service published state
   */
  public get servicePublished(): boolean {
    return this.getServicePublishState() === PublishState.PUBLISHED;
  }

  /**
   * Accessor to determine if service has failed publishing
   * @returns {boolean} the dataservice service publishing failed state
   */
  public get servicePublishFailed(): boolean {
    return this.getServicePublishState() === PublishState.FAILED;
  }

  /**
   * Accessor to return the root of the odata url, ie.
   * http://HOST/odata4/vdbName/
   *
   * @returns {string} the odata url for this dataaservice
   */
  public getOdataRootUrl(): string {
    if (! this.servicePublished || ! this.virtualization) {
      return null;
    }

    let route: VirtRoute = this.virtualization.getOdataRoute();
    if (route == null) {
      return null;
    }

    let proto = 'http';
    if (route.isSecure())
      proto = proto + 's';

    return proto + '://' + route.getHost() + '/' + DataservicesConstants.ODATA_VERSION + '/' + this.getServiceVdbName();
  }

  /**
   * @param {string} id the dataservice identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} description the dataservice description (optional)
   */
  public setDescription( description?: string ): void {
    this.tko__description = description ? description : null;
  }

  /**
   * @param {string} name the dataservice service vdb name
   */
  public setServiceVdbName( name: string ): void {
    this.serviceVdbName = name;
  }

  /**
   * @param {string} version the dataservice service vdb version
   */
  public setServiceVdbVersion( version: string ): void {
    this.serviceVdbVersion = version;
  }

  /**
   * @param {string[]} viewNames the dataservice view names
   */
  public setServiceViewNames( viewNames: string[] ): void {
    this.serviceViews = viewNames;
  }

  /**
   * @param {string} viewModel the dataservice view model
   */
  public setServiceViewModel( viewModel: string ): void {
    this.serviceViewModel = viewModel;
  }

  /**
   * @param {string[]} viewTables the dataservice view tables
   */
  public setServiceViewTables( viewTables: string[] ): void {
    this.serviceViewTables = viewTables;
  }

  /**
   * @param {DeploymentState} state the dataservice deployment state
   */
  public setServiceDeploymentState( state: DeploymentState ): void {
    this.deploymentState = state;
  }

  /**
   * @param {Virtualization} state the dataservice virtualization
   */
  public setServiceVirtualization( state: Virtualization ): void {
    this.virtualization = state ? state : null;
  }

  // overrides toJSON - we do not want the appSettings
  public toJSON(): {} {
    return {
      keng__id: this.keng__id,
      tko__description: this.tko__description,
      serviceVdbName: this.serviceVdbName,
      serviceVdbVersion: this.serviceVdbVersion,
      serviceViews: this.serviceViews,
      serviceViewModel: this.serviceViewModel,
      serviceViewTables: this.serviceViewTables
    };
  }

  /**
   * Set all object values using the supplied Dataservice json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
