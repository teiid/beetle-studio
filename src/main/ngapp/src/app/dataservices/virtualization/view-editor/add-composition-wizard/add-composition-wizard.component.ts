import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  NgxDataTableConfig, NotificationType,
  TableConfig,
  WizardComponent,
  WizardConfig,
  WizardEvent,
  WizardStepConfig
} from "patternfly-ng";
import { LoggerService } from "@core/logger.service";
import { Composition } from "@dataservices/shared/composition.model";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { LoadingState } from "@shared/loading-state.enum";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionTreeSelectorComponent } from "@dataservices/virtualization/view-editor/connection-table-dialog/connection-tree-selector/connection-tree-selector.component";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { Column } from "@dataservices/shared/column.model";
import { CompositionType } from "@dataservices/shared/composition-type.enum";
import { CompositionOperator } from "@dataservices/shared/composition-operator.enum";
import { PathUtils } from "@dataservices/shared/path-utils";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";

enum CompositeSide {
  LEFT = 0,
  RIGHT = 1
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-add-composition-wizard',
  templateUrl: './add-composition-wizard.component.html',
  styleUrls: ['./add-composition-wizard.component.css']
})
export class AddCompositionWizardComponent implements OnInit {

  @Input() public initialSourcePath: string;
  @Input() public editorService: ViewEditorService;
  @Output() public finishAction = new EventEmitter();
  @Output() public cancelAction = new EventEmitter();
  @ViewChild("wizard") public wizard: WizardComponent;
  @ViewChild("connTree") public connectionTree: ConnectionTreeSelectorComponent;

  // Wizard Config
  public wizardConfig: WizardConfig;

  // Wizard Step Configs
  public step1Config: WizardStepConfig;
  public step2Config: WizardStepConfig;

  public ngxLhTableConfig: NgxDataTableConfig;
  public lhTableConfig: TableConfig;
  public lhTableColumns: any[] = [];
  public lhTableRows: Column[] = [];

  public ngxRhTableConfig: NgxDataTableConfig;
  public rhTableConfig: TableConfig;
  public rhTableColumns: any[] = [];
  public rhTableRows: Column[] = [];

  public compositionTablesLoadingState = LoadingState.LOADING;
  public compositionLHColumnsLoadingState = LoadingState.LOADING;
  public compositionRHColumnsLoadingState = LoadingState.LOADING;
  public selectionText = ViewEditorI18n.noSelection;
  public readonly currentSelectionMsg = ViewEditorI18n.currentSelection;
  public selectedCompositionType: CompositionType = CompositionType.INNER_JOIN;
  public selectedCompositionCondition: CompositionOperator = CompositionOperator.EQ;
  public swapButtonText = ViewEditorI18n.addCompositionWizardSwapButtonText;

  private selectedTreeNodePath: string;

  private readonly step1Id = "step1";
  private readonly step2Id = "step2";
  private readonly logger: LoggerService;
  private readonly connectionService: ConnectionService;
  private composition: Composition;
  private columnsMap = new Map<string, Column[]>();  // Maintain loaded columns map to reduce rest calls
  private readonly columnLoadFailedHeader = "Loading Failed: ";
  private readonly columnLoadFailedMsg = "Columns failed to load!";
  private readonly columnLoadFailedType = NotificationType.DANGER;

  constructor( connectionService: ConnectionService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.logger = logger;
  }

  /*
   * Initialization
   */
  public ngOnInit(): void {
    // Step 1 - Basic Properties
    this.step1Config = {
      id: this.step1Id,
      priority: 0,
      title: ViewEditorI18n.addCompositionWizardStep1Text,
      allowClickNav: false,
      nextEnabled: false
    } as WizardStepConfig;

    // Step 3 - Review and Create
    this.step2Config = {
      id: this.step2Id,
      priority: 0,
      title: ViewEditorI18n.addCompositionWizardStep2Text,
      allowClickNav: false
    } as WizardStepConfig;

    // Wizard Configuration
    this.wizardConfig = {
      embedInPage: false,
      title: ViewEditorI18n.addCompositionWizardTitle,
      loadingTitle: ViewEditorI18n.addCompositionWizardLoadingPrimaryText,
      loadingSecondaryInfo: ViewEditorI18n.addCompositionWizardLoadingSecondaryText,
      contentHeight: "500px",
      done: false
    } as WizardConfig;

    // Init the working Composition model
    this.composition = new Composition();
    this.composition.setName(this.generateCompositionName());

    // Init the lhs of the composition with the editorService selection
    if (this.initialSourcePath && this.initialSourcePath !== null && this.initialSourcePath.length > 0) {
      const idParts = this.initialSourcePath.split(Command.identDivider);
      this.composition.setLeftSourcePath(idParts[1], true);
    } else {
      const selections = this.editorService.getSelection();
      if (selections && selections.length === 1) {
        const selection = selections[0];
        const idParts = selection.split(Command.identDivider);
        this.composition.setLeftSourcePath(idParts[1], true);
      }
    }

    const self = this;
    // Load the connection tables
    this.compositionTablesLoadingState = LoadingState.LOADING;
    this.connectionService
      .getConnections(true, true)
      .subscribe(
        (connectionSummaries) => {
          const conns = [];
          const treeNodes = [];
          for ( const connectionSummary of connectionSummaries ) {
            const connStatus = connectionSummary.getStatus();
            const conn = connectionSummary.getConnection();
            conn.setStatus(connStatus);
            conns.push(conn);
            // Add active connection to tree root nodes
            if (conn.isActive) {
              const node = new SchemaNode();
              node.setName(conn.getId());
              node.setType(ConnectionsConstants.schemaNodeType_connection);
              node.setHasChildren(true);
              treeNodes.push(node);
            }
          }
          self.connectionTree.setTreeRoots(treeNodes);
          self.compositionTablesLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.logger.error("[ConnectionTableDialogComponent] Error getting connections: %o", error);
          self.compositionTablesLoadingState = LoadingState.LOADED_INVALID;
        }
      );

    // ----------------------------------
    // Left Table configurations
    // ----------------------------------
    this.lhTableColumns = [
      {
        draggable: false,
        name: "Name",
        prop: "keng__id",
        resizeable: true,
        sortable: true,
        width: "100"
      }
    ];

    this.ngxLhTableConfig = {
      reorderable: false,
      selectionType: "'single'"
    } as NgxDataTableConfig;

    this.lhTableConfig = {
    } as TableConfig;

    // ----------------------------------
    // Right Table configurations
    // ----------------------------------
    this.rhTableColumns = [
      {
        draggable: false,
        name: "Name",
        prop: "keng__id",
        resizeable: true,
        sortable: true,
        width: "100"
      }
    ];

    this.ngxRhTableConfig = {
      reorderable: false,
      selectionType: "'single'"
    } as NgxDataTableConfig;

    this.rhTableConfig = {
    } as TableConfig;

    // Init columnsMap
    this.columnsMap.clear();

    this.loadColumns(CompositeSide.LEFT, true);
  }

  /**
   * Load the columns for the specified CompositeSide
   * @param {CompositeSide} side the side (left or right)
   * @param {boolean} initSelected if 'true' will attempt init the column selections
   */
  private loadColumns(side: CompositeSide, initSelected = false): void {
    const fullPath = this.getSourcePath(side);

    // Columns were already loaded - get them from Map
    if (this.columnsMap.has(fullPath)) {
      const cols = this.columnsMap.get(fullPath);
      this.setColumns(side, cols);
      this.updatePage2ValidStatus();
      return;
    }

    // Columns not loaded - make rest service call
    const connName = PathUtils.getConnectionName(fullPath);
    const tableOption = PathUtils.getPathWithoutConnection(fullPath);
    this.setColumnLoadingState(side, LoadingState.LOADING);
    const self = this;
    this.connectionService
      .getConnectionSchemaColumns(connName, tableOption)
      .subscribe(
        (columns) => {
          self.setColumns(side, columns);
          self.setColumnLoadingState(side, LoadingState.LOADED_VALID);
          self.columnsMap.set(fullPath, columns);
          if (initSelected) {
            self.initCompositionSelectedColumns();
          }
          self.updatePage2ValidStatus();
        },
        (error) => {
          self.setColumns(side, []);
          self.setColumnLoadingState(side, LoadingState.LOADED_INVALID);
          self.updatePage2ValidStatus();
          self.logger.debug("[AddCompositionWizard] Error getting columns: %o", error);
        }
      );
  }

  /**
   * Get the path for the specified source
   * @param {CompositeSide} side the side (left or right)
   * @return {string} the source path
   */
  private getSourcePath( side: CompositeSide ): string {
    if ( side === CompositeSide.LEFT ) {
      return this.composition.getLeftSourcePath();
    }
    return this.composition.getRightSourcePath();
  }

  /**
   * Set the specified columns loading state for the side
   * @param {CompositeSide} side the side (left or right)
   * @param {LoadingState} state the loading state
   */
  private setColumnLoadingState( side: CompositeSide, state: LoadingState): void {
    if ( side === CompositeSide.LEFT ) {
      this.compositionLHColumnsLoadingState = state;
    } else {
      this.compositionRHColumnsLoadingState = state;
    }
  }

  /**
   * Set the specified columns for the side
   * @param {CompositeSide} side the side (left or right)
   * @param {Column[]} cols the array of Columns
   */
  private setColumns( side: CompositeSide, cols: Column[] ): void {
    if ( !cols ) cols = [];
    if ( side === CompositeSide.LEFT ) {
      this.lhTableRows = cols;
    } else {
      this.rhTableRows = cols;
    }
  }

  /**
   * Get a title for the Left Composition table
   * @returns {string} the left title
   */
  public get leftCompositionTableTitle(): string {
    return this.generateTableTitle(CompositeSide.LEFT);
  }

  /**
   * Get a title for the Right Composition table
   * @returns {string} the right title
   */
  public get rightCompositionTableTitle(): string {
    return this.generateTableTitle(CompositeSide.RIGHT);
  }

  /**
   * Generate a table title for the specified side of the composite
   * @param {CompositeSide} side the side (left or right)
   * @return {string} the title
   */
  private generateTableTitle(side: CompositeSide): string {
    let title = "";
    let sourcePath = "";
    if (side === CompositeSide.LEFT) {
      sourcePath = this.composition.getLeftSourcePath();
      if (this.composition.initialSourceOnLeft) {
        title += "** ";
      }
    } else {
      sourcePath = this.composition.getRightSourcePath();
      if (this.composition.initialSourceOnRight) {
        title += "** ";
      }
    }
    if (sourcePath && sourcePath !== null) {
      const connName = PathUtils.getConnectionName(sourcePath);
      const sourceName = PathUtils.getSourceName(sourcePath);
      title += "[" + connName + "] " + sourceName;
    } else {
      title = "undefined";
    }
    return title;
  }

  /*
   * Step 1 instruction message
   */
  public get step1InstructionMessage(): string {
    let message = ViewEditorI18n.addCompositionWizardSelectSourceMessage;
    // If one composition node is available, use it in the message
    if (this.composition && this.composition !== null) {
      let sourcePath: string = null;
      if (this.composition.initialSourceOnLeft) {
        sourcePath = this.composition.getLeftSourcePath();
      } else if (this.composition.initialSourceOnRight) {
        sourcePath = this.composition.getRightSourcePath();
      }
      if (sourcePath !== null) {
        const connName = PathUtils.getConnectionName(sourcePath);
        const srcName = PathUtils.getSourceName(sourcePath);
        message = "Select a source for the composition.  The opposite node is: '[" + connName + "] " + srcName + "'";
      }
    }
    return message;
  }

  /*
   * Step 2 instruction message
   */
  public get step2InstructionMessage(): string {
    return ViewEditorI18n.addCompositionWizardCriteriaStepMessage;
  }

  public stepChanged($event: WizardEvent): void {
    if ($event.step.config.id === this.step1Id) {
      this.wizardConfig.nextTitle = ViewEditorI18n.wizardNextButtonText;
    } else if ($event.step.config.id === this.step2Id) {
      this.wizardConfig.nextTitle = ViewEditorI18n.finishButtonText;
    }
  }

  public nextClicked($event: WizardEvent): void {
    // Click next on page 1 - sets the additional composition node
    if ($event.step.config.id === this.step1Id) {
      // Reset the composition name based on LH and RH nodes
      this.composition.setName(this.generateCompositionName());
      // Load columns for the "opposite" side of the composition (initial node columns are already loaded)
      if (this.composition.initialSourceOnRight) {
        this.loadColumns(CompositeSide.LEFT);
      } else {
        this.loadColumns(CompositeSide.RIGHT);
      }
    }
    // Click finish on page 2 - fires finish event with the composition
    else if ($event.step.config.id === this.step2Id) {
      // Set the selected composition type and operator
      this.composition.setType(this.selectedCompositionType);
      this.composition.setOperator(this.selectedCompositionCondition);
      this.finishAction.emit(this.composition);
    }
  }

  public cancelClicked($event: WizardEvent): void {
    this.cancelAction.emit();
  }

  /**
   * Determine if schema node tree is loading
   * @returns {boolean}
   */
  public get treeLoading( ): boolean {
    return ( this.compositionTablesLoadingState === LoadingState.LOADING );
  }

  /**
   * Determine if schema node tree loading completed, and was successful
   * @returns {boolean}
   */
  public get treeLoadedSuccess( ): boolean {
    return ( this.compositionTablesLoadingState === LoadingState.LOADED_VALID );
  }

  /**
   * Determine if schema node tree loading completed, but failed
   * @returns {boolean}
   */
  public get treeLoadedFailed( ): boolean {
    return ( this.compositionTablesLoadingState === LoadingState.LOADED_INVALID );
  }

  /**
   * Determine if left columns are loading
   * @returns {boolean}
   */
  public get lhColumnsLoading( ): boolean {
    return ( this.compositionLHColumnsLoadingState === LoadingState.LOADING );
  }

  /**
   * Determine if left columns loading completed, and was successful
   * @returns {boolean}
   */
  public get lhColumnsLoadedSuccess( ): boolean {
    return ( this.compositionLHColumnsLoadingState === LoadingState.LOADED_VALID );
  }

  /**
   * Determine if left columns loading completed, but failed
   * @returns {boolean}
   */
  public get lhColumnsLoadedFailed( ): boolean {
    return ( this.compositionLHColumnsLoadingState === LoadingState.LOADED_INVALID );
  }

  /**
   * Determine if right columns are loading
   * @returns {boolean}
   */
  public get rhColumnsLoading( ): boolean {
    return ( this.compositionRHColumnsLoadingState === LoadingState.LOADING );
  }

  /**
   * Determine if right columns loading completed, and was successful
   * @returns {boolean}
   */
  public get rhColumnsLoadedSuccess( ): boolean {
    return ( this.compositionRHColumnsLoadingState === LoadingState.LOADED_VALID );
  }

  /**
   * Determine if right columns loading completed, but failed
   * @returns {boolean}
   */
  public get rhColumnsLoadedFailed( ): boolean {
    return ( this.compositionRHColumnsLoadingState === LoadingState.LOADED_INVALID );
  }

  /**
   * Updates the page 1 status
   */
  private updatePage1ValidStatus( ): void {
    this.setSelectionText();
    this.step1Config.nextEnabled = ( this.selectedTreeNodePath && this.selectedTreeNodePath !== null );
  }

  /**
   * Updates the page 2 status
   */
  private updatePage2ValidStatus( ): void {
    this.step2Config.nextEnabled = this.composition.complete;
  }

  /**
   * Get the array of available composition types
   * @returns array of composition types
   */
  public compositionTypes(): CompositionType[] {
    const compTypes: Array<CompositionType> =
      [ CompositionType.INNER_JOIN, CompositionType.LEFT_OUTER_JOIN, CompositionType.RIGHT_OUTER_JOIN,
        CompositionType.FULL_OUTER_JOIN, CompositionType.UNION ];
    return compTypes;
  }

  /**
   * Get the array of available operators
   * @returns array of composition operators
   */
  public compositionConditions(): CompositionOperator[] {
    const compConditions: Array<CompositionOperator> =
      [ CompositionOperator.EQ, CompositionOperator.NE, CompositionOperator.LT,
        CompositionOperator.LE, CompositionOperator.GT, CompositionOperator.GE ];
    return compConditions;
  }

  /**
   * Sets the node selection text, based upon the selection
   */
  private setSelectionText(): void {
    if (this.selectedTreeNodePath && this.selectedTreeNodePath !== null) {
      const connName = PathUtils.getConnectionName(this.selectedTreeNodePath);
      const sourceName = PathUtils.getSourceName(this.selectedTreeNodePath);
      this.selectionText = "[" + connName + "]   " + sourceName;
    } else {
      this.selectionText = ViewEditorI18n.noSelection;
    }
  }

  /**
   * Handles tree node selection
   * @param {SchemaNode} $event
   */
  public onTreeNodeSelected( $event: SchemaNode ): void {
    const selectedNode = $event;
    if (selectedNode && selectedNode !== null && selectedNode.isQueryable()) {
      this.selectedTreeNodePath = "connection=" + selectedNode.getConnectionName() + "/" + selectedNode.getPath();
      // Set the side of the composition opposite of the initially selected node
      if (this.composition.initialSourceOnRight) {
        this.composition.setLeftSourcePath(this.selectedTreeNodePath);
      } else {
        this.composition.setRightSourcePath(this.selectedTreeNodePath);
      }
    } else {
      this.selectedTreeNodePath = null;
    }
    this.updatePage1ValidStatus();
  }

  /**
   * Handles tree node de-selection
   * @param {SchemaNode} $event
   */
  public onTreeNodeDeselected( $event: SchemaNode ): void {
    this.selectedTreeNodePath = null;
    this.updatePage1ValidStatus();
  }

  /**
   * Handles click of the 'swap' button
   */
  public onSwapClicked( ): void {
    this.composition.swapTables();

    // Reset the composition name based on LH and RH nodes
    this.composition.setName(this.generateCompositionName());

    // swap the table rows
    this.deselectAll(this.lhTableRows);
    this.deselectAll(this.rhTableRows);

    const temp = this.lhTableRows;
    this.lhTableRows = this.rhTableRows;
    this.rhTableRows = temp;

    this.selectTableRow(this.lhTableRows, this.composition.getLeftCriteriaColumn());
    this.selectTableRow(this.rhTableRows, this.composition.getRightCriteriaColumn());
  }

  /*
   * Handle LH column selection
   */
  public lhColumnSelectionChange( $event ): void {
    // mark any selected column as deselected
    this.deselectAll(this.lhTableRows);

    // Single row selection - use first row
    const selected: Column[] = $event.selected;
    const column = selected[0];
    column.setSelected(true);
    this.composition.setLeftCriteriaColumn(column.getName());
    this.updatePage2ValidStatus();
  }

  /*
   * Handle RH column selection
   */
  public rhColumnSelectionChange( $event ): void {
    // mark any selected column as deselected
    this.deselectAll(this.rhTableRows);

    // Single row selection - use first row
    const selected: Column[] = $event.selected;
    const column = selected[0];
    column.setSelected(true);
    this.composition.setRightCriteriaColumn(column.getName());
    this.updatePage2ValidStatus();
  }

  private deselectAll( cols: Column[] ): void {
    for (const col of cols) {
      col.setSelected(false);
    }
  }

  private selectTableRow( cols: Column[], colName: string ): void {
    if (cols && colName) {
      for (const col of cols) {
        if (col.getName() === colName) {
          col.setSelected(true);
        }
      }
    }
  }

  /*
   * Initialize the composition selected columns, if any columns selected
   */
  private initCompositionSelectedColumns(): void {
    for (const lhCol of this.lhTableRows) {
      if (lhCol.selected) {
        this.composition.setLeftCriteriaColumn(lhCol.getName());
      }
    }
    for (const rhCol of this.rhTableRows) {
      if (rhCol.selected) {
        this.composition.setRightCriteriaColumn(rhCol.getName());
      }
    }
  }

  /**
   * Generate the composition name using the left and right node names
   * @return {string} the composition name
   */
  private generateCompositionName(): string {
    const leftPath = this.composition.getLeftSourcePath();
    const rightPath = this.composition.getRightSourcePath();
    const leftSource = PathUtils.getSourceName(leftPath);
    const rightSource = PathUtils.getSourceName(rightPath);
    return leftSource + "-" + rightSource;
  }
}
