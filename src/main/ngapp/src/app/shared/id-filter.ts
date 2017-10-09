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

import { Identifiable } from "@shared/identifiable";

const emptyPattern = "";

export class IdFilter {

  private pattern: string = emptyPattern;

  constructor() {
    // nothing to do
  }

  /**
   * @param {Identifiable<string>} obj the object whose ID is being compared to the filter
   * @returns {boolean} true if the ID matches the filter
   */
  public accepts( obj: Identifiable< string > ): boolean {
    if ( this.pattern === "" ) {
      return true;
    }

    const id: string = obj.getId().toLocaleLowerCase();
    const localized: string = this.pattern.toLocaleLowerCase();
    return id.indexOf( localized ) >= 0;
  }

  /**
   * @returns {string} the pattern being matched to
   */
  public getPattern(): string {
    return this.pattern;
  }

  /**
   * Resets the pattern so that all IDs will match the pattern.
   */
  public reset(): void {
    this.pattern = emptyPattern;
  }

  /**
   * @param {string} pattern the pattern to match IDs with (can be empty or null)
   */
  public setFilter( pattern?: string ): void {
    if ( pattern ) {
      this.pattern = pattern;
    } else {
      this.pattern = emptyPattern;
    }
  }

}
