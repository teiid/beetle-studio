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
import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CanvasService } from '@dataservices/virtualization/view-editor/view-canvas/canvas.service';
import { CanvasConstants } from '@dataservices/virtualization/view-editor/view-canvas/canvas-constants';
import { CanvasGraph, CanvasNode, CanvasLink } from '@dataservices/virtualization/view-editor/view-canvas/models';
import * as d3 from 'd3';
import * as _ from "lodash";

/*
 * Explanation of arrowhead
 *
 * Provides an svg marker that is drawn at the end of each link
 *
 * refX: moves the arrowhead back along the line so it can be seen, ie. N---->---N
 * refY: moves the arrowhead up/below the line. In this case it stays on the line
 * orient: changes orientation to match the line
 * markerWidth: total area of the marker to be displayed. Arrow is 10 and covering rectangle is 50 so chosen 60
 * markerHeight: have to be careful but basically the height of the arrow
 * viewBox: the viewport of the marker - lots of trial n error to get this sorted!
 *
 * path: the path of to draw the arrowhead
 * rect: the rectangle that covers up the remaining end of the line to provide a space, ie. N ---->   N
 *
 */
@Component({
  selector: 'canvas-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg id="canvasGraph" #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <defs>
        <marker id="arrowtail"
                  refX="0"
                  refY="5"
                  orient="auto"
                  markerWidth="55"
                  markerHeight="10"
                  xoverflow=visible>
          <rect x="0" y="0" width="55" height="50" class="cover-up"></rect>
        </marker>
        <marker id="arrowhead"
                  refX="45"
                  refY="0"
                  orient="auto"
                  markerWidth="60"
                  markerHeight="10"
                  xoverflow="visible"
                  viewBox="0 -5 10 10">
          <path d="M 0,-5 L 10,0 L 0,5" style="stroke: none;"></path>
          <rect x="10" y="-10" width="50" height="50" class="cover-up"></rect>
        </marker>
      </defs>
      <g>
        <g [link-visual]="link" *ngFor="let link of links"></g>
        <g [node-visual]="node" [id]="node.id" *ngFor="let node of nodes"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph-visual.component.css']
})
export class GraphVisualComponent implements OnInit {

  public canvasGraph: CanvasGraph;
  public _options: { width: number, height: number } = { width: 800, height: 600 };

  private canvasService: CanvasService;
  private ref: ChangeDetectorRef;

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.canvasService.update(true, this.options);
  }

  constructor(canvasService: CanvasService, ref: ChangeDetectorRef) {
    this.canvasService = canvasService;
    this.ref = ref;
  }

  public get nodes(): CanvasNode[] {
    return this.canvasService.nodes();
  }

  public get links(): CanvasLink[] {
    return this.canvasService.links();
  }

  public ngOnInit(): void {
    console.log("graph-visual: ngOnInit");

    /** Receiving an initialized simulated graph from our custom canvas.service */
    this.canvasGraph = this.canvasService.newCanvasGraph(this.options, this.ref);
  }

  public get options(): any {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
