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
import * as d3 from 'd3';
import * as cola from 'webcola';
import { CanvasNode } from '@dataservices/virtualization/view-editor/view-canvas/models/canvas-node';

export class CanvasLink implements cola.Link<CanvasNode> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // source and target nodes for the CanvasLink
  private src: CanvasNode;
  private tgt: CanvasNode;

  constructor(source: CanvasNode, target: CanvasNode) {
    this.src = source;
    this.tgt = target;
  }

  public get source(): CanvasNode {
    return this.src;
  }

  public set source(src: CanvasNode) {
    this.src = src;
  }

  public get target(): CanvasNode {
    return this.tgt;
  }

  public set target(tgt: CanvasNode) {
    this.tgt = tgt;
  }
}
