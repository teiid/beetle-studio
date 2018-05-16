import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SchemaNode } from "@connections/shared/schema-node.model";

@Component({
  selector: "app-selected-nodes-list",
  templateUrl: "./selected-nodes-list.component.html",
  styleUrls: ["./selected-nodes-list.component.css"]
})
export class SelectedNodesListComponent implements OnInit {

  @Output() public selectionListNodeRemoved: EventEmitter<SchemaNode> = new EventEmitter<SchemaNode>();

  private nodes: SchemaNode[] = [];

  constructor() {
    // nothing to do
  }

  public ngOnInit(): void {
    // nothing to do
  }

  public setNodes( nodes: SchemaNode[] ): void {
    this.nodes = nodes;
  }

  public getNodes( ): SchemaNode[] {
    return this.nodes;
  }

  public get hasNodes( ): boolean {
    return this.getNodes().length > 0;
  }

  /**
   * Determine if the list already has the specified node
   * @param {SchemaNode} node
   * @returns {boolean}
   */
  public hasNode( node: SchemaNode ): boolean {
    let hasIt = false;
    for (const listNode of this.nodes) {
      if ( (listNode.getName() === node.getName()) &&
           (listNode.getConnectionName() === node.getConnectionName()) ) {
        hasIt = true;
        break;
      }
    }
    return hasIt;
  }

  public onNodeRemoved( node: SchemaNode ): void {
    this.selectionListNodeRemoved.emit(node);
  }
}
