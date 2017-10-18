import { Component, OnInit } from "@angular/core";
import {ConnectionsConstants} from "@connections/shared/connections-constants";

@Component({
  selector: "app-add-connection-page",
  templateUrl: "./add-connection.component.html",
  styleUrls: ["./add-connection.component.css"]
})
export class AddConnectionComponent implements OnInit {

  public readonly connectionsLink = ConnectionsConstants.connectionsRootPath;
  public pageError: any = "";

  constructor() {
    // Nothing
  }

  public ngOnInit(): void {
    // Nothing
  }

}
