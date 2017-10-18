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
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { NewConnection } from "@connections/shared/new-connection.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { LoggerService } from "@core/logger.service";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { WizardComponent } from "patternfly-ng";
import { WizardEvent } from "patternfly-ng";
import { WizardStepConfig } from "patternfly-ng";
import { WizardConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-add-connection-wizard",
  templateUrl: "./add-connection-wizard.component.html"
})
export class AddConnectionWizardComponent implements OnInit {
  public readonly connectionSummaryLink: string = ConnectionsConstants.connectionsRootPath;

  // Wizard Config
  public wizardConfig: WizardConfig;

  public basicPropertyForm: FormGroup;
  public createComplete = true;
  public createSuccessful = false;
  public detailPropertiesLoaded = false;
  public requiredPropValues: Array<[string, string]> = [];
  public templatesLoaded = false;

  // Wizard Step 1
  public step1Config: WizardStepConfig;

  // Wizard Step 2
  public step2Config: WizardStepConfig;

  // Wizard Step 3
  public step3Config: WizardStepConfig;
  public step3aConfig: WizardStepConfig;
  public step3bConfig: WizardStepConfig;

  @ViewChild("wizard") public wizard: WizardComponent;
  @ViewChild(PropertyFormComponent) public detailPropForm: PropertyFormComponent;

  private connectionService: ConnectionService;
  private allTemplates: TemplateDefinition[] = [];
  private detailProperties: Array<PropertyDefinition<any>> = [];
  private logger: LoggerService;
  private router: Router;

  constructor( router: Router, connectionService: ConnectionService, logger: LoggerService ) {
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

    // Step 2 - Advanced Properties
    this.step2Config = {
      id: "step2",
      priority: 0,
      title: "Detail Properties",
      allowClickNav: false
    } as WizardStepConfig;

    // Step 3 - Review and Create
    this.step3Config = {
      id: "step3",
      priority: 2,
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
      loadingTitle: "Add Connection Wizard loading",
      loadingSecondaryInfo: "Please wait for the wizard to finish loading...",
      title: "Add Connection",
      sidebarStyleClass: "example-wizard-sidebar",
      stepStyleClass: "example-wizard-step"
    } as WizardConfig;

    // Load the templates for the first step
    this.templatesLoaded = false;
    this.connectionService
      .getConnectionTemplates()
      .subscribe(
        (templates) => {
          this.allTemplates = templates;
          this.templatesLoaded = true;
        },
        (error) => {
          this.logger.error("[AddConnectionWizardComponent] Error getting templates: %o", error);
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
   * Return the driver valid state
   */
  public get driverValid(): boolean {
    return this.basicPropertyForm.controls["driver"].valid;
  }

  /*
   * Return the jndi valid state
   */
  public get jndiValid(): boolean {
    return this.basicPropertyForm.controls["jndi"].valid;
  }

  /*
   * Step 1 instruction message
   */
  public get step1InstructionMessage(): string {
    if (!this.driverValid) {
      return "Please select a Connection type";
    } else if (!this.nameValid) {
      return "Please enter a name for the Connection";
    } else if (!this.jndiValid) {
      return "Please enter a JNDI identifier for the Connection";
    } else {
      return "When finished entering properties, click Next to continue";
    }
  }

  /*
   * Step 2 instruction message
   */
  public get step2InstructionMessage(): string {
    return "Enter advanced properties for the Connection, then click Next to continue";
  }

  /*
   * Step 3 instruction message
   */
  public get step3InstructionMessage(): string {
    return "Review your entries.  When finished, click Create to create the Connection";
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

  /*
   * Return the array of template names
   */
  public get templateNames(): string[] {
    const templateNames: string[] = [];
    for ( const templ of this.allTemplates ) {
      templateNames.push(templ.getId());
    }
    return templateNames.sort();
  }

  public nextClicked($event: WizardEvent): void {
    // When leaving page 1, load the driver-specific property definitions
    if ($event.step.config.id === "step1") {
      this.loadPropertyDefinitions(this.basicPropertyForm.controls["driver"].value);
    }
  }

  public cancelClicked($event: WizardEvent): void {
    const link: string[] = [ ConnectionsConstants.connectionsRootPath ];
    this.logger.log("[AddConnectionWizardComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /*
   * Return the array of [name,value] for the required properties.
   * So that the current required property entries can be shown on page 3 (review)
   */
  public get requiredPropertyValues(): Array<[string, string]> {
    return this.requiredPropValues;
  }

  /*
   * Create the Connection via komodo REST interface,
   * using the currently entered properties
   */
  public createConnection(): void {
    this.createComplete = false;
    this.wizardConfig.done = true;

    const connection: NewConnection = new NewConnection();

    // Connection basic properties from step 1
    connection.setName(this.connectionName);
    connection.setJndiName(this.connectionJndiName);
    connection.setDriverName(this.connectionDriverName);
    connection.setJdbc(this.isJdbc);

    // Connection advanced properties from step 2
    const propMap: Map<string, string> = this.detailPropForm.propertyValuesNonDefault;
    connection.setProperties(propMap);

    this.connectionService
      .createConnection(connection)
      .subscribe(
        () => {
          this.createComplete = true;
          this.createSuccessful = true;
          this.step3bConfig.nextEnabled = false;
        },
        (error) => {
          this.createComplete = true;
          this.createSuccessful = false;
        }
      );
  }

  public stepChanged($event: WizardEvent): void {
    if ($event.step.config.id === "step1") {
      this.updatePage1ValidStatus();
    } else if ($event.step.config.id === "step3a") {
      this.wizardConfig.nextTitle = "Create";
      this.updateRequiredPropertyValues();
    } else if ($event.step.config.id === "step3b") {
      // Note: The next button is not disabled by default when wizard is done
      this.step3Config.nextEnabled = false;
    } else {
      this.wizardConfig.nextTitle = "Next >";
    }
  }

  public updatePage1ValidStatus( ): void {
    this.step1Config.nextEnabled = this.basicPropertyForm.valid;
    this.setNavAway(this.step1Config.nextEnabled);
  }

  /**
   * @returns {string} the name of the connection
   */
  public get connectionName(): string {
    return this.basicPropertyForm.controls["name"].value;
  }

  /**
   * @returns {string} the driver name of the connection
   */
  public get connectionDriverName(): string {
    return this.basicPropertyForm.controls["driver"].value;
  }

  /**
   * @returns {string} the JNDI name of the connection
   */
  public get connectionJndiName(): string {
    return this.basicPropertyForm.controls["jndi"].value;
  }

  /**
   * @returns {boolean} 'true' if connection is JDBC
   */
  public get isJdbc(): boolean {
    return true;
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
      jndi: new FormControl("", Validators.required),
      driver: new FormControl("", Validators.required)
    });
    this.onChanges();
  }

  /*
   * React to basic property changes - update the page 1 status
   */
  private onChanges(): void {
    this.basicPropertyForm.valueChanges.subscribe((val) => {
      this.updatePage1ValidStatus( );
    });
  }

  private setNavAway(allow: boolean): void {
    this.step1Config.allowNavAway = allow;
  }

  /**
   * Load the driver-specific property definitions
   */
  private loadPropertyDefinitions( driverName ): void {
    this.detailPropertiesLoaded = false;
    const that = this;
    this.connectionService
      .getConnectionTemplateProperties(driverName)
      .subscribe(
        (props) => {
          that.detailProperties = props;
          this.detailPropertiesLoaded = true;
        },
        (error) => {
          this.logger.error("[AddConnectionWizardComponent] Error: %o", error);
          // this.error(error);
          this.detailPropertiesLoaded = false;
        }
      );
  }

  /**
   * @returns {PropertyDefinition<any>[]} the property definitions (can be null)
   */
  private getPropertyDefinitions(): Array<PropertyDefinition<any>> {
    return this.detailProperties;
  }

  /**
   * Generates array of required property values when page 3 (Review) is shown
   */
  private updateRequiredPropertyValues(): void {
    const propMap: Map<string, string> = new Map<string, string>();
    for (const property of this.detailProperties) {
      if (property.isRequired()) {
        const name = property.getId();
        const theValue = this.detailPropForm.getPropertyValue(name);
        propMap.set(name, theValue);
      }
    }
    this.requiredPropValues = Array.from(propMap);
  }

}
