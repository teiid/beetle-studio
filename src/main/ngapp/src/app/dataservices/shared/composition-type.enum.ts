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

export enum CompositionType {

  /**
   * Indicates an inner join composition
   *
   * @type {string}
   */
  INNER_JOIN = "INNER_JOIN",

  /**
   * Indicates a left outer join composition
   *
   * @type {string}
   */
  LEFT_OUTER_JOIN = "LEFT_OUTER_JOIN",

  /**
   * Indicates a right outer join composition
   *
   * @type {string}
   */
  RIGHT_OUTER_JOIN = "RIGHT_OUTER_JOIN",

  /**
   * Indicates a full outer join composition
   *
   * @type {string}
   */
  FULL_OUTER_JOIN = "FULL_OUTER_JOIN",

  /**
   * Indicates a union composition
   *
   * @type {string}
   */
  UNION = "UNION"

}

export namespace CompositionType {
  export function toSql( type: CompositionType): string {
    if ( type === CompositionType.INNER_JOIN ) {
      return "INNER JOIN";
    } else if ( type === CompositionType.LEFT_OUTER_JOIN ) {
      return "LEFT OUTER JOIN";
    } else if ( type === CompositionType.RIGHT_OUTER_JOIN ) {
      return "RIGHT OUTER JOIN";
    } else if ( type === CompositionType.FULL_OUTER_JOIN ) {
      return "FULL OUTER JOIN";
    } else if ( type === CompositionType.UNION ) {
      return "UNION";
    }
    return "INNER JOIN";
  }
}
