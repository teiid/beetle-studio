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

import { Identifiable } from "@shared/identifiable";
import { SortDirection } from "@shared/sort-direction.enum";

export class Activity implements Identifiable< string > {

  private keng__id: string;
  private dv__sourceConnection: string;
  private dv__targetConnection: string;

  /**
   * @param {Object} json the JSON representation of a Activity
   * @returns {Activity} the new Activity (never null)
   */
  public static create( json: object = {} ): Activity {
    const activity = new Activity();
    activity.setValues( json );
    return activity;
  }

  /**
   * @param {Activity[]} activities the activities being sorted
   * @param {SortDirection} sortDirection the sort direction
   */
  public static sort( activities: Activity[],
                      sortDirection: SortDirection ): void {
    activities.sort( ( thisActivity: Activity, thatActivity: Activity ) => {
      const result = thisActivity.compareTo( thatActivity );

      if ( sortDirection === SortDirection.DESC ) {
        return result * -1;
      }

      return result;
    } );
  }

  constructor() {
    // nothing to do
  }

  /**
   * See {Identifiable}.
   */
  public compareTo( that: Activity ): number {
    let result = 0;

    if ( this.getId() ) {
      if ( that.getId() ) {
        // both have an ID
        result = this.getId().localeCompare( that.getId() );
      } else {
        // thatItem does not have an ID
        result = 1;
      }
    } else if ( that.getId() ) {
      // thisItem does not have an ID and thatItem does
      result = -1;
    }

    return result;
  }

  /**
   * @returns {string} the activity identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the source connection name (can be null)
   */
  public getSourceConnection(): string {
    return this.dv__sourceConnection;
  }

  /**
   * @returns {string} the target connection name (can be null)
   */
  public getTargetConnection(): string {
    return this.dv__targetConnection;
  }

  /**
   * @param {string} id the activity identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} sourceConnection the source connection (optional)
   */
  public setSourceConnection( sourceConnection?: string ): void {
    this.dv__sourceConnection = sourceConnection ? sourceConnection : null;
  }

  /**
   * @param {string} targetConnection the target connection (optional)
   */
  public setTargetConnection( targetConnection?: string ): void {
    this.dv__targetConnection = targetConnection ? targetConnection : null;
  }

  /**
   * Set all object values using the supplied Activity json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }
}
