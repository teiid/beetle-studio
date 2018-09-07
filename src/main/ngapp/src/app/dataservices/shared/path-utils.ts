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

export class PathUtils {

  /**
   * Return the path, without the leading connection info
   * @param {string} sourcePath
   * @returns {string} the connection name
   */
  public static getPathWithoutConnection(sourcePath: string): string {
    if (!sourcePath || sourcePath === null || sourcePath.length === 0) {
      return undefined;
    }
    const indx = sourcePath.indexOf("/");
    return sourcePath.substring(indx + 1);
  }

  /**
   * Get the connection name from the supplied source path
   * @param {string} sourcePath
   * @returns {string} the connection name
   */
  public static getConnectionName(sourcePath: string): string {
    if (!sourcePath || sourcePath === null || sourcePath.length === 0) {
      return undefined;
    }
    const fqnArray = sourcePath.split("/", 10);

    const connectionSegment = fqnArray[0];
    const parts = connectionSegment.split("=", 2);
    const connName = parts[1];

    return connName;
  }

  /**
   * Get the source name from the supplied source path
   * @param {string} sourcePath
   * @returns {string} the source name
   */
  public static getSourceName(sourcePath: string): string {
    if (!sourcePath || sourcePath === null || sourcePath.length === 0) {
      return undefined;
    }
    const fqnArray = sourcePath.split("/", 10);

    const arrayLength = fqnArray.length;
    const nodeSeqment = fqnArray[arrayLength - 1];
    const parts = nodeSeqment.split("=", 2);
    const nodeName = parts[1];

    return nodeName;
  }

  /**
   * Get the source type from the supplied source path
   * @param {string} sourcePath
   * @returns {string} the source type
   */
  public static getSourceType(sourcePath: string): string {
    if (!sourcePath || sourcePath === null || sourcePath.length === 0) {
      return undefined;
    }
    const fqnArray = sourcePath.split("/", 10);

    const arrayLength = fqnArray.length;
    const nodeSeqment = fqnArray[arrayLength - 1];
    const parts = nodeSeqment.split("=", 2);
    const nodeType = parts[0];

    return nodeType;
  }

}
