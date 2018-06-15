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
import { View } from "@dataservices/shared/view.model";
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

@Component({
  moduleId: module.id,
  selector: "app-dataservices",
  templateUrl: "./dataservices.component.html",
  styleUrls: ["./dataservices.component.css"]
})
export class DataservicesComponent extends AbstractPageComponent implements OnInit {

  public readonly exportInProgressHeader: string = "Publishing:  ";
  public readonly exportSuccessHeader: string = "Publishing Begun:  ";
  public readonly exportFailedHeader: string = "Publishing Failed:  ";
  public readonly connectionsLoadedTag = "connections";

  public readonly downloadSuccessHeader: string = "Download Succeeded:  ";
  public readonly downloadFailedHeader: string = "Download Failed:  ";

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
  private exportNotificationHeader: string;
  private exportNotificationMessage: string;
  private exportNotificationType = NotificationType.SUCCESS;
  private exportNotificationVisible = false;
  private dataserviceDeployStateSubscription: Subscription;
  private dataservicePublishStateSubscription: Subscription;
  private notifierService: NotifierService;
  private selectedSvcViews: View[] = [];
  private allSvcViews: View[] = [];
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
   * @returns {boolean} true if dataservice export notification is to be shown
   */
  public get showExportNotification(): boolean {
    return this.exportNotificationVisible;
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
   * Accessor for all available service views
   */
  public get allServiceViews( ): View[] {
    return this.allSvcViews;
  }

  /**
   * Accessor for selected service view
   */
  public get selectedViews( ): View[] {
    return this.selectedSvcViews;
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

  public onCloseExportNotification(): void {
    this.exportNotificationVisible = false;
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
    this.dataserviceService.setSelectedDataservice(selectedService);
    this.allSvcViews = this.dataserviceService.getSelectedDataserviceViews();
    this.selectedSvcViews = [];
    this.selectedSvcViews.push(this.allServiceViews[0]);

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

      this.exportNotificationHeader = this.exportInProgressHeader;
      this.exportNotificationMessage = "Downloading " + svcName + "...";
      this.exportNotificationType = NotificationType.INFO;
      this.exportNotificationVisible = true;
      this.logger.debug("[DataservicesPageComponent] Downloading Dataservice: " + svcName);
      const self = this;
      this.dataserviceService
        .downloadDataservice(svcName)
        .subscribe(
          (wasSuccess) => {
            self.exportNotificationHeader = this.downloadSuccessHeader;
            self.exportNotificationMessage = "   " + svcName + " was downloaded successfully!";
            self.exportNotificationType = NotificationType.SUCCESS;
            this.logger.debug("[DataservicesPageComponent] Download Dataservice was successful");
          },
          (error) => {
            self.exportNotificationHeader = this.downloadFailedHeader;
            self.exportNotificationMessage = "   Failed to download dataservice " + svcName;
            self.exportNotificationType = NotificationType.DANGER;
            this.logger.error("[DataservicesPageComponent] Download dataservice " + svcName + " failed.");
          }
        );
  }

  public onPublish(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    const virtual: Virtualization = new Virtualization(selectedService.getServiceVdbName(), PublishState.SUBMITTED);
    selectedService.setServiceVirtualization(virtual);
    this.closeLookPanels();

    this.exportNotificationHeader = this.exportInProgressHeader;
    this.exportNotificationMessage = "Publishing " + svcName + "...";
    this.exportNotificationType = NotificationType.INFO;
    this.exportNotificationVisible = true;
    this.logger.debug("[DataservicesPageComponent] Publishing Dataservice: " + svcName);
    const self = this;
    this.dataserviceService
      .publishDataservice(svcName)
      .subscribe(
        (status) => {
          self.exportNotificationHeader = this.exportSuccessHeader;
          self.exportNotificationMessage = "   " + svcName + " publishing successfully initiated.";
          self.exportNotificationType = NotificationType.INFO;
          this.logger.debug("[DataservicesPageComponent] Initiated publishing of dataservice");
        },
        (error) => {
          self.exportNotificationHeader = this.exportFailedHeader;
          self.exportNotificationMessage = "   Failed to publish dataservice " + svcName + ".";
          self.exportNotificationType = NotificationType.DANGER;
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
   * Handle request for new Dataservice
   */
  public onNew(): void {
    this.selectionService.setSelectedVirtualization(null);

    const link: string[] = [ DataservicesConstants.virtualizationPath ];
    this.logger.debug("[DataservicesPageComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /**
   * Handle Edit of the specified Dataservice
   * @param {string} svcName
   */
  public onEdit(svcName: string): void {
    const selectedService =  this.filteredDataservices.find((x) => x.getId() === svcName);
    this.dataserviceService.setSelectedDataservice(selectedService);

    this.closeLookPanels();

    // Sets the selected dataservice and edit mode before transferring
    this.selectionService.setSelectedVirtualization(selectedService);

    const link: string[] = [ DataservicesConstants.virtualizationPath ];
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
    this.dataserviceService.setSelectedDataservice(selectedService);
    this.allSvcViews = this.dataserviceService.getSelectedDataserviceViews();
    this.selectedSvcViews = [];
    this.selectedSvcViews.push(this.allServiceViews[0]);
    const viewName = this.selectedSvcViews[0].getName();
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
    this.dataserviceService.setSelectedDataservice(selectedService);

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
    } else if (filter.field.id === "view") {
      match = item.getViews() === filter.value;
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
