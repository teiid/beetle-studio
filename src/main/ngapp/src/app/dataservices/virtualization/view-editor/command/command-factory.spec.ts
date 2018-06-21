import { AddSourceCommand } from "@dataservices/virtualization/view-editor/command/add-source-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { RemoveSourceCommand } from "@dataservices/virtualization/view-editor/command/remove-source-command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { NoOpCommand } from "@dataservices/virtualization/view-editor/command/no-op-command";

describe( "Command Factory Tests", () => {

  it("AddSourceCommand Test", () => {
    const cmd = CommandFactory.createAddSourceCommand( "theNewSource" );
    expect( cmd.id ).toBe( AddSourceCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( AddSourceCommand.addedSourceId ) ).toEqual( "theNewSource" );
    expect( cmd.toString() ).toBe( "AddSourceCommand, addedSourceId=theNewSource" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( AddSourceCommand.addedSourceId ) ).toBe( cmd.getArg( AddSourceCommand.addedSourceId ) );
  });

  it("AddSourceCommand Undo Test", () => {
    const cmd = CommandFactory.createAddSourceCommand( "theNewSource" );
    const undoCmd = CommandFactory.createUndoCommand( cmd );
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( RemoveSourceCommand.id );
    expect( undoCmd.args.size ).toBe( 1 );
    expect( undoCmd.getArg( RemoveSourceCommand.removedSourceId ) ).toEqual( cmd.getArg( AddSourceCommand.addedSourceId ) );
  });

  it("AddSourcesCommand Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createAddSourcesCommand( sourcesIds );
    expect( cmd.id ).toBe( AddSourcesCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( AddSourcesCommand.addedSourcesIds ) ).toEqual( "a,b,c,d" );
    expect( cmd.toString() ).toBe( "AddSourcesCommand, addedSourcesIds=a,b,c,d" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( AddSourcesCommand.addedSourcesIds ) ).toBe( cmd.getArg( AddSourcesCommand.addedSourcesIds ) );
  });

  it("AddSourcesCommand Undo Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createAddSourcesCommand( sourcesIds );
    const undoCmd = CommandFactory.createUndoCommand( cmd );
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( RemoveSourcesCommand.id );
    expect( undoCmd.args.size ).toBe( 1 );
    expect( undoCmd.getArg( RemoveSourcesCommand.removedSourcesIds ) ).toEqual( cmd.getArg( AddSourcesCommand.addedSourcesIds ) );
  });

  it("NoOpCommand Test", () => {
    const cmd = CommandFactory.createNoOpCommand();
    expect( cmd.id ).toBe( NoOpCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 0 );
    expect( cmd.toString() ).toEqual( "NoOpCommand, []" );
    expect( cmd.isUndoable() ).toBe( false );
  });

  it("NoOpCommand Undo Test", () => {
    const cmd = CommandFactory.createNoOpCommand();
    expect( () => {
      CommandFactory.createUndoCommand( cmd );
    }).toThrow();
  });

  it("RemoveSourceCommand Test", () => {
    const cmd = CommandFactory.createRemoveSourceCommand( "theRemovedSource" );
    expect( cmd.id ).toBe( RemoveSourceCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( RemoveSourceCommand.removedSourceId ) ).toEqual( "theRemovedSource" );
    expect( cmd.toString() ).toEqual( "RemoveSourceCommand, removedSourceId=theRemovedSource" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( RemoveSourceCommand.removedSourceId ) ).toBe( cmd.getArg( RemoveSourceCommand.removedSourceId ) );
  });

  it("RemoveSourceCommand Undo Test", () => {
    const cmd = CommandFactory.createRemoveSourceCommand( "theRemovedSource" );
    const undoCmd = CommandFactory.createUndoCommand( cmd );
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( AddSourceCommand.id );
    expect( undoCmd.args.size ).toBe( 1 );
    expect( undoCmd.getArg( AddSourceCommand.addedSourceId ) ).toEqual( cmd.getArg( RemoveSourceCommand.removedSourceId ) );
  });

  it("RemoveSourcesCommand Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createRemoveSourcesCommand( sourcesIds );
    expect( cmd.id ).toBe( RemoveSourcesCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( RemoveSourcesCommand.removedSourcesIds ) ).toEqual( "a,b,c,d" );
    expect( cmd.toString() ).toEqual( "RemoveSourcesCommand, removedSourcesIds=a,b,c,d" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( RemoveSourcesCommand.removedSourcesIds ) ).toBe( cmd.getArg( RemoveSourcesCommand.removedSourcesIds ) );
  });

  it("RemoveSourcesCommand Undo Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createRemoveSourcesCommand( sourcesIds );
    const undoCmd = CommandFactory.createUndoCommand( cmd );
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( AddSourcesCommand.id );
    expect( undoCmd.args.size ).toBe( 1 );
    expect( undoCmd.getArg( AddSourcesCommand.addedSourcesIds ) ).toEqual( cmd.getArg( RemoveSourcesCommand.removedSourcesIds ) );
  });

  it("UpdateViewDescriptionCommand Test", () => {
    const cmd = CommandFactory.createUpdateViewDescriptionCommand( "theNewDescription",
                                                                   "theOldDescription" );
    expect( cmd.id ).toBe( UpdateViewDescriptionCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 2 );
    expect( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) ).toEqual( "theNewDescription" );
    expect( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) ).toEqual( "theOldDescription" );
    expect( cmd.toString() ).toEqual( "UpdateViewDescriptionCommand, newDescription=theNewDescription, oldDescription=theOldDescription" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( UpdateViewDescriptionCommand.newDescription ) )
                     .toBe( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
    expect( roundtrip.getArg( UpdateViewDescriptionCommand.oldDescription ) )
                     .toBe( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) );
  });

  it("UpdateViewDescriptionCommand Undo Test", () => {
    const cmd = CommandFactory.createUpdateViewDescriptionCommand( "theNewDescription",
                                                                   "theOldDescription" );
    const undoCmd = CommandFactory.createUndoCommand( cmd );
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( UpdateViewDescriptionCommand.id );
    expect( undoCmd.args.size ).toBe( 2 );
    expect( undoCmd.getArg( UpdateViewDescriptionCommand.newDescription ) )
                   .toBe( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) );
    expect( undoCmd.getArg( UpdateViewDescriptionCommand.oldDescription ) )
                   .toBe( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
  });

  it("UpdateViewNameCommand Test", () => {
    const cmd = CommandFactory.createUpdateViewNameCommand( "theNewName", "theOldName" );
    expect( cmd.id ).toBe( UpdateViewNameCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 2 );
    expect( cmd.getArg( UpdateViewNameCommand.newName ) ).toEqual( "theNewName" );
    expect( cmd.getArg( UpdateViewNameCommand.oldName ) ).toEqual( "theOldName" );
    expect( cmd.toString() ).toEqual( "UpdateViewNameCommand, newName=theNewName, oldName=theOldName" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.getArg( UpdateViewNameCommand.newName ) )
                     .toBe( cmd.getArg( UpdateViewNameCommand.newName ) );
    expect( roundtrip.getArg( UpdateViewNameCommand.oldName ) )
                     .toBe( cmd.getArg( UpdateViewNameCommand.oldName ) );
  });

  it("UpdateViewNameCommand Undo Test", () => {
    const cmd = CommandFactory.createUpdateViewNameCommand( "theNewName",
                                                            "theOldName" );
    const undoCmd = CommandFactory.createUndoCommand( cmd );
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( UpdateViewNameCommand.id );
    expect( undoCmd.args.size ).toBe( 2 );
    expect( undoCmd.getArg( UpdateViewNameCommand.newName ) )
                   .toBe( cmd.getArg( UpdateViewNameCommand.oldName ) );
    expect( undoCmd.getArg( UpdateViewNameCommand.oldName ) )
                   .toBe( cmd.getArg( UpdateViewNameCommand.newName ) );
  });

});
