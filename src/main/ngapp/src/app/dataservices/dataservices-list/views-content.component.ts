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

import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { ListConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-views-content",
  templateUrl: "./views-content.component.html"
})
export class ViewsContentComponent implements OnInit {

  @Input() public item: Dataservice;
  @Input() public selectedDataservices: Dataservice[];

  public listConfig: ListConfig;

  constructor() {
    // nothing to do
  }

  /**
   * @param {string} view the view whose connections are being requested
   * @returns {Connection[]} the connections of the dataservice represented by this card
   */
  public getConnections( view: string ): Connection[] {
    // TODO rewrite when REST functionality has been implemented
    const result: Connection[] = [];

    const c1 = new Connection();
    c1.setId( "ConnectionOne" );
    result.push( c1 );

    const c2 = new Connection();
    c2.setId( "ConnectionTwo" );
    result.push( c2 );

    const c3 = new Connection();
    c3.setId( "ConnectionThree" );
    result.push( c3 );

    return result;
  }

  /**
   * @param {Dataservice} ds the dataservice whose views are being requested
   * @returns {string[]} the names of the views
   */
  public getViews( ds: Dataservice ): string[] {
    const result: string[] = [];

    for (const viewName of ds.getServiceViewNames()) {
      result.push(viewName);
    }

    return result;
  }

  public ngOnInit(): void {
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
  }

}
