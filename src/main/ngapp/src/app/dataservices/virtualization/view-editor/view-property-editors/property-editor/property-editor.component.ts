import { Component, OnInit } from '@angular/core';
import { ViewEditorService } from "@dataservices/virtualization/view-editor/view-editor.service";
import { SelectionService } from "@core/selection.service";
import { SelectionItem } from "@dataservices/virtualization/view-editor/view-property-editors/property-editor/selection-item.model";
import { SelectionType } from "@dataservices/virtualization/view-editor/view-property-editors/property-editor/selection-type.enum";

@Component({
  selector: 'app-property-editor',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.css']
})
/**
 * PropertyEditorComponent - display and edit selected items
 */
export class PropertyEditorComponent implements OnInit {

  private readonly editorService: ViewEditorService;
  private readonly selectionService: SelectionService;

  private selectedObject: SelectionItem;

  constructor( selectionService: SelectionService,
               editorService: ViewEditorService ) {
    this.selectionService = selectionService;
    this.editorService = editorService;
    this.editorService.setEditorVirtualization( selectionService.getSelectedVirtualization() );
  }

  public ngOnInit(): void {
    // Nothing to do
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
   * Determine if the first selection item is Source type
   * @return {boolean} 'true' if the first item in the list is a 'Source'
   */
  public get firstSelectionIsSource(): boolean {
    const selectedItem = this.getFirstSelection();
    return selectedItem.getSelectionType() === SelectionType.SOURCE;
  }

  /**
   * Determine if the first selection item is Composition type
   * @return {boolean} 'true' if the first item in the list is a 'Composition'
   */
  public get firstSelectionIsComposition(): boolean {
    const selectedItem = this.getFirstSelection();
    return selectedItem.getSelectionType() === SelectionType.COMPOSITION;
  }

  /**
   * Get the number of selected items
   * @return {number} the number of selected items
   */
  public get numberSelectedItems(): number {
    const selections = this.editorService.getSelection();
    if (selections) {
      return selections.length;
    }
    return 0;
  }

  /**
   * Get the first item in the selections
   * @return {SelectionItem} the first item in the selection list
   */
  public getFirstSelection(): SelectionItem {
    const selectedObj = new SelectionItem(this.editorService);
    const selections = this.editorService.getSelection();
    if (selections && selections.length > 0) {
      selectedObj.setSelection(selections[0]);
    }
    return selectedObj;
  }

}
