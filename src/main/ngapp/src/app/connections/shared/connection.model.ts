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
import { Identifiable } from "@shared/identifiable";
import { SortDirection } from "@shared/sort-direction.enum";

export class Connection implements Identifiable< string > {

  public static descriptionProp = "description";
  public static serviceCatalogSourceProp = "serviceCatalogSource";

  private keng__id: string;
  private dv__jndiName: string;
  private dv__driverName: string;
  private dv__type: boolean;
  private keng__properties: object[] = [];
  private vdbState: DeploymentState = DeploymentState.LOADING;

  /**
   * @param {Object} json the JSON representation of a Connection
   * @returns {Connection} the new Connection (never null)
   */
  public static create( json: object = {} ): Connection {
    const conn = new Connection();
    conn.setValues( json );
    return conn;
  }

  /**
   * @param {Connection[]} connections the connections being sorted
   * @param {SortDirection} sortDirection the sort direction
   */
  public static sort( connections: Connection[],
                      sortDirection: SortDirection ): void {
    connections.sort( ( thisConnection: Connection, thatConnection: Connection ) => {
      const result = thisConnection.compareTo( thatConnection );

      if ( sortDirection === SortDirection.DESC ) {
        return result * -1;
      }

      return result;
    } );
  }

  constructor() {
    // nothing to do
  }

  /**
   * See {Identifiable}.
   */
  public compareTo( that: Connection ): number {
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
   * @returns {string} the connection name
   */
  public get name(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the connection description
   */
  public getDescription(): string {
    let description: string = null;
    for (const propMap of this.keng__properties) {
      if (propMap["name"] === Connection.descriptionProp) {
        description = propMap["value"];
        break;
      }
    }
    return description;
  }

  /**
   * @returns {string} the connection driver name (can be null)
   */
  public getDriverName(): string {
    return this.dv__driverName;
  }

  /**
   * @returns {string} the connection identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the connection JNDI name (can be null)
   */
  public getJndiName(): string {
    return this.dv__jndiName;
  }

  /**
   * @returns {boolean} the jdbc status (true == jdbc)
   */
  public isJdbc(): boolean {
    return this.dv__type;
  }

  /**
   * @returns {string} the service catalog source name
   */
  public getServiceCatalogSourceName(): string {
    let serviceCatalogName: string = null;
    for (const propMap of this.keng__properties) {
      if (propMap["name"] === Connection.serviceCatalogSourceProp) {
        serviceCatalogName = propMap["value"];
        break;
      }
    }
    return serviceCatalogName;
  }

  /**
   * @returns {DeploymentState} the connection VDB Deployment state
   */
  public getVdbDeploymentState(): DeploymentState {
    return this.vdbState;
  }

  /**
   * Accessor to determine if connection VDB deployment is active
   * @returns {boolean} the connection VDB deployment active state
   */
  public get vdbDeploymentActive(): boolean {
    return this.vdbState === DeploymentState.ACTIVE;
  }

  /**
   * Accessor to determine if connection VDB deployment is inactive
   * @returns {boolean} the connection VDB deployment inactive state
   */
  public get vdbDeploymentInactive(): boolean {
    return this.vdbState === DeploymentState.INACTIVE;
  }

  /**
   * Accessor to determine if connection VDB deployment is loading
   * @returns {boolean} the connection VDB deployment loading state
   */
  public get vdbDeploymentLoading(): boolean {
    return this.vdbState === DeploymentState.LOADING;
  }

  /**
   * Accessor to determine if connection VDB deployment is failed
   * @returns {boolean} the connection VDB deployment failed state
   */
  public get vdbDeploymentFailed(): boolean {
    return this.vdbState === DeploymentState.FAILED;
  }

  /**
   * Accessor to determine if connection VDB is not deployed
   * @returns {boolean} the connection VDB not deployed state
   */
  public get vdbDeploymentNotDeployed(): boolean {
    return this.vdbState === DeploymentState.NOT_DEPLOYED;
  }

  /**
   * @param {string} driverName the connection driver name (optional)
   */
  public setDriverName( driverName?: string ): void {
    this.dv__driverName = driverName ? driverName : null;
  }

  /**
   * @param {string} id the connection identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} jndiName the connection JNDI name (optional)
   */
  public setJndiName( jndiName?: string ): void {
    this.dv__jndiName = jndiName ? jndiName : null;
  }

  /**
   * @param {boolean} jdbc the jdbc state
   */
  public setJdbc( jdbc: boolean ): void {
    this.dv__type = jdbc;
  }

  /**
   * @param {string} serviceCatalog the service catalog source name
   */
  public setServiceCatalogSourceName( serviceCatalog: string ): void {
    interface IProp {
      name?: string;
      value?: string;
    }
    const prop: IProp = {};
    prop.name = Connection.serviceCatalogSourceProp;
    prop.value = serviceCatalog;

    this.keng__properties.push(prop);
  }

  /**
   * @param {DeploymentState} state the connecton VDB deployment state
   */
  public setVdbDeploymentState( state: DeploymentState ): void {
    this.vdbState = state;
  }

  /**
   * Set all object values using the supplied Connection json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
