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

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConnectionCardComponent } from "@connections/connections-cards/connection-card/connection-card.component";
import { Connection } from "@connections/shared/connection.model";

@Component({
  moduleId: module.id,
  selector: "app-connections-cards",
  templateUrl: "connections-cards.component.html",
  styleUrls: ["connections-cards.component.css"]
})
export class ConnectionsCardsComponent {

  @Input() public connections: Connection[];
  @Input() public selectedConnections: Connection[];

  @Output() public connectionSelected: EventEmitter<Connection> = new EventEmitter<Connection>();
  @Output() public connectionDeselected: EventEmitter<Connection> = new EventEmitter<Connection>();
  @Output() public deleteConnection: EventEmitter<string> = new EventEmitter<string>();
  @Output() public editConnection: EventEmitter<string> = new EventEmitter<string>();
  @Output() public pingConnection: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Constructor.
   */
  constructor() {
    // nothing to do
  }

  public isSelected( connection: Connection ): boolean {
    return this.selectedConnections.indexOf( connection ) !== -1;
  }

  public onCardEvent( event: { eventType: string,
                               connectionName: string } ): void {
    switch ( event.eventType ) {
      case ConnectionCardComponent.deleteConnectionEvent:
        this.deleteConnection.emit( event.connectionName );
        break;
      case ConnectionCardComponent.editConnectionEvent:
        this.editConnection.emit( event.connectionName );
        break;
      case ConnectionCardComponent.pingConnectionEvent:
        this.pingConnection.emit( event.connectionName );
        break;
      default:
        // TODO log this
        // this.logger.error( "Unhandled event type of '" + event.eventType + "'" );
        break;
    }
  }

  public onSelectEvent( connection: Connection ): void {
    this.connectionSelected.emit( connection );
  }

}
