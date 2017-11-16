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

import { NameValue } from "@dataservices/shared/name-value.model";

/**
 * VdbModel model
 */
export class VdbModel {

  private keng__id: string;
  private keng__dataPath: string;
  private keng__kType = "VdbModel";
  private mmcore__modelType: string;
  // noinspection JSMismatchedCollectionQueryUpdate
  private keng__properties: NameValue[] = [];

  /**
   * @param {Object} json the JSON representation of a VdbModel
   * @returns {VdbModel} the new VdbModel (never null)
   */
  public static create( json: object = {} ): VdbModel {
    const vdbModel = new VdbModel();
    vdbModel.setValues( json );
    return vdbModel;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the vdbModel identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the vdbModel dataPath (can be null)
   */
  public getDataPath(): string {
    return this.keng__dataPath;
  }

  /**
   * @returns {string} the vdbModel type name (can be null)
   */
  public getType(): string {
    return this.keng__kType;
  }

  /**
   * @returns {string} the vdbModel model type
   */
  public getModelType(): string {
    return this.mmcore__modelType;
  }

  /**
   * @param {string} id the vdbModel identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} dataPath the vdbModel dataPath (optional)
   */
  public setDataPath( dataPath?: string ): void {
    this.keng__dataPath = dataPath ? dataPath : null;
  }

  /**
   * @param {string} modelType the vdbModel type
   */
  public setModelType( modelType: string ): void {
    this.mmcore__modelType = modelType;
  }

  /**
   * @param {NameValue[]} props the model properties (optional)
   */
  public setProperties( props?: NameValue[] ): void {
    this.keng__properties = props ? props : null;
  }

  /**
   * Set all object values using the supplied VdbModel json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
