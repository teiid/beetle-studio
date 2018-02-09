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

export class NewConnection {

  private name: string;
  private description = "";
  private serviceCatalogSource: string;

  /**
   * Constructor
   */
  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the connection name (can be null)
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the connection description (can be null)
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * @returns {string} the connection serviceCatalog source name (can be null)
   */
  public getServiceCatalogSource(): string {
    return this.serviceCatalogSource;
  }

  /**
   * @param {string} name the connection name (optional)
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} description the connection description (optional)
   */
  public setDescription( description?: string ): void {
    this.description = description ? description : "";
  }

  /**
   * @param {string} serviceCatalogSource the serviceCatalogSource
   */
  public setServiceCatalogSource( serviceCatalogSource?: string ): void {
    this.serviceCatalogSource = serviceCatalogSource ? serviceCatalogSource : null;
  }

  // overrides toJSON - we do not want the name supplied in the json body.
  public toJSON(): {} {
    return {
      description: this.description,
      serviceCatalogSource: this.serviceCatalogSource,
    };
  }

}
