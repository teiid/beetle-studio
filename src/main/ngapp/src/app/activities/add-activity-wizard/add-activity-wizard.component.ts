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

import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";

import { ActivitiesConstants } from "@activities/shared/activities-constants";
import { ActivityService } from "@activities/shared/activity.service";
import { NewActivity } from "@activities/shared/new-activity.model";
import { FormControl, FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { NewConnection } from "@connections/shared/new-connection.model";
import { LoggerService } from "@core/logger.service";
import { WizardStepConfig } from "patternfly-ng";
import { WizardConfig } from "patternfly-ng";
import { WizardEvent } from "patternfly-ng";
import { WizardComponent } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-add-activity-wizard",
  templateUrl: "./add-activity-wizard.component.html"
})
export class AddActivityWizardComponent implements OnInit {
  public readonly activitySummaryLink: string = ActivitiesConstants.activitiesRootPath;

  // Wizard Config
  public wizardConfig: WizardConfig;

  public basicPropertyForm: FormGroup;
  public createComplete = true;
  public createSuccessful = false;
  public connectionsLoaded = false;

  // Wizard Step 1
  public step1Config: WizardStepConfig;

  // Wizard Step 2
  public step2Config: WizardStepConfig;
  public step2aConfig: WizardStepConfig;
  public step2bConfig: WizardStepConfig;

  @ViewChild("wizard") public wizard: WizardComponent;

  private activityService: ActivityService;
  private connectionService: ConnectionService;
  private allConnections: Connection[] = [];
  private logger: LoggerService;
  private router: Router;

  constructor( router: Router, activityService: ActivityService, connectionService: ConnectionService, logger: LoggerService ) {
    this.activityService = activityService;
    this.connectionService = connectionService;
    this.router = router;
    this.logger = logger;
    this.createBasicPropertyForm();
  }

  /*
   * Initialization
   */
  public ngOnInit(): void {
    // Step 1 - Basic Properties
    this.step1Config = {
      id: "step1",
      priority: 0,
      title: "Basic Properties",
      allowClickNav: false
    } as WizardStepConfig;

    // Step 2 - Review and Create
    this.step2Config = {
      id: "step2",
      priority: 2,
      title: "Review and Create",
      allowClickNav: false
    } as WizardStepConfig;
    this.step2aConfig = {
      id: "step2a",
      priority: 0,
      title: "Review",
      allowClickNav: false
    } as WizardStepConfig;
    this.step2bConfig = {
      id: "step2b",
      priority: 1,
      title: "Create",
      allowClickNav: false
    } as WizardStepConfig;

    // Wizard Configuration
    this.wizardConfig = {
      embedInPage: true,
      loadingTitle: "Add Activity Wizard loading",
      loadingSecondaryInfo: "Please wait for the wizard to finish loading...",
      title: "Add Activity",
      contentHeight: "500px"
    } as WizardConfig;

    // Load the connections for the first step
    this.connectionsLoaded = false;
    const self = this;
    this.connectionService
      .getAllConnections()
      .subscribe(
        (conns) => {
          self.allConnections = conns;
          self.connectionsLoaded = true;
        },
        (error) => {
          self.logger.error("[AddActivityWizardComponent] Error getting connections: %o", error);
        }
      );

    this.setNavAway(false);
  }

  // ----------------
  // Public Methods
  // ----------------

  /*
   * Return the name valid state
   */
  public get nameValid(): boolean {
    return this.basicPropertyForm.controls["name"].valid;
  }

  /*
   * Return the source connection valid state
   */
  public get sourceConnectionValid(): boolean {
    return this.basicPropertyForm.controls["sourceConnection"].valid;
  }

  /*
   * Return the target connection valid state
   */
  public get targetConnectionValid(): boolean {
    return this.basicPropertyForm.controls["targetConnection"].valid;
  }

  /*
   * Step 1 instruction message
   */
  public get step1InstructionMessage(): string {
    if (!this.nameValid) {
      return "Please enter a name for the Activity";
    } else if (!this.sourceConnectionValid) {
      return "Please choose a source connection for the Activity";
    } else if (!this.targetConnectionValid) {
      return "Please choose a target connection for the Activity";
    } else {
      return "When finished entering properties, click Next to continue";
    }
  }

  /*
   * Step 2 instruction message
   */
  public get step2InstructionMessage(): string {
    return "Review your entries.  When finished, click Create to create the Activity";
  }

  /*
   * Return the name error message if invalid
   */
  public getBasicPropertyErrorMessage( name: string ): string {
    const control: AbstractControl = this.basicPropertyForm.controls[name];
    if (control.invalid) {
      // The first error found is returned
      if (control.errors.required) {
        return name + " is a required property";
      }
    }
    return "";
  }

  public nextClicked($event: WizardEvent): void {
    // Nothing to do
  }

  public cancelClicked($event: WizardEvent): void {
    const link: string[] = [ ActivitiesConstants.activitiesRootPath ];
    this.logger.log("[AddActivityWizardComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /*
   * Create the Activity via komodo REST interface,
   * using the currently entered properties
   */
  public createActivity(): void {
    this.createComplete = false;
    this.wizardConfig.done = true;

    const activity: NewActivity = new NewActivity();

    // Activity basic properties from step 1
    activity.setName(this.activityName);
    const srcConn: NewConnection = new NewConnection();
    srcConn.setName(this.sourceConnectionName);
    activity.setSourceConnection(srcConn);
    const tgtConn: NewConnection = new NewConnection();
    tgtConn.setName(this.targetConnectionName);
    activity.setTargetConnection(tgtConn);

    const self = this;
    this.activityService
      .createActivity(activity)
      .subscribe(
        () => {
          self.createComplete = true;
          self.createSuccessful = true;
          self.step2bConfig.nextEnabled = false;
        },
        (error) => {
          self.createComplete = true;
          self.createSuccessful = false;
        }
      );
  }

  public stepChanged($event: WizardEvent): void {
    if ($event.step.config.id === "step1") {
      this.updatePage1ValidStatus();
      this.wizardConfig.nextTitle = "Next >";
    } else if ($event.step.config.id === "step2a") {
      this.wizardConfig.nextTitle = "Create";
    } else if ($event.step.config.id === "step2b") {
      // Note: The next button is not disabled by default when wizard is done
      this.step2Config.nextEnabled = false;
    } else {
      this.wizardConfig.nextTitle = "Next >";
    }
  }

  public updatePage1ValidStatus( ): void {
    this.step1Config.nextEnabled = this.basicPropertyForm.valid;
    this.setNavAway(this.step1Config.nextEnabled);
  }

  /**
   * @returns {string} the name of the activity
   */
  public get activityName(): string {
    return this.basicPropertyForm.controls["name"].value;
  }

  /**
   * @returns {string} the source connection name of the activity
   */
  public get sourceConnectionName(): string {
    return this.basicPropertyForm.controls["sourceConnection"].value;
  }

  /**
   * @returns {string} the target connection name of the activity
   */
  public get targetConnectionName(): string {
    return this.basicPropertyForm.controls["targetConnection"].value;
  }

  /*
   * Return the array of connection names
   */
  public get connectionNames(): string[] {
    const connNames: string[] = [];
    for ( const conn of this.allConnections ) {
      connNames.push(conn.getId());
    }
    return connNames.sort();
  }

  // ----------------
  // Private Methods
  // ----------------

  /*
   * Create the BasicProperty form (page 1)
   */
  private createBasicPropertyForm(): void {
    this.basicPropertyForm = new FormGroup({
      name: new FormControl("", Validators.required),
      sourceConnection: new FormControl("", Validators.required),
      targetConnection: new FormControl("", Validators.required),
    });
    this.onChanges();
  }

  /*
   * React to basic property changes - update the page 1 status
   */
  private onChanges(): void {
    const self = this;
    this.basicPropertyForm.valueChanges.subscribe((val) => {
      self.updatePage1ValidStatus( );
    });
  }

  private setNavAway(allow: boolean): void {
    this.step1Config.allowNavAway = allow;
  }

}
