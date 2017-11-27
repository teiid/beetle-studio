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

import { ReflectiveInjector } from "@angular/core";
import { AppSettingsService } from "@core/app-settings.service";
import { Identifiable } from "@shared/identifiable";
import { SortDirection } from "@shared/sort-direction.enum";

export class Dataservice implements Identifiable< string > {

  private keng__id: string;
  private tko__description: string;
  private serviceVdbName: string;
  private serviceVdbVersion: string;
  private serviceView: string;
  private serviceViewModel: string;
  private serviceViewTables: string[];
  private appSettings: AppSettingsService;

  /**
   * @param {Object} json the JSON representation of a Dataservice
   * @returns {Dataservice} the new Dataservice (never null)
   */
  public static create( json: object = {} ): Dataservice {
    const svc = new Dataservice();
    svc.setValues( json );
    return svc;
  }

  /**
   * @param {Dataservice[]} dataservices the dataservices being sorted
   * @param {SortDirection} sortDirection the sort direction
   */
  public static sort( dataservices: Dataservice[],
                      sortDirection: SortDirection ): void {
    dataservices.sort( ( thisDataservice: Dataservice, thatDataservice: Dataservice ) => {
      const result = thisDataservice.compareTo( thatDataservice );

      if ( sortDirection === SortDirection.DESC ) {
        return result * -1;
      }

      return result;
    } );
  }

  constructor( ) {
    const injector = ReflectiveInjector.resolveAndCreate([AppSettingsService]);
    this.appSettings = injector.get(AppSettingsService);
  }

  /**
   * See {Identifiable}.
   */
  public compareTo( that: Dataservice ): number {
    let result = 0;

    if ( this.getId() ) {
      if ( that.getId() ) {
        // both have an ID
        result = this.getId().localeCompare( that.getId() );
      } else {
        // thatItem does not have an ID
        result = 1;
      }
    } else if ( that.getId() ) {
      // thisItem does not have an ID and thatItem does
      result = -1;
    }

    return result;
  }

  /**
   * @returns {string} the dataservice identifier (can be null)
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {string} the dataservice description (can be null)
   */
  public getDescription(): string {
    return this.tko__description;
  }

  /**
   * @returns {string} the dataservice Vdb name (can be null)
   */
  public getServiceVdbName(): string {
    return this.serviceVdbName;
  }

  /**
   * @returns {string} the dataservice Vdb version (can be null)
   */
  public getServiceVdbVersion(): string {
    return this.serviceVdbVersion;
  }

  /**
   * @returns {string} the dataservice view name (can be null)
   */
  public getServiceViewName(): string {
    return this.serviceView;
  }

  /**
   * @returns {string} the dataservice view model name (can be null)
   */
  public getServiceViewModel(): string {
    return this.serviceViewModel;
  }

  /**
   * @returns {string} the dataservice view table names array (can be null)
   */
  public getServiceViewTables(): string[] {
    return this.serviceViewTables;
  }

  /**
   * @returns {string} the dataservice dataPath (can be null)
   */
  public getDataPath(): string {
    return this.appSettings.getKomodoUserWorkspacePath() + "/" + this.keng__id;
  }

  /**
   * @returns {string} the dataservice type name (can be null)
   */
  public getType(): string {
    return "Dataservice";
  }

  /**
   * @param {string} id the dataservice identifier (optional)
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {string} description the dataservice description (optional)
   */
  public setDescription( description?: string ): void {
    this.tko__description = description ? description : null;
  }

  /**
   * @param {string} name the dataservice service vdb name
   */
  public setServiceVdbName( name: string ): void {
    this.serviceVdbName = name;
  }

  /**
   * @param {string} version the dataservice service vdb version
   */
  public setServiceVdbVersion( version: string ): void {
    this.serviceVdbVersion = version;
  }

  /**
   * @param {string} viewName the dataservice view name
   */
  public setServiceViewName( viewName: string ): void {
    this.serviceView = viewName;
  }

  /**
   * @param {string} viewModel the dataservice view model
   */
  public setServiceViewModel( viewModel: string ): void {
    this.serviceViewModel = viewModel;
  }

  /**
   * @param {string[]} viewTables the dataservice view tables
   */
  public setServiceViewTables( viewTables: string[] ): void {
    this.serviceViewTables = viewTables;
  }

  // overrides toJSON - we do not want the appSettings
  public toJSON(): {} {
    return {
      keng__id: this.keng__id,
      tko__description: this.tko__description,
      serviceVdbName: this.serviceVdbName,
      serviceVdbVersion: this.serviceVdbVersion,
      serviceView: this.serviceView,
      serviceViewModel: this.serviceViewModel,
      serviceViewTables: this.serviceViewTables
    };
  }

  /**
   * Set all object values using the supplied Dataservice json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
