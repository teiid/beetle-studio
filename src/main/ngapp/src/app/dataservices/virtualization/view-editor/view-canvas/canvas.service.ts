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
import { Injectable, EventEmitter, ChangeDetectorRef, Output } from '@angular/core';
import { CanvasConstants } from '@dataservices/virtualization/view-editor/view-canvas/canvas-constants';
import { CanvasNode, CanvasLink, CanvasGraph } from '@dataservices/virtualization/view-editor/view-canvas/models';
import { ViewCanvasEvent } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event";
import { ViewCanvasEventType } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event-type.enum";
import * as d3 from 'd3';
import * as _ from "lodash";

@Injectable()
export class CanvasService {

  /**
   * An event fired when the state of the canvas has changed.
   *
   * @type {EventEmitter<ViewCanvasEvent>}
   */
  @Output() public canvasEvent: EventEmitter< ViewCanvasEvent > = new EventEmitter();

  private canvasGraph: CanvasGraph;
  private viewReference: ChangeDetectorRef;

  /**
   * This service will provide methods to enable user interaction with elements
   * while maintaining the d3 simulations physics
   */
  constructor() {}

  /**
   * The interactable graph.
   * This method does not interact with the document, purely physical calculations with d3
   */
  public newCanvasGraph(options: { width, height }, changeDetectorRef: ChangeDetectorRef): CanvasGraph {
    this.viewReference = changeDetectorRef;

    this.canvasGraph = new CanvasGraph(this, options);
    this.canvasGraph.nodesSelected.subscribe((nodes) => {
      const event = ViewCanvasEvent.create(ViewCanvasEventType.CANVAS_SELECTION_CHANGED, nodes);
      this.canvasEvent.emit(event);
    });

    /**
     * Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.canvasGraph.ticker.subscribe((d) => {
      this.viewReference.markForCheck();
    });

    return this.canvasGraph;
  }

  private stopPropagation(): void {
    // Stop propagration of click event to parent svg
    d3.event.stopPropagation();

    // Stop shift-left-click shortcut being fired (firefox opens a new tab/window)
    d3.event.preventDefault();
  }

  /**
   * Callback for the command icon when the command has been depressed or not
   */
  private commandIconChangeCallback(nodeId: string, commandType: string, depressed: boolean): void {
    console.log(" commandIconChangeCallback: " + nodeId + " " + commandType + " " + depressed);
    const selection = d3.select('#' + nodeId + '-' + commandType);
    selection.attr('xlink:href', this.commandIcon(commandType, depressed));
    this.stopPropagation();
  }

  private addNodeCallback(source: CanvasNode): void {
    let eventType = null;
    if (source.type === CanvasConstants.SOURCE_TYPE)
      eventType = ViewCanvasEventType.CREATE_COMPOSITION;
    else if (source.type === CanvasConstants.COMPONENT_TYPE)
      eventType = ViewCanvasEventType.CREATE_SOURCE;

    const event = ViewCanvasEvent.create(eventType, []);
    this.canvasEvent.emit(event);
    //
    // //
    // // Ensure all nodes have been unfixed
    // // to allow the graph to properly relayout
    // //
    // this.canvasGraph.unfixNodes();
    //
    // //
    // // Fix the source node
    // //
    // source.setFixed(true);
    //
    // let type = null;
    // if (source.type === CanvasConstants.SOURCE_TYPE)
    //   type = CanvasConstants.COMPONENT_TYPE;
    // else
    //   type = CanvasConstants.SOURCE_TYPE;
    //
    // const tgtId = this.createNode(type, '<<ToBeImplemented>>');
    // const srcId = source.id;
    //
    // //
    // // Create the link and update the graph
    // //
    // this.createLink(srcId, tgtId, true);
    this.stopPropagation();
  }

  private removeNodeCallback(node: CanvasNode) {
    this.deleteNode(node.id, true);
    this.stopPropagation();
  }

  public nodes(): CanvasNode[] {
    if (!this.canvasGraph)
      return new Array<CanvasNode>();

    return this.canvasGraph.nodes;
  }

  public links(): CanvasLink[] {
    if (!this.canvasGraph)
      return new Array<CanvasLink>();

    return this.canvasGraph.links;
  }

  /**
   * Makes sure both the canvas graph and the
   * view are up to date and all events have
   * been wired up.
   */
  public update(refreshGraph: boolean, options?: any): void {
    if (this.canvasGraph && refreshGraph) {
      if (options !== undefined)
        this.canvasGraph.setOptions(options);

      this.canvasGraph.refresh();
    }

    if (this.viewReference)
      this.viewReference.detectChanges();

    const svg = d3.select(CanvasConstants.CSS_GRAPH_ID);
    const svgGroup = svg.select('g');

    //
    // Create zoom / pan behaviour
    //
    const zoom = d3.zoom()
                    .scaleExtent([0.1, 3])
                    .on('zoom', () => {
                      svgGroup.attr("transform", d3.event.transform);
                    });

    //
    // Add mouse click listener and zoom listener to graph
    //
    svg
      .on('click', () => this.canvasGraph.selectionCallback(null))
      .call(zoom);

    //
    // Add mouse selection listener on each node
    //
    const nodeSelection = d3.selectAll(CanvasConstants.CSS_NODE_VISUAL_GROUP_CLASS);
    nodeSelection
      .data(this.canvasGraph.nodes)
      .on('click', (cn) => this.canvasGraph.selectionCallback(cn));

    //
    // Add mouse listener on each plus button
    //
    const plusSelection = d3.selectAll(CanvasConstants.CSS_NODE_VISUAL_TOOLS_PLUS_CLASS);
    plusSelection
      .data(this.canvasGraph.nodes)
      .on('mousedown', (cn) => this.commandIconChangeCallback(cn.id, 'plus', true))
      .on('mouseup', (cn) => this.commandIconChangeCallback(cn.id, 'plus', false))
      .on('click', (src) => this.addNodeCallback(src));

    //
    // Add mouse listener on each minus button
    //
    const minusSelection = d3.selectAll(CanvasConstants.CSS_NODE_VISUAL_TOOLS_MINUS_CLASS);
    minusSelection
      .data(this.canvasGraph.nodes)
      .on('mousedown', (cn) => this.commandIconChangeCallback(cn.id, 'minus', true))
      .on('mouseup', (cn) => this.commandIconChangeCallback(cn.id, 'minus', false))
      .on('click', (cn) => this.removeNodeCallback(cn));
  }

  /**
   * Find the bounding box of the element associated with
   * the given canvas node. The box represents the outer
   * perimeter of the drawn element, including x, y, width and height
   */
  public boundingBox(elementId: string): any {
    if (_.isEmpty(elementId))
      return null;

    const selection = d3.select('#' + elementId);
    if (selection)
      return (<SVGGraphicsElement>selection.node()).getBBox();

    return null;
  }

  /**
   * @returns the icon for the command type provided. If depressed then
   *            returns the depressed version of the icon
   */
  public commandIcon(cmdType: string, depressed: boolean) {
    if (depressed)
      return "/assets/iconfinder/Aha-soft/" + cmdType + "-depressed.png";

    return "/assets/iconfinder/Aha-soft/" + cmdType + ".png";
  }

  /**
   * Create a new node and add it to the graph
   */
  public createNode(type: string, label: string, refresh?: boolean): string {
    if (! this.canvasGraph)
      throw new Error("A canvas graph is required before creating a node");

    const canvasNode = this.canvasGraph.addNode(type, label, refresh);
    return canvasNode.id;
  }

  /**
   * Delete the node with the given id
   */
  public deleteNode(nodeId: string, refresh?: boolean) {
    if (! this.canvasGraph)
      throw new Error("A canvas graph is required before removing a node");

    this.canvasGraph.removeNode(nodeId, refresh);
  }

  /**
   * Create a new link and add it to the graph
   */
  public createLink(source: string, target: string, refresh?: boolean): void {
    if (! this.canvasGraph)
      throw new Error("A canvas graph is required before creating a node");

    this.canvasGraph.addLink(source, target, refresh);
  }
}
