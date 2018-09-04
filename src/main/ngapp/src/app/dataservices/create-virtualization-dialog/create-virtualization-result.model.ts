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
 * CreateVirtualizationResult model - to hold the results of the dialog entry
 */
export class CreateVirtualizationResult {

  private virtName: string;
  private virtDescription = "";
  private viewName: string;
  private viewDescription = "";

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the virtualization name
   */
  public getVirtualizationName(): string {
    return this.virtName;
  }

  /**
   * @param {string} name the virtualization name
   */
  public setVirtualizationName( name?: string ): void {
    this.virtName = name ? name : null;
  }

  /**
   * @returns {string} the virtualization description
   */
  public getVirtualizationDescription(): string {
    return this.virtDescription;
  }

  /**
   * @param {string} description the virtualization description
   */
  public setVirtualizationDescription( description?: string ): void {
    this.virtDescription = description ? description : "";
  }

  /**
   * @returns {string} the view name
   */
  public getViewName(): string {
    return this.viewName;
  }

  /**
   * @param {string} name the view name
   */
  public setViewName( name?: string ): void {
    this.viewName = name ? name : null;
  }

  /**
   * @returns {string} the view description
   */
  public getViewDescription(): string {
    return this.viewDescription;
  }

  /**
   * @param {string} description the view description
   */
  public setViewDescription( description?: string ): void {
    this.viewDescription = description ? description : "";
  }

}
