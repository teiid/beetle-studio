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

import { PublishState } from "@dataservices/shared/publish-state.enum";
import { VirtRoute } from "@dataservices/shared/virt-route.model";

/**
 * Virtualization model
 */
export class Virtualization {

  private readonly vdb_name: string;
  private build_name: string;
  private deployment_name: string;
  private build_status: string; /* NOTFOUND, SUBMITTED, CONFIGURING, BUILDING, DEPLOYING, RUNNING, FAILED, CANCELLED */
  private build_status_message: string;
  private namespace: string;
  private last_updated: string;
  private publishState: PublishState;
  private virtRoutes: Array<VirtRoute>;

  /**
   * @param {Object} json the JSON representation of a Virtualization
   * @returns {Virtualization} the new Virtualization (never null)
   */
  public static create( json: object = {} ): Virtualization {
    const virtual = new Virtualization();
    virtual.setValues( json );
    return virtual;
  }

  constructor();
  constructor(vdbName: string, publishState: PublishState)
  constructor(vdbName?: string, publishState?: PublishState) {
    this.vdb_name = vdbName ? vdbName : null;
    this.publishState = publishState ? publishState : PublishState.NOT_PUBLISHED;
  }

  /**
   * @returns {string} the virtualization name (can be null)
   */
  public getVdbName(): string {
    return this.vdb_name;
  }

  /**
   * @returns {string} the virtualization build_name (can be null)
   */
  public getBuildName(): string {
    return this.build_name;
  }

  /**
   * @returns {string} the virtualization deployment name (can be null)
   */
  public getDeploymentName(): string {
    return this.deployment_name;
  }

  /**
   * @returns {string} the virtualization build status (can be null)
   */
  public getBuildStatus(): string {
    return this.build_status;
  }

  /**
   * @returns {string} the virtualization build status message (can be null)
   */
  public getBuildStatusMsg(): string {
    return this.build_status_message;
  }

  /**
   * @returns {string} the virtualization namespace (can be null)
   */
  public getNamespace(): string {
    return this.namespace;
  }

  /**
   * @returns {string} the virtualization last updated date and time (can be null)
   */
  public getLastUpdated(): string {
    return this.last_updated;
  }

  /**
   * @returns {PublishState} the published state of this virtualization (derived from build state)
   */
  public getPublishState(): PublishState {
    return this.publishState;
  }

  public getOdataRoute(): VirtRoute {
    if (! this.virtRoutes) {
      return null;
    }

    for ( const virtRoute of this.virtRoutes ) {
      if (virtRoute.isOdata())
        return virtRoute;
    }

    return null;
  }

  /**
   * Set all object values using the supplied Virtualization json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);

    if (values['routes']) {
      const routes = values['routes'];
      for (const route of routes) {
        const virtRoute = VirtRoute.create(route);
        if (!this.virtRoutes) {
          this.virtRoutes = [];
        }

        this.virtRoutes.push(virtRoute);
      }
    }

    if (this.build_status) {
      if (this.build_status === "SUBMITTED") {
        this.publishState = PublishState.SUBMITTED;
      } else if (this.build_status === "CONFIGURING") {
        this.publishState = PublishState.CONFIGURING;
      } else if (this.build_status === "BUILDING") {
        this.publishState = PublishState.BUILDING;
      } else if (this.build_status === "DEPLOYING") {
        this.publishState = PublishState.DEPLOYING;
      } else if (this.build_status === "RUNNING") {
        this.publishState = PublishState.PUBLISHED;
      } else if (this.build_status === "FAILED") {
        this.publishState = PublishState.FAILED;
      } else {
        this.publishState = PublishState.NOT_PUBLISHED;
      }
    }
  }

}
