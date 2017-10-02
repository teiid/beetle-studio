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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ActivitiesModule } from "@activities/activities.module";
import { AppComponent } from '@app/app.component';
import { ConnectionsModule } from "@connections/connections.module";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ActivitiesModule,
    BrowserModule,
    ConnectionsModule,
    CoreModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
