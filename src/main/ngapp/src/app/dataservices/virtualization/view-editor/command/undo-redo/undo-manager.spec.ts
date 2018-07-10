import { UndoManager } from "@dataservices/virtualization/view-editor/command/undo-redo/undo-manager";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { Undoable } from "@dataservices/virtualization/view-editor/command/undo-redo/undoable";

describe( "UndoManager Tests", () => {

  it( "shouldHaveGoodInitialState", () => {
    const undoMgr = new UndoManager();
    expect( undoMgr.canRedo() ).toBe( false );
    expect( undoMgr.canUndo() ).toBe( false );
    expect( () => { undoMgr.peekRedoCommand(); } ).toThrow();
    expect( () => { undoMgr.popRedoCommand(); } ).toThrow();
    expect( () => { undoMgr.peekUndoCommand(); } ).toThrow();
    expect( () => { undoMgr.popUndoCommand(); } ).toThrow();
    expect( undoMgr.redoLabel() ).toBe( ViewEditorI18n.redoActionTooltip );
    expect( undoMgr.toArray().length ).toBe( 0 );
    expect( undoMgr.undoLabel() ).toBe( ViewEditorI18n.undoActionTooltip );
  } );

  it( "shouldAddUndoable", () => {
    const undoMgr = new UndoManager();
    const cmd = CommandFactory.createUpdateViewNameCommand( "newName", "oldName");
    const undoable = CommandFactory.createUndoable( cmd as Command ) ;
    undoMgr.add( undoable as Undoable );

    expect( undoMgr.canRedo() ).toBe( false );
    expect( undoMgr.canUndo() ).toBe( true );
    expect( () => { undoMgr.peekRedoCommand(); } ).toThrow();
    expect( () => { undoMgr.popRedoCommand(); } ).toThrow();
    expect( undoMgr.peekUndoCommand() instanceof Command ).toBe( true );
    expect( undoMgr.toArray().length ).toBe( 1 );

    // now pop
    expect( undoMgr.popUndoCommand() instanceof Command ).toBe( true );
    expect( undoMgr.canRedo() ).toBe( true );
    expect( undoMgr.canUndo() ).toBe( false );
    expect( () => { undoMgr.peekUndoCommand(); } ).toThrow();
    expect( () => { undoMgr.popUndoCommand(); } ).toThrow();
    expect( undoMgr.peekRedoCommand() instanceof Command ).toBe( true );
    expect( undoMgr.toArray().length ).toBe( 1 );
    expect( undoMgr.toJSON()[ "undoables"].length ).toBe( 1 );
  } );

  it( "shouldClear", () => {
    const undoMgr = new UndoManager();
    const cmd = CommandFactory.createUpdateViewNameCommand( "newName", "oldName");
    const undoable = CommandFactory.createUndoable( cmd as Command ) ;
    undoMgr.add( undoable as Undoable );

    expect( undoMgr.canRedo() ).toBe( false );
    expect( undoMgr.canUndo() ).toBe( true );
    expect( () => { undoMgr.peekRedoCommand(); } ).toThrow();
    expect( () => { undoMgr.popRedoCommand(); } ).toThrow();
    expect( undoMgr.peekUndoCommand() instanceof Command ).toBe( true );
    expect( undoMgr.toArray().length ).toBe( 1 );

    // now pop
    expect( undoMgr.popUndoCommand() instanceof Command ).toBe( true );
    expect( undoMgr.canRedo() ).toBe( true );
    expect( undoMgr.canUndo() ).toBe( false );
    expect( () => { undoMgr.peekUndoCommand(); } ).toThrow();
    expect( () => { undoMgr.popUndoCommand(); } ).toThrow();
    expect( undoMgr.peekRedoCommand() instanceof Command ).toBe( true );
    expect( undoMgr.toArray().length ).toBe( 1 );
    expect( undoMgr.toJSON()[ "undoables"].length ).toBe( 1 );
  } );

  it( "shouldConvertToArrayCorrectly" , () => {
    const undoMgr = new UndoManager();

    // add update name command
    let cmd = CommandFactory.createUpdateViewNameCommand( "newName", "oldName");
    let undoable = CommandFactory.createUndoable( cmd as Command ) ;
    undoMgr.add( undoable as Undoable );

    // add update description command
    cmd = CommandFactory.createUpdateViewNameCommand( "newName", "oldName");
    undoable = CommandFactory.createUndoable( cmd as Command ) ;
    undoMgr.add( undoable as Undoable );

    // should include both undoables
    expect( undoMgr.toArray()).not.toBe( null );
    expect( undoMgr.toArray().length).toBe( 2 );

    // move the pointer to the left
    undoMgr.popUndoCommand();
    expect( undoMgr.toArray().length).toBe( 1 );
    expect( undoMgr.toArray().length).toBe( 1 );
  } );

  it( "shouldConvertToJsonCorrectly" , () => {
    const undoMgr = new UndoManager();

    // add update name command
    let cmd = CommandFactory.createUpdateViewNameCommand( "newName", "oldName");
    let undoable = CommandFactory.createUndoable( cmd as Command ) ;
    undoMgr.add( undoable as Undoable );

    // add update description command
    cmd = CommandFactory.createUpdateViewDescriptionCommand( "newDescription", "oldDescription");
    undoable = CommandFactory.createUndoable( cmd as Command ) ;
    undoMgr.add( undoable as Undoable );

    // should include both undoables
    expect( undoMgr.toJSON() ).not.toBe( null );
    expect( undoMgr.toJSON()[ UndoManager.undoables ] ).not.toBe( null );
    expect( undoMgr.toJSON()[ UndoManager.undoables ] instanceof Array ).toBe( true );

    const undoables = undoMgr.toJSON()[ UndoManager.undoables ] as Array< any >;
    expect( undoables.length ).toBe( 2 );

    // move the pointer to the left
    undoMgr.popUndoCommand();
    expect( undoMgr.toArray().length).toBe( 1 );
    expect( undoMgr.toArray().length).toBe( 1 );
  } );

} );
