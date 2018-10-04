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

import { CommandType } from "@dataservices/virtualization/view-editor/command/command-type.enum";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { Composition } from "@dataservices/shared/composition.model";
import { PathUtils } from "@dataservices/shared/path-utils";
import { SelectionType } from "@dataservices/virtualization/view-editor/view-property-editors/property-editor/selection-type.enum";

/**
 * SelectionItem model - interprets the selection string and provides the payload in object form
 */
export class SelectionItem {

  private editorService: ViewEditorService;
  private selectionType = SelectionType.UNKNOWN;
  private srcPath = "";
  private comp: Composition;

  constructor(editorService: ViewEditorService) {
    this.editorService = editorService;
  }

  /**
   * Set the selection string
   * @param {string} selection the selection
   */
  public setSelection( selection: string ): void {
    if ( !selection || selection === null ) return;

    const commandType = this.editorService.getSelectionCommandType(selection);
    const payload = this.editorService.getSelectionPayload(selection);

    if ( commandType === CommandType.ADD_SOURCES_COMMAND ) {
      this.selectionType = SelectionType.SOURCE;
      this.srcPath = payload;
    } else if ( commandType === CommandType.ADD_COMPOSITION_COMMAND ) {
      this.selectionType = SelectionType.COMPOSITION;
      this.comp = Composition.create(JSON.parse(payload));
    } else {
      this.selectionType = SelectionType.UNKNOWN;
    }
  }

  /**
   * Get the type of selection
   * @return {SelectionType} the selection type
   */
  public getSelectionType(): SelectionType {
    return this.selectionType;
  }

  /**
   * Get the source connection name
   * @return {string} the source connection name
   */
  public getSourceConnectionName(): string {
    return PathUtils.getConnectionName(this.srcPath);
  }

  /**
   * Get the source name
   * @return {string} the source name
   */
  public getSourceName(): string {
    return PathUtils.getSourceName(this.srcPath);
  }

  /**
   * Get the composition
   * @return {Composition} the composition
   */
  public getComposition(): Composition {
    return this.comp;
  }

}
