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

import { Composition } from "@dataservices/shared/composition.model";
import { PathUtils } from "@dataservices/shared/path-utils";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";

/**
 * ViewDefinition model
 */
export class ViewDefinition {
  private viewName: string;
  private keng__description: string;
  private isComplete = false;
  private isEditable = false;
  private sourcePaths: string[] = [];
  private compositions: Composition[] = [];

  /**
   * @param {Object} json the JSON representation of a ViewDefinition
   * @returns {ViewDefinition} the new ViewDefinition (never null)
   */
  public static create( json: object = {} ): ViewDefinition {
    const viewDefn = new ViewDefinition();
    for (const field of Object.keys(json)) {
      if (field === "viewName") {
        viewDefn.setName(json[field]);
      } else if (field === "keng__description") {
        viewDefn.setDescription(json[field]);
      } else if (field === "sourcePaths") {
        const arrayElems = json[field];
        for (const arrayElem of arrayElems) {
          if (arrayElem.length > 0) {
            viewDefn.addSourcePath(arrayElem);
          }
        }
      } else if (field === "compositions") {
        const arrayElems = json[field];
        for (const arrayElem of arrayElems) {
          const compStr = JSON.stringify(arrayElem);
          if (compStr.length > 2) {
            const comp = Composition.create(arrayElem);
            viewDefn.addComposition(comp);
          }
        }
      }
    }
    return viewDefn;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the view definition name
   */
  public getName(): string {
    return this.viewName;
  }

  /**
   * @param {string} name the view definition name
   */
  public setName( name?: string ): void {
    this.viewName = name ? name : null;
  }

  /**
   * @returns {string} the view description
   */
  public getDescription(): string {
    return this.keng__description;
  }

  /**
   * @param {string} description the view description
   */
  public setDescription( description?: string ): void {
    this.keng__description = description ? description : null;
  }

  /**
   * @returns {string[]} the view source paths
   */
  public getSourcePaths(): string[] {
    return this.sourcePaths;
  }

  /**
   * @param {string[]} sourcePaths the view source paths
   */
  public setSourcePaths( sourcePaths: string[] = [] ): void {
    this.sourcePaths = sourcePaths;
  }

  /**
   * @returns {Composition[]} the view compositions
   */
  public getCompositions(): Composition[] {
    return this.compositions;
  }

  /**
   * @param {Composition[]} compositions the view compositions
   */
  public setCompositions( compositions: Composition[] = [] ): void {
    this.compositions = compositions;
  }

  /**
   * Add Composition to the View
   *
   * @param {Composition} compositionToAdd the composition to add
   */
  public addComposition( compositionToAdd: Composition ): void {
    const index = this.compositions.findIndex( ( comp ) => comp.getName() === compositionToAdd.getName() );

    if ( index === -1 ) {
      this.compositions.push( compositionToAdd );
    }
  }

  /**
   * @param {string} compositionToRemove the composition name to remove
   */
  public removeComposition( compositionToRemove: string ): void {
    const index = this.compositions.findIndex( ( comp ) => comp.getName() === compositionToRemove );

    if ( index !== -1 ) {
      this.compositions.splice( index, 1 );
    }
  }

  /**
   * Add source path to the list of source paths
   *
   * @param {string} sourcePathToAdd the source path to add
   */
  public addSourcePath( sourcePathToAdd: string ): void {
    const index = this.sourcePaths.findIndex( ( sPath ) =>
      sPath === sourcePathToAdd
    );

    if ( index === -1 ) {
      this.sourcePaths.push( sourcePathToAdd );
    }
  }

  /**
   * Add source paths to the list of source paths.
   *
   * @param {string[]} sourcePathsToAdd the source paths being added
   */
  public addSourcePaths( sourcePathsToAdd: string[] = [] ): void {
    const self = this;

    sourcePathsToAdd.forEach( ( sourcePath ) => {
      self.addSourcePath( sourcePath );
    } );
  }

  /**
   * @param {string} sourcePathToRemove the source path to remove
   */
  public removeSourcePath( sourcePathToRemove: string ): void {
    const index = this.sourcePaths.findIndex( ( sourcePath ) =>
      sourcePath === sourcePathToRemove );

    if ( index !== -1 ) {
      this.sourcePaths.splice( index, 1 );
    }
  }

  /**
   * @param {string[]} sourcePathsToRemove the source paths to remove
   */
  public removeSourcePaths( sourcePathsToRemove: string[] ): void {
    const self = this;

    sourcePathsToRemove.forEach( ( sourcePath ) => {
      self.removeSourcePath( sourcePath );
    } );
  }

  /**
   * Determine if this view definition currenly has the specified source path
   * @param {string} sourcePathToTest the source path
   */
  public hasSourcePath( sourcePathToTest: string ): boolean {
    const index = this.sourcePaths.findIndex( ( sourcePath ) =>
      sourcePath === sourcePathToTest );

    if ( index !== -1 ) {
      return true;
    }
    return false;
  }

  /**
   * Determine whether the view definition is in a complete state
   * @returns {boolean} true if complete
   */
  public get complete(): boolean {
    return this.viewName != null && this.sourcePaths.length > 0;
  }

  /**
   * Determine whether the view definition is editable
   * @returns {boolean} true if editable
   */
  public get editable(): boolean {
    return this.isEditable;
  }

  /**
   * Set the ViewDefinition editable status
   * @param {boolean} editable true if editable
   */
  public setEditable(editable: boolean): void {
    this.isEditable = editable;
  }

  /**
   * Get the SQL for the view, given the current selections
   * @returns {string} the view SQL
   */
  public getSql(): string {
    // The view currently supports single source only
    let sourceNodeName = "unknownSource";
    let connectionName = "unknownConnection";
    const sourcePath = this.getSourcePaths()[ 0 ];
    if ( sourcePath && sourcePath !== null ) {
      sourceNodeName = PathUtils.getSourceName(sourcePath);
      if ( PathUtils.getConnectionName(sourcePath) !== null ) {
        connectionName = PathUtils.getConnectionName(sourcePath);
      }
    }

    // Return SQL for this view
    return "SELECT * FROM " + connectionName.toLowerCase() + VdbsConstants.SCHEMA_MODEL_SUFFIX + "." + sourceNodeName + ";";
  }

  /**
   * Set all object values using the supplied ViewDefinition json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

  /**
   * @returns {{}} a JSON representation of the view definition
   */
  public toJSON(): {} {
    return {
      viewName: this.viewName,
      keng__description: this.keng__description,
      isComplete: this.complete,
      sourcePaths: this.sourcePaths,
      compositions: this.compositions
    };
  }

  /**
   * @returns {string} a string representation of the event
   */
  public toString(): string {
    let text = `viewName: ${this.viewName}, keng__description: ${this.keng__description}, isComplete: ${this.complete}`;

    let firstTime = true;
    if ( this.sourcePaths.length !== 0 ) {
      text += ", sourcePaths: ";

      for ( const sourcePath of this.sourcePaths ) {
        if ( firstTime ) {
          firstTime = false;
        } else {
          text += ", ";
        }

        text += sourcePath;
      }
    } else {
      text += ", []";
    }

    return text;
  }

}
