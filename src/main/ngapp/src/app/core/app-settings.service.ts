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
import { LayoutType } from "@shared/layout-type.enum";

@Injectable()
export class AppSettingsService {

  // ** Dont change git keys - must match Komodo rest call parameters **
  public readonly GIT_REPO_BRANCH_KEY = "repo-branch-property";
  public readonly GIT_REPO_AUTHOR_NAME_KEY = "author-name-property";
  public readonly GIT_REPO_AUTHOR_EMAIL_KEY = "author-email-property";
  public readonly GIT_REPO_USERNAME_KEY = "repo-username-property";
  public readonly GIT_REPO_PASSWORD_KEY = "repo-password-property";
  public readonly GIT_REPO_PATH_KEY = "repo-path-property";
  public readonly GIT_REPO_FILE_PATH_KEY = "file-path-property";

  private readonly komodoRoot = "tko:komodo/tko:workspace";

  // TODO: temporary location for user and password
  private readonly komodoUser = "dsbUser";
  private readonly komodoUserPassword = "1demo-user1";

  // Map to maintain the target git repository properties
  private readonly gitRepoProperties: Map<string, string>;

  // page layouts
  private svcPageLayout: LayoutType = LayoutType.CARD;
  private connPageLayout: LayoutType = LayoutType.CARD;

  constructor() {
    // TODO: The git repository properties will be picked up based on the Openshift install location
    this.gitRepoProperties = new Map<string, string>();
    this.gitRepoProperties.set(this.GIT_REPO_PATH_KEY, "https://github.com/GIT_USER/GIT_REPO");
    this.gitRepoProperties.set(this.GIT_REPO_BRANCH_KEY, "master");
    this.gitRepoProperties.set(this.GIT_REPO_USERNAME_KEY, "MY_USER");
    this.gitRepoProperties.set(this.GIT_REPO_PASSWORD_KEY, "MY_PASS");
    this.gitRepoProperties.set(this.GIT_REPO_AUTHOR_NAME_KEY, "MY_USER");
    this.gitRepoProperties.set(this.GIT_REPO_AUTHOR_EMAIL_KEY, "USER@SOMEWHERE.COM");
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

  /*
   * Get the git repository property for the supplied property key
   * @returns {string} the git repository property
   */
  public getGitRepoProperty(propertyKey: string): string {
    return this.gitRepoProperties.get(propertyKey);
  }

  /*
   * Get the LayoutType for the connections summary page
   * @returns {LayoutType} the connections page layout
   */
  public get connectionsPageLayout( ): LayoutType {
    return this.connPageLayout;
  }

  /*
   * Sets the LayoutType for the connections summary page
   * @param {LayoutType} layout the connections page layout
   */
  public set connectionsPageLayout( layout: LayoutType ) {
    this.connPageLayout = layout;
  }

  /*
   * Get the LayoutType for the dataservices summary page
   * @returns {LayoutType} the dataservices page layout
   */
  public get dataservicesPageLayout( ): LayoutType {
    return this.svcPageLayout;
  }

  /*
   * Sets the LayoutType for the dataservices summary page
   * @param {LayoutType} layout the dataservices page layout
   */
  public set dataservicesPageLayout( layout: LayoutType ) {
    this.svcPageLayout = layout;
  }

}
