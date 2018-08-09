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

export class CanvasNode implements cola.Node {

  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x: number;
  y: number;
  fixed?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  private readonly _id: string;
  private readonly _type: string;
  private _label: string;
  private _selected = false;
  private _root = false;

  public static encodeId(id: string): string {
    return id.replace(/\//g, '5X5').replace(/=/g, '6X6');
  }

  public static decodeId(id: string): string {
    return id.replace(/5X5/g, '/').replace(/6X6/g, '=');
  }

  constructor(id: string, type: string, label: string, root?: boolean) {
    this._id = CanvasNode.encodeId(id);
    this._type = type;
    this._label = label;
    if (root !== undefined)
      this._root = root;
  }

  public get id(): string {
    return this._id;
  }

  public get decodedId(): string {
    return CanvasNode.decodeId(this.id);
  }

  public get type(): string {
    return this._type;
  }

  public get label(): string {
    return this._label;
  }

  public set label(label: string) {
    this._label = label;
  }

  public get selected(): boolean {
    return this._selected;
  }

  public set selected(selected: boolean) {
    this._selected = selected;
  }

  public get root(): boolean {
    return this._root;
  }

  public isFixed(): boolean {
    return this.fixed === 0;
  }

  public setFixed(fixed: boolean): void {
    this.fixed = fixed ? 1 : 0;
  }
}
