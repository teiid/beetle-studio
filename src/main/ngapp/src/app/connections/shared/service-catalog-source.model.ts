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

export class ServiceCatalogSource implements Identifiable< string > {

  private keng__id: string;
  private sc__name: string;
  private sc__type: string;
  private sc__bound: boolean;

  /**
   * Create a ServiceCatalogSource from its json representation
   * @param {Object} json the JSON representation of a ServiceCatalogSource
   * @returns {ServiceCatalogSource} the new ServiceCatalogSource (never null)
   */
  public static create( json: object = {} ): ServiceCatalogSource {
    const conn = new ServiceCatalogSource();
    conn.setValues( json );
    return conn;
  }

  /**
   * Sorts the provided catalog sources in the specified sort direction
   * @param {ServiceCatalogSource[]} catalogSources the catalog sources being sorted
   * @param {SortDirection} sortDirection the sort direction
   */
  public static sort( catalogSources: ServiceCatalogSource[],
                      sortDirection: SortDirection ): void {
    catalogSources.sort( ( thisSource: ServiceCatalogSource, thatSource: ServiceCatalogSource ) => {
      const result = thisSource.compareTo( thatSource );

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
  public compareTo( that: ServiceCatalogSource ): number {
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
   * Get the catalog source type
   * @returns {string} the catalog source type name (can be null)
   */
  public getType(): string {
    return this.sc__type;
  }

  /**
   * Get the catalog source id
   * @returns {string} the catalog source identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * Get the catalog source name
   * @returns {string} the catalog source name (can be null)
   */
  public getName(): string {
    return this.sc__name;
  }

  /**
   * Get the bound status of the catalog source
   * @returns {boolean} the bound status (true == bound)
   */
  public isBound(): boolean {
    return this.sc__bound;
  }

  /**
   * Set the catalog source type
   * @param {string} typeName the catalog source type (optional)
   */
  public setType( typeName?: string ): void {
    this.sc__type = typeName ? typeName : null;
  }

  /**
   * Set the catalog source id
   * @param {string} id the catalog source identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * Set the catalog source name
   * @param {string} name the catalog source name (optional)
   */
  public setName( name?: string ): void {
    this.sc__name = name ? name : null;
  }

  /**
   * Set the bound state of the catalog source
   * @param {boolean} bound the bound state
   */
  public setBound( bound: boolean ): void {
    this.sc__bound = bound;
  }

  /**
   * Set all object values using the supplied catalog source json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
