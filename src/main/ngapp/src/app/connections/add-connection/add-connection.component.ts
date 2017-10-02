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

import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AddConnectionFormComponent } from '@connections/shared/add-connection-form/add-connection-form.component';
import { ConnectionService } from '@connections/shared/connection.service';
import { NewConnection } from '@connections/shared/new-connection.model';
import { AbstractPageComponent } from '@shared/abstract-page.component';

@Component({
  selector: 'app-add-connection',
  templateUrl: '@connections/add-connection.component.html',
  styleUrls: ['@connections/add-connection.component.css']
})
export class AddConnectionComponent extends AbstractPageComponent {

  @ViewChild(AddConnectionFormComponent) form: AddConnectionFormComponent;

  constructor(private router: Router, route: ActivatedRoute, private apiService: ConnectionService) {
    super(route);
  }

  /**
   * Called when the Add Connection form (component) emits a "add-connection" event.  This is bound to
   * from the add-connection.page.html template.
   * @param {NewConnection} connection
   */
  public onCreateConnection(connection: NewConnection) {
    console.log('[AddConnectionComponent] onCreateConnection(): ' + JSON.stringify(connection));
    this.apiService
      .createConnection(connection)
      .subscribe(
      () => {
        this.form.creatingConnection = false;
        const link: string[] = [ '/connections' ];
        console.log('[AddConnectionComponent] Navigating to: %o', link);
        this.router.navigate(link);
      }
    );

  }

}
