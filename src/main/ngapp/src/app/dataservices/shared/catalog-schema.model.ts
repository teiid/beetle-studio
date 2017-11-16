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
 * CatalogSchema model.  The type will be 'Catalog' or 'Schema'.  For Schema, the catalogName may
 * or may not be set depending on whether Catalogs are supported.
 */
export class CatalogSchema {
  private name: string;
  private type: string;
  private catalogName: string;

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the info name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the info type
   */
  public getType(): string {
    return this.type;
  }

  /**
   * @returns {string} the catalog name
   */
  public getCatalogName(): string {
    return this.catalogName;
  }

  /**
   * @returns {string} the display name
   */
  public getDisplayName(): string {
    const type = this.getType();
    if ( type === "Catalog" ) {
      return this.getName();
    } else if ( type === "Schema" ) {
      const catalog = this.getCatalogName();
      if ( catalog && catalog.length > 0 ) {
        return catalog + "." + this.getName();
      } else {
        return this.getName();
      }
    }
    return this.catalogName;
  }

  /**
   * @param {string} name the name
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} type the type
   */
  public setType( type?: string ): void {
    this.type = type ? type : null;
  }

  /**
   * @param {string} name the name of the catalog
   */
  public setCatalogName( name?: string ): void {
    this.catalogName = name ? name : null;
  }

}
