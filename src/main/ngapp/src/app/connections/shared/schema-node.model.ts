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

export class SchemaNode {
  private name: string;
  private type: string;
  private path: string;
  private connectionName: string;
  private queryable = false;
  private isSelected = true;
  private hasChildren = false;
  private children: SchemaNode[];

  /**
   * @param {Object} json the JSON representation of a SchemaNode
   * @returns {SchemaNode} the new SchemaNode (never null)
   */
  public static create( json: object = {} ): SchemaNode {
    const schemaNode = new SchemaNode();
    for (const field of Object.keys(json)) {
      if (field === "children") {
        const jsonKids = json[field];
        const kids: SchemaNode[] = [];
        for (const kid of jsonKids) {
          const k = SchemaNode.create(kid);
          kids.push(k);
        }
        schemaNode.setChildren(kids);
      } else if (field === "name") {
        schemaNode.setName(json[field]);
      } else if (field === "type") {
        schemaNode.setType(json[field]);
      } else if (field === "path") {
        schemaNode.setPath(json[field]);
      } else if (field === "queryable") {
        schemaNode.setQueryable(json[field]);
      } else if (field === "connectionName") {
        schemaNode.setConnectionName(json[field]);
      }
    }
    return schemaNode;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the node name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the node type
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Get the path, for example: ( schema=public/table=customer ).  It is assumed that the path here does NOT include
   * the connection.
   * @returns {string} the node path
   */
  public getPath(): string {
    return this.path;
  }

  /**
   * @returns {string} the nodes connection
   */
  public getConnectionName(): string {
    return this.connectionName;
  }

  /**
   * @param {string} name the node name
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} type the node type
   */
  public setType( type?: string ): void {
    this.type = type ? type : null;
  }

  /**
   * Set the path, for example: ( schema=public/table=customer ).  It is assumed that the path here does NOT include
   * the connection.
   * @param {string} path the node path
   */
  public setPath( path?: string ): void {
    this.path = path ? path : null;
  }

  /**
   * @param {string} connectionName the nodes connection name
   */
  public setConnectionName( connectionName?: string ): void {
    this.connectionName = connectionName ? connectionName : null;
  }

  /**
   * @returns {boolean} true if queryable
   */
  public isQueryable(): boolean {
    return this.queryable;
  }

  /**
   * @param {boolean} queryable 'true' if queryable
   */
  public setQueryable(queryable: boolean ): void {
    this.queryable = queryable;
  }

  /**
   * @param {boolean} hasChildren 'true' if has children
   */
  public setHasChildren(hasChildren: boolean ): void {
    this.hasChildren = hasChildren;
  }

  /**
   * @returns {SchemaNode[]} the child SchemaNode array
   */
  public getChildren(): SchemaNode[] {
    return this.children;
  }

  /**
   * @param {SchemaNode[]} children SchemaNode children
   */
  public setChildren( children: SchemaNode[] ): void {
    this.children = children;
  }

  /**
   * Get selected state
   * @returns {boolean} the selected state
   */
  public get selected( ): boolean {
    return this.isSelected;
  }

  /**
   * Set selected status
   * @param {boolean} isSelected the selected state
   */
  public set selected( isSelected: boolean ) {
    this.isSelected = isSelected;
  }

  /**
   * Determine the max number of levels in the tree structure, including this node.
   * @returns {number} the max number of levels, including this node
   */
  public getMaxLevels(): number {
    let maxChildLevel = 0;
    if (this.children && this.children != null) {
      for (const child of this.children) {
        maxChildLevel = Math.max(maxChildLevel, child.getMaxLevels());
      }
    }
    return maxChildLevel + 1;
  }

  /**
   * Set all object values using the supplied View json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
