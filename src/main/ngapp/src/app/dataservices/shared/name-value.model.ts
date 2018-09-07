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

/**
 * A model for holding simple name-value pairs.
 */
export class NameValue {

  private readonly name: string;
  private readonly value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  public getName(): string {
    return this.name;
  }

  public getValue(): string {
    return this.value;
  }

}
