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

import { addActivityPath, editActivityPath } from "@activities/activities-routing.module";
import { Activity } from "@activities/shared/activity.model";
import { ActivityService } from "@activities/shared/activity.service";
import { NewActivity } from "@activities/shared/new-activity.model";
import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
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
  styleUrls: ["./activities.component.css"],
  providers: [ ActivityService ]
})
export class ActivitiesComponent extends AbstractPageComponent {

  public addActivityLink = addActivityPath;

  private allActivities: Activity[] = [];
  private filteredActivities: Activity[] = [];
  private selectedActivities: Activity[] = [];
  private activityNameForDelete: string;
  private router: Router;
  private activityService: ActivityService;
  private filter: IdFilter = new IdFilter();
  private layout: LayoutType = LayoutType.CARD;
  private sortDirection: SortDirection;

  @ViewChild(ConfirmDeleteComponent) private confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(router: Router, route: ActivatedRoute, activityService: ActivityService) {
    super(route);
    this.router = router;
    this.activityService = activityService;
  }

  public loadAsyncPageData(): void {
    this.allActivities = this.activityService.getAllActivities();
    this.filteredActivities = this.filterActivities();
    this.loaded("activities");
  }

  /**
   * Filters and sorts the list of activities based on the user input
   */
  private filterActivities(): Activity[] {
    // Clear the array first.
    this.filteredActivities.splice(0, this.filteredActivities.length);
    for (const activity of this.allActivities) {
      if (this.filter.accepts(activity)) {
        this.filteredActivities.push(activity);
      }
    }
    this.filteredActivities.sort( (a1: Activity, a2: Activity) => {
      let rval: number = a1.getId().localeCompare(a2.getId());
      if (this.sortDirection === SortDirection.DESC) {
        rval *= -1;
      }
      return rval;
    });

    this.selectedActivities = ArrayUtils.intersect(this.selectedActivities, this.filteredActivities);

    return this.filteredActivities;
  }

  public onSelected(activity: Activity): void {
    // Only allow one item to be selected
    this.selectedActivities.shift();
    this.selectedActivities.push(activity);
  }

  public onDeselected(activity: Activity): void {
    // Only one item is selected at a time
    this.selectedActivities.shift();
    // this.selectedConnections.splice(this.selectedConnections.indexOf(connection), 1);
  }

  public onEdit(activityName: string): void {
    const link: string[] = [ editActivityPath ];
    this.router.navigate(link);
  }

  public onDelete(activityName: string): void {
    this.activityNameForDelete = activityName;
    this.confirmDeleteDialog.open();
  }

  public onStart(activityName: string): void {
    alert("Start activity " + activityName);
  }

  public isFiltered(): boolean {
    return this.allActivities.length !== this.filteredActivities.length;
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
   * @returns {string} the pattern the activity names are being matched to (can be null or empty)
   */
  public get nameFilter(): string {
    return this.filter.getPattern();
  }

  public onListLayout(): void {
    this.layout = LayoutType.LIST;
  }

  public onCardLayout(): void {
    this.layout = LayoutType.CARD;
  }

  /**
   * Called to doDelete all selected APIs.
   */
  public deleteActivity(): void {
    const selectedActivity =  this.filterActivities().find((x) => x.getId() === this.activityNameForDelete);

    const activityToDelete: NewActivity = new NewActivity();
    activityToDelete.setName(selectedActivity.getId());

    // Note: we can only doDelete selected items that we can see in the UI.
    console.log("[ActivitiesPageComponent] Deleting selected Activity.");
    this.activityService.deleteActivity(activityToDelete);
    /*
    this.apiService
      .deleteActivity(activityToDelete)
      .subscribe(
        () => {
          this.removeActivityFromList(selectedActiv);
          const link: string[] = [ '/activities' ];
          console.log('[CreateApiPageComponent] Navigating to: %o', link);
          this.router.navigate(link);
        }
      );
      */
  }

  private removeActivityFromList(activity: Activity): void {
    this.allActivities.splice(this.allActivities.indexOf(activity), 1);
    this.filterActivities();
  }
}
