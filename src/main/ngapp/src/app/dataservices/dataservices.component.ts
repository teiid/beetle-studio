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
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { ArrayUtils } from "@core/utils/array-utils";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { Table } from "@dataservices/shared/table.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { SqlControlComponent } from "@dataservices/sql-control/sql-control.component";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { ConfirmDeleteComponent } from "@shared/confirm-delete/confirm-delete.component";
import { IdFilter } from "@shared/id-filter";
import { LayoutType } from "@shared/layout-type.enum";
import { SortDirection } from "@shared/sort-direction.enum";
import { NotificationType } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";

import { Filter } from "patternfly-ng";
import { FilterConfig } from "patternfly-ng";
import { FilterField } from "patternfly-ng";
import { FilterEvent } from "patternfly-ng";
import { FilterType } from "patternfly-ng";
import { SortConfig } from "patternfly-ng";
import { SortField } from "patternfly-ng";
import { SortEvent } from "patternfly-ng";

@Component({
  moduleId: module.id,
  selector: "app-dataservices",
  templateUrl: "./dataservices.component.html",
  styleUrls: ["./dataservices.component.css"]
})
export class DataservicesComponent extends AbstractPageComponent implements OnInit {

  public readonly exportInProgressHeader: string = "Publishing:  ";
  public readonly exportSuccessHeader: string = "Publish Succeeded:  ";
  public readonly exportFailedHeader: string = "Publish Failed:  ";
  public filterConfig: FilterConfig;
  public filtersText = "";
  public separator: object;
  public allItems: Dataservice[];
  public items: Dataservice[];
  public sortConfig: SortConfig;
  public currentSortField: SortField;
  public isAscendingSort: boolean = true;

  private cardListAreaCss = "dataservice-summary-top-area-no-results";
  private resultsAreaCss = "dataservice-summary-bottom-area-no-results";
  private resultsShowing = false;
  private quickLookSvcName: string;
  private quickLookQueryText: string;

  private allServices: Dataservice[] = [];
  private filteredServices: Dataservice[] = [];
  private selectedServices: Dataservice[] = [];
  private dataserviceNameForDelete: string;
  private router: Router;
  private appSettingsService: AppSettingsService;
  private dataserviceService: DataserviceService;
  private vdbService: VdbService;
  private filter: IdFilter = new IdFilter();
  private sortDirection: SortDirection = SortDirection.ASC;
  private exportNotificationHeader: string;
  private exportNotificationMessage: string;
  private exportNotificationType = NotificationType.SUCCESS;
  private exportNotificationVisible = false;
  private dataserviceStateSubscription: Subscription;
  private notifierService: NotifierService;
  private wizardService: WizardService;
  private selectedSvcViews: Table[] = [];
  private allSvcViews: Table[] = [];

  @ViewChild(ConfirmDeleteComponent) private confirmDeleteDialog: ConfirmDeleteComponent;
  @ViewChild(SqlControlComponent) private sqlControlComponent: SqlControlComponent;

  constructor(router: Router, route: ActivatedRoute, dataserviceService: DataserviceService,
              logger: LoggerService, appSettingsService: AppSettingsService, wizardService: WizardService,
              notifierService: NotifierService, vdbService: VdbService ) {
    super(route, logger);
    this.router = router;
    this.appSettingsService = appSettingsService;
    this.dataserviceService = dataserviceService;
    this.vdbService = vdbService;
    this.notifierService = notifierService;
    this.wizardService = wizardService;
    // Register for dataservice state changes
    this.dataserviceStateSubscription = this.notifierService.getDataserviceStateMap().subscribe((serviceStateMap) => {
      this.onDataserviceStateChanged(serviceStateMap);
    });
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
  }

  /**
   * Sets the open state of the quick look panel
   * @param {boolean} openState true if quick look panel is to be shown
   */
  public setQuickLookPanelOpenState(openState: boolean): void {
    if (openState) {
      this.cardListAreaCss = "dataservice-summary-top-area-with-results";
      this.resultsAreaCss = "dataservice-summary-bottom-area-with-results";
      this.resultsShowing = true;
    } else {
      this.cardListAreaCss = "dataservice-summary-top-area-no-results";
      this.resultsAreaCss = "dataservice-summary-bottom-area-no-results";
      this.resultsShowing = false;
    }
  }

  /**
   * @returns {boolean} true if dataservice results panel is to be shown
   */
  public get showResults(): boolean {
    return this.resultsShowing;
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
  public get allServiceViews( ): Table[] {
    return this.allSvcViews;
  }

  /**
   * Accessor for selected service view
   */
  public get selectedViews( ): Table[] {
    return this.selectedSvcViews;
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

    this.setQuickLookPanelOpenState(false);

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

    this.setQuickLookPanelOpenState(false);

    const link: string[] = [ DataservicesConstants.testDataservicePath ];
    this.logger.debug("[DataservicesPageComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  public onPublish(svcName: string): void {
    this.setQuickLookPanelOpenState(false);

    this.exportNotificationHeader = this.exportInProgressHeader;
    this.exportNotificationMessage = "Publishing " + svcName + "...";
    this.exportNotificationType = NotificationType.INFO;
    this.exportNotificationVisible = true;
    this.logger.log("[DataservicesPageComponent] Publishing Dataservice: " + svcName);
    const self = this;
    this.dataserviceService
      .exportDataservice(svcName)
      .subscribe(
        (wasSuccess) => {
          self.exportNotificationHeader = this.exportSuccessHeader;
          self.exportNotificationMessage = "   " + svcName + " was published successfully!";
          self.exportNotificationType = NotificationType.SUCCESS;
          this.logger.log("[DataservicesPageComponent] Publish Dataservice was successful");
        },
        (error) => {
          self.exportNotificationHeader = this.exportFailedHeader;
          self.exportNotificationMessage = "   Failed to publish dataservice " + svcName + "!";
          self.exportNotificationType = NotificationType.DANGER;
          this.logger.log("[DataservicesPageComponent] Publish Dataservice failed.");
        }
      );
  }

  /**
   * Handle Delete of the specified Dataservice
   * @param {string} svcName
   */
  public onDelete(svcName: string): void {
    this.setQuickLookPanelOpenState(false);

    this.dataserviceNameForDelete = svcName;
    this.confirmDeleteDialog.open();
  }

  /**
   * Handle request for new Dataservice
   */
  public onNew(): void {
    this.wizardService.setEdit(false);
    this.wizardService.clearWizardSelectedTables();

    const link: string[] = [ DataservicesConstants.addDataservicePath ];
    this.logger.log("[DataservicesPageComponent] Navigating to: %o", link);
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

    this.setQuickLookPanelOpenState(false);

    // Sets the selected dataservice and edit mode before transferring
    this.wizardService.setSelectedDataservice(selectedService);
    this.wizardService.setEdit(true);

    const link: string[] = [ DataservicesConstants.addDataservicePath ];
    this.logger.log("[DataservicesPageComponent] Navigating to: %o", link);
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
    this.sqlControlComponent.queryText = this.quickLookQueryText;
    this.sqlControlComponent.submitCurrentQuery();
  }

  /**
   * Set the layout to list type
   */
  public setListLayout(): void {
    this.setQuickLookPanelOpenState(false);
    this.appSettingsService.dataservicesPageLayout = LayoutType.LIST;
  }

  /**
   * Set the layout to card type
   */
  public setCardLayout(): void {
    this.setQuickLookPanelOpenState(false);
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
    this.logger.log("[DataservicesPageComponent] Deleting selected Dataservice.");
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
   * Update the displayed dataservice states using the provided states
   */
  private onDataserviceStateChanged(stateMap: Map<string, DeploymentState>): void {
      // For displayed dataservices, update the State using supplied services
      for ( const dService of this.filteredDataservices ) {
        const serviceId = dService.getId();
        if (stateMap && stateMap.has(serviceId)) {
          dService.setServiceDeploymentState(stateMap.get(serviceId));
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

}
