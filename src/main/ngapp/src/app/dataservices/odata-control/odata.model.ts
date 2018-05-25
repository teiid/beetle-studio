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

import * as _ from "lodash";
import { OdataEntity } from "@dataservices/odata-control/odata-entity.model";
import { OdataColumn } from "@dataservices/odata-control/odata-column.model";
import { OdataWhere } from "@dataservices/odata-control/odata-where.model";

export class Odata {

  public static readonly EQUALS = 'equals';
  public static readonly NOT_EQUALS = 'not equals';
  public static readonly GREATER_THAN = 'greater than';
  public static readonly GREATER_THAN_EQ_TO = 'greater than or equal to';
  public static readonly LESS_THAN = 'less than';
  public static readonly LESS_THAN_EQ_TO = 'less than or equal to';
  public static readonly IN = 'in';
  public static readonly EQUALS_CINS = 'equals (case insensitive)';
  public static readonly NOT_EQUALS_CINS = 'not equals (case insensitive)';
  public static readonly STARTS_WITH = 'starts with';
  public static readonly NO_STARTS_WITH = 'not starts with';
  public static readonly ENDS_WITH = 'ends with';
  public static readonly NO_ENDS_WITH = 'not ends with';
  public static readonly CONTAINS = 'contains';
  public static readonly LENGTH_EQ = 'length equals';
  public static readonly BEFORE_DATE = 'before date';
  public static readonly AFTER_DATE = 'after date';
  public static readonly BEFORE_EQ = 'before or equals';
  public static readonly AFTER_EQ = 'after or equals';

  public static readonly NO_LIMIT = 'no limit';
  public static readonly COUNT_ONLY = 'count only';
  public static readonly TOP_1 = 'top 1';
  public static readonly TOP_10 = 'top 10';
  public static readonly TOP_50 = 'top 50';
  public static readonly TOP_100 = 'top 100';
  public static readonly TOP_1000 = 'top 1000';
  public static readonly TOP_10000 = 'top 10000';

  public static readonly QUERYABLE_TYPES: Array<string> = ['Boolean', 'String', 'Byte', 'Decimal', 'Double', 'Single', 'Float', 'Guid',
                                                          'Int16', 'Int32', 'Int64', 'SByte', 'DateTime', 'Time', 'DateTimeOffset'];

  public static readonly LIMITS: Array<string> = [
    Odata.NO_LIMIT,
    Odata.COUNT_ONLY,
    Odata.TOP_1,
    Odata.TOP_10,
    Odata.TOP_50,
    Odata.TOP_100,
    Odata.TOP_1000,
    Odata.TOP_10000
  ];

  private _metadata: any = null;

  private _metadataFailure = false;

  private _entities: Array<OdataEntity> = [];

  /* The entity for the select component */
  private _entity: OdataEntity = new OdataEntity();

  /* Will contain the selected columns */
  private _columns: Array<OdataColumn> = [];

  /* Where clauses for query criteria */
  private _wheres: Array<OdataWhere> = [];

  /* The limit of the query results */
  private _limit: string = Odata.NO_LIMIT;

  constructor() {
    const newWhere: OdataWhere = new OdataWhere();
    this.addWhere(newWhere);
  }

  /**
   * @returns collection of conditions for int types
   */
  public intConditions(): string[] {
    const conditions: Array<string> = [ Odata.EQUALS, Odata.NOT_EQUALS, Odata.GREATER_THAN,
                                       Odata.GREATER_THAN_EQ_TO, Odata.LESS_THAN, Odata.LESS_THAN_EQ_TO,
                                       Odata.IN ];
    return conditions;
  }

  /**
   * @returns collection of conditions for string types
   */
  public stringConditions(): string[] {
    const conditions: Array<string> = [ Odata.EQUALS, Odata.NOT_EQUALS, Odata.IN, Odata.EQUALS_CINS, Odata.NOT_EQUALS_CINS,
                                       Odata.STARTS_WITH, Odata.NO_STARTS_WITH, Odata.ENDS_WITH, Odata.NO_ENDS_WITH,
                                       Odata.CONTAINS, Odata.LENGTH_EQ ];
    return conditions;
  }

  /**
   * @returns collection of conditions for date types
   */
  public dateConditions(): string[] {
    const conditions: Array<string> = [ Odata.EQUALS, Odata.BEFORE_DATE, Odata.AFTER_DATE, Odata.BEFORE_EQ, Odata.AFTER_EQ ];
    return conditions;
  }

  /**
   * @returns collection of conditions for boolean types
   */
  public booleanConditions(): string[] {
    const conditions: Array<string> = [ Odata.EQUALS, Odata.NOT_EQUALS ];
    return conditions;
  }

  /**
   * @returns metadata
   */
  public get metadata(): any {
    return this._metadata;
  }

  /**
   * Extract the available columns from the entity
   * located in the $metadata xml/json
   */
  private extractColumns(entity: any): OdataColumn[] {
    let odataColumns = [];
    if (_.isEmpty(entity.Property))
      return odataColumns;

    const columns = entity.Property;
    if (_.isArray(columns)) {
      for (const column of columns) {
        const odataColumn = new OdataColumn();
        odataColumn.name = column._Name;
        odataColumn.type = column._Type.replace('Edm.', '');
        odataColumns.push(odataColumn);
      }
    } else if (_.isObject(columns)) {
      const singleColumn = new OdataColumn();
      singleColumn.name = columns._Name;
      singleColumn.type = columns._Type.replace('Edm.', '');
      odataColumns = [singleColumn];
    }

    return odataColumns;
  }

  /**
   * sets the metadata
   */
  public set metadata(metadata: any) {
    if (_.isEqual(this._metadata, metadata))
      return;

    this._metadata = metadata;

    //
    // Reset the entity
    //
    this.entity = null;
    this._entities = [];

    if (_.isEmpty(metadata) || _.isEmpty(metadata.Edmx) ||
        _.isEmpty(metadata.Edmx.DataServices) || _.isEmpty(metadata.Edmx.DataServices.Schema) ||
        _.isEmpty(metadata.Edmx.DataServices.Schema.EntityType)) {
        return;
    }

    const entityTypes = metadata.Edmx.DataServices.Schema.EntityType;
    if (_.isArray(entityTypes)) {
      for (const entityType of entityTypes) {
        const entity = new OdataEntity();
        entity.name = entityType._Name;
        entity.columns = this.extractColumns(entityType);
        this._entities.push(entity);
      }
    } else if (_.isObject(entityTypes)) {
        const singleEntity = new OdataEntity();
        singleEntity.name = entityTypes._Name;
        singleEntity.columns = this.extractColumns(entityTypes);
        this._entities = [singleEntity];
    }

    if (! _.isEmpty(this._entities)) {
      this._entity = this._entities[0];
    }
  }

  /**
   * @returns metadata failure flag
   */
  public get metadataFailure(): boolean {
    return this._metadataFailure;
  }

  /**
   * sets the metadata failure flag
   */
  public set metadataFailure(metadataFailure: boolean) {
    this._metadataFailure = metadataFailure;
  }

  /**
   * @returns entity
   */
  public get entity(): OdataEntity {
    return this._entity;
  }

  /**
   * Sets the entity
   */
  public set entity(entity: OdataEntity) {
    this._entity = entity;
  }

  /**
   * @returns entities
   */
  public get entities(): OdataEntity[] {
    if (_.isEmpty(this._entities))
      return [];

    return this._entities;
  }

  /**
   * @returns limit
   */
  public get limit(): string {
    return this._limit;
  }

  /**
   * Sets the limit
   */
  public set limit(limit: string) {
    this._limit = limit;
  }

  /**
   * @returns the selected columns
   */
  public get columns(): OdataColumn[] {
    return this._columns;
  }

  /**
   * Is this column with name selected
   */
  public hasColumn(columnName: string): boolean {
    for (const column of this.columns) {
      if (_.isEqual(columnName, column.name))
        return true;
    }

    return false;
  }

  /**
   * Add a column
   */
  public addColumn(column: OdataColumn): void {
    if (this.hasColumn(column.name))
      return; // already selected

    this._columns.push(column);
  }

  /**
   * Remove a column
   */
  public removeColumn(column: OdataColumn): void {
    if (! this.hasColumn(column.name))
      return; // not present

    const index = this._columns.indexOf(column);
    if (index > -1) {
      this._columns.splice(index, 1);
    }
  }

  /**
   * @returns available where clauses
   */
  public get wheres(): OdataWhere[] {
    if (_.isEmpty(this._wheres))
      return [];

    return this._wheres;
  }

  /**
   * @returns true if there are where clauses defined
   */
  public get hasWhere(): boolean {
    return this._wheres.length > 0;
  }

  /**
   * Add a where
   */
  public addWhere(where: OdataWhere): void {
    this._wheres.push(where);
  }

  /**
   * Remove a where
   */
  public removeWhere(where: OdataWhere): void {
    const index = this._wheres.indexOf(where);
    if (index > -1) {
      this._wheres.splice(index, 1);
    }
  }

  /**
   * Converts the limit value into the odata limit clause
   */
  public convertLimit(): string {
    if (_.isEmpty(this.limit))
      return '';

    if (Odata.LIMITS[0] === this.limit)
      return '?'; // no limit

    if (Odata.LIMITS[1] === this.limit)
      return '/$count?'; // count

    return this.limit.replace('top ', '?$top=') + '&';
  }

  /**
   * Converts the where clauses into odata where clauses
   */
  public convertWhere(): string {
    if (this._wheres.length === 0)
      return '';

    const SPACE = ' ';
    const OBKT = '(';
    const CBKT = ')';
    const QUOTE = "'";
    const COMMA = ',';

    const prefix = '$filter=';
    let clauses = '';

    for (let i = 0; i < this._wheres.length; ++i) {
      const where = this._wheres[i];
      const column: OdataColumn = where.column;
      const condition: string = where.condition;
      const value: string = where.value;

      if (! column || ! value)
        continue; // ignore incomplete where clauses

      if (clauses.length > 0 && i > 0)
        clauses = clauses + SPACE + 'and' + SPACE;

      let clause = '';
      if (condition === Odata.EQUALS)
        clause = column.name + SPACE + 'eq' + SPACE + QUOTE + value + QUOTE;
      else if (condition === Odata.NOT_EQUALS)
        clause = column.name + SPACE + 'ne' + SPACE + QUOTE + value + QUOTE;
      else if (condition === Odata.GREATER_THAN || condition === Odata.AFTER_DATE)
        clause = column.name + SPACE + 'gt' + SPACE + QUOTE + value + QUOTE;
      else if (condition === Odata.GREATER_THAN_EQ_TO || condition === Odata.BEFORE_EQ)
        clause = column.name + SPACE + 'ge' + SPACE + QUOTE + value + QUOTE;
      else if (condition === Odata.LESS_THAN || condition === Odata.BEFORE_DATE)
        clause = column.name + SPACE + 'lt' + SPACE + QUOTE + value + QUOTE;
      else if (condition === Odata.LESS_THAN_EQ_TO || condition === Odata.AFTER_EQ)
        clause = column.name + SPACE + 'le' + SPACE + QUOTE + value + QUOTE;
      else if (condition === Odata.EQUALS_CINS) {
        //
        // tolower(Description) eq tolower('value')
        //
        clause = 'tolower' + OBKT + column + CBKT +
                 SPACE + 'eq' + SPACE +
                 'tolower' + OBKT + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.NOT_EQUALS_CINS) {
        //
        // tolower(Description) ne tolower('value')
        //
        clause = 'tolower' + OBKT + column + CBKT + SPACE + 'ne' + SPACE +
                 'tolower' + OBKT + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.STARTS_WITH) {
        //
        // startswith(Description, 'value')
        //
        clause = 'startswith' + OBKT + column.name + COMMA + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.NO_STARTS_WITH) {
        //
        // not startswith(Description, 'value')
        //
        clause = 'not startswith' + OBKT + column.name + COMMA + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.ENDS_WITH) {
        //
        // endswith(Description, 'value')
        //
        clause = 'endswith' + OBKT + column.name + COMMA + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.NO_ENDS_WITH) {
        //
        // not endswith(Description, 'value')
        //
        clause = 'not endswith' + OBKT + column.name + COMMA + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.CONTAINS) {
        //
        // contains(Description, 'value')
        //
        clause = 'contains' + OBKT + column.name + COMMA + QUOTE + value + QUOTE + CBKT;
      }
      else if (condition === Odata.LENGTH_EQ) {
        //
        // length(Description) eq 5
        //
        clause = 'length' + OBKT + column.name + CBKT + SPACE + 'eq' + SPACE + value;
      }
      else if (condition === Odata.IN) {
        //
        // in separated by ;, eg. 1;2
        // becomes
        // (ID eq 1 or ID eq 2)
        //
        clause = OBKT;
        const values = value.split(';');
        for (let j = 0; j < values.length; ++j) {
          if (j > 0)
            clause = clause + SPACE + 'or' + SPACE;

          clause = clause + column.name + SPACE + 'eq' + SPACE + values[j];
        }
        clause = clause + CBKT;
      }

      clauses = clauses + clause;
    }

    if (clauses.length > 0)
      return prefix + clauses + '&';

    return clauses;
  }

  /**
   * Converts the column array into odata select clause
   */
  public convertColumns(): string {
    if (this._columns.length === 0)
      return '';

    //
    // Column selection not applicable with count only
    //
    if (this.limit === Odata.COUNT_ONLY)
      return '';

    let value = '$select=';
    for (let i = 0; i < this._columns.length; ++i) {
      value = value + this._columns[i].name;

      if ((i + 1) < this._columns.length)
        value = value + ',';
    }

    return value + '&';
  }

  /**
   * Converts the order by values into odata orderby clause
   */
  public convertOrderBy(): string {
    if (this._entity.columns.length === 0)
      return '';

    //
    // orderby not applicable with count only
    //
    if (this.limit === Odata.COUNT_ONLY)
      return '';

    const orderbyPrefix = '$orderby=';
    let value = orderbyPrefix;
    for (let i = 0; i < this._entity.columns.length; ++i) {
      const column: OdataColumn = this._entity.columns[i];
      if (!column.sort)
        continue;

      if ('asc' === column.sort)
        value = value + column.name;
      else if ('desc' === column.sort)
        value = value + column.name + ' desc';

      if ((i + 1) < this._entity.columns.length)
        value = value + ',';
    }

    // Remove trailing comma if applicable
    if (value.endsWith(','))
      value = value.substring(0, value.length - 1);

    if (value === orderbyPrefix)
      return '';

    return value + '&';
  }

}
