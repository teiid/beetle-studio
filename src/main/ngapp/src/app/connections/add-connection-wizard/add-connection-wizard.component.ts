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
import { Router } from "@angular/router";
import { ConnectionType } from "@connections/shared/connection-type.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { NewConnection } from "@connections/shared/new-connection.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { LoggerService } from "@core/logger.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { NotificationType, WizardEvent } from "patternfly-ng";
import { WizardStepConfig } from "patternfly-ng";
import { WizardConfig } from "patternfly-ng";
import { WizardComponent } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-add-connection-wizard",
  templateUrl: "./add-connection-wizard.component.html",
  styleUrls: ["./add-connection-wizard.component.css"]
})
export class AddConnectionWizardComponent implements OnInit {
  public readonly connectionSummaryLink: string = ConnectionsConstants.connectionsRootPath;
  public emptyServiceCatalogSource = new ServiceCatalogSource(); // a bogus service catalog source used in drop down to give instructions
  public readonly selectServiceCatalogSourceErrorMsg = "A service catalog source must be selected";

  // Wizard Config
  public wizardConfig: WizardConfig;

  public connectionBasicPropertyForm: FormGroup;
  public createComplete = true;
  public createSuccessful = false;
  public connectionTypesLoading = true;
  public connectionTypesLoadSuccess = false;
  public serviceCatalogSourcesLoading = true;
  public serviceCatalogSourcesLoadSuccess = false;
  public nameValidationError = "";
  public selectedServiceCatalogSource: ServiceCatalogSource;

  // Wizard Step 1
  public step1Config: WizardStepConfig;

  // Wizard Step 2
  public step2Config: WizardStepConfig;
  public step2aConfig: WizardStepConfig;
  public step2bConfig: WizardStepConfig;
  public noSourcesNotificationDismissable = false;
  public noSourcesNotificationHeader = "No Sources Available";
  public noSourcesNotificationMessage = "No Sources of the correct type to select. ";
  public noSourcesNotificationType = NotificationType.DANGER;

  @ViewChild("wizard") public wizard: WizardComponent;

  private connectionService: ConnectionService;
  private wizardService: WizardService;
  private selectedConnTypes: ConnectionType[] = [];
  private connTypes: ConnectionType[] = [];
  private serviceCatSources: ServiceCatalogSource[] = [];
  private logger: LoggerService;
  private router: Router;
  private errorDetailMessage: string;
  private theFinalPageTitle = "";
  private theFinalPageMessage = "";

  constructor( router: Router, connectionService: ConnectionService,
               wizardService: WizardService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.wizardService = wizardService;
    this.router = router;
    this.logger = logger;
    this.emptyServiceCatalogSource.setId( " -- select catalog source -- " );
    this.selectedServiceCatalogSource = this.emptyServiceCatalogSource;
    this.createConnectionBasicPropertyForm();
  }

  /*
   * Initialization
   */
  public ngOnInit(): void {
    // Step 1 - Basic Properties
    this.step1Config = {
      id: "step1",
      priority: 0,
      title: "Connection Type",
      allowClickNav: false
    } as WizardStepConfig;

    // Step 3 - Review and Create
    this.step2Config = {
      id: "step2",
      priority: 0,
      title: "Connection Definition",
      allowClickNav: false
    } as WizardStepConfig;
    this.step2aConfig = {
      id: "step2a",
      priority: 0,
      title: "Define",
      allowClickNav: false
    } as WizardStepConfig;
    this.step2bConfig = {
      id: "step2b",
      priority: 1,
      title: "Review",
      allowClickNav: false
    } as WizardStepConfig;

    // Wizard Configuration
    this.wizardConfig = {
      embedInPage: true,
      loadingTitle: "Add Connection Wizard loading",
      loadingSecondaryInfo: "Please wait for the wizard to finish loading...",
      title: "Add Connection",
      contentHeight: "500px",
      done: false
    } as WizardConfig;

    // Load the available connection types for the first step
    this.connTypes = this.connectionService.getConnectionTypes();
    this.connectionTypesLoadSuccess = true;
    this.connectionTypesLoading = false;

    // Select connection type if editing
    if (this.wizardService.isEdit()) {
      const selectedConnection = this.wizardService.getSelectedConnection();
      const connType = selectedConnection.getDriverName();
      for (const cType of this.connectionTypes) {
        if (connType === cType.getName()) {
          this.onConnectionTypeSelected(cType);
          break;
        }
      }
    }
  }

  // ----------------
  // Public Methods
  // ----------------

  public handleNameChanged( input: AbstractControl ): void {
    const self = this;

    this.connectionService.isValidName( input.value ).subscribe(
      ( errorMsg ) => {
        if ( errorMsg ) {
          // only update if error has changed
          if ( errorMsg !== self.nameValidationError ) {
            self.nameValidationError = errorMsg;
          }
        } else { // name is valid
          self.nameValidationError = "";
        }
        self.updatePage2ValidStatus();
      },
      ( error ) => {
        self.logger.error( "[handleNameChanged] Error: %o", error );
      } );
  }

  /*
   * Return the name valid state
   */
  public get nameValid(): boolean {
    if (this.wizardService.isEdit()) {
      return true;
    }
    return this.nameValidationError == null || this.nameValidationError.length === 0;
  }

  /**
   * Handles service catalog source change
   * @param {string} newValue the new serviceCatalog source
   */
  public selectedServiceCatalogSourceChanged( newValue ): void {
    this.selectedServiceCatalogSource = this.serviceCatSources.find((src) => src.getId() === newValue);
    this.updatePage2ValidStatus();
  }

  /*
   * Determine if there are one or more service catalog sources
   */
  public get hasServiceCatalogSources(): boolean {
    return this.serviceCatSources.length > 0;
  }

  /**
   * @returns {boolean} `true` if a service catalog source has been selected
   */
  public get hasSelectedServiceCatalogSource(): boolean {
    return ( this.selectedServiceCatalogSource != null ) && ( this.selectedServiceCatalogSource !== this.emptyServiceCatalogSource );
  }

  /**
   * @returns {boolean} `true` if the serviceCatalogSource is selected, but type is different than
   * the selected connection type.
   */
  public get serviceCatalogSelectedWrongType(): boolean {
    if (!this.hasSelectedServiceCatalogSource) {
      return false;
    }
    const selectedSvcCatSourceType = this.selectedServiceCatalogSource.getType();
    const selectedConnType = this.selectedConnTypes[0];

    return selectedConnType.getName() !== selectedSvcCatSourceType;
  }

  /**
   * Gets the Title to be displayed on the final wizard page
   * @returns {string}
   */
  public get finalPageTitle(): string {
    return this.theFinalPageTitle;
  }

  /**
   * Gets the message to be displayed on the final wizard page
   * @returns {string}
   */
  public get finalPageMessage(): string {
    return this.theFinalPageMessage;
  }

  /**
   * @returns {string} the error details message
   */
  public get errorDetails(): string {
    return this.errorDetailMessage;
  }

  /*
   * Step 1 instruction message
   */
  public get step1InstructionMessage(): string {
    return "Please select a Connection type";
  }

  /*
   * Step 2 instruction message
   */
  public get step2InstructionMessage(): string {
    if (this.serviceCatSources.length === 0) {
      return "No sources available";
    } else if (!this.nameValid) {
      return "Please enter a name for the Connection";
    } else if (!this.hasSelectedServiceCatalogSource) {
      return "Please select a catalog source for the Connection";
    } else {
      if (this.wizardService.isEdit()) {
        return "Review selections.  Click Update to update the Connection";
      } else {
        return "When finished, click Create to create the Connection";
      }
    }
  }

  /*
   * Return the name error message if invalid
   */
  public getConnectionBasicPropertyErrorMessage( name: string ): string {
    const control: AbstractControl = this.connectionBasicPropertyForm.controls[name];
    if (control.invalid) {
      // The first error found is returned
      if (control.errors.required) {
        return name + " is a required property";
      }
    }
    return "";
  }

  /*
   * Return the array of ConnectionTypes
   */
  public get connectionTypes(): ConnectionType[] {
    return this.connTypes;
  }

  /*
   * Return the currently selected ConnectionType
   */
  public get selectedConnectionTypes(): ConnectionType[] {
    return this.selectedConnTypes;
  }

  /**
   * Handles connection type selection
   * @param {ConnectionType} connectionType the connection type
   */
  public onConnectionTypeSelected(connectionType: ConnectionType): void {
    // Only allow one item to be selected
    this.selectedConnTypes.shift();
    this.selectedConnTypes.push(connectionType);
    // Selecting type clears the serviceCatalog source selection
    this.selectedServiceCatalogSource = this.emptyServiceCatalogSource;
    this.updatePage1ValidStatus();
  }

  /**
   * Handles connection type de-selection
   * @param {ConnectionType} connectionType the connection type
   */
  public onConnectionTypeDeselected(connectionType: ConnectionType): void {
    // Only one item is selected at a time
    this.selectedConnTypes.shift();
  }

  /*
   * Return the array of ServiceCatalogSources
   */
  public get serviceCatalogSources(): ServiceCatalogSource[] {
    return this.serviceCatSources;
  }

  public nextClicked($event: WizardEvent): void {
    // When leaving page 1, load the available service catalog sources for the selected type
    if ($event.step.config.id === "step1") {
      // load the available catalog sources
      this.loadServiceCatalogSources(this.selectedConnTypes[0]);
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
   * Create the Connection via komodo REST interface,
   * using the currently entered properties
   */
  public createConnection(): void {
    this.createComplete = false;
    this.createSuccessful = false;

    const connection: NewConnection = new NewConnection();

    // Connection basic properties
    connection.setName(this.connectionName);
    connection.setDescription(this.connectionDescription);
    connection.setServiceCatalogSource(this.selectedServiceCatalogSource.getId());

    const self = this;
    if (this.wizardService.isEdit()) {
      this.updateDeployConnection(connection);
    } else {
      this.createDeployConnection(connection);
    }
  }

  public stepChanged($event: WizardEvent): void {
    if ($event.step.config.id === "step1") {
      this.wizardConfig.nextTitle = "Next >";
      this.updatePage1ValidStatus();
    } else if ($event.step.config.id === "step2a") {
      if (this.wizardService.isEdit()) {
        this.wizardConfig.nextTitle = "Update";
      } else {
        this.wizardConfig.nextTitle = "Create";
      }
      this.updatePage2ValidStatus();
    } else if ($event.step.config.id === "step2b") {
      this.step2Config.nextEnabled = false;
    } else {
      this.wizardConfig.nextTitle = "Next >";
    }
  }

  /**
   * @returns {string} the name of the connection
   */
  public get connectionName(): string {
    return this.connectionBasicPropertyForm.controls["name"].value;
  }

  /**
   * @returns {string} the description of the connection
   */
  public get connectionDescription(): string {
    return this.connectionBasicPropertyForm.controls["description"].value;
  }

  // ----------------
  // Private Methods
  // ----------------

  /**
   * Create the Connection Basic properties form
   */
  private createConnectionBasicPropertyForm(): void {
    this.connectionBasicPropertyForm = new FormGroup({
      name: new FormControl( "", this.handleNameChanged.bind( this ) ),
      description: new FormControl(""),
    });

    // Initialize form values
    if (!this.wizardService.isEdit()) {
      this.connectionBasicPropertyForm.controls["name"].setValue(null);
      this.connectionBasicPropertyForm.controls["description"].setValue(null);
    } else {
      const selectedConnection = this.wizardService.getSelectedConnection();
      this.connectionBasicPropertyForm.controls["name"].setValue(selectedConnection.name);
      this.connectionBasicPropertyForm.controls["description"].setValue(selectedConnection.getDescription());
      this.connectionBasicPropertyForm.get("name").disable();
    }

    // Responds to basic property changes - updates the page status
    this.connectionBasicPropertyForm.valueChanges.subscribe((val) => {
      this.updatePage2ValidStatus( );
    });
  }

  /**
   * Load the available service catalog sources for the supplied connection type
   * @param {ConnectionType} connType the connection type
   */
  private loadServiceCatalogSources(connType: ConnectionType): void {
    // Load the available service catalog sources for the second step
    this.serviceCatalogSourcesLoading = true;
    this.serviceCatalogSourcesLoadSuccess = false;

    const self = this;
    this.connectionService
      .getAllServiceCatalogSources()
      .subscribe(
        (sources) => {
          // Only keep the service catalog sources whose type matches the connectionType.  empty source is always included.
          self.serviceCatSources = [];
          for ( const source of sources ) {
            if ( source.getType() === connType.getName() ) {
              self.serviceCatSources.push(source);
            }
          }

          // Edit mode select the service catalog source
          if (self.wizardService.isEdit() && (!self.hasSelectedServiceCatalogSource || self.serviceCatalogSelectedWrongType)) {
            const selectedConnection = self.wizardService.getSelectedConnection();
            const connSvcSourceName = selectedConnection.getServiceCatalogSourceName();
            self.selectedServiceCatalogSource = this.emptyServiceCatalogSource;
            for (const svcSource of self.serviceCatSources) {
              if (svcSource.getId() === connSvcSourceName) {
                self.selectedServiceCatalogSource = svcSource;
                break;
              }
            }
          }

          self.updatePage2ValidStatus();
          self.serviceCatalogSourcesLoading = false;
          self.serviceCatalogSourcesLoadSuccess = true;
        },
        (error) => {
          // Creates the connection property form
          this.createConnectionBasicPropertyForm();

          self.logger.error("[AddConnectionWizardComponent] Error getting service catalog sources: %o", error);
          self.updatePage2ValidStatus();
          self.serviceCatalogSourcesLoading = false;
          self.serviceCatalogSourcesLoadSuccess = false;
        }
      );
  }

  /**
   * Updates the page 1 status
   */
  private updatePage1ValidStatus( ): void {
    this.step1Config.nextEnabled = this.selectedConnTypes.length > 0;
  }

  /**
   * Updates the page 2 status
   */
  private updatePage2ValidStatus( ): void {
    if (!this.step2aConfig) {
      return;
    }
    if (this.wizardService.isEdit()) {
      this.step2aConfig.nextEnabled = this.connectionBasicPropertyForm.valid;
    } else {
      this.step2aConfig.nextEnabled = this.nameValid && this.hasSelectedServiceCatalogSource;
    }
  }

  /**
   * Creates the workspace connection, binds to serviceCatalogSource,
   * and deploys a corresponding connection VDB to teiid.
   * @param {Connection} connection the new connection
   */
  private createDeployConnection(connection: NewConnection): void {
    const self = this;
    this.connectionService
      .createDeployConnection(connection)
      .subscribe(
        (wasSuccess) => {
          self.setFinalPageComplete(wasSuccess);
        },
        (error) => {
          self.logger.error("[AddConnectionWizardComponent] Error creating connection: %o", error);
          self.setErrorDetails(error);
          self.setFinalPageComplete(false);
        }
      );
  }

  /**
   * Updates the workspace connection, binds to serviceCatalogSource,
   * and re-deploys the corresponding connection VDB to teiid.
   * @param {Connection} connection the new connection
   */
  private updateDeployConnection(connection: NewConnection): void {
    const self = this;
    this.connectionService
      .updateDeployConnection(connection)
      .subscribe(
        (wasSuccess) => {
          self.setFinalPageComplete(wasSuccess);
        },
        (error) => {
          self.logger.error("[AddConnectionWizardComponent] Error updating connection: %o", error);
          self.setErrorDetails(error);
          self.setFinalPageComplete(false);
        }
      );
  }

  /**
   * Sets the final page in progress status
   */
  private setFinalPageInProgress(): void {
    this.createComplete = false;
    this.createSuccessful = false;
    if (this.wizardService.isEdit()) {
      this.theFinalPageTitle = "Update in progress";
      this.theFinalPageMessage = "The connection is being updated.";
    } else {
      this.theFinalPageTitle = "Creation in progress";
      this.theFinalPageMessage = "The connection is being created.";
    }
    this.step2bConfig.nextEnabled = false;
    this.step2bConfig.previousEnabled = false;
  }

  /**
   * Sets the final page completion status
   * @param {boolean} wasSuccessful 'true' if the create or update was successful
   */
  private setFinalPageComplete(wasSuccessful: boolean): void {
    this.createComplete = true;
    this.createSuccessful = wasSuccessful;
    this.step2bConfig.nextEnabled = false;
    this.step2bConfig.previousEnabled = true;
    if (wasSuccessful) {
      if (this.wizardService.isEdit()) {
        this.theFinalPageTitle = "Update was successful";
        this.theFinalPageMessage = "The connection was updated successfully. Click on the button to see all connections.";
      } else {
        this.theFinalPageTitle = "Creation was successful";
        this.theFinalPageMessage = "The connection was created successfully. Click on the button to see all connections.";
      }
    } else {
      if (this.wizardService.isEdit()) {
        this.theFinalPageTitle = "Update failed";
        this.theFinalPageMessage = "The connection update failed!";
      } else {
        this.theFinalPageTitle = "Creation failed";
        this.theFinalPageMessage = "The connection creation failed!";
      }
    }
  }

  /**
   * Sets the error details for the response
   * @param resp the rest call response
   */
  private setErrorDetails( resp: any ): void {
    // Get the error from the response json
    this.errorDetailMessage = "";
    if (resp) {
      try {
        this.errorDetailMessage = resp.json().error;
      } catch ( e ) {
        this.errorDetailMessage = resp.text();
      }
    }
    // Error visible if message has content
    if (this.errorDetailMessage.length === 0) {
      this.errorDetailMessage = "Please check dataservice entries and retry";
    }
  }
}
