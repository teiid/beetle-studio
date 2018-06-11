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

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { PageErrorComponent } from "@shared/page-error/page-error.component";
import { TestDataService } from "@shared/test-data.service";
import { ModalModule } from "ngx-bootstrap";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { PropertyFormPropertyComponent } from "./property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "./property-form/property-form.component";
import { SlideInComponent } from "./slide-in/slide-in.component";
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [
    ConfirmDialogComponent,
    PageErrorComponent,
    PageNotFoundComponent,
    PropertyFormComponent,
    PropertyFormPropertyComponent,
    SlideInComponent,
    ProgressDialogComponent
  ],
  exports: [
    ConfirmDialogComponent,
    PageErrorComponent,
    PageNotFoundComponent,
    ProgressDialogComponent,
    PropertyFormComponent,
    PropertyFormPropertyComponent,
    SlideInComponent
  ],
  providers: [
    TestDataService
  ],
})
export class SharedModule {
}
