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
import { ViewDefinition } from "@dataservices/shared/view-definition.model";

@Component({
  selector: "app-create-view-dialog",
  templateUrl: "./create-view-dialog.component.html",
  styleUrls: ["./create-view-dialog.component.css"]
})
/**
 * CreateView Dialog.  Invoke this from another component as follows:
 *
 *     this.modalRef = this.modalService.show(CreateViewDialogComponent, {initialState});
 *     this.modalRef.content.okAction.take(1).subscribe((selectedNodes) => {
 *       // do something with array of selected nodes - selectedNodes - SchemaNode[]
 *     });
 *
 *     The expected initial state is as follows:
 *     const initialState = {
 *       title: "The dialog title",
 *       cancelButtonText: "Text for cancel button",
 *       confirmButtonText: "Text for confirm button"
 *     };
 */
export class CreateViewDialogComponent implements OnInit {

  @Output() public okAction: EventEmitter<ViewDefinition> = new EventEmitter<ViewDefinition>();

  public readonly title = ViewEditorI18n.createViewDialogTitle;
  public readonly message = ViewEditorI18n.createViewDialogMessage;
  public readonly cancelButtonText = ViewEditorI18n.cancelButtonText;
  public readonly okButtonText = ViewEditorI18n.okButtonText;
  public okButtonEnabled = false;
  public bsModalRef: BsModalRef;
  public nameValidationError = "";
  public viewPropertyForm: FormGroup;

  private loggerService: LoggerService;
  private dataserviceService: DataserviceService;
  private vdbService: VdbService;
  private serviceVdbName = "";

  constructor(bsModalRef: BsModalRef, logger: LoggerService,
              dataserviceService: DataserviceService, vdbService: VdbService) {
    this.bsModalRef = bsModalRef;
    this.loggerService = logger;
    this.dataserviceService = dataserviceService;
    const dService = this.dataserviceService.getSelectedDataservice();
    if ( dService && dService !== null ) {
      this.serviceVdbName = dService.getServiceVdbName();
    }
    this.vdbService = vdbService;
    this.createViewPropertyForm();
  }

  public ngOnInit(): void {
    this.viewPropertyForm.controls["name"].setValue("");
    this.viewPropertyForm.controls["description"].setValue("");
  }

  /*
   * Creates the view property form
   */
  private createViewPropertyForm(): void {
      this.viewPropertyForm = new FormGroup({
        name: new FormControl( "", this.handleNameChanged.bind( this ) ),
        description: new FormControl("")
      });
      // Responds to basic property changes - updates the page status
      this.viewPropertyForm.valueChanges.subscribe((val) => {
        // this.updatePage2aValidStatus( );
      });
  }

  /**
   * Handler for view name changes.
   * @param {AbstractControl} input
   */
  public handleNameChanged( input: AbstractControl ): void {
    const self = this;

    this.vdbService.isValidViewName( this.serviceVdbName, "views", input.value ).subscribe(
      ( errorMsg ) => {
        if ( errorMsg ) {
          // only update if error has changed
          if ( errorMsg !== self.nameValidationError ) {
            self.nameValidationError = errorMsg;
          }
        } else { // name is valid
          self.nameValidationError = "";
        }
        self.setOkButtonEnablement();
      },
      ( error ) => {
        self.loggerService.error( "[handleNameChanged] Error: %o", error );
        self.nameValidationError = "Error validating view name";
        self.setOkButtonEnablement();
      } );
  }

  /**
   * OK selected.  Emit ViewDefinition with the view, then modal is closed
   */
  public onOkSelected(): void {
    const theName = this.viewPropertyForm.controls["name"].value;
    const theDescr = this.viewPropertyForm.controls["description"].value;

    const viewDefn = new ViewDefinition();
    viewDefn.setName(theName);
    viewDefn.setDescription(theDescr);
    this.okAction.emit(viewDefn);
    this.bsModalRef.hide();
  }

  /**
   * Cancel selected.  The modal is closed.
   */
  public onCancelSelected(): void {
    this.bsModalRef.hide();
  }

  /*
   * Return the name valid state
   */
  public get nameValid(): boolean {
    return this.nameValidationError == null || this.nameValidationError.length === 0;
  }

  /**
   * Sets the OK button enablement, based upon the selections
   */
  private setOkButtonEnablement(): void {
    if (this.nameValid) {
      this.okButtonEnabled = true;
    } else {
      this.okButtonEnabled = false;
    }
  }

}
