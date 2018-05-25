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
 * VirtRoute model
 * This is a model of the routes generated within Openshift
 * allowing access to the protocols urls, such as odata and jdbc.
 */
export class VirtRoute {

  public static readonly ODATA_PROTOCOL = 'odata';

  private name: string;
  private protocol: string;
  private host: string;
  private port: string;
  private path: string;
  private target: string;
  private secure: boolean;

  /**
   * @param {Object} json the JSON representation of a VirtRoute
   * @returns {VirtRoute} the new VirtRoute (never null)
   */
  public static create( json: object = {} ): VirtRoute {
    const route = new VirtRoute();
    route.setValues( json );
    return route;
  }

  constructor();
  constructor(name?: string) {
    this.name = name ? name : null;
  }

  /**
   * @returns {string} the route name (can be null)
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the route protocol (can be null)
   */
  public getProtocol(): string {
    return this.protocol;
  }

  /**
   * @returns {string} the route host (can be null)
   */
  public getHost(): string {
    return this.host;
  }

  /**
   * @returns {string} the route port (can be null)
   */
  public getPort(): string {
    return this.port;
  }

  /**
   * @returns {string} the route path (can be null)
   */
  public getPath(): string {
    return this.path;
  }

  /**
   * @returns {string} the route target (can be null)
   */
  public getTarget(): string {
    return this.target;
  }

  /**
   * @returns {boolean} whether the route is secure
   */
  public isSecure(): boolean {
    return this.secure;
  }

  /**
   * Set all object values using the supplied VirtRoute json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

  /**
   * Is this an odata route
   */
  public isOdata(): boolean {
    return this.getProtocol() === VirtRoute.ODATA_PROTOCOL;
  }
}
