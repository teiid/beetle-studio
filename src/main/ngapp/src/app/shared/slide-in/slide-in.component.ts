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

import { Component, ElementRef, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "slide-in",
  templateUrl: "./slide-in.component.html",
  styleUrls: ["./slide-in.component.css"]
})
/**
 * Slide In.  Invoke this from another component as follows:
 *
 * <slide-in openedWidth='{40%/300px/50em/.../...}'
 *           (onBeforeOpen)='doSomethingBeforeOpening()'
 *           (onAfterOpen)='doSomethingAfterOpening()'
 *           (onBeforeClose)='doSomethingBeforeClosing()'
 *           (onAfterClose)='doSomethingAfterClosing()'>
 *   <div slide-in-button>
 *     <!-- Style for the button to initiate the slide-in -->
 *     <!-- Maybe ... -->
 *     <span class="pull-left fa fa-cogs fa-2x card-action-icon"
 *       style="color:green;"
 *       data-toggle="tooltip"
 *       data-placement="right"
 *       title="Virtualization Published">
 *     </span>
 *     <!-- or -->
 *     <button class="btn btn-primary">Open</button>
 *   </div>
 *   <div slide-in-content>
 *     <!-- Content of the slide-in -->
 *   </div>
 * </slide-in>
 */
export class SlideInComponent {

  @Input()
  private openedWidth = '30%';

  @Output()
  private onBeforeOpen: EventEmitter<any> = new EventEmitter();

  @Output()
  private onAfterOpen: EventEmitter<any> = new EventEmitter();

  @Output()
  private onBeforeClose: EventEmitter<any> = new EventEmitter();

  @Output()
  private onAfterClose: EventEmitter<any> = new EventEmitter();

  private state = false;

  private readonly hostElement: ElementRef;

  constructor(elRef: ElementRef) {
    this.hostElement = elRef;
  }

  private beforeStateChange(): void {
    if (! this.state) {
      // state is closed and about to be opened
      this.onBeforeOpen.emit();
    } else {
      // state is opened and about to be closed
      this.onBeforeClose.emit();
    }
  }

  private afterStateChange(): void {
    if (this.state) {
      // state has been changed to open
      this.onAfterOpen.emit();
    } else {
      // state has been changed to closed
      this.onAfterClose.emit();
    }
  }

  public showHide(): void {
    this.beforeStateChange();

    this.state = !this.state;

    this.afterStateChange();
  }

  public close(): void {
    this.beforeStateChange();

    this.state = false;

    this.afterStateChange();
  }

  public slideInWidth(): string {
    if (this.state)
      return this.openedWidth;
    else
      return "0";
  }

  public slideInClasses(): string {
    let classes = 'slide-in';
    const screenWidth = window.screen.width;
    if (this.hostElement && this.hostElement.nativeElement) {
      const posLeft = this.hostElement.nativeElement.offsetLeft;
      const screenMiddle = screenWidth / 2;
      if (posLeft > screenMiddle)
        classes = classes + ' slide-in-left';
      else
        classes = classes + ' slide-in-right';
    }

    return classes;
  }
}
