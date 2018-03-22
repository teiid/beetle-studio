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
 * VdbModelSource model
 */
export class VdbModelSource {

  private keng__id: string;
  private keng__dataPath: string;
  private keng__kType = "VdbModelSource";
  private vdb__sourceJndiName: string;
  private vdb__sourceTranslator: string;
  private tko__associatedConnection: string;

  /**
   * @param {Object} json the JSON representation of a VdbModelSource
   * @returns {VdbModelSource} the new VdbModelSource (never null)
   */
  public static create( json: object = {} ): VdbModelSource {
    const vdbModelSource = new VdbModelSource();
    vdbModelSource.setValues( json );
    return vdbModelSource;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the vdbModelSource identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the vdbModelSource dataPath (can be null)
   */
  public getDataPath(): string {
    return this.keng__dataPath;
  }

  /**
   * @returns {string} the vdbModelSource type name (can be null)
   */
  public getType(): string {
    return this.keng__kType;
  }

  /**
   * @returns {string} the jndi name (can be null)
   */
  public getJndiName(): string {
    return this.vdb__sourceJndiName;
  }

  /**
   * @returns {string} the translator name (can be null)
   */
  public getTranslatorName(): string {
    return this.vdb__sourceTranslator;
  }

  /**
   * @returns {string} the associated connection path (can be null)
   */
  public getAssociatedConnection(): string {
    return this.tko__associatedConnection;
  }

  /**
   * @param {string} id the vdbModelSource identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} dataPath the vdbModelSource dataPath (optional)
   */
  public setDataPath( dataPath?: string ): void {
    this.keng__dataPath = dataPath ? dataPath : null;
  }

  /**
   * @param {string} jndiName the jndi name (optional)
   */
  public setJndiName( jndiName?: string ): void {
    this.vdb__sourceJndiName = jndiName ? jndiName : null;
  }

  /**
   * @param {string} translator the translator name (optional)
   */
  public setTranslatorName( translator?: string ): void {
    this.vdb__sourceTranslator = translator ? translator : null;
  }

  /**
   * @param {string} connectionPath the path to the associated connection (optional)
   */
  public setAssociatedConnection( connectionPath?: string ): void {
    this.tko__associatedConnection = connectionPath ? connectionPath : null;
  }

  /**
   * Set all object values using the supplied VdbModelSource json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
