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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { About } from "@core/about-dialog/about.model";
import { AboutEvent } from "@core/about-dialog/about-event";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent {

  /**
   * The Event is emitted when modal is closed
   */
  @Output( 'onCancel' ) public onCancel = new EventEmitter();

  /**
   * The about information.
   */
  @Input() public info: About;

  /**
   * The default contructor
   */
  constructor() {
    // nothing to do
  }

  public get appImageAlt(): string {
    return "Beetle Studio image";
  }

  public get appImageSrc(): string {
    return "assets/teiid-lizard-gradient-bgd.png";
  }

  public close(): void {
    this.onCancel.emit( {
      close: true
    } as AboutEvent );
  }

  public get logoImageAlt(): string {
    return "Red Hat Logo image";
  }

  public get logoImageSrc(): string {
    return "assets/redhat-iot.png";
  }

}
