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
import { Component, Input } from '@angular/core';
import { CanvasNode } from '@dataservices/virtualization/view-editor/view-canvas/models';
import { CanvasService } from '@dataservices/virtualization/view-editor/view-canvas/canvas.service';
import { CanvasConstants } from '@dataservices/virtualization/view-editor/view-canvas/canvas-constants';
import * as _ from "lodash";

@Component({
  selector: '[node-visual]',
  template: `
    <svg:g class="node-visual" [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
      <svg:rect *ngIf="node.selected"
                [id]="id('selection')"
                [attr.x]="0 - (bboxWidth / 2)" [attr.y]="0 - (bboxHeight / 2)"
                [attr.width]="bboxWidth" [attr.height]="bboxHeight"
                class="canvas-node-selected">
      </svg:rect>
      <svg:g class="node-visual-group" [id]="id('group')">
        <svg:image class="node-img" [id]="id('icon')"
                    x="-32" y="-32"
                    width="64" height="64"
                    [attr.xlink:href]="icon">
        </svg:image>
        <svg:text class="node-name" [id]="id('label')" dy="45">
          {{node.label}}
        </svg:text>
        <svg:g class="node-visual-tools" [id]="id('tools')">
          <svg:image class="node-visual-tools-plus" [id]="id('plus')"
                   x="32" y="-32"
                   width="16" height="16"
                   [attr.xlink:href]="cmdIcon('plus')">
          </svg:image>
          <svg:image class="node-visual-tools-minus" [id]="id('minus')"
                   x="32" y="-14"
                   width="16" height="16"
                   [attr.xlink:href]="cmdIcon('minus')">
          </svg:image>
        </svg:g>
      </svg:g>
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.css']
})

export class NodeVisualComponent {

  @Input('node-visual') public node: CanvasNode;

  private canvasService: CanvasService;

  constructor(canvasService: CanvasService) {
    this.canvasService = canvasService;
  }

  /**
   * @return an id for the object type
   *         based on the node's own id
   */
  public id(type: string): string {
    return this.node.id + '-' + type;
  }

  public get icon(): string {
    if (this.node.type === CanvasConstants.SOURCE_TYPE)
      return "/assets/graphicsfuel/database-64.png";
    else if (this.node.type === CanvasConstants.COMPOSITION_TYPE)
      return "/assets/composition.png";

    return "/assets/iconfinder/Natalya-Skidan/question-mark.png";
  }

  public cmdIcon(type: string): string {
    return this.canvasService.commandIcon(type, false);
  }

  /**
   * @return the width of the bounding box of this element
   */
  public get bboxWidth(): number {
    const bbox = this.canvasService.boundingBox(this.id('group'));
    if (! bbox)
      return 100;

    return bbox.width + 10;
  }

  /**
   * @return the height of the bounding box of this element
   */
  public get bboxHeight(): number {
    const bbox = this.canvasService.boundingBox(this.id('group'));
    if (! bbox)
      return 100;

    return bbox.height + 20;
  }
}
