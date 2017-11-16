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

/**
 * VdbStatus model
 */
export class VdbStatus {

  private name: string;
  private deployedName: string;
  private version = "1";
  private active = false;
  private loading = false;
  private failed = false;
  private errors: string[] = [];

  /**
   * @param {Object} json the JSON representation of a VdbStatus
   * @returns {VdbStatus} the new VdbStatus (never null)
   */
  public static create( json: object = {} ): VdbStatus {
    const vdbStatus = new VdbStatus();
    vdbStatus.setValues( json );
    return vdbStatus;
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
   * @returns {string} the vdbStatus deployedName
   */
  public getDeployedName(): string {
    return this.deployedName;
  }

  /**
   * @returns {string} the vdbStatus version (can be null)
   */
  public getVersion(): string {
    return this.version;
  }

  /**
   * @returns {boolean} the vdbStatus active state
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * @returns {boolean} the vdbStatus loading state
   */
  public isLoading(): boolean {
    return this.loading;
  }

  /**
   * @returns {boolean} the vdbStatus failed state
   */
  public isFailed(): boolean {
    return this.failed;
  }

  /**
   * @returns {string[]} the errors (never null)
   */
  public getErrors(): string[] {
    return this.errors;
  }

  /**
   * @param {string} name the vdbStatus name
   */
  public setName( name: string ): void {
    this.name = name;
  }

  /**
   * @param {string} deployedName the vdbStatus deployedName
   */
  public setDeployedName( deployedName: string ): void {
    this.deployedName = deployedName;
  }

  /**
   * @param {string} version the vdbStatus version (optional)
   */
  public setVersion( version?: string ): void {
    this.version = version ? version : "1";
  }

  /**
   * @param {boolean} active the active state
   */
  public setActive( active: boolean ): void {
    this.active = active;
  }

  /**
   * @param {boolean} loading the loading state
   */
  public setLoading( loading: boolean ): void {
    this.loading = loading;
  }

  /**
   * @param {boolean} failed the failed state
   */
  public setFailed( failed: boolean ): void {
    this.failed = failed;
  }

  /**
   * @param {[string]} errors the status errors
   */
  public setErrors( errors: string[] ): void {
    this.errors = errors;
  }

  /**
   * Set all object values using the supplied VdbStatus json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
