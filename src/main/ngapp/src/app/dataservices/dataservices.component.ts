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
import { ActivatedRoute, Router } from "@angular/router";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { SelectionService } from "@core/selection.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { PublishState } from "@dataservices/shared/publish-state.enum";
import { VdbService } from "@dataservices/shared/vdb.service";
import { Virtualization } from "@dataservices/shared/virtualization.model";
import { SqlControlComponent } from "@dataservices/sql-control/sql-control.component";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { ConfirmDialogComponent } from "@shared/confirm-dialog/confirm-dialog.component";
import { LayoutType } from "@shared/layout-type.enum";
import { SortDirection } from "@shared/sort-direction.enum";
import { BsModalService } from "ngx-bootstrap";
import {
  ActionConfig,
  EmptyStateConfig,
  Filter,
  FilterConfig,
  FilterEvent,
  FilterField,
  FilterType,
  NotificationType,
  SortConfig,
  SortEvent,
  SortField
} from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";
import { SqlView } from "@dataservices/shared/sql-view.model";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { CreateVirtualizationDialogComponent } from "@dataservices/create-virtualization-dialog/create-virtualization-dialog.component";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { ViewEditorState } from "@dataservices/shared/view-editor-state.model";
import { NameValue } from "@dataservices/shared/name-value.model";

@Component({
  moduleId: module.id,
  selector: "app-dataservices",
  templateUrl: "./dataservices.component.html",
  styleUrls: ["./dataservices.component.css"]
})
export class DataservicesComponent extends AbstractPageComponent implements OnInit {

  public readonly connectionsLoadedTag = "connections";

  public filterConfig: FilterConfig;
  public filtersText = "";
  public items: Dataservice[];
  public sortConfig: SortConfig;
  public currentSortField: SortField;
  public isAscendingSort = true;

  private connectionsExist = false;
  private noConnectionsConfig: EmptyStateConfig;
  private noDataservicesConfig: EmptyStateConfig;

  private cardListAreaCss = "dataservice-summary-top-area-no-results";
  private resultsAreaCss = "dataservice-summary-bottom-area-no-results";
  private resultsShowing = false;
  private odataEditorShowing = false;
  private quickLookSvcName: string;
  private odataSvcName: string;
  private quickLookQueryText: string;

  private allServices: Dataservice[] = [];
  private connectionService: ConnectionService;
  private filteredServices: Dataservice[] = [];
  private selectedServices: Dataservice[] = [];
  private dataserviceNameForDelete: string;
  private router: Router;
  private appSettingsService: AppSettingsService;
  private dataserviceService: DataserviceService;
  private vdbService: VdbService;
  private sortDirection: SortDirection = SortDirection.ASC;
  private toastNotificationHeader: string;
  private toastNotificationMessage: string;
  private toastNotificationType = NotificationType.SUCCESS;
  private toastNotificationVisible = false;
  private dataserviceDeployStateSubscription: Subscription;
  private dataservicePublishStateSubscription: Subscription;
  private notifierService: NotifierService;
  private selectedSvcViewNames: SqlView[] = [];
  private allSvcViewNames: SqlView[] = [];
  private modalService: BsModalService;
  private selectionService: SelectionService;

  @ViewChild(SqlControlComponent) private sqlControlComponent: SqlControlComponent;

  constructor(router: Router, route: ActivatedRoute, dataserviceService: DataserviceService,
              logger: LoggerService, appSettingsService: AppSettingsService,
              notifierService: NotifierService, vdbService: VdbService, connectionService: ConnectionService,
              selectionService: SelectionService, modalService: BsModalService) {
    super(route, logger);
    this.router = router;
    this.appSettingsService = appSettingsService;
    this.dataserviceService = dataserviceService;
    this.vdbService = vdbService;
    this.notifierService = notifierService;
    this.modalService = modalService;
    this.selectionService = selectionService;
    // Register for dataservice deployment state changes
    this.dataserviceDeployStateSubscription = this.notifierService.getDataserviceDeployStateMap().subscribe((serviceStateMap) => {
      this.onDataserviceDeploymentStateChanged(serviceStateMap);
    });
    // Register for dataservice state changes
    this.dataservicePublishStateSubscription = this.notifierService.getDataserviceVirtualizationMap().subscribe((serviceStateMap) => {
      this.onDataservicePublishStateChanged(serviceStateMap);
    });
    this.connectionService = connectionService;
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.filterConfig = {
      fields: [{
        id: "name",
        title: "Name",
        placeholder: "Filter by Name...",
        type: FilterType.TEXT
      }, {
        id: "description",
        title: "Description",
        placeholder: "Filter by Description...",
        type: FilterType.TEXT
      }] as FilterField[],
      resultsCount: this.filteredDataservices.length,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: "name",
        title: "Name",
        sortType: "alpha"
      }, {
        id: "description",
        title: "Description",
        sortType: "alpha"
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;
  }

  public get noConnectionsEmptyConfig(): EmptyStateConfig {
    if ( !this.noConnectionsConfig ) {
      const actionConfig = {
        primaryActions: [
          {
            id: "createConnectionActionId",
            title: "Add Connection",
            tooltip: "Add a connection"
          }
        ]
      } as ActionConfig;

      this.noConnectionsConfig = {
        actions: actionConfig,
        iconStyleClass: "pficon-warning-triangle-o",
        info: "No Data virtualizations were found. In order to create a virtualization, you must first create a connection. "
              + "Please click below to create a connection.",
        title: "No Data Virtualizations Available"
      } as EmptyStateConfig;
    }

    return this.noConnectionsConfig;
  }

  public get noDataservicesEmptyConfig(): EmptyStateConfig {
    if ( !this.noDataservicesConfig ) {
      const actionConfig = {
        primaryActions: [
          {
            id: "createDataserviceActionId",
            title: "Add Data Virtualization",
            tooltip: "Add a data virtualization"
          }
        ]
      } as ActionConfig;

      this.noDataservicesConfig = {
        actions: actionConfig,
        iconStyleClass: "pficon-warning-triangle-o",
        info: "No Data virtualizations were found. Please click below to create a virtualization.",
        title: "No Data Virtualizations Available"
      } as EmptyStateConfig;
    }

    return this.noDataservicesConfig;
  }

  public get hasConnections(): boolean {
    return this.isLoaded( this.connectionsLoadedTag ) && this.connectionsExist;
  }

  public onNewConnection(): void {
    this.selectionService.setSelectedConnection(null);

    const link: string[] = [ ConnectionsConstants.addConnectionPath ];
    this.logger.debug( "[DataservicesPageComponent] Navigating to: %o", link );
    this.router.navigate( link ).then(() => {
      // nothing to do
    } );
  }

  public loadAsyncPageData(): void {
    const self = this;
    this.dataserviceService
      .getAllDataservices()
      .subscribe(
        (dataservices) => {
          self.allServices = dataservices;
          self.filteredServices = dataservices;
          self.dataserviceService.updateDataserviceStates();  // trigger refresh in event of new deployment
          self.loaded("dataservices");
        },
        (error) => {
          self.error(error, "Error getting dataservices");
        }
      );

    this.connectionService
      .getConnections(true, false)
      .subscribe(
        ( connectionSummaries ) => {
          const connections = [];
          for ( const connectionSummary of connectionSummaries ) {
            connections.push(connectionSummary.getConnection());
          }
          self.connectionsExist = connections.length !== 0;
          self.loaded( self.connectionsLoadedTag );
        },
        ( error ) => {
          self.error( error, "Error getting connections" );
        }
      );
  }

  public setOdataEditorPanelOpenState(openState: boolean): void {
    if (openState) {
      this.cardListAreaCss = "dataservice-summary-top-area-with-results";
      this.resultsAreaCss = "dataservice-summary-bottom-area-with-results";

      //
      // Make the preview panel and odata panels mutually exclusive
      //
      this.resultsShowing = false;
      this.odataEditorShowing = true;
    } else {
      this.cardListAreaCss = "dataservice-summary-top-area-no-results";
      this.resultsAreaCss = "dataservice-summary-bottom-area-no-results";
      this.odataEditorShowing = false;
    }
  }

  /**
   * Sets the open state of the quick look panel
   * @param {boolean} openState true if quick look panel is to be shown
   */
  public setQuickLookPanelOpenState(openState: boolean): void {
    if (openState) {
      this.cardListAreaCss = "dataservice-summary-top-area-with-results";
      this.resultsAreaCss = "dataservice-summary-bottom-area-with-results";

      //
      // Make the preview panel and odata panels mutually exclusive
      //
      this.odataEditorShowing = false;
      this.resultsShowing = true;
    } else {
      this.cardListAreaCss = "dataservice-summary-top-area-no-results";
      this.resultsAreaCss = "dataservice-summary-bottom-area-no-results";
      this.resultsShowing = false;
    }
  }

  /**
   * Closes both the quick look and odate editor panels
   * if either of them are open
   */
  public closeLookPanels(): void {
    this.setQuickLookPanelOpenState(false);
    this.setOdataEditorPanelOpenState(false);
  }

  /**
   * @returns {boolean} true if dataservice results panel is to be shown
   */
  public get showResults(): boolean {
    return this.resultsShowing;
  }

  /**
   * @returns {boolean} true if dataservice odate editor panel is to be shown
   */
  public get showOdataEditor(): boolean {
    return this.odataEditorShowing;
  }

  /**
   * @returns {boolean} true if dataservice toast notification is to be shown
   */
  public get showToastNotification(): boolean {
    return this.toastNotificationVisible;
  }

  /**
   * @returns {boolean} true if dataservices are being represented by cards
   */
  public get isCardLayout(): boolean {
    return this.appSettingsService.dataservicesPageLayout === LayoutType.CARD;
  }

  /**
   * @returns {boolean} true if dataservices are being represented by items in a list
   */
  public get isListLayout(): boolean {
    return this.appSettingsService.dataservicesPageLayout === LayoutType.LIST;
  }

  /**
   * @returns {boolean} true if sorting dataservice names in ascending order
   */
  public get isSortAscending(): boolean {
    return this.sortDirection === SortDirection.ASC;
  }

  /**
   * @returns {boolean} true if sorting dataservice names in descending order
   */
  public get isSortDescending(): boolean {
    return this.sortDirection === SortDirection.DESC;
  }

  /**
   * @returns {Dataservice[]} the array of all dataservices
   */
  public get allDataservices(): Dataservice[] {
    return this.allServices;
  }

  /**
   * @returns {boolean} 'true' if any dataservices are available
   */
  public get hasDataservices(): boolean {
    return this.allServices.length > 0;
  }

  /**
   * @returns {Dataservice[]} the array of filtered dataservices
   */
  public get filteredDataservices(): Dataservice[] {
    return this.filteredServices;
  }

  /**
   * @returns {Dataservice[]} the array of selected dataservices
   */
  public get selectedDataservices(): Dataservice[] {
    return this.selectedServices;
  }

  /**
   * Accessor for all available service view names
   */
  public get allServiceViewNames( ): SqlView[] {
    return this.allSvcViewNames;
  }

  /**
   * Accessor for selected service view names
   */
  public get selectedViewNames( ): SqlView[] {
    return this.selectedSvcViewNames;
  }

  /**
   * @returns {string} the odata service name
   */
  public get odataServiceName(): string {
    return this.odataSvcName;
  }

  /**
   * @returns {string} the quick look service name
   */
  public get quickLookServiceName(): string {
    return this.quickLookSvcName;
  }

  /**
   * @returns {string} the quick look service name
   */
  public get quickLookSql(): string {
    return this.quickLookQueryText;
  }

  public onSelected(dataservice: Dataservice): void {
    // Only allow one item to be selected
    this.selectedServices.shift();
    this.selectedServices.push(dataservice);
  }

  public onDeselected(dataservice: Dataservice): void {
    // Only one item is selected at a time
    this.selectedServices.shift();
    // this.selectedServices.splice(this.selectedServices.indexOf(dataservice), 1);
  }

  public onActivate(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    selectedService.setServiceDeploymentState(DeploymentState.LOADING);

    this.closeLookPanels();

    const self = this;
    // Start the deployment and then redirect to the dataservice summary page
    this.dataserviceService
      .deployDataservice(svcName)
      .subscribe(
        (wasSuccess) => {
          self.dataserviceService.updateDataserviceStates();
        },
        (error) => {
          self.dataserviceService.updateDataserviceStates();
        }
      );
  }

  public onTest(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    this.selectionService.setSelectedVirtualization(selectedService);
    this.allSvcViewNames = this.selectionService.getSelectedVirtualizationViewNames();
    this.selectedSvcViewNames = [];
    this.selectedSvcViewNames.push(this.allServiceViewNames[0]);

    this.closeLookPanels();

    const link: string[] = [ DataservicesConstants.testDataservicePath ];
    this.logger.debug("[DataservicesPageComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /**
   * Handle Download of the specified Dataservice
   * @param {string} svcName
   */
  public onDownload(svcName: string): void {
      this.closeLookPanels();

      this.setToastNotification(Toast.Type.Download, Toast.State.InProgress, svcName);
      this.toastNotificationVisible = true;
      this.logger.debug("[DataservicesPageComponent] Downloading Dataservice: " + svcName);
      const self = this;
      this.dataserviceService
        .downloadDataservice(svcName)
        .subscribe(
          (wasSuccess) => {
            self.setToastNotification(Toast.Type.Download, Toast.State.Successful, svcName);
            // Dismiss toast notification after 8 sec
            setTimeout(() => self.toastNotificationVisible = false, 8000);
            this.logger.debug("[DataservicesPageComponent] Download Dataservice was successful");
          },
          (error) => {
            self.setToastNotification(Toast.Type.Download, Toast.State.Failed, svcName);
            // Dismiss toast notification after 8 sec
            setTimeout(() => self.toastNotificationVisible = false, 8000);
            this.logger.error("[DataservicesPageComponent] Download dataservice " + svcName + " failed.");
          }
        );
  }

  /**
   * Set the toast notification details based on state and type.
   * @param {Toast.Type} type the type of toast message (Toast.Type.xyz)
   * @param {Toast.State} state the state of the progress (Toast.State.xyz)
   * @param {string} virtualizationName the name of the virtualization
   */
  private setToastNotification( type: Toast.Type, state: Toast.State, virtualizationName: string ): void {
    // Set InProgress Toast details
    if ( state === Toast.State.InProgress ) {
      this.toastNotificationType = NotificationType.INFO;
      if ( type === Toast.Type.Download ) {
        this.toastNotificationHeader = "Downloading: ";
        this.toastNotificationMessage = "Downloading " + virtualizationName + "...";
      } else if ( type === Toast.Type.Publish ) {
        this.toastNotificationHeader = "Publishing: ";
        this.toastNotificationMessage = "Publishing " + virtualizationName + "...";
      } else if ( type === Toast.Type.NewVirtualization ) {
        this.toastNotificationHeader = "Creating: ";
        this.toastNotificationMessage = "Creating " + virtualizationName + "...";
      }
      // Set Successful Toast details
    } else if ( state === Toast.State.Successful ) {
      this.toastNotificationType = NotificationType.SUCCESS;
      if ( type === Toast.Type.Download ) {
        this.toastNotificationHeader = "Download Succeeded:  ";
        this.toastNotificationMessage = "   " + virtualizationName + " was downloaded successfully!";
      } else if ( type === Toast.Type.Publish ) {
        this.toastNotificationHeader = "Publishing Started:  ";
        this.toastNotificationMessage = "   " + virtualizationName + " publishing successfully initiated.";
      } else if ( type === Toast.Type.NewVirtualization ) {
        this.toastNotificationHeader = "Create Succeeded:  ";
        this.toastNotificationMessage = "   " + virtualizationName + " was created successfully!";
      }
      // Set Failed Toast details
    } else if ( state === Toast.State.Failed ) {
      this.toastNotificationType = NotificationType.DANGER;
      if ( type === Toast.Type.Download ) {
        this.toastNotificationHeader = "Download Failed:  ";
        this.toastNotificationMessage = "   Failed to download dataservice " + virtualizationName;
      } else if ( type === Toast.Type.Publish ) {
        this.toastNotificationHeader = "Publishing Failed:  ";
        this.toastNotificationMessage = "   Failed to publish dataservice " + virtualizationName + ".";
      } else if ( type === Toast.Type.NewVirtualization ) {
        this.toastNotificationHeader = "Create Failed:  ";
        this.toastNotificationMessage = "   Failed to create dataservice " + virtualizationName;
      }
    }
  }

  public onPublish(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    const virtual: Virtualization = new Virtualization(selectedService.getServiceVdbName(), PublishState.SUBMITTED);
    selectedService.setServiceVirtualization(virtual);
    this.closeLookPanels();

    this.setToastNotification(Toast.Type.Publish, Toast.State.InProgress, svcName);
    this.toastNotificationVisible = true;
    this.logger.debug("[DataservicesPageComponent] Publishing Dataservice: " + svcName);
    const self = this;
    this.dataserviceService
      .publishDataservice(svcName)
      .subscribe(
        (status) => {
          self.setToastNotification(Toast.Type.Publish, Toast.State.Successful, svcName);
          // Dismiss toast notification after 8 sec
          setTimeout(() => self.toastNotificationVisible = false, 8000);
          this.logger.debug("[DataservicesPageComponent] Initiated publishing of dataservice");
        },
        (error) => {
          self.setToastNotification(Toast.Type.Publish, Toast.State.Failed, svcName);
          // Dismiss toast notification after 8 sec
          setTimeout(() => self.toastNotificationVisible = false, 8000);
          this.logger.error("[DataservicesPageComponent] Publish dataservice " + svcName + " failed.");
        }
      );
  }

  /**
   * Handle Delete of the specified Dataservice
   * @param {string} svcName
   */
  public onDelete(svcName: string): void {
    this.closeLookPanels();

    this.dataserviceNameForDelete = svcName;

    // Dialog Content
    const message = "Do you really want to delete Virtualization '" + svcName + "'?";
    const initialState = {
      title: "Confirm Delete",
      bodyContent: message,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete"
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    modalRef.content.confirmAction.take(1).subscribe((value) => {
      this.onDeleteDataservice();
    });
  }

  /**
   * Handle request for new Virtualization
   */
  public onNew(): void {
    // Open New Virtualization dialog
    const initialState = {
      title: ViewEditorI18n.createVirtualizationDialogTitle,
      cancelButtonText: ViewEditorI18n.cancelButtonText,
      okButtonText: ViewEditorI18n.okButtonText
    };

    // Show Dialog, act upon confirmation click
    const modalRef = this.modalService.show(CreateVirtualizationDialogComponent, {initialState});
    modalRef.content.okAction.take(1).subscribe((dialogResult) => {

      // Create the new virtualization and view.
      const virtName  = dialogResult.getVirtualizationName();
      const virtDescr = dialogResult.getVirtualizationDescription();
      const viewName  = dialogResult.getViewName();
      const viewDescr = dialogResult.getViewDescription();
      const viewDefn = new ViewDefinition();
      viewDefn.setName(viewName);
      viewDefn.setDescription(viewDescr);

      // Display Toast notification
      this.setToastNotification(Toast.Type.NewVirtualization, Toast.State.InProgress, virtName);
      this.toastNotificationVisible = true;

      // Create the new virtualization
      const newVirtualization = this.dataserviceService.newDataserviceInstance(virtName, virtDescr);
      const self = this;
      this.dataserviceService
        .createDataservice(newVirtualization)
        .subscribe(
          (wasSuccess) => {
            // Set the current virtualization to the newly created virtualization
            self.selectVirtualizationCreateView(virtName, viewDefn);
          },
          (error) => {
            self.logger.error("[VirtualizationComponent] Error creating virtualization: %o", error);
            // Display Toast notification
            self.setToastNotification(Toast.Type.NewVirtualization, Toast.State.Failed, virtName);
            // Dismiss toast notification after 8 sec
            setTimeout(() => self.toastNotificationVisible = false, 8000);
          }
        );

    });

  }

  /*
   * Select the specified Dataservice.  create a starter view under it
   * @param {string} dsName the name of the dataservice
   * @param {string} viewDefn the view definition to create
   */
  private selectVirtualizationCreateView(virtName: string, viewDefn: ViewDefinition): void {
    const self = this;
    this.dataserviceService
      .getAllDataservices()
      .subscribe(
        (dataservices) => {
          for (const ds of dataservices) {
            if (ds.getId() === virtName) {
              self.selectionService.setSelectedVirtualization(ds);
              self.createView(ds, viewDefn);
            }
          }
        },
        (error) => {
          self.logger.error("[VirtualizationComponent] Error selecting the virtualization: %o", error);
          // Display Toast notification
          self.setToastNotification(Toast.Type.NewVirtualization, Toast.State.Failed, virtName);
          // Dismiss toast notification after 8 sec
          setTimeout(() => self.toastNotificationVisible = false, 8000);
        }
      );
  }

  private createView(dataservice: Dataservice, viewDefn: ViewDefinition): void {
    const selectedDs = this.selectionService.getSelectedVirtualization();
    let editorId = "";
    if ( selectedDs || selectedDs !== null ) {
      editorId = this.getEditorStateId(selectedDs, viewDefn);
    }

    // Create new editor state to save
    const editorState = new ViewEditorState();
    editorState.setId(editorId);
    editorState.setViewDefinition(viewDefn);

    const virtName = selectedDs.getId();
    const self = this;
    this.dataserviceService
      .saveViewEditorStateRefreshViews(editorState, selectedDs.getId())
      .subscribe(
        (wasSuccess) => {
          // Dismiss toast since navigating away
          self.toastNotificationVisible = false;

          // transfer control to the viewEditor
          const link: string[] = [ DataservicesConstants.viewPath ];
          this.logger.debug("[DataservicesPageComponent] Navigating to: %o", link);
          this.router.navigate(link).then(() => {
            // nothing to do
          });
        },
        (error) => {
          self.logger.error("[VirtualizationComponent] Error saving the editor state: %o", error);
          // Display Toast notification
          self.setToastNotification(Toast.Type.NewVirtualization, Toast.State.Failed, virtName);
          // Dismiss toast notification after 8 sec
          setTimeout(() => self.toastNotificationVisible = false, 8000);
        }
      );
  }

  /**
   * Construct id for the editor state
   * @param {Dataservice} dataservice the dataservice
   * @param {ViewDefinition} viewDefn the view definition
   * @returns {string} the ID used to persist the editor state
   */
  private getEditorStateId(dataservice: Dataservice, viewDefn: ViewDefinition): string {
    return dataservice.getServiceVdbName().toLowerCase() + "." + viewDefn.getName();
  }

  /**
   * Handle Edit of the specified Dataservice and View
   * @param {string} svcName
   */
  public onEdit(svcNameView: NameValue): void {
    const virtName = svcNameView.getName();
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === virtName);
    this.selectionService.setSelectedVirtualization(selectedService);

    const viewName = svcNameView.getValue();
    let viewDefn: ViewDefinition = null;
    if (viewName && viewName !== null) {
      viewDefn = new ViewDefinition();
      viewDefn.setName(viewName);
    }
    this.selectionService.setSelectedViewDefinition(selectedService, viewDefn);

    this.closeLookPanels();

    const link: string[] = [ DataservicesConstants.viewPath ];
    this.logger.debug("[DataservicesPageComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /*
   * Handle showing the QuickLook panel for the specified Dataservice
   */
  public onQuickLook(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    this.selectionService.setSelectedVirtualization(selectedService);
    this.allSvcViewNames = this.selectionService.getSelectedVirtualizationViewNames();
    this.selectedSvcViewNames = [];
    this.selectedSvcViewNames.push(this.allServiceViewNames[0]);
    const viewName = this.selectedSvcViewNames[0];
    this.quickLookQueryText = "SELECT * FROM " + viewName + ";";

    if (!this.resultsShowing) {
      this.setQuickLookPanelOpenState(true);
    }
    this.setQuickLookResults(svcName);

    //
    // Not available until opened
    //
    if (this.sqlControlComponent) {
      this.sqlControlComponent.queryText = this.quickLookQueryText;
      this.sqlControlComponent.submitCurrentQuery();
    }
  }

  /*
   * Handle showing the Odata QuickLook panel for the specified Dataservice
   */
  public onOdataLook(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    this.selectionService.setSelectedVirtualization(selectedService);

    if (!this.odataEditorShowing) {
      this.setOdataEditorPanelOpenState(true);
    }

    this.setOdataServiceName(svcName);
  }

  /**
   * Set the layout to list type
   */
  public setListLayout(): void {
    this.closeLookPanels();
    this.appSettingsService.dataservicesPageLayout = LayoutType.LIST;
  }

  /**
   * Set the layout to card type
   */
  public setCardLayout(): void {
    this.closeLookPanels();
    this.appSettingsService.dataservicesPageLayout = LayoutType.CARD;
  }

  /**
   * Called to doDelete all selected APIs.
   */
  public onDeleteDataservice(): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === this.dataserviceNameForDelete);

    // const itemsToDelete: Dataservice[] = ArrayUtils.intersect(this.selectedServices, this.filteredServices);
    // const selectedService = itemsToDelete[0];

    // Note: we can only doDelete selected items that we can see in the UI.
    this.logger.debug("[DataservicesPageComponent] Deleting selected Dataservice.");
    const self = this;
    this.dataserviceService
      .deleteDataservice(selectedService.getId())
      .subscribe(
        (wasSuccess) => {
          self.undeployVdb(selectedService.getServiceVdbName());
          self.removeDataserviceFromList(selectedService);
        },
        (error) => {
          self.error(error, "Error deleting the dataservice");
        }
      );
  }

  /**
   * Called to submit the quick look query
   */
  public onSubmitQuickLookQuery(): void {
    this.sqlControlComponent.submitCurrentQuery();
  }

  /**
   * Filter functions
   */
  public applyFilters(filters: Filter[]): void {
    this.items = [];
    if (filters && filters.length > 0) {
      this.allDataservices.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.items.push(item);
        }
      });
    } else {
      this.items = this.allDataservices;
    }
    this.filteredServices = this.items;
    this.filterConfig.resultsCount = this.items.length;
  }

  public filterChanged($event: FilterEvent): void {
    this.filtersText = "";
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + " : " + filter.value + "\n";
    });
    this.applyFilters($event.appliedFilters);
  }

  public matchesFilter(item: any, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === "name") {
      match = item.getId().match(filter.value) !== null;
    } else if (filter.field.id === "description") {
      match = item.getDescription().match(filter.value) !== null;
    }
    return match;
  }

  public matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;
    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return matches;
      }
    });
    return matches;
  }

  /**
   * Sort functions
   */
  public compare(item1: any, item2: any): number {
    let compValue = 0;
    if (this.currentSortField.id === "name") {
      compValue = item1.getId().localeCompare(item2.getId());
    } else if (this.currentSortField.id === "description") {
      compValue = item1.getDescription().localeCompare(item2.getDescription());
    }

    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  public sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.filteredServices.sort((item1: any, item2: any) => this.compare(item1, item2));
  }

  /*
   * Undeploy the Vdb with the specified name
   * @param {string} vdbName the name of the Vdb
   */
  private undeployVdb(vdbName: string): void {
    this.vdbService
      .undeployVdb(vdbName)
      .subscribe(
        (wasSuccess) => {
          // nothing to do
        },
        (error) => {
          // nothing to do
        }
      );
  }

  /*
   * Remove the specified Dataservice from the list of dataservices
   */
  private removeDataserviceFromList(dataservice: Dataservice): void {
    this.allServices.splice(this.allServices.indexOf(dataservice), 1);
  }

  /*
   * Update the displayed dataservice deployment states using the provided states
   */
  private onDataserviceDeploymentStateChanged(stateMap: Map<string, DeploymentState>): void {
      // For displayed dataservices, update the Deployment State using supplied services
      for ( const dService of this.filteredDataservices ) {
        const serviceId = dService.getId();
        if (stateMap && stateMap.has(serviceId)) {
          dService.setServiceDeploymentState(stateMap.get(serviceId));
        }
      }
  }

  /*
   * Update the displayed dataservice publish states using the provided states
   */
  private onDataservicePublishStateChanged(stateMap: Map<string, Virtualization>): void {
      // For displayed dataservices, update the Publish State using supplied services
      for ( const dService of this.filteredDataservices ) {
        const serviceId = dService.getId();
        if (stateMap && stateMap.has(serviceId)) {
          dService.setServiceVirtualization(stateMap.get(serviceId));
        }
      }
  }

  /*
   * Update quick look results using the supplied dataservice
   * @param {string} svcName the dataservice name
   */
  private setQuickLookResults(svcName): void {
     this.quickLookSvcName = svcName;
  }

  /*
   * Update odata editor using the supplied dataservice
   * @param {string} svcName the dataservice name
   */
  private setOdataServiceName(svcName): void {
     this.odataSvcName = svcName;
  }
}

/**
 * Internal enums for Toast Notifications
 */
export namespace Toast {
  export enum State {
    InProgress,
    Successful,
    Failed
  }
  export enum Type {
    Download,
    Publish,
    NewVirtualization
  }
}
