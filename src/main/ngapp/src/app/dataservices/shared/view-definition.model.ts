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
import { ProjectedColumn } from "@dataservices/shared/projected-column.model";

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
  private projectedColumns: ProjectedColumn[] = [];
  private defaultProjectedColumns: ProjectedColumn[] = [];

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
      } else if (field === "projectedColumns") {
        const arrayElems = json[field];
        const cols: ProjectedColumn[] = [];
        for (const arrayElem of arrayElems) {
          const compStr = JSON.stringify(arrayElem);
          if (compStr.length > 2) {
            const col = ProjectedColumn.create(arrayElem);
            cols.push(col);
          }
        }
        viewDefn.setProjectedColumns(cols);
      }
    }
    return viewDefn;
  }

  /**
   * Constructor
   */
  constructor() {
    // Define the default projected columns ('SELECT *')
    const selectStar: ProjectedColumn = new ProjectedColumn();
    selectStar.setName("ALL");
    selectStar.setType("ALL");
    selectStar.selected = true;
    this.defaultProjectedColumns.push(selectStar);

    // Init the ViewDefinition with default projected columns
    this.initProjectedColumns();
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
    // change in source paths will re-init the projected columns
    this.initProjectedColumns();
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
    // change in compositions will re-init the projected columns
    this.initProjectedColumns();
  }

  /**
   * @returns {ProjectedColumn[]} the view projected columns
   */
  public getProjectedColumns(): ProjectedColumn[] {
    return this.projectedColumns;
  }

  /**
   * @param {ProjectedColumns} projColumns the projected columns
   */
  public setProjectedColumns( projColumns: ProjectedColumn[] ): void {
    this.projectedColumns = projColumns;
  }

  /**
   * Get the projected columns that are currently selected
   * @returns {ProjectedColumn[]} the view selected projected columns
   */
  public getSelectedProjectedColumns(): ProjectedColumn[] {
    const selectedProjCols: ProjectedColumn[] = [];
    for (const projCol of this.getProjectedColumns()) {
      if (projCol.selected) {
        selectedProjCols.push(projCol);
      }
    }
    return selectedProjCols;
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
      // adding composition will re-init the projected columns
      this.initProjectedColumns();
    }
  }

  /**
   * @param {string} compositionToRemove the composition name to remove
   */
  public removeComposition( compositionToRemove: string ): void {
    const index = this.compositions.findIndex( ( comp ) => comp.getName() === compositionToRemove );

    if ( index !== -1 ) {
      this.compositions.splice( index, 1 );
      // removing composition will re-init the projected columns
      this.initProjectedColumns();
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
      // adding source will re-init the projected columns
      this.initProjectedColumns();
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
      // remove source will re-init the projected columns
      this.initProjectedColumns();
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
  public getPreviewSql( sourcePath?: string ): string {

    // TODO:  This method currently handles single source views, and single join views
    //        Will need to expand capabilites in the future - as more complex joins are supported.

    // If source path is supplied, return the source SQL
    if ( sourcePath !=  null ) {
      const tableName = this.getPreviewTableName(sourcePath);
      return "SELECT * FROM " + tableName + ";";
    }

    // The preview SQL for the view is only generated if the view is complete
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
        const projColsSql = this.getProjectedColumnsSql();
        return "SELECT " + projColsSql + " FROM " + leftTable + " AS A " + joinType + " " +
                                        rightTable + " AS B ON " +
                                        "A." + leftCriteriaColName + " " + criteriaOperator + " " +
                                        "B." + rightCriteriaColName + ";";
        // Single Source View
      } else {
        const tableName = this.getPreviewTableName(this.getSourcePaths()[0]);
        const projColsSql = this.getProjectedColumnsSql();
        return "SELECT " + projColsSql + " FROM " + tableName + ";";
      }
    }

    return "";
  }

  /**
   * Determine if the current projected columns is '*'
   * @return {boolean} 'true' if select all
   */
  public isProjectAllColumns(): boolean {
    return this.getProjectedColumns().length === 1 && this.getProjectedColumns()[0].getName() === "ALL" && this.getProjectedColumns()[0].getType() === "ALL";
  }

  /**
   * Initializes the projected columns for this view.  This resets the view projected columns to "*" ("ALL")
   */
  private initProjectedColumns(): void {
    this.setProjectedColumns(this.defaultProjectedColumns);
  }

  /**
   * Get the SQL string for the current projected columns
   * @return {string} the projected columns SQL
   */
  private getProjectedColumnsSql(): string {
    // TODO: This function will need more work as the ViewDefinition is refined (addition of aliases, etc)
    let sql = "";

    // Determine duplicate names from all projected columns.  They will need to be aliased so they are not ambiguous
    const duplicateNames = this.getDuplicateColumnNames(this.getProjectedColumns());

    // Build the sql from the selected columns
    const selectedCols = this.getSelectedProjectedColumns();
    for ( let i = 0; i < selectedCols.length; i++ ) {
      // If column is a duplicate, qualify it as left table
      const cName = this.getSqlColumnName(selectedCols[i]);
      if ( duplicateNames.indexOf(cName) !== -1 ) {
        sql = sql.concat("A." + cName);
      } else {
        sql = sql.concat(cName);
      }
      if ( i < selectedCols.length - 1 ) {
        sql = sql.concat(", ");
      }
    }
    return sql;
  }

  /**
   * Get the array of duplicate column names.  If no duplicates, an empty array is returned
   * @param columns the array of columns to test
   * @return the array of duplicate names in the supplied columns
   */
  private getDuplicateColumnNames(columns: ProjectedColumn[]): string[] {
    const allColNames: string[] = [];
    const duplicateNames: string[] = [];
    for ( const col of columns ) {
      const colName = this.getSqlColumnName(col);
      if (allColNames.indexOf(colName) !== -1) {
        duplicateNames.push(colName);
      } else {
        allColNames.push(colName);
      }
    }
    return duplicateNames;
  }

  /**
   * Get the name of the supplied column
   * @param col the column
   * @return {string} the column sql name
   */
  private getSqlColumnName(col: ProjectedColumn): string {
    if (col && col !== null) {
      if (col.getName() === "ALL" && col.getType() === "ALL") {
        return "*";
      } else {
        return col.getName();
      }
    }
    return "";
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
        this.compositionsEqual(this.getCompositions(), otherView.getCompositions()) &&
        this.projectedColumnsEqual(this.getProjectedColumns(), otherView.getProjectedColumns()) ) {
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

  private projectedColumnsEqual(left: ProjectedColumn[], right: ProjectedColumn[]): boolean {
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
      compositions: this.compositions,
      projectedColumns: this.projectedColumns
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
