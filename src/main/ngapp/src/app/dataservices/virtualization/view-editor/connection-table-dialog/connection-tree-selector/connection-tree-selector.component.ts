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

import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ConnectionService } from "@connections/shared/connection.service";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { LoggerService } from "@core/logger.service";
import { TreeNode } from "angular-tree-component/dist/defs/api";

@Component({
  selector: "app-connection-tree-selector",
  templateUrl: "./connection-tree-selector.component.html",
  styleUrls: ["./connection-tree-selector.component.css"]
})
/**
 * ConnectionTreeSelector.  This is the tree selector component for selecting connection nodes.
 *
 */
export class ConnectionTreeSelectorComponent implements OnInit {

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
