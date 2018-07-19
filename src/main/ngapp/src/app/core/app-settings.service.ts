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
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { environment } from "@environments/environment";
import { LayoutType } from "@shared/layout-type.enum";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

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

  protected userProfile: object;

  // Map to maintain the target git repository properties
  private readonly gitRepoProperties: Map<string, string>;

  // page layouts
  private svcPageLayout: LayoutType = LayoutType.CARD;
  private connPageLayout: LayoutType = LayoutType.CARD;

  private http: Http;
  private logger: LoggerService;

  constructor(http: Http, logger: LoggerService) {
    this.http = http;
    this.logger = logger;

    // TODO: The git repository properties will be picked up based on the Openshift install location
    this.gitRepoProperties = new Map<string, string>();
    this.gitRepoProperties.set(this.GIT_REPO_PATH_KEY, "https://github.com/GIT_USER/GIT_REPO");
    this.gitRepoProperties.set(this.GIT_REPO_BRANCH_KEY, "master");
    this.gitRepoProperties.set(this.GIT_REPO_USERNAME_KEY, "MY_USER");
    this.gitRepoProperties.set(this.GIT_REPO_PASSWORD_KEY, "MY_PASS");
    this.gitRepoProperties.set(this.GIT_REPO_AUTHOR_NAME_KEY, "MY_USER");
    this.gitRepoProperties.set(this.GIT_REPO_AUTHOR_EMAIL_KEY, "USER@SOMEWHERE.COM");

    this.initUserProfile();
  }

  public initUserProfile(): void {
    //
    // Do a call to fetch the user profile on init of service.
    // The fetchProfile method returns an observable
    // which we subscribe to and on completion assigns the variable
    // values accordingly
    //
    this.fetchUserProfile().subscribe(
      ( profile ) => {
        this.userProfile = profile;
      },
      ( error ) => {
        this.logger.error( "[fetchUserProfile] Error:", error );
      } );
  }

  protected fetchUserProfile(): Observable<object> {
    return this.http.get(environment.userProfileUrl, this.getAuthRequestOptions())
      .map((response) => {
        const userInfo = response.json();
        return userInfo.Information;
      })
      .catch((error) => this.handleError(error));
  }

  /**
   * Get the Auth RequestOptions if any
   * Note: Since usage of the oauth-proxy no additional auth request options are necessary
   *
   * @returns {RequestOptions}
   */
  public getAuthRequestOptions(): RequestOptions {
    const headers = new Headers({});
    return new RequestOptions({ headers });
  }

  /*
   * Get the logged in komodo user
   * @returns {string} the komodo user
   */
  public getKomodoUser(): string {
    if (! this.userProfile) {
      throw new Error( "Failed to retrieve the user profile so cannot provide a user name" );
    }

    const komodoUser = this.userProfile["User Name"];
    if (! komodoUser) {
      throw new Error( "Failed to retrieve the user name from the user profile" );
    }

    return komodoUser;
  }

  /*
   * Get the komodo workspace path for the current user
   * @returns {string} the komodo workspace path
   */
  public getKomodoUserWorkspacePath(): string {
    if (! this.userProfile) {
      throw new Error( "Failed to retrieve the user profile so cannot provide a workspace path" );
    }

    const workspace = this.userProfile["Workspace"];
    if (! workspace) {
      throw new Error( "Failed to retrieve the workspace path from the user profile" );
    }

    return workspace;
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

  private handleError(error: Response): ErrorObservable {
    this.logger.error( this.constructor.name + "::handleError" );
    return Observable.throw(error);
  }

}
