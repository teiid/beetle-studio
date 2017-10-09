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

import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { NewConnection } from "@connections/shared/new-connection.model";

@Component({
  moduleId: module.id,
  selector: "app-add-connection-form",
  templateUrl: "./add-connection-form.component.html",
  styleUrls: ["./add-connection-form.component.css"]
})
export class AddConnectionFormComponent {

  private creatingConnection = false;
  private model = new NewConnection();
  private router: Router;

  @Output() private onCreateConnection = new EventEmitter<NewConnection>();

  constructor( router: Router ) {
    this.router = router;
  }

  /**
   * @returns {string} the name of the connection
   */
  public get connectionName(): string {
    return this.model.getName();
  }

  /**
   * @returns {string} the driver name of the connection
   */
  public get connectionDriverName(): string {
    return this.model.getDriverName();
  }

  /**
   * @returns {boolean} true if a JDBC connection
   */
  public get connectionIsJdbc(): boolean {
    return this.model.isJdbc();
  }

  /**
   * @returns {string} the JNDI name of the connection
   */
  public get connectionJndiName(): string {
    return this.model.getJndiName();
  }

  public currentConnection(): string {
    return JSON.stringify(this.model);
  }

  /**
   * Called when the user clicks the "Create Connection" submit button on the form.
   */
  public createConnection(): void {
    const connection: NewConnection = new NewConnection();
    connection.setName(this.model.getName());
    connection.setJndiName(this.model.getJndiName());
    connection.setDriverName(this.model.getDriverName());
    connection.setJdbc(this.model.isJdbc());

    console.log("[AddConnectionFormComponent] Firing create-connection event: %o", connection);

    this.creatingConnection = true;
    this.onCreateConnection.emit(connection);
  }

  public cancelAdd(): void {
    const link: string[] = [ ConnectionsConstants.connectionsRootPath ];
    this.router.navigate(link);
  }

  /**
   * Called when the connection has been created.
   */
  public connectionCreated(): void {
    this.creatingConnection = false;
  }
}
