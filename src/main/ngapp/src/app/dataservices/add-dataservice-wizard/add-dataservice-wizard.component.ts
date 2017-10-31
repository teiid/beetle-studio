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

import { FormControl, FormGroup } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { NewDataservice } from "@dataservices/shared/new-dataservice.model";
import { LoggerService } from "@core/logger.service";
import { WizardComponent } from "patternfly-ng";
import { WizardEvent } from "patternfly-ng";
import { WizardStepConfig } from "patternfly-ng";
import { WizardConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-add-dataservice-wizard",
  templateUrl: "./add-dataservice-wizard.component.html"
})
export class AddDataserviceWizardComponent implements OnInit {
  public readonly dataserviceSummaryLink: string = DataservicesConstants.dataservicesRootPath;

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

  private connectionService: ConnectionService;
  private dataserviceService: DataserviceService;
  private allConnections: Connection[] = [];
  private logger: LoggerService;
  private router: Router;

  constructor( router: Router, connectionService: ConnectionService, dataserviceService: DataserviceService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.dataserviceService = dataserviceService;
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
      priority: 0,
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
      loadingTitle: "Add Dataservice Wizard loading",
      loadingSecondaryInfo: "Please wait for the wizard to finish loading...",
      title: "Add Dataservice",
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
          self.logger.error("[AddDataserviceWizardComponent] Error getting connections: %o", error);
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
   * Return the connection valid state
   */
  public get connectionValid(): boolean {
    return this.basicPropertyForm.controls["connection"].valid;
  }

  /*
   * Step 1 instruction message
   */
  public get step1InstructionMessage(): string {
    if (!this.nameValid) {
      return "Please enter a name for the Dataservice";
    } else if (!this.connectionValid) {
      return "Please choose a connection for the Dataservice";
    } else {
      return "When finished entering properties, click Next to continue";
    }
  }

  /*
   * Step 2 instruction message
   */
  public get step2InstructionMessage(): string {
    return "Review your entries.  When finished, click Create to create the Dataservice";
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
    // When leaving page 1, load the driver-specific property definitions
    if ($event.step.config.id === "step1") {
    }
  }

  public cancelClicked($event: WizardEvent): void {
    const link: string[] = [ DataservicesConstants.dataservicesRootPath ];
    this.logger.log("[AddDataserviceWizardComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /*
   * Create the Dataservice via komodo REST interface,
   * using the currently entered properties
   */
  public createDataservice(): void {
    this.createComplete = false;
    this.wizardConfig.done = true;

    const dataservice: NewDataservice = new NewDataservice();

    // Dataservice basic properties from step 1
    dataservice.setId(this.dataserviceName);

    const self = this;
    this.dataserviceService
      .createDataservice(dataservice)
      .subscribe(
        () => {
          self.createComplete = true;
          self.createSuccessful = true;
          self.step2bConfig.nextEnabled = false;
        },
        (error) => {
          self.logger.error("[AddDataserviceWizardComponent] Error: %o", error);
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

  /**
   * Handler for property form initialization
   * @param {boolean} isValid form valid state
   */
  public onDetailPropertyInit(isValid: boolean): void {
    this.updatePage2ValidStatus(isValid);
  }

  /**
   * Handler for property form changes
   * @param {boolean} isValid form valid state
   */
  public onDetailPropertyChanged(isValid: boolean): void {
    this.updatePage2ValidStatus(isValid);
  }

  /**
   * @returns {string} the name of the dataservice
   */
  public get dataserviceName(): string {
    return this.basicPropertyForm.controls["name"].value;
  }

  /**
   * @returns {string} the connection name of the dataservice
   */
  public get connectionName(): string {
    return this.basicPropertyForm.controls["connection"].value;
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
      connection: new FormControl("", Validators.required)
    });
    // Responds to basic property changes - updates the page status
    this.basicPropertyForm.valueChanges.subscribe((val) => {
      this.updatePage1ValidStatus( );
    });
  }

  private setNavAway(allow: boolean): void {
    this.step1Config.allowNavAway = allow;
  }

  private updatePage1ValidStatus( ): void {
    this.step1Config.nextEnabled = this.basicPropertyForm.valid;
    this.setNavAway(this.step1Config.nextEnabled);
  }

  private updatePage2ValidStatus(formValid: boolean): void {
    this.step2Config.nextEnabled = formValid;
    this.setNavAway(this.step2Config.nextEnabled);
  }

}
