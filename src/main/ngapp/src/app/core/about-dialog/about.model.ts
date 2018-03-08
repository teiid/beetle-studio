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

export class About {

  // Here is the JSON returned from REST:
  //
  // {
  //   "Information": {
  //     "App Name": "vdb-builder",
  //     "App Title": "Vdb Builder",
  //     "copyright": "2017-1018",
  //     "App Description": "A tool that allows creating, editing and managing dynamic VDBs and their contents",
  //     "App Version": "0.0.4-SNAPSHOT",
  //     "Repository Workspace": "komodoLocalWorkspace",
  //     "Repository Configuration": "vfs:/dirLocation/komodo-core-0.0.4-SNAPSHOT.jar/org/komodo/repository/local-repository-config.json",
  //     "Repository Vdb Total": "1"
  //   }
  // }

  private Information: {};

  public static create( json: object = {} ): About {
    const about = new About();
    about.setValues( json );
    return about;
  }

  public get appDescription(): string {
    if ( this.Information && this.Information[ "App Description" ] != null ) {
      return this.Information[ "App Description" ];
    }

    return "App description not found";
  }

  public get appName(): string {
    if ( this.Information && this.Information[ "App Name" ] ) {
      return this.Information[ "App Name" ];
    }

    return "App name not found";
  }

  public get appTitle(): string {
    if ( this.Information && this.Information[ "App Title" ] ) {
      return this.Information[ "App Title" ];
    }

    return "App title not found";
  }

  public get appVersion(): string {
    if ( this.Information && this.Information[ "App Version" ] ) {
      return this.Information[ "App Version" ];
    }

    return "App version not found";
  }

  public get copyright(): string {
    if ( this.Information && this.Information[ "App Copyright" ] ) {
      return this.Information[ "App Copyright" ];
    }

    return "2017-2018 Red Hat, Inc.";
  }

  /**
   * Set all object values using the supplied JSON.
   * @param {Object} values
   */
  public setValues( values: object = {} ): void {
    Object.assign( this, values );
  }

}
