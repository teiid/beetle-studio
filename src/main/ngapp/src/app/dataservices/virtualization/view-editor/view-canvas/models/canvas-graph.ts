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
import { EventEmitter } from '@angular/core';
import { CanvasConstants } from '@dataservices/virtualization/view-editor/view-canvas/canvas-constants';
import { CanvasService } from '@dataservices/virtualization/view-editor/view-canvas/canvas.service';
import { CanvasNode } from '@dataservices/virtualization/view-editor/view-canvas/models/canvas-node';
import { CanvasLink } from '@dataservices/virtualization/view-editor/view-canvas/models/canvas-link';
import * as d3 from 'd3';
import * as cola from 'webcola';
import * as _ from "lodash";

const FORCES = {
  LINKS: 0.2,
  COLLISION: 1
};

export class CanvasGraph {

  private canvasService: CanvasService;
  private options: any;
  private _nodes: CanvasNode[] = [];
  private _links: CanvasLink[] = [];

  public ticker: EventEmitter<cola.Layout> = new EventEmitter();
  public nodesSelected: EventEmitter<CanvasNode[]> = new EventEmitter();

  private layout: cola.Layout;

  constructor(canvasService: CanvasService, options: { width: number, height: number }) {
    this.canvasService = canvasService;
    this.options = options;

    this.init(options);
  }

  private select(node: CanvasNode): void {
    if (! node.selected)
      node.selected = true;

    const selected: CanvasNode[] = [];
    this.nodes.forEach((node) => {
      if (node.selected)
        selected.push(node);
    });

    //
    // Let other parties know what has been selected
    //
    this.nodesSelected.emit(selected);
  }

  private clearSelection(): void {
    this.nodes.forEach((node) => {
      node.selected = false;
    });

    this.nodesSelected.emit(new Array<CanvasNode>());
  }

  /**
   * Initialize the graph and its layout
   */
  public init(options): void {
    console.log("canvas-graph: init");

    if (!options || !options.width || !options.height) {
      throw new Error('missing options when initializing layout');
    }

    if (_.isEmpty(this.nodes))
      return;

    /** Creating the layout */
    if (!this.layout) {
      const ticker = this.ticker;

      this.layout = cola.d3adaptor(d3)
                   .size([options.width, options.height])
                   .flowLayout("x", 150)
                   .symmetricDiffLinkLengths(30)
                   .avoidOverlaps(true)
                   .handleDisconnected(true)
                   .nodes(this.nodes)
                   .links(this.links);

      // Connecting the d3 ticker to an angular event emitter
      this.layout.on('tick', function() {
        ticker.emit(this);
      });
    }
  }

  /**
   * Reset the options of the graph.
   * This will stop the layout and will require an update
   * to be called after it.
   */
  public setOptions(options: any): void {
    this.options = options;
    if (this.layout) {
      this.layout.stop();
      this.layout = null;
    }
  }

  /**
   * Callback for conducting a (de)selection of nodes
   */
  public selectionCallback(node: CanvasNode): void {
    const append = d3.event.shiftKey;

    if (! node) {
      // Cancel all selections unless append is true (shift key held)
      if (append) {
        // Shift key pressed so nothing to do since current selection
        // remains the same as previously.
        return;
      }

      // Remove all selections from the DOM
      this.clearSelection();
    }
    else {
      /*
       * Update the diagram with the new selection
       */
      if (!append) {
        // Remove all selections from the DOM
        this.clearSelection();
      }

      this.select(node);
    }

    //
    // the view does not detect the change if made from
    // here so need to prompt it.
    //
    this.canvasService.update(false);

    // Stop propagration of click event to parent svg
    d3.event.stopPropagation();

    // Stop shift-left-click shortcut being fired (firefox opens a new tab/window)
    d3.event.preventDefault();
  }

  /**
   * @returns the collection of nodes
   */
  public get nodes(): CanvasNode[] {
    return this._nodes;
  }

  /**
   * Add a new node to the graph
   */
  public addNode(id: string, type: string, label: string, update?: boolean): CanvasNode {
    const isEmpty = _.isEmpty(this.nodes);
    const canvasNode = new CanvasNode(id, type, label, isEmpty);

    //
    // Set as fixed by default until its linked
    //
    canvasNode.setFixed(true);

    //
    // Always start at here so the nodes flow left -> right
    //
    canvasNode.x = 250;
    canvasNode.y = 100 * (this.nodes.length + 1);

    this._nodes.push(canvasNode);

    if (update !== undefined && update)
      this.canvasService.update(true);

    return canvasNode;
  }

  private findLinksConnectedToNode(node: CanvasNode): CanvasLink[] {
    //
    // Need to find all links connected to this node
    //
    const linksToRemove = this.links.filter((link) => {
      if (link.source === node || link.target === node)
        return link;
    });

    return linksToRemove;
  }

  /**
   * Remove the node and all its dependents
   */
  public removeNode(nodeId: string, update?: boolean);
  public removeNode(nodeToRemove: CanvasNode, update?: boolean);
  public removeNode(nodeToRemoveOrNodeId: CanvasNode | string, update?: boolean): void {
    let nodeToRemove = null;
    if (typeof nodeToRemoveOrNodeId === "string") {
      //
      // Find the node itself
      //
      nodeToRemove = this.nodes.find((node) => {
        return node.id === nodeToRemoveOrNodeId;
      });
    } else {
      nodeToRemove = nodeToRemoveOrNodeId;
    }

    if (! nodeToRemove)
      return;

    //
    // Remove the node from the array
    //
    const nodeIndex = this.nodes.findIndex((node) => {
      return node === nodeToRemove;
    });
    if (nodeIndex >= 0) {
      this.nodes.splice(nodeIndex, 1);
    }

    //
    // Find any links attached to the node
    //
    const linksToRemove = this.findLinksConnectedToNode(nodeToRemove);
    linksToRemove.forEach((link) => {
      const index = this.links.indexOf(link);
      if (index >= 0) {
        //
        // Remove the link
        //
        this.links.splice(index, 1);
      }

      //
      // Remove any nodes targetted by this link
      // (ignoring the current nodeToRemove)
      //
      if (nodeToRemove !== link.target)
        this.removeNode(link.target);
    });

    //
    // If node has no links then fix its position
    // since the layout will consign it to the middle
    // of the graph.
    //
    this.nodes.forEach((node) => {
      const nodeLinks = this.findLinksConnectedToNode(node);
      if (_.isEmpty(nodeLinks))
        node.setFixed(true);
    });

    if (update !== undefined && update)
      this.canvasService.update(true);
  }

  public get links(): CanvasLink[] {
    return this._links;
  }

  /**
   * Add a new link to the graph
   */
  public addLink(source: string, target: string, update?: boolean): void {
    let src: CanvasNode = null;
    let tgt: CanvasNode = null;
    this.nodes.forEach((node) => {
      if (node.id === source) {
        src = node;
      }
      if (node.id === target) {
        tgt = node;
      }
    });

    if (src === null)
      throw new Error("Cannot create link as source node '" + source + "' cannot be found");

    if (tgt === null)
      throw new Error("Cannot create link as target node '" + target + "' cannot be found");

    const link = new CanvasLink(src, tgt);
    this._links.push(link);

    //
    // Remove the fix on the nodes unless it is the root
    //
    src.setFixed(!src.root);
    tgt.setFixed(!tgt.root);

    if (update !== undefined && update)
      this.canvasService.update(true);
  }

  /**
   * Refreshes / restarts / updates the layout
   */
  public refresh(): void {
    if (! this.layout) {
      this.init(this.options);
    }

    if (!this.layout)
      return; // nothing to do

    //
    // Restarting the layout internal timer
    //
    this.layout.start();
  }

  /**
   * Set all nodes to be fixed to
   * protect their current positions
   */
  public fixNodes(): void {
    this.nodes.forEach((node) => {
      if (!node.root)
        node.setFixed(true);
    });
  }

  /**
   * Set all nodes to be unfixed to allow the
   * layout to properly flow.
   */
  public unfixNodes(): void {
    this.nodes.forEach((node) => {
      if (!node.root)
        node.setFixed(false);
    });
  }
}
