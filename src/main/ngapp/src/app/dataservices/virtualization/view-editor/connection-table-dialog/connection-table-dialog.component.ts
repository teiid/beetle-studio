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

import { Component, OnInit, ViewChild } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { ConnectionTreeSelectorComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-tree-selector/connection-tree-selector.component";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { LoadingState } from "@shared/loading-state.enum";
import { ConnectionService } from "@connections/shared/connection.service";
import { LoggerService } from "@core/logger.service";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";

@Component({
  selector: "app-connection-table-dialog",
  templateUrl: "./connection-table-dialog.component.html",
  styleUrls: ["./connection-table-dialog.component.css"]
})
/**
 * ConnectionTable Dialog.  Invoke this from another component as follows:
 *
 *     this.modalRef = this.modalService.show(ConnectionTableDialogComponent, {initialState});
 *     this.modalRef.content.okAction.take(1).subscribe((selectedNodes) => {
 *       // do something with array of selected nodes - selectedNodes - SchemaNode[]
 *     });
 *
 *     The expected initial state is as follows:
 *     const initialState = {
 *       title: "The dialog title",
 *       cancelButtonText: "Text for cancel button",
 *       confirmButtonText: "Text for confirm button"
 *     };
 */
export class ConnectionTableDialogComponent implements OnInit {

  @ViewChild(ConnectionTreeSelectorComponent) public connectionTree: ConnectionTreeSelectorComponent;

  @Output() public okAction = new EventEmitter();

  public readonly title = ViewEditorI18n.connectionTableSelectionDialogTitle;
  public readonly message = ViewEditorI18n.connectionTableSelectionDialogMessage;
  public readonly cancelButtonText = ViewEditorI18n.cancelButtonText;
  public readonly okButtonText = ViewEditorI18n.okButtonText;
  public okButtonEnabled = false;
  public bsModalRef: BsModalRef;
  public selectionText = ViewEditorI18n.noSelection;
  public readonly currentSelectionMsg = ViewEditorI18n.currentSelection;

  private connectionService: ConnectionService;
  private selectedTreeNodes: SchemaNode[] = [];
  private loggerService: LoggerService;
  private connectionLoadingState: LoadingState = LoadingState.LOADING;

  constructor(bsModalRef: BsModalRef, connectionService: ConnectionService, logger: LoggerService) {
    this.bsModalRef = bsModalRef;
    this.connectionService = connectionService;
    this.loggerService = logger;
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
          self.connectionTree.setTreeRoots(treeNodes);
          self.connectionLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.loggerService.error("[ConnectionTableDialogComponent] Error getting connections: %o", error);
          self.connectionLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  /**
   * Handles tree node selection
   * @param {SchemaNode} $event
   */
  public onTreeNodeSelected( $event: SchemaNode ): void {
    const selectedNode = $event;
    if (selectedNode && selectedNode !== null && selectedNode.isQueryable()) {
      this.selectedTreeNodes = [];
      this.selectedTreeNodes.push(selectedNode);
    } else {
      this.selectedTreeNodes = [];
    }
    this.setSelectionTextAndOkButtonEnablement();
  }

  /**
   * Handles tree node de-selection
   * @param {SchemaNode} $event
   */
  public onTreeNodeDeselected( $event: SchemaNode ): void {
    const selectedNode = $event;
    this.selectedTreeNodes = [];
    this.setSelectionTextAndOkButtonEnablement();
  }

  /**
   * OK selected.  The array of selected SchemaNodes is emiited, then modal is closed
   */
  public onOkSelected(): void {
    this.okAction.emit(this.selectedTreeNodes);
    this.bsModalRef.hide();
  }

  /**
   * Cancel selected.  The modal is closed.
   */
  public onCancelSelected(): void {
    this.bsModalRef.hide();
  }

  /**
   * Sets the node selection text and OK button enablement, based upon the selections
   */
  private setSelectionTextAndOkButtonEnablement(): void {
    if (this.selectedTreeNodes.length > 0) {
      this.selectionText = "[" + this.selectedTreeNodes[0].getConnectionName() + "]   " +
                           this.selectedTreeNodes[0].getName();
      this.okButtonEnabled = true;
    } else {
      this.selectionText = "Nothing selected";
      this.okButtonEnabled = false;
    }
  }

}
