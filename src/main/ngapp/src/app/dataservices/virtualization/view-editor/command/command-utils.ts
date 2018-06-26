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

export class CommandUtils {

  /**
   * The name of the command argument whose value is the connection name of the source.
   *
   * @type {string}
   */
  private static readonly connectionName = "connectionName";

  private static readonly connNamePrefix = CommandUtils.connectionName + "=";
  private static readonly delim = ", ";

  /**
   * The name of the command argument whose value is the fully-qualified schema node path of the source.
   *
   * @type {string}
   */
  private static readonly path = "path";

  private static readonly pathSearchPrefix = CommandUtils.path + "=";

  /**
   * The name of the command argument whose value is a list of stringified source schema nodes.
   *
   * @type {string}
   */
  public static readonly sources = "sources";


  /**
   *
   * @param {string} value the sources argument value being parsed
   * @returns {{}[] | Error} an array of { connectionName: string, path: string } objects or an error if unable to parse
   */
  public static parseSourcesArg( value: string ): {}[] | Error {
    const index = value.indexOf( CommandUtils.delim );

    if ( index === -1 ) {
      return new Error( "A delimiter was not found: " + value );
    }

    const temp = value.substring( 0, index );
    const size = parseInt( temp, 10 );

    // make sure size was converted to a number
    if ( isNaN( size ) ) {
      return new Error( "Size is not a number: " + value );
    }

    const result: {}[] = [];
    let text = value.substring( index );

    for ( let count = 0; count <= size; ++count ) {
      // find schema node connection name
      if ( !text.startsWith( CommandUtils.connNamePrefix ) ) {
        return new Error( "Connection name prefix not found: " + value );
      }

      text = text.substring( CommandUtils.connNamePrefix.length );
      let delimIndex = text.indexOf( CommandUtils.delim );

      if ( delimIndex === -1 ) {
        return new Error( "Missing delimiter after connection name: " + value );
      }

      const connName = text.substring( 0, delimIndex );
      text = text.substring( delimIndex + CommandUtils.delim.length );

      // find schema node path
      if ( !text.startsWith( CommandUtils.pathSearchPrefix ) ) {
        return new Error( "Missing path prefix: " + value );
      }

      text = text.substring( CommandUtils.pathSearchPrefix.length );
      delimIndex = text.indexOf( CommandUtils.delim );

      if ( delimIndex === -1 && count !== size - 1 ) {
        return new Error( "Missing delimiter after path: " + value );
      }

      if ( count === size - 1 ) {
        delimIndex = text.length;
      }

      const path = text.substring( 0, delimIndex );
      result.push( { [ CommandUtils.connectionName ]: connName, [ CommandUtils.path ]: path } );

      if ( count !== size - 1 ) {
        text = text.substring( delimIndex + CommandUtils.delim.length );
      }
    }

    return result;
  }

  /**
   * @param {SchemaNode[]} schemaNodes the schema nodes whose JSON value is being requested
   * @returns {string} the JSON value of the schema nodes
   */
  public static toJsonValue( schemaNodes: SchemaNode[] ): string {
    let result = schemaNodes.length + CommandUtils.delim;
    let firstTime = true;

    schemaNodes.forEach( ( node ) => {
      if ( firstTime ) {
        firstTime = false;
      } else {
        result += CommandUtils.delim;
      }

      // for each source add connection name and path
      result += CommandUtils.connectionName + "=" + node.getConnectionName()
                + CommandUtils.delim + CommandUtils.path + "=" + node.getPath();
    } );

    return result;
  }

}
