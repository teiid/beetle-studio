import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Connection } from "@connections/shared/connection.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import {  } from "@dataservices/shared/dataservice.model";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'views-content',
  templateUrl: './views-content.component.html'
})
export class ViewsContentComponent implements OnInit {
  @Input() public item: Dataservice;
  @Input() public selectedDataservices: Dataservice[];


  constructor() {
  }
  /**
   * @param {string} view the view whose connections are being requested
   * @returns {Connection[]} the connections of the dataservice represented by this card
   */
  public getConnections( view: string ): Connection[] {
    // TODO rewrite when REST functionality has been implemented
    const result: Connection[] = [];

    const c1 = new Connection();
    c1.setId( "ConnectionOne" );
    result.push( c1 );

    const c2 = new Connection();
    c2.setId( "ConnectionTwo" );
    result.push( c2 );

    const c3 = new Connection();
    c3.setId( "ConnectionThree" );
    result.push( c3 );

    return result;
  }

  /**
   * @param {Dataservice} ds the dataservice whose views are being requested
   * @returns {string[]} the names of the views
   */
  public getViews( ds: Dataservice ): string[] {
    const result: string[] = [];

    for (const viewName of ds.getServiceViewNames()) {
      result.push(viewName);
    }

    return result;
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
  }
}
