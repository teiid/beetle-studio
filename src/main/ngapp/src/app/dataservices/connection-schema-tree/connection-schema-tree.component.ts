import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ConnectionService } from "@connections/shared/connection.service";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { LoggerService } from "@core/logger.service";
import { TreeNode } from "angular-tree-component/dist/defs/api";

@Component({
  selector: "app-connection-schema-tree",
  templateUrl: "./connection-schema-tree.component.html",
  styleUrls: ["./connection-schema-tree.component.css"]
})
export class ConnectionSchemaTreeComponent implements OnInit {

  @Output() public nodeSelected: EventEmitter<SchemaNode> = new EventEmitter<SchemaNode>();
  @Output() public nodeDeselected: EventEmitter<SchemaNode> = new EventEmitter<SchemaNode>();

  public nodes = [];
  public options;

  private connectionService: ConnectionService;
  private logger: LoggerService;

  constructor( connectionService: ConnectionService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.logger = logger;
  }

  /*
   * Component initialization
   */
  public ngOnInit(): void {
    // Tree Options (specify async loading of root children)
    this.options = {
      // Handles Async Call to get Connection children
      getChildren: this.lazyLoadChildren.bind(this)
    };
  }

  public onEvent(event): void {
    if (event.eventName === "activate") {
      this.nodeSelected.emit(event.node.data);
    } else if (event.eventName === "deactivate") {
      this.nodeDeselected.emit(event.node.data);
    }
  }

  public setTreeRoots( roots: SchemaNode[]): void {
    this.nodes = roots;
  }

  private lazyLoadChildren(node: TreeNode): any {
    return this.connectionService.getConnectionSchema(node.data.name).toPromise();
  }
}
