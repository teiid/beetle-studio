import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { LoadingState } from "@shared/loading-state.enum";
import { SqlView } from "@dataservices/shared/sql-view.model";

@Component({
  selector: "app-test-dataservice",
  templateUrl: "./test-dataservice.component.html",
  styleUrls: ["./test-dataservice.component.css"]
})
export class TestDataserviceComponent extends AbstractPageComponent {

  public readonly dataservicesLink = DataservicesConstants.dataservicesRootPath;

  public pageError: any = "";

  private dataservice: Dataservice;
  private dataserviceService: DataserviceService;
  private pageLoadingState: LoadingState = LoadingState.LOADED_VALID;
  private selectedSvcViewNames: SqlView[] = [];
  private allSvcViewNames: SqlView[] = [];
  private quickLookQueryText: string;

  constructor( router: Router, route: ActivatedRoute, dataserviceService: DataserviceService, logger: LoggerService ) {
    super(route, logger);
    this.dataserviceService = dataserviceService;
  }

  public loadAsyncPageData(): void {
    this.dataservice = this.dataserviceService.getSelectedDataservice();
    this.allSvcViewNames = this.dataserviceService.getSelectedDataserviceViewNames();
    this.selectedSvcViewNames = [];
    this.selectedSvcViewNames.push(this.allSvcViewNames[0]);
    const viewName = this.selectedSvcViewNames[0];
    this.quickLookQueryText = "SELECT * FROM " + viewName + ";";
  }

  /**
   * Determine if page is loading
   */
  public get pageLoading( ): boolean {
    return this.pageLoadingState === LoadingState.LOADING;
  }

  /**
   * Determine if page has loaded successfully
   */
  public get pageLoadedValid( ): boolean {
    return this.pageLoadingState === LoadingState.LOADED_VALID;
  }

  /**
   * Accessor for all available service view definitions
   */
  public get allServiceViewNames( ): SqlView[] {
    return this.allSvcViewNames;
  }

  /**
   * Accessor for selected service view definition
   */
  public get selectedViewNames( ): SqlView[] {
    return this.selectedSvcViewNames;
  }

  /**
   * @returns {string} the quick look service name
   */
  public get quickLookSql(): string {
    return this.quickLookQueryText;
  }
}
