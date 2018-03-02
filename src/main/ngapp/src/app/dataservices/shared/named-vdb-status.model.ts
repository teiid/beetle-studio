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
 * NamedVdbStatus model.
 */
export class NamedVdbStatus {

  private objectName: string;
  private vdbStatus: VdbStatus;

  /**
   * @param {Object} json the JSON representation of a NamedVdbStatus
   * @returns {NamedVdbStatus} the new NamedVdbStatus (never null)
   */
  public static create( json: object = {} ): NamedVdbStatus {
    const namedStatus = new NamedVdbStatus();
    for (const field of Object.keys(json)) {
      if (field === "objectName") {
        namedStatus.setName(json[field]);
      } else if (field === "vdbStatus") {
        // length of 2 or shorter - no object.  TODO: better way to do this?
        if (JSON.stringify(json[field]).length > 2) {
          namedStatus.setVdbStatus(VdbStatus.create(json[field]));
        }
      }
    }
    return namedStatus;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the vdbStatus name
   */
  public getName(): string {
    return this.objectName;
  }

  /**
   * @returns {boolean} 'true' if vdbStatus exists
   */
  public hasVdbStatus(): boolean {
    return (this.vdbStatus && this.vdbStatus !== null);
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
    this.objectName = name;
  }

  /**
   * @param {VdbStatus} status the object VdbStatus
   */
  public setVdbStatus( status: VdbStatus ): void {
    this.vdbStatus = status;
  }

  /**
   * Set all object values using the supplied ConnectionSummary json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
