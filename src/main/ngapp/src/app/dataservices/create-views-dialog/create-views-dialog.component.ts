import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { BsModalRef } from "ngx-bootstrap";
import { ConnectionService } from "@connections/shared/connection.service";
import { LoggerService } from "@core/logger.service";
import { LoadingState } from "@shared/loading-state.enum";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { SchemaNode } from "@connections/shared/schema-node.model";
import {
  EmptyStateConfig,
  ListConfig,
  ListEvent,
  NotificationType,
  TableConfig
} from "patternfly-ng";
import { NewView } from "@dataservices/create-views-dialog/new-view.model";
import { TableEvent } from "patternfly-ng";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { CreateViewsResult } from "@dataservices/create-views-dialog/create-views-result.model";

@Component({
  selector: 'app-create-views-dialog',
  templateUrl: './create-views-dialog.component.html',
  styleUrls: ['./create-views-dialog.component.css']
})
/**
 * CreateViews Dialog.  Invoke this from another component as follows:
 *
 *     this.modalRef = this.modalService.show(CreateViewsDialogComponent, {initialState});
 *     this.modalRef.content.okAction.take(1).subscribe((dialogResult) => {
 *       // do something with dialogResult (CreateViewsResult)
 *     });
 *
 *     The expected initial state is as follows:
 *     const initialState = {
 *       title: "The dialog title",
 *       cancelButtonText: "Text for cancel button",
 *       confirmButtonText: "Text for confirm button"
 *     };
 */
export class CreateViewsDialogComponent implements OnInit {

  @Output() public okAction: EventEmitter<CreateViewsResult> = new EventEmitter<CreateViewsResult>();

  public readonly title = ViewEditorI18n.createViewsDialogNewVirtualizationTitle;
  public readonly message = ViewEditorI18n.createViewsDialogMessage;
  public readonly cancelButtonText = ViewEditorI18n.cancelButtonText;
  public readonly okButtonText = ViewEditorI18n.okButtonText;
  public okButtonEnabled = false;
  public bsModalRef: BsModalRef;
  public connections: SchemaNode[] = [];
  public allViews: NewView[] = [];
  public listConfig: ListConfig;
  public tableColumns: any[] = [];
  public tableConfig: TableConfig;
  public virtNameValidationError = "";
  public virtualizationPropertyForm: FormGroup;
  public readonly connectionsLoadFailedHeader = "Loading Failed: ";
  public readonly connectionsLoadFailedMsg = "Connections failed to load!";
  public readonly connectionsLoadFailedType = NotificationType.DANGER;
  public readonly viewsLoadFailedHeader = "Loading Failed: ";
  public readonly viewsLoadFailedMsg = "Views failed to load!";
  public readonly viewsLoadFailedType = NotificationType.DANGER;

  private connectionService: ConnectionService;
  private dataserviceService: DataserviceService;
  private selectedConnections: SchemaNode[] = [];
  private selectedViews: NewView[] = [];
  private loggerService: LoggerService;
  private connectionsLoadingState: LoadingState = LoadingState.LOADING;
  private viewsLoadingState: LoadingState = LoadingState.LOADED_VALID;
  private emptyStateConfig: EmptyStateConfig;

  constructor(bsModalRef: BsModalRef, dataserviceService: DataserviceService,
              connectionService: ConnectionService, logger: LoggerService) {
    this.bsModalRef = bsModalRef;
    this.connectionService = connectionService;
    this.dataserviceService = dataserviceService;
    this.loggerService = logger;
    this.createPropertyForm();
  }

  public ngOnInit(): void {
    // List configuration
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      showCheckbox: true
    };

    // ----------------------------------
    // View Table configurations
    // ----------------------------------
    this.tableColumns = [
      {
        draggable: false,
        name: "Connection",
        prop: "connection",
        resizeable: true,
        sortable: false,
        width: "100"
      },
      {
        draggable: false,
        name: "View Name",
        prop: "view",
        resizeable: true,
        sortable: false,
        width: "100"
      },
      {
        draggable: false,
        name: "Source Node",
        prop: "path",
        resizeable: true,
        sortable: false,
        width: "100"
      }
    ];

    this.emptyStateConfig = {
      title: ViewEditorI18n.noViewsDisplayedMessage
    } as EmptyStateConfig;

    this.tableConfig = {
      showCheckbox: true,
      emptyStateConfig: this.emptyStateConfig
    } as TableConfig;

    // Init virtualization name and description
    this.virtualizationPropertyForm.controls["virtName"].setValue("");
    this.virtualizationPropertyForm.controls["virtDescription"].setValue("");

    // Load the connections
    this.connectionsLoadingState = LoadingState.LOADING;
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
              node.selected = false;
              this.connections.push(node);
            }
          }
          self.connectionsLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.loggerService.error("[ConnectionTableDialogComponent] Error getting connections: %o", error);
          self.connectionsLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  /*
   * Creates the view property form
   */
  private createPropertyForm(): void {
    this.virtualizationPropertyForm = new FormGroup({
      virtName: new FormControl( "", this.handleVirtNameChanged.bind( this ) ),
      virtDescription: new FormControl(""),
    });
  }

  /**
   * Handler for virtualization name changes.
   * @param {AbstractControl} input
   */
  public handleVirtNameChanged( input: AbstractControl ): void {
    const self = this;

    this.dataserviceService.isValidName( input.value ).subscribe(
      ( errorMsg ) => {
        if ( errorMsg ) {
          // only update if error has changed
          if ( errorMsg !== self.virtNameValidationError ) {
            self.virtNameValidationError = errorMsg;
          }
        } else { // name is valid
          self.virtNameValidationError = "";
        }
        self.setOkButtonEnablement();
      },
      ( error ) => {
        self.loggerService.error( "[handleNameChanged] Error: %o", error );
        self.virtNameValidationError = "Error validating view name";
        self.setOkButtonEnablement();
      } );
  }

  /*
   * Return the virtualization name valid state
   */
  public get virtNameValid(): boolean {
    return this.virtNameValidationError == null || this.virtNameValidationError.length === 0;
  }

  /**
   * Handles change in connection selection
   * @param {ListEvent} $event the list selection event
   */
  public handleConnectionSelectionChange($event: ListEvent): void {
    const newSelections = $event.selectedItems;
    const numberNewSelections = newSelections.length;
    // Find new selection that was added
    if (numberNewSelections > this.selectedConnections.length) {
      newSelections.forEach( ( newConn ) => {
        const index = this.selectedConnections.findIndex( ( conn ) => conn.getName() === newConn.getName() );

        if ( index === -1 ) {
          this.onConnectionSelected(newConn);
        }
      } );
    // Find existing selection that was removed
    } else {
      for (const selectedConn of this.selectedConnections) {
        const index = newSelections.findIndex( ( conn ) => conn.getName() === selectedConn.getName() );

        if ( index === -1 ) {
          this.onConnectionDeselected(selectedConn);
          break;
        }
      }
    }
    this.selectedConnections = newSelections;
  }

  /**
   * Handler for connection selection
   * @param {SchemaNode} conn the connection node
   */
  private onConnectionSelected(conn: SchemaNode): void {
    this.generateConnectionViewInfos(conn.getName());
  }

  /**
   * Handler for connection deselection
   * @param {SchemaNode} conn the connection node
   */
  private onConnectionDeselected(conn: SchemaNode): void {
    let i = this.allViews.length;
    while (i--) {
      if (this.allViews[i].getConnectionName() === conn.getName()) {
        this.allViews.splice(i, 1);
      }
    }
    this.allViews = [...this.allViews];
  }

  /**
   * Handles change in View selections
   * @param {TableEvent} $event the table selection event
   */
  public handleViewSelectionChange($event: TableEvent): void {
    this.selectedViews = $event.selectedRows;
    this.setOkButtonEnablement();
  }

  /**
   * Determine if connections are loading
   * @returns {boolean}
   */
  public get connectionsLoading( ): boolean {
    return ( this.connectionsLoadingState === LoadingState.LOADING );
  }

  /**
   * Determine if connections loading completed, and was successful
   * @returns {boolean}
   */
  public get connectionsLoadedSuccess( ): boolean {
    return ( this.connectionsLoadingState === LoadingState.LOADED_VALID );
  }

  /**
   * Determine if connections loading completed, but failed
   * @returns {boolean}
   */
  public get connectionsLoadedFailed( ): boolean {
    return ( this.connectionsLoadingState === LoadingState.LOADED_INVALID );
  }

  /**
   * Determine if views are loading
   * @returns {boolean}
   */
  public get viewsLoading( ): boolean {
    return ( this.viewsLoadingState === LoadingState.LOADING );
  }

  /**
   * Determine if views loading completed, and was successful
   * @returns {boolean}
   */
  public get viewsLoadedSuccess( ): boolean {
    return ( this.viewsLoadingState === LoadingState.LOADED_VALID );
  }

  /**
   * Determine if views loading completed, but failed
   * @returns {boolean}
   */
  public get viewsLoadedFailed( ): boolean {
    return ( this.viewsLoadingState === LoadingState.LOADED_INVALID );
  }

  /**
   * OK selected.  The array of selected SchemaNodes is emiited, then modal is closed
   */
  public onOkSelected(): void {
    const virtName = this.virtualizationPropertyForm.controls["virtName"].value;
    const virtDescr = this.virtualizationPropertyForm.controls["virtDescription"].value;
    const result = new CreateViewsResult();
    result.setVirtualizationName(virtName);
    result.setVirtualizationDescription(virtDescr);
    result.setViews(this.selectedViews);

    this.bsModalRef.hide();
    this.okAction.emit(result);
  }

  /**
   * Cancel selected.  The modal is closed.
   */
  public onCancelSelected(): void {
    this.bsModalRef.hide();
  }

  /**
   * Sets the OK button enablement, based upon the view selections
   */
  private setOkButtonEnablement(): void {
    if (this.virtNameValid && this.selectedViews.length > 0) {
      this.okButtonEnabled = true;
    } else {
      this.okButtonEnabled = false;
    }
  }

  /**
   * Generate the view infos for the supplied connection name
   * @param {string} connName the connection name
   */
  public generateConnectionViewInfos(connName: string): void {
    // Load the connections
    this.viewsLoadingState = LoadingState.LOADING;
    const self = this;
    this.connectionService
      .getConnectionSchema(connName)
      .subscribe(
        (schemaNodes) => {
          const newViews: NewView[] = [];
          for ( const schemaNode of schemaNodes ) {
            const nodePath: string[] = [];
            self.generateViewInfos(connName, schemaNode, nodePath, newViews);
          }
          for (const newView of newViews) {
            self.allViews.push(newView);
          }
          self.allViews = [...self.allViews];
          self.viewsLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.loggerService.error("[ConnectionTableDialogComponent] Error getting connections: %o", error);
          self.viewsLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  /**
   * Recursively generate the view infos for this node and its children
   * @param {SchemaNode} schemaNode the schema node
   */
  private generateViewInfos(connName: string, schemaNode: SchemaNode, nodePath: string[], viewInfos: NewView[]): void {
    const sourcePath: string[] = [];
    for (const seg of nodePath) {
      sourcePath.push(seg);
    }
    if ( schemaNode.isQueryable() ) {
      const newView: NewView = new NewView();
      newView.setConnectionName(connName);
      newView.setViewSourceNode(schemaNode);
      newView.setNodePath(sourcePath);
      const viewName = connName + "_" + schemaNode.getName();
      newView.setViewName(viewName);
      viewInfos.push(newView);
    }
    sourcePath.push(schemaNode.getName());
    for (const childNode of schemaNode.getChildren()) {
      this.generateViewInfos(connName, childNode, sourcePath, viewInfos);
    }
  }

}
