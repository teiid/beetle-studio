import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { LoggerService } from "@core/logger.service";
import { ConnectionSchemaTreeComponent } from "@dataservices/connection-schema-tree/connection-schema-tree.component";
import { SelectedNodesListComponent } from "@dataservices/selected-nodes-list/selected-nodes-list.component";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { WizardService } from "@dataservices/shared/wizard.service";
import { LoadingState } from "@shared/loading-state.enum";

@Component({
  selector: "app-connection-node-selector",
  templateUrl: "./connection-node-selector.component.html",
  styleUrls: ["./connection-node-selector.component.css"]
})
export class ConnectionNodeSelectorComponent implements OnInit {

  @ViewChild(SelectedNodesListComponent) public selectedNodesList: SelectedNodesListComponent;
  @ViewChild(ConnectionSchemaTreeComponent) public connectionSchemaTree: ConnectionSchemaTreeComponent;
  @Output() public selectedNodeListUpdated: EventEmitter<void> = new EventEmitter<void>();

  private selectedTreeNode: SchemaNode = null;
  private connectionService: ConnectionService;
  private logger: LoggerService;
  private wizardService: WizardService;
  private connections: Connection[] = [];
  private connectionLoadingState: LoadingState = LoadingState.LOADING;

  constructor( connectionService: ConnectionService,
               logger: LoggerService,
               wizardService: WizardService ) {
    this.wizardService = wizardService;
    this.connectionService = connectionService;
    this.logger = logger;
  }

  public ngOnInit(): void {
    // Load the connections
    this.connectionLoadingState = LoadingState.LOADING;
    const self = this;
    this.connectionService
      .getConnections(true, true)
      .subscribe(
        (connectionSummaries) => {
          const conns = [];
          const treeNodes = [];
          for ( const connectionSummary of connectionSummaries ) {
            const connStatus = connectionSummary.getStatus();
            const conn = connectionSummary.getConnection();
            conn.setStatus(connStatus);
            conns.push(conn);
            // Add active connection to tree root nodes
            if (conn.isActive) {
              const node = new SchemaNode();
              node.setName(conn.getId());
              node.setType(ConnectionsConstants.schemaNodeType_connection);
              node.setHasChildren(true);
              treeNodes.push(node);
            }
          }
          self.connections = conns;
          self.connectionSchemaTree.setTreeRoots(treeNodes);
          self.connectionLoadingState = LoadingState.LOADED_VALID;
          if (self.wizardService.isEdit()) {
            self.initEdit();
          }
        },
        (error) => {
          self.logger.error("[ConnectionSchemaTreeComponent] Error getting connections: %o", error);
          self.connectionLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  /**
   * selector is valid if at least one node is selected.
   * @returns {boolean} the selector status (true if one or more nodes selected)
   */
  public valid( ): boolean {
    return this.getSelectedNodes().length > 0;
  }

  /*
   * Return all currently selected Nodes
   * @returns {SchemaNode[]} the list of selected connection Nodes
   */
  public getSelectedNodes(): SchemaNode[] {
    return this.wizardService.getSelectedSchemaNodes();
  }

  public onTreeNodeSelected( $event: SchemaNode ): void {
    this.selectedTreeNode = $event;
  }

  public onTreeNodeDeselected( $event: SchemaNode ): void {
    this.selectedTreeNode = null;
  }

  public onAddSourceNodeClicked( ): void {
    this.wizardService.addToSelectedSchemaNodes(this.selectedTreeNode);
    this.selectedNodesList.setNodes(this.wizardService.getSelectedSchemaNodes());
    this.selectedNodeListUpdated.emit();
  }

  public onSourceNodeRemoved( node: SchemaNode ): void {
    this.wizardService.removeFromSelectedSchemaNodes(node);
    this.selectedNodesList.setNodes(this.wizardService.getSelectedSchemaNodes());
    this.selectedNodeListUpdated.emit();
  }

  public get enableAddArrow(): boolean {
    // Enable the add arrow if (1) a queryable node is selected and (2) it's not already in the selected list
    return this.selectedNodeIsQueryable && !this.selectedNodesList.hasNode(this.selectedTreeNode);
  }

  public getConnectionsForSelectedNodes(): Connection[] {
    // Get array of unique connections
    const uniqueConnNames: string[] = [];
    const resultConns: Connection[] = [];
    for (const node of this.getSelectedNodes()) {
      const connName = node.getConnectionName();
      // If new name, add it to array.  Add corresponding connection
      if (uniqueConnNames.indexOf(connName) === -1) {
        uniqueConnNames.push(connName);
        for (const conn of this.connections) {
          if (conn.getId() === connName) {
            resultConns.push(conn);
            break;
          }
        }
      }
    }

    return resultConns;
  }

  /**
   * Is a node currently selected, and is it queryable
   */
  private get selectedNodeIsQueryable(): boolean {
    return (this.selectedTreeNode && this.selectedTreeNode !== null && this.selectedTreeNode.isQueryable());
  }

  /**
   * Initialization for edit mode
   */
  private initEdit(): void {
    // Get available connection names from tree
    const connNames: string[] = [];
    for (const conn of this.connections) {
      connNames.push(conn.getId());
    }

    // Initialize the selected source nodes in the wizard service
    this.wizardService.clearSelectedSchemaNodes();
    const srcTables: string[] = this.wizardService.getSelectedDataservice().getServiceViewTables();
    for ( const tableStr of srcTables ) {
      const subParts = tableStr.split(".");
      const connectionName = subParts[0].replace(VdbsConstants.SCHEMA_VDB_SUFFIX, "");
      const tableName = subParts[1];
      const node: SchemaNode = new SchemaNode();
      node.setName(tableName);
      // The server lowercases the connection name, so look for case insensitive match
      for (const cName of connNames) {
        if (connectionName.toLowerCase() === cName.toLowerCase()) {
          node.setConnectionName(cName);
          break;
        }
      }
      this.wizardService.addToSelectedSchemaNodes(node);
      this.selectedNodesList.setNodes(this.wizardService.getSelectedSchemaNodes());
      this.selectedNodeListUpdated.emit();
    }
  }

}
