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
import { Validators } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { LoggerService } from "@core/logger.service";
import { ConnectionTableSelectorComponent } from "@dataservices/connection-table-selector/connection-table-selector.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { NewDataservice } from "@dataservices/shared/new-dataservice.model";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { LoadingState } from "@shared/loading-state.enum";
import { WizardComponent } from "patternfly-ng";
import { WizardEvent } from "patternfly-ng";
import { WizardStepConfig } from "patternfly-ng";
import { WizardConfig } from "patternfly-ng";
import { Subscription } from "rxjs/Subscription";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-add-dataservice-wizard",
  templateUrl: "./add-dataservice-wizard.component.html",
  styleUrls: ["./add-dataservice-wizard.component.css"]
})
export class AddDataserviceWizardComponent implements OnInit {
  public readonly dataserviceSummaryLink: string = DataservicesConstants.dataservicesRootPath;
  public loadingState = LoadingState; // need local ref of enum for html to use

  // Wizard Config
  public wizardConfig: WizardConfig;

  public basicPropertyForm: FormGroup;
  public createComplete = true;
  public createSuccessful = false;
  public tableSelectorLoadingState = LoadingState.LOADING;

  // Wizard Step 1
  public step1Config: WizardStepConfig;

  // Wizard Step 2
  public step2Config: WizardStepConfig;

  // Wizard Step 3
  public step3Config: WizardStepConfig;
  public step3aConfig: WizardStepConfig;
  public step3bConfig: WizardStepConfig;

  @ViewChild("wizard") public wizard: WizardComponent;
  @ViewChild(ConnectionTableSelectorComponent) public tableSelector: ConnectionTableSelectorComponent;

  private dataserviceService: DataserviceService;
  private vdbService: VdbService;
  private logger: LoggerService;
  private router: Router;
  private deploymentChangeSubscription: Subscription;

  constructor( router: Router, dataserviceService: DataserviceService,
               logger: LoggerService, vdbService: VdbService ) {
    this.dataserviceService = dataserviceService;
    this.vdbService = vdbService;
    this.router = router;
    this.logger = logger;
    this.createBasicPropertyForm();
  }

  /*
   * Initialization
   */
  public ngOnInit(): void {
    // Step 1 - Name and Description
    this.step1Config = {
      id: "step1",
      priority: 0,
      title: "Name and Description",
      allowClickNav: false
    } as WizardStepConfig;

    // Step 2 - Tables
    this.step2Config = {
      id: "step2",
      priority: 0,
      title: "Table Selection",
      allowClickNav: false
    } as WizardStepConfig;

    // Step 3 - Review and Create
    this.step3Config = {
      id: "step3",
      priority: 0,
      title: "Review and Create",
      allowClickNav: false
    } as WizardStepConfig;
    this.step3aConfig = {
      id: "step3a",
      priority: 0,
      title: "Review",
      allowClickNav: false
    } as WizardStepConfig;
    this.step3bConfig = {
      id: "step3b",
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
      contentHeight: "500px",
      done: false
    } as WizardConfig;

    this.tableSelectorLoadingState = LoadingState.LOADING;
    this.setNavAway(false);
  }

  // ----------------
  // Public Methods
  // ----------------

  /**
   * Determine if table selector is loading
   */
  public get tableSelectorLoading( ): boolean {
    return this.tableSelectorLoadingState === LoadingState.LOADING;
  }

  /**
   * Determine if table selector is loaded and valid
   */
  public get tableSelectorLoadedValid( ): boolean {
    return this.tableSelectorLoadingState === LoadingState.LOADED_VALID;
  }

  /**
   * Determine if table selector is loaded and invalid
   */
  public get tableSelectorLoadedInvalid( ): boolean {
    return this.tableSelectorLoadingState === LoadingState.LOADED_INVALID;
  }

  /*
   * Return the name valid state
   */
  public get nameValid(): boolean {
    return this.basicPropertyForm.controls["name"].valid;
  }

  /*
   * Step 1 instruction message
   */
  public get step1InstructionMessage(): string {
    if (!this.nameValid) {
      return "Please enter a name for the Dataservice";
    } else {
      return "Click Next to continue";
    }
  }

  /*
   * Step 2 instruction message
   */
  public get step2InstructionMessage(): string {
    if (!this.tableSelector.valid) {
      return "Please select tables for the Dataservice";
    } else {
      return "Select tables, then click Next to continue";
    }
  }

  /*
   * Step 3 instruction message
   */
  public get step3InstructionMessage(): string {
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
    if ($event.step.config.id === "step1") {
      // TODO implement nextClicked
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
    this.createSuccessful = false;

    const sourceVdbName = this.tableSelector.getSelectedTables()[0].getConnection().getId() + VdbsConstants.SOURCE_VDB_SUFFIX;

    // Before polling, subscribe to get status event
    this.deploymentChangeSubscription = this.vdbService.deploymentStatus.subscribe((status) => {
      this.onSourceVdbDeploymentStateChanged(status);
    });

    const self = this;
    this.vdbService
      .deployVdbForTable(this.tableSelector.getSelectedTables()[0])
      .subscribe(
        (wasSuccess) => {
          // Deployment succeeded - wait for source vdb to become active
          if (wasSuccess) {
            self.vdbService.pollForActiveVdb(sourceVdbName, 30, 5);
          } else {
            self.createComplete = true;
            self.createSuccessful = false;
            self.step3bConfig.nextEnabled = false;
            self.vdbService.deploymentStatus.unsubscribe();
          }
        },
        (error) => {
          self.logger.error("[AddDataserviceWizardComponent] Error: %o", error);
          self.createComplete = true;
          self.createSuccessful = false;
          self.step3bConfig.nextEnabled = false;
          self.vdbService.deploymentStatus.unsubscribe();
        }
      );
  }

  /*
   * Listens for the source VDB deployment completion.  If the source VDB is active, proceed with
   * creation of the Dataservice
   * @param status the VDB deployment status
   */
  public onSourceVdbDeploymentStateChanged(status: VdbStatus): void {
    // if null received, ignore
    if (!status) {
      return;
      // non-null received, unsubscribe to stop any further notifications
    } else {
      // Got the status change, unsubscribe
      this.deploymentChangeSubscription.unsubscribe();
    }

    if (this.tableSelector.hasSelectedConnection()) {
      const selectedConnectionName = this.tableSelector.selectedConnection.getId();
      const selectedVdbName = selectedConnectionName + VdbsConstants.SOURCE_VDB_SUFFIX;
      if (selectedVdbName === status.getName()) {
        if (status.isActive()) {
          this.createDataserviceForSingleTable();
        } else if (status.isFailed()) {
          this.createComplete = true;
          this.createSuccessful = false;
          this.step3bConfig.nextEnabled = false;
        }
      }
    }
  }

  public stepChanged($event: WizardEvent): void {
    if ($event.step.config.id === "step1") {
      this.updatePage1ValidStatus();
      this.wizardConfig.nextTitle = "Next >";
    } else if ($event.step.config.id === "step2") {
      this.updatePage2ValidStatus();
      this.wizardConfig.nextTitle = "Next >";
    } else if ($event.step.config.id === "step3a") {
      this.wizardConfig.nextTitle = "Create";
    } else if ($event.step.config.id === "step3b") {
      // Note: The next button is not disabled by default when wizard is done
      this.step3Config.nextEnabled = false;
    } else {
      this.wizardConfig.nextTitle = "Next >";
    }
  }

  /**
   * @returns {string} the name of the dataservice
   */
  public get dataserviceName(): string {
    return this.basicPropertyForm.controls["name"].value;
  }

  /**
   * @returns {string} the description of the dataservice
   */
  public get dataserviceDescription(): string {
    return this.basicPropertyForm.controls["description"].value;
  }

  public updatePage2ValidStatus( ): void {
    this.step2Config.nextEnabled = this.tableSelector.valid();
    this.setNavAway(this.step2Config.nextEnabled);
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
      description: new FormControl("")
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

  /*
   * Create the Dataservice for the selected source table.  This is invoked
   * only after the source VDB has successfully deployed.
   */
  private createDataserviceForSingleTable(): void {
    const dataservice: NewDataservice = new NewDataservice();

    // Dataservice basic properties from step 1
    dataservice.setId(this.dataserviceName);
    dataservice.setDescription(this.dataserviceDescription);

    const self = this;
    this.dataserviceService
      .createDataserviceForSingleTable(dataservice, this.tableSelector.getSelectedTables()[0])
      .subscribe(
        (wasSuccess) => {
          // Deployment succeeded - wait for source vdb to become active
          if (wasSuccess) {
            self.createComplete = true;
            self.createSuccessful = true;
            self.step3bConfig.nextEnabled = false;
          } else {
            self.createComplete = true;
            self.createSuccessful = false;
            self.step3bConfig.nextEnabled = false;
          }
        },
        (error) => {
          self.logger.error("[AddDataserviceWizardComponent] Error: %o", error);
          self.createComplete = true;
          self.createSuccessful = false;
          self.step3bConfig.nextEnabled = false;
        }
      );

  }
}
