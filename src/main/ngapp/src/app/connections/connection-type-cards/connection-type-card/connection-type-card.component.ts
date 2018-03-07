import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { CardConfig } from "patternfly-ng";
import { ConnectionType } from "../../shared/connection-type.model";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-connection-type-card",
  templateUrl: "./connection-type-card.component.html",
  styleUrls: ["./connection-type-card.component.css"]
})
export class ConnectionTypeCardComponent implements OnInit {

  @Input() public connectionType: ConnectionType;
  @Input() public selectedConnectionTypes: ConnectionType[];
  @Output() public cardEvent: EventEmitter< {} > = new EventEmitter< {} >();
  @Output() public selectEvent: EventEmitter< ConnectionType > = new EventEmitter< ConnectionType >();

  public cardConfig: CardConfig;

  constructor() {
    // nothing to do
  }

  public ngOnInit(): void {
    this.cardConfig = {
      titleBorder: true,
      noPadding: true,
      topBorder: false
    } as CardConfig;
  }

  /**
   * @returns {string} the ConnectionType name
   */
  public get name(): string {
    return this.connectionType.getName();
  }

  /**
   * @returns {string} the ConnectionType description
   */
  public get description(): string {
    return this.connectionType.getDescription();
  }

  /**
   * @returns {string} the ConnectionType image source
   */
  public get imageSrc(): string {
    return this.connectionType.getImageSrc();
  }

  /**
   * @returns {string} the ConnectionType image alt text
   */
  public get imageAlt(): string {
    return this.connectionType.getImageAlt();
  }

  /**
   * @returns {boolean} `true` if the ConnectionType represented by this card is selected
   */
  public isSelected(): boolean {
    return this.selectedConnectionTypes.indexOf( this.connectionType ) !== -1;
  }

  /**
   * An event handler for when the card is clicked.
   */
  public onSelect(): void {
    this.selectEvent.emit( this.connectionType );
  }

}
