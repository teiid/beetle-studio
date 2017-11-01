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

export class Dataservice implements Identifiable< string > {

  private keng__id: string;
  private tko__description: string;

  /**
   * @param {Object} json the JSON representation of a Dataservice
   * @returns {Dataservice} the new Dataservice (never null)
   */
  public static create( json: object = {} ): Dataservice {
    const svc = new Dataservice();
    svc.setValues( json );
    return svc;
  }

  constructor() {
    // nothing to do
  }

  /**
   * See {Identifiable}.
   */
  public compareTo( that: Dataservice ): number {
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
   * @returns {string} the dataservice identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the dataservice description (can be null)
   */
  public getDescription(): string {
    return this.tko__description;
  }

  /**
   * @returns {string} the dataservice dataPath (can be null)
   */
  public getDataPath(): string {
    return "/tko:komodo/tko:workspace/dsbUser/" + this.keng__id;
  }

  /**
   * @returns {string} the dataservice type name (can be null)
   */
  public getType(): string {
    return "Dataservice";
  }

  /**
   * @param {string} id the dataservice identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} description the dataservice description (optional)
   */
  public setDescription( description?: string ): void {
    this.tko__description = description ? description : null;
  }

  /**
   * Set all object values using the supplied Dataservice json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
