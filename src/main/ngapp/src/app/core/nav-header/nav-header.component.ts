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

import {Component, OnInit, Inject} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: [ './nav-header.component.less' ]
})
export class NavHeaderComponent implements OnInit {

  version = 'N/A';
  builtOn: Date = new Date();
  projectUrl = 'http://jboss.org/teiiddesigner/';

  constructor() {
    if (window['ApicurioStudioInfo']) {
      console.log('[NavHeaderComponent] Found app info: %o', window['ApicurioStudioInfo'])
      this.version = window['ApicurioStudioInfo'].version;
      this.builtOn = new Date(window['ApicurioStudioInfo'].builtOn);
      this.projectUrl = window['ApicurioStudioInfo'].url;
    } else {
      console.log('[NavHeaderComponent] App info not found.');
    }
  }

  ngOnInit(): void {
  }

  public user(): string {
    return 'User';
  }

  public logout(): void {
  }

}
