import { Injectable, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { environment } from "@environments/environment";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockAppSettingsService extends AppSettingsService implements OnInit {

  protected readonly userNameProperty = "User Name";
  protected readonly workspaceProperty = "Workspace";

  protected readonly userProfile = {
    userNameProperty: "dsbUser",
    workspaceProperty: environment.komodoWorkspaceUrl + "/dsbUser"
  };

  constructor( http: Http,
               logger: LoggerService) {
    super( http, logger );
  }

  protected fetchUserProfile(): Observable< object > {
    return Observable.of( this.userProfile );
  }

  public getKomodoUser(): string {
    return this.userProfile[ this.userNameProperty ];
  }

  public getKomodoUserWorkspacePath(): string {
    return this.userProfile[ this.workspaceProperty ];
  }

  public ngOnInit(): void {
    // nothing to do
  }

}
