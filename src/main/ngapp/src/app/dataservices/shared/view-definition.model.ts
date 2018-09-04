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
import { CompositionOperator } from "@dataservices/shared/composition-operator.enum";
import { CompositionType } from "@dataservices/shared/composition-type.enum";

/**
 * ViewDefinition model
 */
export class ViewDefinition {
  private viewName: string;
  private keng__description = "";
  private isEditable = false;
  private sourcePaths: string[] = [];
  private compositions: Composition[] = [];
  private isSelected = false;

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
    this.keng__description = description ? description : "";
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
    // Checks to determine whether the viewDefinition is complete.

    // View name must be set
    if (!this.viewName || this.viewName.length === 0) {
      return false;
    }

    // Must be at least one source Path
    if (!this.sourcePaths || this.sourcePaths.length === 0) {
      return false;
    }

    // If single source path, then any compositions will be ignored - and it's complete
    if (this.sourcePaths.length === 1) {
      return true;
    } else {
      // Has more than one source path.  Make sure
      // 1 - has a composition
      // 2 - composition is complete,
      // 3 - sides of the composition are contained in the sourcePaths
      const comps: Composition[] = this.getCompositions();
      if (!comps || comps.length !== 1) {
        return false;
      } else if (!comps[0].complete) {
        return false;
      }
      // Make sure the left and right composition source paths are present in the view definition sourcePaths
      const leftSrcPath = comps[0].getLeftSourcePath();
      const rightSrcPath = comps[0].getRightSourcePath();
      let hasLeft = false;
      let hasRight = false;
      for (const srcPath of this.sourcePaths) {
        if (srcPath === leftSrcPath) {
          hasLeft = true;
        } else if (srcPath === rightSrcPath) {
          hasRight = true;
        }
      }
      if (!hasLeft || !hasRight) {
        return false;
      }
    }

    return true;
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
   * Get the preview SQL for the view, given the current selections
   * @returns {string} the view SQL
   */
  public getPreviewSql(): string {
    let previewSql = "";

    // TODO:  This method currently handles single source views, and single join views
    //        Will need to expand capabilites in the future - as more complex joins are supported.

    // The preview SQL is only generated if the view is complete
    if ( this.complete ) {
      // Join View
      if ( this.getCompositions().length === 1 ) {
        const composition = this.getCompositions()[0];
        const leftTable = this.getPreviewTableName(composition.getLeftSourcePath());
        const rightTable = this.getPreviewTableName(composition.getRightSourcePath());
        const leftCriteriaColName = composition.getLeftCriteriaColumn();
        const rightCriteriaColName = composition.getRightCriteriaColumn();
        const criteriaOperator = CompositionOperator.toSql(composition.getOperator());
        const joinType = CompositionType.toSql(composition.getType());
        previewSql = "SELECT * FROM " + leftTable + " AS A " + joinType + " " +
                                        rightTable + " AS B ON " +
                                        "A." + leftCriteriaColName + " " + criteriaOperator + " " +
                                        "B." + rightCriteriaColName + ";";
        // Single Source View
      } else {
        const tableName = this.getPreviewTableName(this.getSourcePaths()[0]);
        previewSql = "SELECT * FROM " + tableName + ";";
      }
    }

    return previewSql;
  }

  /**
   * Generates the table name for the preview query, given the source path
   * @param {string} sourcePath the path for the view source
   */
  private getPreviewTableName( sourcePath: string ): string {
    let sourceNodeName = "unknownSource";
    let connectionName = "unknownConnection";
    if ( sourcePath && sourcePath !== null ) {
      sourceNodeName = PathUtils.getSourceName(sourcePath);
      if ( PathUtils.getConnectionName(sourcePath) !== null ) {
        connectionName = PathUtils.getConnectionName(sourcePath);
      }
    }
    return connectionName.toLowerCase() + VdbsConstants.SCHEMA_MODEL_SUFFIX + "." + sourceNodeName;
  }

  /**
   * @returns {boolean} 'true' if ViewDefinition isSelected
   */
  public get selected(): boolean {
    return this.isSelected;
  }

  /**
   * @param {boolean} selected the ViewDefinition isSelected state
   */
  public setSelected( selected: boolean ): void {
    this.isSelected = selected;
  }

  /**
   * Determine if the supplied ViewDefinition is equal to this
   * @param {Object} values
   */
  public isEqual( otherView: ViewDefinition ): boolean {
    let equal = false;
    if (this.getName() === otherView.getName() &&
        this.getDescription() === otherView.getDescription() &&
        this.pathsEqual(this.getSourcePaths(), otherView.getSourcePaths()) &&
        this.compositionsEqual(this.getCompositions(), otherView.getCompositions()) ) {
      equal = true;
    }
    return equal;
  }

  private pathsEqual(left: string[], right: string[]): boolean {
    if (left === right) return true;
    if (left == null || right == null) return false;
    if (left.length !== right.length) return false;

    left.sort();
    right.sort();
    for (let i = 0; i < right.length; ++i) {
      if (left[i] !== right[i]) return false;
    }
    return true;
  }

  private compositionsEqual(left: Composition[], right: Composition[]): boolean {
    if (left === right) return true;
    if (left == null || right == null) return false;
    if (left.length !== right.length) return false;

    left.sort();
    right.sort();
    for (let i = 0; i < right.length; ++i) {
      if (!left[i].isEqual(right[i])) return false;
    }
    return true;
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
