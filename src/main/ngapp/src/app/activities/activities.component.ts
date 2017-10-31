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

import { ActivitiesConstants } from "@activities/shared/activities-constants";
import { Activity } from "@activities/shared/activity.model";
import { ActivityService } from "@activities/shared/activity.service";
import { NewActivity } from "@activities/shared/new-activity.model";
import { Component } from "@angular/core";
import { ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { LoggerService } from "@core/logger.service";
import { ArrayUtils } from "@core/utils/array-utils";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { ConfirmDeleteComponent } from "@shared/confirm-delete/confirm-delete.component";
import { IdFilter } from "@shared/id-filter";
import { LayoutType } from "@shared/layout-type.enum";
import { SortDirection } from "@shared/sort-direction.enum";

@Component({
  moduleId: module.id,
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.css"]
})
export class ActivitiesComponent extends AbstractPageComponent {

  public readonly addActivityLink = ActivitiesConstants.addActivityPath;

  private allActs: Activity[] = [];
  private filteredActs: Activity[] = [];
  private selectedActs: Activity[] = [];
  private activityNameForDelete: string;
  private router: Router;
  private activityService: ActivityService;
  private filter: IdFilter = new IdFilter();
  private layout: LayoutType = LayoutType.CARD;
  private sortDirection: SortDirection = SortDirection.ASC;

  @ViewChild(ConfirmDeleteComponent) private confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(router: Router, route: ActivatedRoute, activityService: ActivityService, logger: LoggerService ) {
    super(route, logger);
    this.router = router;
    this.activityService = activityService;
    this.logger = logger;
  }

  public loadAsyncPageData(): void {
    const self = this;

    this.activityService
      .getAllActivities()
      .subscribe(
        (activities) => {
          self.allActs = activities;
          self.filteredActs = this.filterActivities();
          self.loaded("activities");
        },
        (error) => {
          self.logger.error("[ActivitiesComponent] Error getting activities.");
          self.error(error);
        }
      );
  }

  public onSelected(activity: Activity): void {
    // Only allow one item to be selected
    this.selectedActs.shift();
    this.selectedActs.push(activity);
  }

  public onDeselected(activity: Activity): void {
    // Only one item is selected at a time
    this.selectedActs.shift();
    // this.selectedConnections.splice(this.selectedConnections.indexOf(connection), 1);
  }

  public onEdit(activityName: string): void {
    const link: string[] = [ ActivitiesConstants.editActivityPath ];
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  public onDelete(activityName: string): void {
    this.activityNameForDelete = activityName;
    this.confirmDeleteDialog.open();
  }

  public onStart(activityName: string): void {
    alert("Start activity " + activityName);
  }

  public isFiltered(): boolean {
    return this.allActs.length !== this.filteredActs.length;
  }

  public get nameFilter(): string {
    return this.filter.getPattern();
  }

  /**
   * @param {string} pattern the new pattern for the connection name filter (can be null or empty)
   */
  public set nameFilter( pattern: string ) {
    this.filter.setFilter( pattern );
  }

  public toggleSortDirection(): void {
    if (this.sortDirection === SortDirection.ASC) {
      this.sortDirection = SortDirection.DESC;
    } else {
      this.sortDirection = SortDirection.ASC;
    }
    this.filterActivities();
  }

  public clearFilters(): void {
    this.filter.reset();
    this.filterActivities();
  }

  /**
   * @returns {boolean} true if activities are being represented by cards
   */
  public get isCardLayout(): boolean {
    return this.layout === LayoutType.CARD;
  }

  /**
   * @returns {boolean} true if activities are being represented by items in a list
   */
  public get isListLayout(): boolean {
    return this.layout === LayoutType.LIST;
  }

  /**
   * @returns {boolean} true if sorting activity names in ascending order
   */
  public get isSortAscending(): boolean {
    return this.sortDirection === SortDirection.ASC;
  }

  /**
   * @returns {boolean} true if sorting activity names in descending order
   */
  public get isSortDescending(): boolean {
    return this.sortDirection === SortDirection.DESC;
  }

  /**
   * @returns {Activity[]} the array of all activities
   */
  public get allActivities(): Activity[] {
    return this.allActs;
  }

  /**
   * @returns {Activity[]} the array of filtered activities
   */
  public get filteredActivities(): Activity[] {
    return this.filteredActs;
  }

  /**
   * @returns {Activity[]} the array of selected activities
   */
  public get selectedActivities(): Activity[] {
    return this.selectedActs;
  }

  /**
   * Set the layout type to LIST
   */
  public setListLayout(): void {
    this.layout = LayoutType.LIST;
  }

  /**
   * Set the layout type to CARD
   */
  public setCardLayout(): void {
    this.layout = LayoutType.CARD;
  }

  /**
   * Called to doDelete all selected APIs.
   */
  public onDeleteActivity(): void {
    const selectedActivity =  this.filterActivities().find((x) => x.getId() === this.activityNameForDelete);

    const activityToDelete: NewActivity = new NewActivity();
    activityToDelete.setName(selectedActivity.getId());

    // Note: we can only doDelete selected items that we can see in the UI.
    this.logger.log("[ActivitiesPageComponent] Deleting selected Activity.");
    // this.activityService.deleteActivity(activityToDelete);

    const self = this;

    this.activityService
      .deleteActivity(activityToDelete)
      .subscribe(
        () => {
          self.removeActivityFromList(selectedActivity);
          const link: string[] = [ ActivitiesConstants.activitiesRootPath ];
          self.logger.log("[ActivitiesComponent] Navigating to: %o", link);
          self.router.navigate(link).then(() => {
            // nothing to do
          });
        }
      );
  }

  /**
   * Filters and sorts the list of activities based on the user input
   */
  public filterActivities(): Activity[] {
    // Clear the array first.
    this.filteredActs.splice(0, this.filteredActs.length);
    for (const activity of this.allActs) {
      if (this.filter.accepts(activity)) {
        this.filteredActs.push(activity);
      }
    }
    this.filteredActs.sort( (a1: Activity, a2: Activity) => {
      let rval: number = a1.getId().localeCompare(a2.getId());
      if (this.sortDirection === SortDirection.DESC) {
        rval *= -1;
      }
      return rval;
    });

    this.selectedActs = ArrayUtils.intersect(this.selectedActs, this.filteredActs);

    return this.filteredActs;
  }

  private removeActivityFromList(activity: Activity): void {
    this.allActs.splice(this.allActs.indexOf(activity), 1);
    this.filterActivities();
  }
}
