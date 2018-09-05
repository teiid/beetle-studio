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
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { LoggerService } from "@core/logger.service";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { VdbService } from "@dataservices/shared/vdb.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { CreateVirtualizationResult } from "@dataservices/create-virtualization-dialog/create-virtualization-result.model";
import { SelectionService } from "@core/selection.service";

@Component({
  selector: "app-create-virtualization-dialog",
  templateUrl: "./create-virtualization-dialog.component.html",
  styleUrls: ["./create-virtualization-dialog.component.css"]
})
/**
 * CreateVirtualization Dialog.  Invoke this from another component as follows:
 *
 *     this.modalRef = this.modalService.show(CreateVirtualizationDialogComponent, {initialState});
 *     this.modalRef.content.okAction.take(1).subscribe((createResult) => {
 *       // do something with dialog result - CreateVirtualizationResult
 *     });
 *
 *     The expected initial state is as follows:
 *     const initialState = {
 *       title: "The dialog title",
 *       cancelButtonText: "Text for cancel button",
 *       confirmButtonText: "Text for confirm button"
 *     };
 */
export class CreateVirtualizationDialogComponent implements OnInit {

  @Output() public okAction: EventEmitter<CreateVirtualizationResult> = new EventEmitter<CreateVirtualizationResult>();

  public readonly title = ViewEditorI18n.createVirtualizationDialogTitle;
  public readonly message = ViewEditorI18n.createVirtualizationDialogMessage;
  public readonly cancelButtonText = ViewEditorI18n.cancelButtonText;
  public readonly okButtonText = ViewEditorI18n.okButtonText;
  public okButtonEnabled = false;
  public bsModalRef: BsModalRef;
  public virtNameValidationError = "";
  public viewNameValidationError = "";
  public virtualizationPropertyForm: FormGroup;

  private loggerService: LoggerService;
  private dataserviceService: DataserviceService;
  private selectionService: SelectionService;
  private vdbService: VdbService;
  private serviceVdbName = "";

  constructor(bsModalRef: BsModalRef, logger: LoggerService,
              dataserviceService: DataserviceService, selectionService: SelectionService, vdbService: VdbService) {
    this.bsModalRef = bsModalRef;
    this.loggerService = logger;
    this.dataserviceService = dataserviceService;
    this.selectionService = selectionService;
    const dService = this.selectionService.getSelectedVirtualization();
    if ( dService && dService !== null ) {
      this.serviceVdbName = dService.getServiceVdbName();
    }
    this.vdbService = vdbService;
    this.createPropertyForm();
  }

  public ngOnInit(): void {
    this.virtualizationPropertyForm.controls["virtName"].setValue("");
    this.virtualizationPropertyForm.controls["virtDescription"].setValue("");
    this.virtualizationPropertyForm.controls["viewName"].setValue("");
    this.virtualizationPropertyForm.controls["viewDescription"].setValue("");
  }

  /*
   * Creates the view property form
   */
  private createPropertyForm(): void {
    this.virtualizationPropertyForm = new FormGroup({
      virtName: new FormControl( "", this.handleVirtNameChanged.bind( this ) ),
      virtDescription: new FormControl(""),
      viewName: new FormControl( "", this.handleViewNameChanged.bind( this ) ),
      viewDescription: new FormControl("")
    });
  }

  /**
   * Handler for virtualization name changes.
   * @param {AbstractControl} input
   */
  public handleVirtNameChanged( input: AbstractControl ): void {
    const self = this;

    this.dataserviceService.isValidName( input.value ).subscribe(
      ( errorMsg ) => {
        if ( errorMsg ) {
          // only update if error has changed
          if ( errorMsg !== self.virtNameValidationError ) {
            self.virtNameValidationError = errorMsg;
          }
        } else { // name is valid
          self.virtNameValidationError = "";
        }
        self.setOkButtonEnablement();
      },
      ( error ) => {
        self.loggerService.error( "[handleNameChanged] Error: %o", error );
        self.virtNameValidationError = "Error validating view name";
        self.setOkButtonEnablement();
      } );
  }

  /**
   * Handler for view name changes.  Since this will be the first view in the virtualization,
   * no need to make a service call - just do some general name checking
   * @param {AbstractControl} input
   */
  public handleViewNameChanged( input: AbstractControl ): void {
    this.viewNameValidationError = this.validateViewName(input.value);
    this.setOkButtonEnablement();
  }

  /**
   * OK selected.  Emit ViewDefinition with the view, then modal is closed
   */
  public onOkSelected(): void {
    const virtName = this.virtualizationPropertyForm.controls["virtName"].value;
    const virtDescr = this.virtualizationPropertyForm.controls["virtDescription"].value;
    const viewName = this.virtualizationPropertyForm.controls["viewName"].value;
    const viewDescr = this.virtualizationPropertyForm.controls["viewDescription"].value;

    const result = new CreateVirtualizationResult();
    result.setVirtualizationName(virtName);
    result.setVirtualizationDescription(virtDescr);
    result.setViewName(viewName);
    result.setViewDescription(viewDescr);
    this.okAction.emit(result);

    this.bsModalRef.hide();
  }

  /**
   * Cancel selected.  The modal is closed.
   */
  public onCancelSelected(): void {
    this.bsModalRef.hide();
  }

  /*
   * Return the virtualization name valid state
   */
  public get virtNameValid(): boolean {
    return this.virtNameValidationError == null || this.virtNameValidationError.length === 0;
  }

  /*
   * Return the view name valid state
   */
  public get viewNameValid(): boolean {
    return this.viewNameValidationError == null || this.viewNameValidationError.length === 0;
  }

  /**
   * Validate the provided view name.  If the name is valid, an empty string will be returned.  If the view is invalid,
   * the error message is returned.
   * @param {string} viewName the view name being validated
   * @return {string} the validation message
   */
  private validateViewName( viewName: string ): string {
    if ( !viewName || viewName === null || viewName.length === 0 ) {
      return "View name cannot be empty";
    }
    const isValid = /^\w+$/.test(viewName);
    if ( !isValid ) {
      return "View name can only contain letters, digits and underscores";
    }
    return "";
  }

  /**
   * Sets the OK button enablement.  Both the virtualization name and view name must be valid.
   */
  private setOkButtonEnablement(): void {
    if (this.virtNameValid && this.viewNameValid) {
      this.okButtonEnabled = true;
    } else {
      this.okButtonEnabled = false;
    }
  }

}
