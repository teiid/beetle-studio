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

import { ViewCanvasEventType } from "@dataservices/virtualization/view-editor/view-canvas/event/view-canvas-event-type.enum";

export class ViewCanvasEvent {

  private readonly _args: any[] = [];
  private readonly _type: ViewCanvasEventType;

  /**
   * Factory method to create an event.
   *
   * @param {ViewCanvasEventType} type the type of event
   * @param {object[]} args the optional args
   * @returns {ViewCanvasEvent} the created event
   */
  public static create( type: ViewCanvasEventType,
                        args?: any[] ): ViewCanvasEvent {
    return new ViewCanvasEvent( type, args );
  }

  private constructor( type: ViewCanvasEventType,
                       args?: any[] ) {
    this._type = type;

    if ( args ) {
      this._args = args;
    }
  }

  /**
   * @returns {any[]} the optional args to the event (never `null` but can be empty)
   */
  public get args(): any[] {
    return this._args;
  }

  /**
   * @returns {string} a string representation of the event
   */
  public toString(): string {
    let text = `event type: ${this.type}, args: `;
    let firstTime = true;

    if ( this.args && this.args.length !== 0 ) {
      for ( const arg of this.args ) {
        if ( firstTime ) {
          firstTime = false;
        } else {
          text += ", ";
        }

        text += arg;
      }
    }

    return text;
  }

  /**
   * @returns {ViewCanvasEventType} the event type
   */
  public get type(): ViewCanvasEventType {
    return this._type;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewCanvasEventType.CANVAS_SELECTION_CHANGED`
   */
  public typeIsCanvasSelectionChanged(): boolean {
    return this.type === ViewCanvasEventType.CANVAS_SELECTION_CHANGED;
  }
}
