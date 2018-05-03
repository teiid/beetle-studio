import { Injectable } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";

@Injectable()
export class WizardService {

  private static newlyAddedServiceWaitMillis = 10000;  // Wait of 10 sec

  private selectedSchemaNodes: SchemaNode[] = [];
  private edit = false;
  private currentConnections: Connection[] = [];
  private selectedDataservice: Dataservice;
  private selectedConnection: Connection;
  private connectionForSchemaRegen = "";
  private newlyAddedDataservice = "";
  private newlyAddedDataserviceCreateTime = 0;

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
   * Get the wizard node selections
   * @returns {SchemaNode[]} the selections
   */
  public getSelectedSchemaNodes( ): SchemaNode[] {
    const sel = this.selectedSchemaNodes.sort(
      ( thisNode, thatNode ) => {
        return thisNode.getName().localeCompare( thatNode.getName() );
      } );
    return sel;
  }

  /**
   * Clears the list of selected schema nodes
   */
  public clearSelectedSchemaNodes( ): void {
    this.selectedSchemaNodes = [];
  }

  /**
   * Determine if the supplied node is one of the current selections
   * @param {SchemaNode} node the node
   */
  public isSchemaNodeSelected(node: SchemaNode): boolean {
    return this.getSchemaNodeIndex(node) > -1;
  }

  /**
   * Add a node to the currently selected connection node
   * @param {SchemaNode} nodeToAdd node to add
   */
  public addToSelectedSchemaNodes(nodeToAdd: SchemaNode): void {
    if (!this.isSchemaNodeSelected(nodeToAdd)) {
      this.selectedSchemaNodes.push(nodeToAdd);
    }
  }

  /**
   * Remove a node from the currently selected schema nodes
   * @param {SchemaNode} nodeToRemove the node to remove
   * @returns {boolean} true if node was removed
   */
  public removeFromSelectedSchemaNodes(nodeToRemove: SchemaNode): boolean {
    let wasRemoved = false;

    const index = this.getSchemaNodeIndex(nodeToRemove);
    if (index > -1) {
      this.selectedSchemaNodes.splice(index, 1);
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
   * Get name of a newly added dataservice.  If the wait time after create has been exceeded,
   * it is no longer considered a new service.
   * @returns {string} the name of the newly added dataservice
   */
  public getNewlyAddedDataservice(): string {
    // New service not set - just return
    if (this.newlyAddedDataservice.length === 0) {
      return this.newlyAddedDataservice;
    }

    // New service set - check wait time.  If wait time expired, reset name.
    const waitSinceCreate = Date.now() - this.newlyAddedDataserviceCreateTime;
    if (waitSinceCreate > WizardService.newlyAddedServiceWaitMillis) {
      this.newlyAddedDataservice = "";
    }
    return this.newlyAddedDataservice;
  }

  /**
   * Set the name of a newly added service.
   * @param {string} dataserviceName the name of the newly added dataservice
   */
  public setNewlyAddedDataservice(dataserviceName: string): void {
    // If non-empty name, set it the name and the creation time.
    if (dataserviceName !== null && dataserviceName.length > 0) {
      this.newlyAddedDataservice = dataserviceName;
      this.newlyAddedDataserviceCreateTime = Date.now();
    } else {
      this.newlyAddedDataservice = "";
    }
  }

  /**
   * Find index of the node in the selected nodes list.  -1 if not found
   * @param {SchemaNode} node the node
   * @returns {number} the node index
   */
  private getSchemaNodeIndex(node: SchemaNode): number {
    // supplied table and connection
    const nodeName = node.getName();
    // const nodePath = node.getPath();
    let i = 0;
    for (const wizTable of this.selectedSchemaNodes) {
      const wizNodeName = wizTable.getName();
      // const wizNodePath = wizTable.getPath();
      if (wizNodeName === nodeName) {
//        if (wizNodeName === nodeName && wizNodePath === nodePath) {
        return i;
      }
      i++;
    }
    return -1;
  }

}
