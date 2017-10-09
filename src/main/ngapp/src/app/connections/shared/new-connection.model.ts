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
  private jndiName: string;
  private driverName: string;
  private jdbc: boolean;
  private properties: Map< string, string > = new Map< string, string >();

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
   * @returns {string} the connection jndi name (can be null)
   */
  public getJndiName(): string {
    return this.jndiName;
  }

  /**
   * @returns {string} the connection driver name (can be null)
   */
  public getDriverName(): string {
    return this.driverName;
  }

  /**
   * @returns {boolean} the jdbc status
   */
  public isJdbc(): boolean {
    return this.jdbc;
  }

  /**
   * @returns {Map<string, string>} the connection properties (never null)
   */
  public getProperties(): Map< string, string > {
    return this.properties;
  }

  /**
   * @param {string} name the connection name (optional)
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} jndiName the connection JNDI name (optional)
   */
  public setJndiName( jndiName?: string ): void {
    this.jndiName = jndiName ? jndiName : null;
  }

  /**
   * @param {string} driverName the connection driver name (optional)
   */
  public setDriverName( driverName?: string ): void {
    this.driverName = driverName ? driverName : null;
  }

  /**
   * @param {boolean} isJdbc the jdbc status (optional)
   */
  public setJdbc( isJdbc?: boolean ): void {
    this.jdbc = isJdbc ? isJdbc : true;
  }

  /**
   * @param {Map<string, string>} props the connection properties (optional)
   */
  public setProperties( props?: Map< string, string > ): void {
    this.properties = props ? props : new Map< string, string >();
  }

  // overrides toJSON - we do not want the name supplied in the json body.
  public toJSON(): {} {
    return {
      jndiName: this.jndiName,
      driverName: this.driverName,
      jdbc: this.jdbc,
      parameters: this.properties
    };
  }
}
