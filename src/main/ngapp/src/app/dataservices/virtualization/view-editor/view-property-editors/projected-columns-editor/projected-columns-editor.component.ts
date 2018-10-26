import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { SelectionService } from "@core/selection.service";
import { EmptyStateConfig, TableConfig, TableEvent } from "patternfly-ng";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { ProjectedColumn } from "@dataservices/shared/projected-column.model";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { LoggerService } from "@core/logger.service";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { Subscription } from "rxjs/Subscription";
import { UpdateProjectedColumnsCommand } from "@dataservices/virtualization/view-editor/command/update-projected-columns-command";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { AddCompositionCommand } from "@dataservices/virtualization/view-editor/command/add-composition-command";
import { RemoveCompositionCommand } from "@dataservices/virtualization/view-editor/command/remove-composition-command";

@Component({
  selector: 'app-projected-columns-editor',
  templateUrl: './projected-columns-editor.component.html',
  styleUrls: ['./projected-columns-editor.component.css']
})
export class ProjectedColumnsEditorComponent implements OnInit, OnDestroy {

  public tableColumns: any[] = [];
  public tableConfig: TableConfig;

  private readonly editorService: ViewEditorService;
  private readonly selectionService: SelectionService;
  private readonly logger: LoggerService;
  private editorSubscription: Subscription;

  private readonly emptyStateConfig: EmptyStateConfig;
  public projectedColumns: ProjectedColumn[] = [];
  private originalColumns: ProjectedColumn[] = [];

  constructor( selectionService: SelectionService,
               logger: LoggerService,
               editorService: ViewEditorService ) {
    this.selectionService = selectionService;
    this.editorService = editorService;
    this.logger = logger;

    // ----------------------------------
    // View Table configurations
    // ----------------------------------
    this.tableColumns = [
      {
        draggable: false,
        name: "Name",
        prop: "name",
        resizeable: true,
        sortable: false,
        width: "60"
      },
      {
        draggable: false,
        name: "Type",
        prop: "type",
        resizeable: true,
        sortable: false,
        width: "60"
      }
    ];

    this.emptyStateConfig = {
      title: ViewEditorI18n.noViewsDisplayedMessage
    } as EmptyStateConfig;

    this.tableConfig = {
      showCheckbox: true,
      emptyStateConfig: this.emptyStateConfig,
    } as TableConfig;

    this.editorService.setEditorVirtualization( selectionService.getSelectedVirtualization() );
  }

  public ngOnInit(): void {
    this.editorSubscription = this.editorService.editorEvent.subscribe( ( event ) => this.handleEditorEvent( event ) );
  }

  /**
   * Cleanup code when destroying the canvas and properties parts.
   */
  public ngOnDestroy(): void {
    this.editorSubscription.unsubscribe();
  }

  /**
   * @param {ViewEditorEvent} event the event being processed
   */
  public handleEditorEvent( event: ViewEditorEvent ): void {
    this.logger.debug( "ProjectedColumnsEditor received event: " + event.toString() );

    // Initialize the projected columns editor when the ViewDefinition is set
    if ( event.typeIsEditedViewSet()) {
      const viewDefn = this.editorService.getEditorView();
      this.initProjectedColumns(viewDefn.getProjectedColumns());
    }
    else if (event.typeIsViewStateChanged()) {
      // Reset project columns if change came from the editor
      if ( event.sourceIsEditor() ) {
        if ( event.args.length === 1 && event.args[ 0 ] instanceof Command ) {
          const cmd = event.args[ 0 ] as Command;

          // Handle updated projected columns
          if ( cmd instanceof UpdateProjectedColumnsCommand ) {
            this.updateProjectedColumns(cmd.getNewProjectedColumns());
          }
          // Change in sources or compositions - forces a reset of the columns
          else if ( cmd instanceof AddSourcesCommand || cmd instanceof RemoveSourcesCommand ||
                    cmd instanceof AddCompositionCommand || cmd instanceof RemoveCompositionCommand ) {
            const viewDefn = this.editorService.getEditorView();
            this.initProjectedColumns(viewDefn.getProjectedColumns());
          }
        }
      }
    }
    else {
      this.logger.debug( "ProjectedColumnsEditor not handling received editor event: " + event.toString());
    }
  }

  /**
   * Initializes the projected columns
   * @param {ProjectedColumn[]} prjCols the projected columns
   */
  private initProjectedColumns(prjCols: ProjectedColumn[]): void {
    this.projectedColumns = [];
    this.originalColumns = [];

    // Clone view definition projected columns; save original state
    const copyPrjCols: ProjectedColumn[] = [];
    const copyOrigCols: ProjectedColumn[] = [];
    if (prjCols && prjCols !== null) {
      for (const pCol of prjCols) {
        copyPrjCols.push(ProjectedColumn.create(pCol));
        copyOrigCols.push(ProjectedColumn.create(pCol));
      }
    }
    this.projectedColumns = copyPrjCols;
    this.originalColumns = copyOrigCols;

    this.projectedColumns = [...this.projectedColumns];
  }

  /**
   * Updates the projected columns
   * @param {ProjectedColumn[]} prjCols the projected columns
   */
  private updateProjectedColumns(prjCols: ProjectedColumn[]): void {
    const copyPrjCols: ProjectedColumn[] = [];
    const copyOrigCols: ProjectedColumn[] = [];
    if (prjCols && prjCols !== null) {
      for (const pCol of prjCols) {
        copyPrjCols.push(ProjectedColumn.create(pCol));
        copyOrigCols.push(ProjectedColumn.create(pCol));
      }
    }
    this.originalColumns = copyOrigCols;
    // Handle case where current columns are SELECT *
    if (this.hasSelectAllProjectedColumns) {
      // Incoming is also SELECT * - no need to do anything
      if (this.isSelectStar(copyPrjCols)) {
        return;
      }
      // Incoming is full column set.  Need to remove current SELECT *
      else {
        this.projectedColumns = [];
        for (const col of copyPrjCols) {
          this.projectedColumns.push(col);
        }
      }
    }
    // Iterate existing columns, setting selection state
    else {
      for (const col of copyPrjCols) {
        for (const projCol of this.projectedColumns) {
          if (projCol.getName() === col.getName()) {
            projCol.selected = col.selected;
            break;
          }
        }
      }
    }
  }

  /**
   * Determine if a view has select all projected columns
   *
   * @return {boolean} 'true' if view has select all projected columns
   */
  public get hasSelectAllProjectedColumns(): boolean {
    return this.isSelectStar(this.projectedColumns);
  }

  private isSelectStar(projCols: ProjectedColumn[]): boolean {
    return projCols && projCols !== null && projCols.length === 1 && projCols[0].getName() === "ALL" && projCols[0].getType() === "ALL";
  }

  /**
   * Determine whether the editor has a view currently selected
   *
   * @return {boolean} 'true' if has a view selection
   */
  public get hasSelectedView(): boolean {
    const selView = this.editorService.getEditorView();
    return (selView && selView !== null);
  }

  /**
   * Handles change in Column selections
   * @param {TableEvent} $event the column selection event
   */
  public handleColumnSelectionChange($event: TableEvent): void {
    // Change in projected column selections fire change event
    if (this.hasSelectedView) {
      // Fire update event with new and old columns
      const temp = CommandFactory.createUpdateProjectedColumnsCommand( JSON.stringify(this.projectedColumns), JSON.stringify(this.originalColumns) );
      if ( temp instanceof Command ) {
        this.editorService.fireViewStateHasChanged( ViewEditorPart.PROJECTED_COLUMNS, temp as Command );
      } else {
        const error = temp as Error;
        this.logger.error( error.message );
      }
      // Update the original columns
      const origCols: ProjectedColumn[] = [];
      for (const col of this.projectedColumns) {
        origCols.push(ProjectedColumn.create(col));
      }
      this.originalColumns = origCols;
    } else {
      // shouldn't get here as description text input should be disabled if no view being edited
      this.logger.error( "Trying to set description but there is no view being edited" );
    }
  }

}
