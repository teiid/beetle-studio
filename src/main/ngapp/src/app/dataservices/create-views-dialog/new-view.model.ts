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

import { SchemaNode } from "@connections/shared/schema-node.model";

/**
 * NewView model - to hold the NewView objects
 */
export class NewView {

  private connection: string;
  private view: string;
  private viewDescription = "";
  private viewSourceNode: SchemaNode;
  private nodePath: string[] = [];

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the connection name
   */
  public getConnectionName(): string {
    return this.connection;
  }

  /**
   * @param {string} name the connection name
   */
  public setConnectionName( name?: string ): void {
    this.connection = name ? name : null;
  }

  /**
   * @returns {string} the view name
   */
  public getViewName(): string {
    return this.view;
  }

  /**
   * @param {string} name the view name
   */
  public setViewName( name?: string ): void {
    this.view = name ? name : null;
  }

  /**
   * @returns {string} the view description
   */
  public getViewDescription(): string {
    return this.viewDescription;
  }

  /**
   * @param {string} description the view description
   */
  public setViewDescription( description?: string ): void {
    this.viewDescription = description ? description : "";
  }

  /**
   * @returns {SchemaNode} the view source node
   */
  public getViewSourceNode(): SchemaNode {
    return this.viewSourceNode;
  }

  /**
   * @param {SchemaNode} node the view source node
   */
  public setViewSourceNode( node: SchemaNode ): void {
    this.viewSourceNode = node;
  }

  /**
   * @returns {string} the stringified node path
   */
  public get path(): string {
    let path = "";
    const segLength = this.nodePath.length;
    for ( let i = 0; i < segLength; i++ ) {
      path += this.nodePath[i];
      if ( i !== segLength - 1 ) {
        path += ".";
      }
    }
    if (path.length === 0) {
      return this.viewSourceNode.getName();
    } else {
      return path + "." + this.viewSourceNode.getName();
    }
  }

  /**
   * @param {string[]} path the node path
   */
  public setNodePath( path: string[] ): void {
    this.nodePath = [];
    for (const segment of path) {
      this.nodePath.push(segment);
    }
  }

}
