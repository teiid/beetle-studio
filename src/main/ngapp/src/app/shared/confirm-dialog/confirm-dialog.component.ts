import { Component, OnInit } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.css"]
})
/**
 * Confirmation Dialog.  Invoke this from another component as follows:
 *
 *     this.modalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
 *     this.modalRef.content.confirmAction.take(1).subscribe((value) => {
 *       this.doSomethingOnConfirm();
 *     });
 *
 *     The expected initial state is as follows:
 *     const initialState = {
 *       title: "The dialog title",
 *       bodyContent: "The dialog message",
 *       cancelButtonText: "Text for cancel button",
 *       confirmButtonText: "Text for confirm button"
 *     };
 */
export class ConfirmDialogComponent implements OnInit {

  @Output() public confirmAction = new EventEmitter();

  public title = "Title";
  public bodyContent = "Confirmation Message";
  public cancelButtonText = "Cancel";
  public confirmButtonText = "Confirm";
  public bsModalRef: BsModalRef;

  constructor(bsModalRef: BsModalRef) {
    this.bsModalRef = bsModalRef;
  }

  public ngOnInit(): void {
    // Nothing to do
  }

  public onConfirmSelected(): void {
    this.confirmAction.emit(true);
    this.bsModalRef.hide();
  }

  public onCancelSelected(): void {
    this.bsModalRef.hide();
  }

}
