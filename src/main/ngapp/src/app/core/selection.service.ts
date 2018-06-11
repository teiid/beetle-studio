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

import { Injectable } from "@angular/core";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { View } from "@dataservices/shared/view.model";

@Injectable()
export class SelectionService {

  private selectedVirtualization: Dataservice;
  private selectedView: View;

  constructor() {
    // nothing to do
  }

  /**
   * Gets the selected virtualization
   * @returns {Dataservice} the selected virtualization
   */
  public getSelectedVirtualization(): Dataservice {
    return this.selectedVirtualization;
  }

  /**
   * Sets the selected dataservice
   * @param {Dataservice} virtualization the selected virtualization
   */
  public setSelectedVirtualization(virtualization: Dataservice): void {
    this.selectedVirtualization = virtualization;
  }

  /**
   * Determine if there is a selected virtualization
   * @returns {boolean} 'true' if a virtualization is selected
   */
  public get hasSelectedVirtualization(): boolean {
    return this.selectedVirtualization && this.selectedVirtualization !== null;
  }

  /**
   * Gets the selected view
   * @returns {View} the selected view
   */
  public getSelectedView(): View {
    return this.selectedView;
  }

  /**
   * Sets the selected view
   * @param {View} view the selected view
   */
  public setSelectedView(virtualization: Dataservice, view: View): void {
    this.selectedVirtualization = virtualization;
    this.selectedView = view;
  }

  /**
   * Determine if there is a selected view
   * @returns {boolean} 'true' if a view is selected
   */
  public get hasSelectedView(): boolean {
    return this.selectedView && this.selectedView !== null;
  }

}
