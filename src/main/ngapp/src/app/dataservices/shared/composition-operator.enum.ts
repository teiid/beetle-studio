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

export enum CompositionOperator {

  /**
   * Indicates 'equals' condition
   *
   * @type {string}
   */
  EQ = "EQ",

  /**
   * Indicates 'greater than' condition
   *
   * @type {string}
   */
  GT = "GT",

  /**
   * Indicates 'less than' condition
   *
   * @type {string}
   */
  LT = "LT",

  /**
   * Indicates 'greater than or equal' condition
   *
   * @type {string}
   */
  GE = "GE",

  /**
   * Indicates 'less than or equal' condition
   *
   * @type {string}
   */
  LE = "LE",

  /**
   * Indicates 'not equal' condition
   *
   * @type {string}
   */
  NE = "NE"

}
