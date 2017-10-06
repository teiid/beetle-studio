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

import { Identifiable } from "@shared/identifiable";

export class Connection implements Identifiable< string > {

  private keng__id: string;
  private dv__jndiName: string;
  private dv__driverName: string;
  private keng__properties: Map< string, string > = new Map< string, string >();

  /**
   * @param {Object} json the JSON representation of a Connection
   * @returns {Connection} the new Connection (never null)
   */
  public static create( json: Object = {} ): Connection {
    const conn = new Connection();
    conn.setValues( json );
    return conn;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the connection driver name (can be null)
   */
  public getDriverName(): string {
    return this.dv__driverName;
  }

  /**
   * @returns {string} the connection identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the connection JNDI name (can be null)
   */
  public getJndiName(): string {
    return this.dv__jndiName;
  }

  /**
   * @returns {Map<string, string>} the connection properties (never null)
   */
  public getProperties(): Map< string, string > {
    return this.keng__properties;
  }

  /**
   * @param {string} driverName the connection driver name (optional)
   */
  public setDriverName( driverName?: string ): void {
    this.dv__driverName = driverName ? driverName : null;
  }

  /**
   * @param {string} id the connection identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} jndiName the connection JNDI name (optional)
   */
  public setJndiName( jndiName?: string ): void {
    this.dv__jndiName = jndiName ? jndiName : null;
  }

  /**
   * @param {Map<string, string>} props the connection properties (optional)
   */
  public setProperties( props?: Map< string, string > ): void {
    this.keng__properties = props ? props : new Map< string, string >();
  }

  /**
   * Set all object values using the supplied Connection json
   * @param {Object} values
   */
  public setValues(values: Object = {}): void {
    Object.assign(this, values);
  }

}
