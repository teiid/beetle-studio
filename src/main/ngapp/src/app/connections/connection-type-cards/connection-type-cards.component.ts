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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ConnectionType } from "@connections/shared/connection-type.model";

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: "app-connection-type-cards",
  templateUrl: "./connection-type-cards.component.html",
  styleUrls: ["./connection-type-cards.component.css"]
})

export class ConnectionTypeCardsComponent {

  @Input() public connectionTypes: ConnectionType[];
  @Input() public selectedConnectionTypes: ConnectionType[];
  @Output() public connectionTypeSelected: EventEmitter<ConnectionType> = new EventEmitter<ConnectionType>();
  @Output() public connectionTypeDeselected: EventEmitter<ConnectionType> = new EventEmitter<ConnectionType>();

  /**
   * constructor
   */
  constructor( ) {
    // nothing to do
  }

  public isSelected( connectionType: ConnectionType ): boolean {
    return this.selectedConnectionTypes.indexOf( connectionType ) !== -1;
  }

  public onSelectEvent( connectionType: ConnectionType ): void {
    this.connectionTypeSelected.emit( connectionType );
  }

}
