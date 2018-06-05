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
import { ConnectionsConstants } from "@connections/shared/connections-constants";

export class ConnectionType {
  private name: string;
  private description: string;

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the ConnectionType name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the ConnectionType description
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * @returns {string} the alternate image text for the ConnectionType
   */
  public getImageAlt(): string {
    const name = this.getName();
    if (name === ConnectionsConstants.connectionType_mysql) {
      return "MySQL database img";
    } else if (name === ConnectionsConstants.connectionType_postgresql) {
      return "PostgeSQL database img";
    } else if (name === ConnectionsConstants.connectionType_mongodb) {
      return "MongoDB database img";
    } else if (name === ConnectionsConstants.connectionType_mariadb) {
      return "MariaDB database img";
    } else if (name === ConnectionsConstants.connectionType_salesforce) {
      return "SalesForce img";
    }
    return "unknown image";
  }

  /**
   * @returns {string} the image location for the ConnectionType
   */
  public getImageSrc(): string {
    const name = this.getName();
    if (name === ConnectionsConstants.connectionType_mysql) {
      return "assets/MySQL_70x40.png";
    } else if (name === ConnectionsConstants.connectionType_postgresql) {
      return "assets/PostgresSql_70x40.png";
    } else if (name === ConnectionsConstants.connectionType_mongodb) {
      return "assets/MongoDB_70x40.png";
    } else if (name === ConnectionsConstants.connectionType_mariadb) {
      return "assets/MongoDB_70x40.png";
    } else if (name === ConnectionsConstants.connectionType_salesforce) {
      return "assets/salesforce_40x40.png";
    }
    return "";
  }

  /**
   * @param {string} name the ConnectionType name
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} description the ConnectionType description
   */
  public setDescription( description?: string ): void {
    this.description = description ? description : null;
  }

}
