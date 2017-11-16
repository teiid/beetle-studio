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

import { Injectable } from "@angular/core";

@Injectable()
export class AppSettingsService {

  private readonly komodoRoot = "tko:komodo/tko:workspace";

  // TODO: temporary location for user and password
  private readonly komodoUser = "dsbUser";
  private readonly komodoUserPassword = "1demo-user1";

  constructor() {
    // Nothing to do
  }

  /*
   * Get the komodo workspace path for the current user
   * @returns {string} the komodo workspace path
   */
  public getKomodoUserWorkspacePath( ): string {
    return this.komodoRoot + "/" + this.komodoUser;
  }

  /*
   * Get the logged in komodo user
   * @returns {string} the komodo user
   */
  public getKomodoUser( ): string {
    return this.komodoUser;
  }

  /*
   * Get the logged in komodo user password
   * @returns {string} the komodo user password
   */
  public getKomodoUserPassword( ): string {
    return this.komodoUserPassword;
  }

}
