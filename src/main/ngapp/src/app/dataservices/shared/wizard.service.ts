import { Injectable } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { Table } from "@dataservices/shared/table.model";

@Injectable()
export class WizardService {

  private wizardSelectedTablesArray: Table[] = [];
  private edit = false;
  private currentConnections: Connection[] = [];
  private selectedDataservice: Dataservice;

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

}
