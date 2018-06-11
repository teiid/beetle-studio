import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.css']
})
export class ProgressDialogComponent implements OnInit {

  public title = "Title";
  public bodyContent = "Progress Message";
  public bsModalRef: BsModalRef;

  constructor(bsModalRef: BsModalRef) {
    this.bsModalRef = bsModalRef;
  }

  public ngOnInit(): void {
    // Nothing to do
  }

}
