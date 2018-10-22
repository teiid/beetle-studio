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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-editor-header",
  templateUrl: "./view-editor-header.component.html",
  styleUrls: ["./view-editor-header.component.css"]
})
export class ViewEditorHeaderComponent implements OnInit, OnDestroy {

  private readonly editorService: ViewEditorService;

  constructor( editorService: ViewEditorService) {
    this.editorService = editorService;
  }

  /**
   * Cleanup code when destroying the view editor header.
   */
  public ngOnDestroy(): void {

  }

  /**
   * Initialization code run after construction.
   */
  public ngOnInit(): void {
  }

  /**
   * @returns {boolean} `true` if view being edited is readonly
   */
  public get readOnly(): boolean {
    return !this.editorService.getEditorView() || this.editorService.isReadOnly();
  }

  /**
   * @returns {string} the name of the dataservice of the view being edited
   */
  public get virtualizationName(): string {
    const virtualization = this.editorService.getEditorVirtualization();

    if ( virtualization ) {
      return virtualization.getId();
    }

    // should always have a virtualization name so shouldn't get here
    return "< error >";
  }
}
