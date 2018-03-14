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

import { VdbStatus } from "@dataservices/shared/vdb-status.model";

/**
 * ObjectVdbStatus model.
 * Object name to VdbStatus pairing
 */
export class ObjectVdbStatus {

  private name: string;
  private vdbStatus: VdbStatus;

  /**
   * @param {Object} json the JSON representation of a ObjectVdbStatus
   * @returns {ObjectVdbStatus} the new VdbStatus (never null)
   */
  public static create( json: object = {} ): ObjectVdbStatus {
    const objVdbStatus = new ObjectVdbStatus();
    for (const field of Object.keys(json)) {
      if (field === "name") {
        objVdbStatus.setName(json[field]);
      } else if (field === "vdbStatus") {
        // length of 2 or shorter - no object.  TODO: better way to do this?
        if (JSON.stringify(json[field]).length > 2) {
          const status: VdbStatus = new VdbStatus();
          status.setValues(json[field]);
          objVdbStatus.setVdbStatus(status);
        }
      }
    }
    return objVdbStatus;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the vdbStatus name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {VdbStatus} the vdbStatus
   */
  public getVdbStatus(): VdbStatus {
    return this.vdbStatus;
  }

  /**
   * @param {string} name the object name
   */
  public setName( name: string ): void {
    this.name = name;
  }

  /**
   * @param {VdbStatus} status the object VdbStatus
   */
  public setVdbStatus( status: VdbStatus ): void {
    this.vdbStatus = status;
  }

  /**
   * Set all object values using the supplied ObjectVdbStatus json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
