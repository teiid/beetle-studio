import { Injectable } from "@angular/core";
import { ConnectionTable } from "@connections/shared/connection-table.model";
import { Connection } from "@connections/shared/connection.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";

@Injectable()
export class WizardService {

  private selectedConnectionTables: ConnectionTable[] = [];
  private edit = false;
  private currentConnections: Connection[] = [];
  private selectedDataservice: Dataservice;
  private selectedConnection: Connection;
  private connectionForSchemaRegen = "";

  constructor() {
    // Nothing to do
  }

  /**
   * Sets edit mode
   * @param {boolean} isEdit 'true' if editing, 'false' if not.
   */
  public setEdit(isEdit: boolean): void {
    this.edit = isEdit;
  }

  /**
   * Gets the edit mode
   * @returns {boolean} 'true' if editing, 'false' if not.
   */
  public isEdit(): boolean {
    return this.edit;
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
   * Gets the selected dataservice
   * @returns {Dataservice} the selected dataservice
   */
  public getSelectedDataservice(): Dataservice {
    return this.selectedDataservice;
  }

  /**
   * Sets the selected dataservice
   * @param {Dataservice} dataservice the selected dataservice
   */
  public setSelectedDataservice(dataservice: Dataservice): void {
    this.selectedDataservice = dataservice;
  }

  /**
   * Get the wizard table selections
   * @returns {ConnectionTable[]} the selections
   */
  public getSelectedConnectionTables( ): ConnectionTable[] {
    return this.selectedConnectionTables.sort(
      ( thisTable, thatTable ) => {
        return thisTable.getId().localeCompare( thatTable.getId() );
      } );
  }

  /**
   * Clears the list of selected connection tables
   */
  public clearSelectedConnectionTables( ): void {
    this.selectedConnectionTables = [];
  }

  /**
   * Determine if the supplied table is one of the current selections
   * @param {ConnectionTable} table the table
   */
  public isConnectionTableSelected(table: ConnectionTable): boolean {
    return this.getConnectionTableIndex(table) > -1;
  }

  /**
   * Add a table to the currently selected connection tables
   * @param {ConnectionTable} tableToAdd table to add
   */
  public addToSelectedConnectionTables(tableToAdd: ConnectionTable): void {
    if (!this.isConnectionTableSelected(tableToAdd)) {
      this.selectedConnectionTables.push(tableToAdd);
    }
  }

  /**
   * Remove a table from the currently selected connection tables
   * @param {ConnectionTable} tableToRemove
   * @returns {boolean}
   */
  public removeFromSelectedConnectionTables(tableToRemove: ConnectionTable): boolean {
    let wasRemoved = false;

    const index = this.getConnectionTableIndex(tableToRemove);
    if (index > -1) {
      this.selectedConnectionTables.splice(index, 1);
      wasRemoved = true;
    }

    return wasRemoved;
  }

  /**
   * Set the current connections to the supplied array
   * @param {Connection[]} conns the current array of Connections
   */
  public setCurrentConnections(conns: Connection[]): void {
    this.currentConnections = conns;
  }

  /**
   * Get the current connections array
   * @returns {Connection[]} the current connections
   */
  public getCurrentConnections( ): Connection[] {
    return this.currentConnections;
  }

  /**
   * Get the current connection with the supplied name.  If not found, returns null.
   * @returns {Connection} the current connection
   */
  public getCurrentConnection(connName: string): Connection {
    // No connections, return null
    if (!this.currentConnections || this.currentConnections.length === 0) {
      return null;
    }

    // Returns the matching connection, if found.
    return this.currentConnections.find((x) => x.getId() === connName);
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

  /**
   * Find index of the connection table in the wizard selected tables list.  -1 if not found
   * @param {ConnectionTable} table connection table
   * @returns {number}
   */
  private getConnectionTableIndex(table: ConnectionTable): number {
    // supplied table and connection
    const connName = table.getConnection().getId();
    const tableName = table.getId();
    let i = 0;
    for (const wizTable of this.selectedConnectionTables) {
      const wizTableName = wizTable.getId();
      const wizConnName = wizTable.getConnection().getId();
      if (wizTableName === tableName && wizConnName === connName) {
        return i;
      }
      i++;
    }
    return -1;
  }

}
