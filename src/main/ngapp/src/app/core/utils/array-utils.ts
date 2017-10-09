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

export class ArrayUtils {

  /**
   * @param a the array being searched
   * @param item the item being searched for
   * @return {boolean} true if the given item is contained in the given array
   */
  public static contains( a: any[], item: any ): boolean {
    for ( const aitem of a ) {
      if ( aitem === item ) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {any[]} a1 the first array
   * @param {any[]} a2 the second array
   * @returns {any[]} the intersection of two arrays
   */
  public static intersect( a1: any[], a2: any[] ): any[] {
    const rval: any[] = [];
    for ( const item of a1 ) {
      if ( ArrayUtils.contains( a2, item ) ) {
        rval.push( item );
      }
    }
    return rval;
  }

}
