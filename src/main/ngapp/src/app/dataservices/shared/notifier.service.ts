import { Injectable } from "@angular/core";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subject } from "rxjs/Subject";

/**
 * NotifierService is used to send notifications to any interested components, and for interested components to register
 * for notifications
 */
@Injectable()
export class NotifierService {

  private deploymentStatusSubject: Subject<VdbStatus> = new ReplaySubject<VdbStatus>(1);
  private dataserviceStateSubject: Subject< Map<string, DeploymentState> > = new ReplaySubject< Map<string, DeploymentState> >(1);

  constructor() {
    // Nothing to do
  }

  /**
   * Sends VdbStatus
   * @param {VdbStatus} status the VDB deployment Status
   */
  public sendVdbDeploymentStatus(status: VdbStatus): void {
    this.deploymentStatusSubject.next(status);
  }

  /**
   * Get the VdbStatus Observable
   * @returns {Observable<VdbStatus>}
   */
  public getVdbDeploymentStatus(): Observable<VdbStatus> {
    return this.deploymentStatusSubject.asObservable();
  }

  /**
   * Clears VdbStatus
   */
  public clearVdbDeploymentStatus(): void {
    this.deploymentStatusSubject.next(null);
  }

  /**
   * Sends map of dataservice DeploymentState
   * @param {Map<string, DeploymentState>} stateMap
   */
  public sendDataserviceStateMap(stateMap: Map<string, DeploymentState>): void {
    this.dataserviceStateSubject.next(stateMap);
  }

  /**
   * Get the map of dataservice DeploymentState
   * @returns {Observable<Map<string, DeploymentState>>}
   */
  public getDataserviceStateMap(): Observable<Map<string, DeploymentState>> {
    return this.dataserviceStateSubject.asObservable();
  }

  /**
   * Clears the dataservice DeploymentState
   */
  public clearDataserviceStateMap(): void {
    this.dataserviceStateSubject.next(null);
  }
}
