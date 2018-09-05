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
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { Connection } from "@connections/shared/connection.model";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { SqlView } from "@dataservices/shared/sql-view.model";

@Injectable()
export class SelectionService {

  private selectedConnection: Connection;
  private selectedVirtualization: Dataservice;
  private selectedViewDefinition: ViewDefinition;
  private connectionForSchemaRegen = "";

  constructor() {
    // nothing to do
  }

  /**
   * Gets the selected virtualization
   * @returns {Dataservice} the selected virtualization
   */
  public getSelectedVirtualization(): Dataservice {
    return this.selectedVirtualization;
  }

  /**
   * Sets the selected dataservice
   * @param {Dataservice} virtualization the selected virtualization
   */
  public setSelectedVirtualization(virtualization: Dataservice): void {
    this.selectedVirtualization = virtualization;
  }

  /**
   * Determine if there is a selected virtualization
   * @returns {boolean} 'true' if a virtualization is selected
   */
  public get hasSelectedVirtualization(): boolean {
    return this.selectedVirtualization && this.selectedVirtualization !== null;
  }

  /**
   * Get the current Virtualization selection's views.View
   * The ViewDefinition name is currently set to the full "modelName"."viewName" of the view.
   * @returns {SqlView[]} the selected Dataservice view definitions
   */
  public getSelectedVirtualizationViewNames( ): SqlView[] {
    if ( !this.hasSelectedVirtualization ) {
      return [];
    }

    const modelName = this.selectedVirtualization.getServiceViewModel();
    const serviceViews = this.selectedVirtualization.getServiceViewNames();

    const allViewNames: SqlView[] = [];
    for ( const serviceView of serviceViews ) {
      allViewNames.push(new SqlView(modelName + "." + serviceView));
    }

    return allViewNames;
  }

  /**
   * Gets the selected connection
   * @returns {Connection} the selected connection
   */
  public getSelectedConnection(): Connection {
    return this.selectedConnection;
  }

  /**
   * Sets the selected connection
   * @param {Connection} connection the selected connection
   */
  public setSelectedConnection(connection: Connection): void {
    this.selectedConnection = connection;
  }

  /**
   * Determine if there is a selected connection
   * @returns {boolean} 'true' if a connection is selected
   */
  public get hasSelectedConnection(): boolean {
    return this.selectedConnection && this.selectedConnection !== null;
  }

  /**
   * Gets the selected view definition
   * @returns {ViewDefinition} the selected view definition
   */
  public getSelectedViewDefinition(): ViewDefinition {
    return this.selectedViewDefinition;
  }

  /**
   * Sets the selected view definition
   * @param {ViewDefinition} view the selected view definition
   */
  public setSelectedViewDefinition(virtualization: Dataservice, viewDefn: ViewDefinition): void {
    this.selectedVirtualization = virtualization;
    this.selectedViewDefinition = viewDefn;
  }

  /**
   * Determine if there is a selected view definition
   * @returns {boolean} 'true' if a view definition is selected
   */
  public get hasSelectedViewDefinition(): boolean {
    return this.selectedViewDefinition && this.selectedViewDefinition !== null;
  }

  /**
   * Determine if has a connection which needs its schema regenerated
   * @returns {boolean} 'true' if there is a connection needing schema regen
   */
  public get hasConnectionForSchemaRegen(): boolean {
    return this.connectionForSchemaRegen && this.connectionForSchemaRegen.length > 0;
  }

  /**
   * Gets the connection id which needs its schema regenerated
   * @returns {string} the connection id needing schema regen
   */
  public getConnectionIdForSchemaRegen(): string {
    return this.connectionForSchemaRegen;
  }

  /**
   * Sets the connection id which needs its schema regenerated
   * @param {string} connectionName the connection id which needs its schema regenerated
   */
  public setConnectionIdForSchemaRegen(connectionName: string): void {
    this.connectionForSchemaRegen = connectionName !== null ? connectionName : "";
  }

}
