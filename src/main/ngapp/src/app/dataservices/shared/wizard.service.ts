import { Injectable } from "@angular/core";
import { Table } from "@dataservices/shared/table.model";

@Injectable()
export class WizardService {

  private wizardSelectedTablesArray: Table[] = [];

  constructor() {
    // Nothing to do
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

}
