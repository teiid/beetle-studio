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

import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

/**
 * Models the menus off the main left-hand vertical nav.
 */
enum VerticalNavType {
  Home, Activities, Connections
}

@Component({
  moduleId: module.id,
  selector: "app-vertical-nav",
  templateUrl: "./vertical-nav.component.html",
  styleUrls: ["./vertical-nav.component.less"]
})

export class VerticalNavComponent implements OnInit {
  public menuTypes: any = VerticalNavType;
  public currentMenu: VerticalNavType = VerticalNavType.Home;
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public ngOnInit(): void {
    console.log("Subscribing to router events.");
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onShadeClick();
      }
    });
  }

  /**
   * Returns true if the currently active route is /activities/*
   * @returns {boolean}
   */
  private isActivitiesRoute(): boolean {
    return this.router.isActive( "/activities", true );
  }

    /**
     * Returns true if the currently active route is /connections/*
     * @returns {boolean}
     */
  private isConnectionsRoute(): boolean {
    return this.router.isActive("/connections", true);
  }

   /**
    * Called when the user clicks the vertical menu shade (the grey shaded area behind the submenu div that
    * is displayed when a sub-menu is selected).  Clicking the shade makes the sub-menu div go away.
    */
  private onShadeClick(): void {
      /*
        this.subMenuOut = false;
        setTimeout(() => {
            this.currentSubMenu = VerticalNavSubMenuType.None;
        }, 180);
        */
    }

    /**
     * Called when the user clicks the vertical menu Activities item.
     */
  private onActivitiesClick(): void {
      this.currentMenu = VerticalNavType.Activities;
      const link: string[] = [ "/activities" ];
      this.router.navigate(link);
    }

    /**
     * Called when the user clicks the vertical menu Connections item.
     */
  private onConnectionsClick(): void {
      this.currentMenu = VerticalNavType.Connections;
      const link: string[] = [ "/connections" ];
      this.router.navigate(link);
    }

    /**
     * Toggles a sub-menu off the main vertical left-hand menu bar.  If the sub-menu is
     * already selected, it de-selects it.
     * @param subMenu the sub-menu to toggle
     */
    /*
    toggleSubMenu(subMenu: VerticalNavSubMenuType): void {
        if (this.subMenuOut && this.currentSubMenu === subMenu) {
            this.onShadeClick();
        } else {
            this.currentSubMenu = subMenu;
            this.subMenuOut = true;
        }
    }
    */

}
