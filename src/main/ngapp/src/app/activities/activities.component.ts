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

import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Activity } from '@activities/shared/activity.model';
import { NewActivity } from '@activities/shared/new-activity.model';
import { ActivityService } from '@activities/shared/activity.service';
import { ArrayUtils } from '@core/common';
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { ConfirmDeleteComponent } from '@shared/confirm-delete/confirm-delete.component';

class Filters {
  nameFilter: string;
  sortDirection: string;
  layout: string;

  constructor(params?: any) {
    this.reset();
    if (params) {
      for (const key of Object.keys(params)) {
        this[key] = params[ key ];
      }
    }
  }

  public accepts(activity: Activity): boolean {
    const name: string = activity.getId().toLocaleLowerCase();
    const namef: string = this.nameFilter.toLocaleLowerCase();
    return name.indexOf(namef) >= 0;
  }

  public reset(): void {
    this.nameFilter = '';
    this.sortDirection = 'ASC';
    this.layout = 'card';
  }
}

@Component({
  moduleId: module.id,
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  providers: [ ActivityService ]
})
export class ActivitiesComponent extends AbstractPageComponent {

  allActivities: Activity[] = [];
  filteredActivities: Activity[] = [];
  selectedActivities: Activity[] = [];
  filters: Filters = new Filters();
  private activityNameForDelete: string;

  @ViewChild(ConfirmDeleteComponent) confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(private router: Router, route: ActivatedRoute, private activityService: ActivityService) {
    super(route);
  }

  public loadAsyncPageData() {
    this.allActivities = this.activityService.getAllActivities();
    this.filteredActivities = this.filterActivities();
    this.loaded('activities');
  }

  /**
   * Filters and sorts the list of activities based on the user input
   */
  private filterActivities(): Activity[] {
    // Clear the array first.
    this.filteredActivities.splice(0, this.filteredActivities.length);
    for (const activity of this.allActivities) {
      if (this.filters.accepts(activity)) {
        this.filteredActivities.push(activity);
      }
    }
    this.filteredActivities.sort( (a1: Activity, a2: Activity) => {
      let rval: number = a1.getId().localeCompare(a2.getId());
      if (this.filters.sortDirection === 'DESC') {
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
    const link: string[] = [ '/activities/edit-activity' ];
    this.router.navigate(link);
  }

  public onDelete(activityName: string): void {
    this.activityNameForDelete = activityName;
    this.confirmDeleteDialog.open();
  }

  public onStart(activityName: string): void {
    alert('Start activity ' + activityName);
  }

  public isFiltered(): boolean {
    return this.allActivities.length !== this.filteredActivities.length;
  }

  public toggleSortDirection(): void {
    if (this.filters.sortDirection === 'ASC') {
      this.filters.sortDirection = 'DESC';
    } else {
      this.filters.sortDirection = 'ASC';
    }
    this.filterActivities();
  }

  public clearFilters(): void {
    this.filters.nameFilter = '';
    this.filterActivities();
  }

  public onListLayout(): void {
    this.filters.layout = 'list';
  }

  public onCardLayout(): void {
    this.filters.layout = 'card';
  }

  /**
   * Called to delete all selected APIs.
   */
  public deleteActivity(): void {
    const selectedActiv =  this.filterActivities().find(x => x.getId() === this.activityNameForDelete);

    const activityToDelete: NewActivity = new NewActivity();
    activityToDelete.setName(selectedActiv.getId());

    // Note: we can only delete selected items that we can see in the UI.
    console.log('[ActivitiesPageComponent] Deleting selected Activity.');
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

  private removeActivityFromList(activity: Activity) {
    this.allActivities.splice(this.allActivities.indexOf(activity), 1);
    this.filterActivities();
  }
}
