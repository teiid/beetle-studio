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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { NewConnection } from '@connections/shared/new-connection.model';

@Component({
  selector: 'app-add-connection-form',
  templateUrl: './add-connection-form.component.html',
  styleUrls: ['./add-connection-form.component.css']
})
export class AddConnectionFormComponent implements OnInit {

  @Output() onCreateConnection = new EventEmitter<NewConnection>();

  model = new NewConnection();
  creatingConnection = false;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  get currentConnection() { return JSON.stringify(this.model); }

  /**
   * Called when the user clicks the "Create Connection" submit button on the form.
   */
  public createConnection(): void {
    const connection: NewConnection = new NewConnection();
    connection.setName(this.model.getName());
    connection.setJndiName(this.model.getJndiName());
    connection.setDriverName(this.model.getDriverName());
    connection.setJdbc(this.model.isJdbc());

    console.log('[AddConnectionFormComponent] Firing create-connection event: %o', connection);

    this.creatingConnection = true;
    this.onCreateConnection.emit(connection);
  }

  public cancelAdd(): void {
    const link: string[] = [ '/connections' ];
    this.router.navigate(link);
  }

}
