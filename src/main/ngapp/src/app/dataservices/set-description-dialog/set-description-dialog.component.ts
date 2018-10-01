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
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-create-view-dialog",
  templateUrl: "./set-description-dialog.component.html",
  styleUrls: ["./set-description-dialog.component.css"]
})
/**
 * SetDescription Dialog.  Invoke this from another component as follows:
 *
 *     this.modalRef = this.modalService.show(SetDescriptionDialogComponent, {initialState});
 *     this.modalRef.content.okAction.take(1).subscribe((description) => {
 *       // do something with description
 *     });
 *
 *     The expected initial state is as follows:
 *     const initialState = {
 *       title: "The dialog title",
 *       cancelButtonText: "Text for cancel button",
 *       confirmButtonText: "Text for confirm button"
 *     };
 */
export class SetDescriptionDialogComponent implements OnInit {

  @Output() public okAction: EventEmitter<string> = new EventEmitter<string>();

  public readonly title = ViewEditorI18n.setDescriptionDialogTitle;
  public readonly message = ViewEditorI18n.setDescriptionDialogMessage;
  public readonly cancelButtonText = ViewEditorI18n.cancelButtonText;
  public readonly okButtonText = ViewEditorI18n.okButtonText;
  public description = "";
  public okButtonEnabled = true;
  public bsModalRef: BsModalRef;
  public viewPropertyForm: FormGroup;

  private loggerService: LoggerService;
  private originalDescription = "";

  constructor(bsModalRef: BsModalRef, logger: LoggerService) {
    this.bsModalRef = bsModalRef;
    this.loggerService = logger;
    this.createViewPropertyForm();
  }

  public ngOnInit(): void {
    this.originalDescription = this.description;
    this.viewPropertyForm.controls["description"].setValue(this.description);
  }

  /*
   * Creates the view property form
   */
  private createViewPropertyForm(): void {
      this.viewPropertyForm = new FormGroup({
        description: new FormControl(this.description)
      });
  }

  /**
   * OK selected.  Emit ViewDefinition with the view, then modal is closed
   */
  public onOkSelected(): void {
    const theDescr = this.viewPropertyForm.controls["description"].value;

    this.okAction.emit(theDescr);
    this.bsModalRef.hide();
  }

  /**
   * Cancel selected.  The modal is closed.
   */
  public onCancelSelected(): void {
    this.bsModalRef.hide();
  }

}
