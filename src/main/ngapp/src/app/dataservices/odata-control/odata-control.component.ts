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

import { Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import * as _ from "lodash";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";
import { ColumnData } from "@dataservices/shared/column-data.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { OdataConstants } from "@dataservices/odata-control/odata-constants";
import { Odata } from "@dataservices/odata-control/odata.model";
import { OdataEntity } from "@dataservices/odata-control/odata-entity.model";
import { OdataColumn } from "@dataservices/odata-control/odata-column.model";
import { OdataWhere } from "@dataservices/odata-control/odata-where.model";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-odata-control",
  templateUrl: "./odata-control.component.html",
  styleUrls: ["./odata-control.component.css"]
})
export class OdataControlComponent implements OnChanges {

  @Input() private dataserviceName: string;

  @ViewChild('odataResultsEditor') private resultsEditor: any;

  private dataserviceService: DataserviceService;
  private dataservice: Dataservice;
  private logger: LoggerService;
  public i18n: OdataConstants = new OdataConstants();

  public searchMsg: string;
  public searchMsgClasses: string[];
  public searchInProgress: boolean;

  public metadataFetchInProgress: boolean;

  public odata: Odata;

  private jsonFormat = {
    mode: {
      name: "javascript",
      json: true,
      statementIndent: 2
    }
  };

  private xmlFormat = {
    mode: {
      name: "xml",
      htmlMode: "false",
    }
  };

  public resultsConfig = {
    mode: {},
    lineNumbers: true,
    lineWrapping: true,
    readOnly: true,
    placeholder: "No results",
    styleActiveLine: true,
    tabSize: 2,
    showCursorWhenSelecting: true,
    theme: "neat"
  };

  //
  // Format of the results
  //
  public resultsType = "JSON";

  //
  // Results to show from the odata query
  //
  public results: string = null;

  constructor( dataserviceService: DataserviceService, logger: LoggerService ) {
    this.dataserviceService = dataserviceService;
    this.logger = logger;
  }

  public get rootUrl(): string {
    return this.dataservice.getOdataRootUrl() + '/' + this.dataservice.getServiceViewModel();
  }

  public get metadataUrl(): string {
    return this.rootUrl + '/$metadata';
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.dataservice = this.dataserviceService.getSelectedDataservice();

    this.metadataFetchInProgress = false;

    this.searchMsg = null;
    this.searchMsgClasses = [];
    this.searchInProgress = false;
    this.odata = new Odata();

    this.results = null;

    const url = this.metadataUrl;

    this.metadataFetchInProgress = true;
    this.dataserviceService.odataGet(url)
      .subscribe(
        (response) => {
          if (! _.isEmpty(response) && this.dataserviceService.isXML(response.value)) {
            const xmlObject = this.dataserviceService.tryXMLParse(response.value);
            this.odata.metadata = xmlObject;
            this.odata.metadataFailure = false;
          } else {
            this.odata.metadata = '';
            this.odata.metadataFailure = true;
          }
          this.metadataFetchInProgress = false;
        },
        (error) => {
          this.odata.metadataFailure = true;
          this.metadataFetchInProgress = false;
          console.error('Failed to get odata metadata from\n' + url + "\n" + error);
        }
      );
  }

  /**
   * The odata endpoint url constructed from the parameters
   */
  public get endPointUrl(): string {
    if (this.odata.metadataFailure)
      return this.i18n.UrlNotAvailable;

    if (_.isEmpty(this.odata.metadata))
      return this.i18n.UrlNotAvailable;

    const baseUrl = this.rootUrl;

    if (_.isEmpty(baseUrl))
      return this.i18n.UrlNotAvailable;

    const service = this.odata.entity;
    if (_.isEmpty(service) || _.isEmpty(service.name))
      return this.i18n.UrlNotAvailable;

    let odataUrl = baseUrl + '/' + service.name;

    const limit = this.odata.convertLimit();
    if (! _.isEmpty(limit))
      odataUrl = odataUrl + limit;

    const where = this.odata.convertWhere();
    if (! _.isEmpty(where))
      odataUrl = odataUrl + where;

    const columns = this.odata.convertColumns();
    if (! _.isEmpty(columns))
      odataUrl = odataUrl + columns;

    const orderBy = this.odata.convertOrderBy();
    if (! _.isEmpty(orderBy))
      odataUrl = odataUrl + orderBy;

    //
    // Append the result format but only if the
    // query has not specified count (which is incompatible)
    //
    if (! _.isEmpty(this.resultsType) && this.odata.limit !== Odata.COUNT_ONLY) {
      odataUrl = odataUrl + "$format=" + this.resultsType.toLowerCase();
    }

    if (odataUrl.endsWith('&') || odataUrl.endsWith('?'))
      odataUrl = odataUrl.substring(0, odataUrl.length - 1);

    return odataUrl;
  }

  /**
   * @returns true if the odata control widgets
   * should be displayed.
   */
  public get hasOdataAttributes(): boolean {
    return ! _.isEmpty(this.odata.metadata);
  }

  public get metadataFailure(): boolean {
    return this.odata.metadataFailure;
  }

  public get metadataFailureMsg(): string {
    let msg = this.i18n.metadataFetchFailure + '<br/>';
    if (_.isEmpty(this.dataservice.getOdataRootUrl()))
      return msg + this.i18n.metadataFetchFailureNoOdataRoot;

    if (_.isEmpty(this.dataservice.getServiceViewModel()))
      return msg + this.i18n.metadataFetchFailureNoViewModel;


    return msg + this.i18n.metadataFetchFailureUrl + '<br/>' +
      '<a href="' + this.metadataUrl + '">' + this.metadataUrl + '</a>';
  }

  /**
   * Can the query be enacted
   * @returns {boolean} true if good to go, false otherwise
   */
  public get canQuery(): boolean {
    return !_.isEmpty(this.odata.metadata) &&
            !_.isEmpty(this.odata.entity) &&
            this.endPointUrl !== this.i18n.UrlNotAvailable;

  }

  /**
   * @returns {OdataEntity[]} the available entities
   */
  public get entities(): OdataEntity[] {
    if (_.isEmpty(this.odata.entities))
      return [];

    return this.odata.entities;
  }

  /**
   * @returns {OdataEntity} the selected entitie
   */
  public get entity(): OdataEntity {
    if (_.isEmpty(this.odata.entity))
      return null;

    return this.odata.entity;
  }

  /**
   * Set the selected entity
   */
  public set entity(entity: OdataEntity) {
    this.odata.entity = entity;
  }

  /**
   * @returns {string[]} the available limit options
   */
  public get limits(): string[] {
    return Odata.LIMITS;
  }

  /**
   * @returns {string} the selected limit
   */
  public get limit(): string {
    if (_.isEmpty(this.odata.limit))
      return '';

    return this.odata.limit;
  }

  /**
   * Set the selected limit
   */
  public set limit(limit: string) {
    this.odata.limit = limit;
  }

  /**
   * Return the available columns for the selected entity
   */
  public get columns(): OdataColumn[] {
    if (_.isEmpty(this.odata.entity) || _.isEmpty(this.odata.entity.columns)) {
      return [];
    }

    return this.odata.entity.columns;
  }

  /**
   * Return the selected columns
   */
  public get selectedColumns(): OdataColumn[] {
    return this.odata.columns;
  }

  /**
   * Used by column checkboxes to determine if a checkbox
   * should be checked.
   */
  public isColumnSelected(columnName: string): boolean {
    return this.odata.hasColumn(columnName);
  }

  /**
   * Updates the column selection when its checkbox has been (un)checked
   */
  public updateColumnSelection(checked: boolean, column: OdataColumn): void {
    if (checked) {
      this.odata.addColumn(column);
    }
    else {
      this.odata.removeColumn(column);
    }
  }

  /**
   * Return the available wheres
   */
  public get wheres(): OdataWhere[] {
    return this.odata.wheres;
  }

  /**
   * On changing the where column selection:
   * * Remove the where condition since it may be invalid
   * * Check the column is queryable and if not display an error
   */
  public onWhereColumnSelected(where: OdataWhere): void {
    if (! _.isEmpty(where) && ! _.isEmpty(where.condition))
      delete where.condition;

    if (! _.isEmpty(where.column)) {
      const index = _.indexOf(Odata.QUERYABLE_TYPES, where.column.type);
      if (index < 0)
        where.error = this.i18n.whereErrorMsg;
      else
        where.error = null;
    }
  }

  /**
   * Event handler for adding a where condition
   */
  public onAddWhereClicked(): void {
    try {
      const newWhere: OdataWhere = new OdataWhere();
      this.odata.addWhere(newWhere);
    } catch (error) {
      // nothing to do
    }
  }

  /**
   * Event handler for removing a where condition
   */
  public onRemoveWhereClicked(where): void {
    try {
      if (_.isEmpty(where))
        return;

      this.odata.removeWhere(where);

      if (this.odata.wheres.length === 0) {
        //
        // Always keep 1 empty clause so preserve buttons
        //
        const newWhere: OdataWhere = new OdataWhere();
        this.odata.addWhere(newWhere);
      }

    } catch (error) {
      // nothing to do
    }
  }

  /**
   * Provides the choices to select for a where clause
   * depending on the type of column already selected
   */
  public whereConditions(where: OdataWhere): Array<string> {
    if (_.isEmpty(where) || _.isEmpty(where.column))
      return [];

    const index = _.indexOf(Odata.QUERYABLE_TYPES, where.column.type);
    if (index < 0)
      return [];
    else if (index === 0) // Boolean
      return this.odata.booleanConditions();
    else if (index === 1) // String
      return this.odata.stringConditions();
    else if (index <= 11) // number
      return this.odata.intConditions();
    else if (index > 11) // DateTime
      return this.odata.dateConditions();
    else
      return [];
  }

  public get showResults(): boolean {
    return ! _.isEmpty(this.results);
  }

  /**
   * Submit the query for evaluation
   */
  public submitQuery(): void {
    this.searchMsg = null;
    this.searchMsgClasses = [];
    this.searchInProgress = true;

    this.dataserviceService.odataGet(this.endPointUrl)
      .subscribe(
        (response) => {
          this.results = null;

          // Remove the search progress spinner
          this.searchInProgress = false;

          if (response.error) {
            this.searchMsgClasses = ['odata-results-msg-error'];
            this.searchMsg = this.i18n.searchErrorMsg + response.error;
            return;
          }

          if (response.count) {
            //
            // Handles the count function by returning a
            //
            this.searchMsgClasses = ['odata-results-msg-info'];
            this.searchMsg = this.i18n.resultCountMsg + response.count;
            return;
          }

          if (_.isEmpty(response.value)) {
            this.searchMsgClasses = ['odata-results-msg-info'];
            this.searchMsg = this.i18n.noResultsMsg;
            return;
          }

          const instance = this.resultsEditor.instance;
          if (this.resultsType === "XML") {
            instance.setOption('mode', this.xmlFormat.mode);
          } else {
            instance.setOption('mode', this.jsonFormat.mode);
          }

          this.results = response.value;
      },
      (error) => {
        this.results = null;
        this.searchInProgress = false;
        this.searchMsgClasses = ['odata-results-msg-error'];
        this.searchMsg = 'Failed to get odata results ' + error;
      }
    );
  }
}
