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

/**
 * Vdb model
 */
export class Vdb implements Identifiable< string > {

  private keng__id: string;
  private vdb__description: string;
  private keng__dataPath: string;
  private keng__kType = "Vdb";
  private vdb__name: string;
  private vdb__originalFile: string;
  private vdb__preview: boolean;
  private vdb__version: string;

  /**
   * @param {Object} json the JSON representation of a Vdb
   * @returns {Vdb} the new Vdb (never null)
   */
  public static create( json: object = {} ): Vdb {
    const vdb = new Vdb();
    vdb.setValues( json );
    return vdb;
  }

  /**
   * @param {Vdb[]} vdbs the vdbs being sorted
   * @param {SortDirection} sortDirection the sort direction
   */
  public static sort( vdbs: Vdb[],
                      sortDirection: SortDirection ): void {
    vdbs.sort( ( thisVdb: Vdb, thatVdb: Vdb ) => {
      const result = thisVdb.compareTo( thatVdb );

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
  public compareTo( that: Vdb ): number {
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
   * @returns {string} the vdb identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the vdb name (can be null)
   */
  public getName(): string {
    return this.vdb__name;
  }

  /**
   * @returns {string} the vdb description (can be null)
   */
  public getDescription(): string {
    return this.vdb__description;
  }

  /**
   * @returns {string} the vdb dataPath (can be null)
   */
  public getDataPath(): string {
    return this.keng__dataPath;
  }

  /**
   * @returns {string} the vdb originalFile (can be null)
   */
  public getOriginalFile(): string {
    return this.vdb__originalFile;
  }

  /**
   * @returns {string} the vdb type name (can be null)
   */
  public getType(): string {
    return this.keng__kType;
  }

  /**
   * @returns {boolean} the vdb preview status
   */
  public isPreview(): boolean {
    return this.vdb__preview;
  }

  /**
   * @returns {string} the vdb type name (can be null)
   */
  public getVersion(): string {
    return this.vdb__version;
  }

  /**
   * @param {string} id the vdb identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} name the vdb name (optional)
   */
  public setName( name?: string ): void {
    this.vdb__name = name ? name : null;
  }

  /**
   * @param {string} description the vdb description (optional)
   */
  public setDescription( description?: string ): void {
    this.vdb__description = description ? description : null;
  }

  /**
   * @param {string} dataPath the vdb dataPath (optional)
   */
  public setDataPath( dataPath?: string ): void {
    this.keng__dataPath = dataPath ? dataPath : null;
  }

  /**
   * @param {string} originalFile the vdb originalFile (optional)
   */
  public setOriginalFile( originalFile?: string ): void {
    this.vdb__originalFile = originalFile ? originalFile : null;
  }

  /**
   * @param {boolean} preview the vdb preview status
   */
  public setPreview( preview: boolean ): void {
    this.vdb__preview = preview;
  }

  /**
   * @param {string} version the vdb version
   */
  public setVersion( version?: string ): void {
    this.vdb__version = version;
  }

  /**
   * Set all object values using the supplied Vdb json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
