import { Injectable } from "@angular/core";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { Virtualization } from "@dataservices/shared/virtualization.model";
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
  private dataserviceDeployStateSubject: Subject< Map<string, DeploymentState> > = new ReplaySubject< Map<string, DeploymentState> >(1);
  private dataserviceVirtualizationSubject: Subject< Map<string, Virtualization> > = new ReplaySubject< Map<string, Virtualization> >(1);

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
  public sendDataserviceDeployStateMap(stateMap: Map<string, DeploymentState>): void {
    this.dataserviceDeployStateSubject.next(stateMap);
  }

  /**
   * Get the map of dataservice DeploymentState
   * @returns {Observable<Map<string, DeploymentState>>}
   */
  public getDataserviceDeployStateMap(): Observable<Map<string, DeploymentState>> {
    return this.dataserviceDeployStateSubject.asObservable();
  }

  /**
   * Clears the dataservice DeploymentState
   */
  public clearDataserviceDeployStateMap(): void {
    this.dataserviceDeployStateSubject.next(null);
  }

  /**
   * Sends map of dataservice virtualizations
   * @param {Map<string, Virtualization>} stateMap
   */
  public sendDataserviceVirtualizationMap(stateMap: Map<string, Virtualization>): void {
    this.dataserviceVirtualizationSubject.next(stateMap);
  }

  /**
   * Get the map of dataservice Virtualization
   * @returns {Observable<Map<string, Virtualization>>}
   */
  public getDataserviceVirtualizationMap(): Observable<Map<string, Virtualization>> {
    return this.dataserviceVirtualizationSubject.asObservable();
  }

  /**
   * Clears the dataservice Virtualization
   */
  public clearDataserviceVirtualizationMap(): void {
    this.dataserviceVirtualizationSubject.next(null);
  }
}
