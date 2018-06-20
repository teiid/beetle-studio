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
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( AddSourceCommand.addedSourceId ) ).toBe( cmd.getArg( AddSourceCommand.addedSourceId ) );
  });

  it("AddSourceCommand Undo Test", () => {
    const cmd = CommandFactory.createAddSourceCommand( "theNewSource", true );
    expect( cmd.canUndo() ).toBe( true );
    expect( cmd.undoCommand ).not.toBeNull();
    expect( cmd.undoCommand.id ).toBe( RemoveSourceCommand.id );
    expect( cmd.undoCommand.args.size ).toBe( 1 );
    expect( cmd.undoCommand.getArg( RemoveSourceCommand.removedSourceId ) ).toEqual( cmd.getArg( AddSourceCommand.addedSourceId ) );
  });

  it("AddSourcesCommand Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createAddSourcesCommand( sourcesIds );
    expect( cmd.id ).toBe( AddSourcesCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( AddSourcesCommand.addedSourcesIds ) ).toEqual( "a,b,c,d" );
    expect( cmd.toString() ).toBe( "AddSourcesCommand, addedSourcesIds=a,b,c,d" );
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( AddSourcesCommand.addedSourcesIds ) ).toBe( cmd.getArg( AddSourcesCommand.addedSourcesIds ) );
  });

  it("AddSourcesCommand Undo Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createAddSourcesCommand( sourcesIds, true );
    expect( cmd.canUndo() ).toBe( true );
    expect( cmd.undoCommand ).not.toBeNull();
    expect( cmd.undoCommand.id ).toBe( RemoveSourcesCommand.id );
    expect( cmd.undoCommand.args.size ).toBe( 1 );
    expect( cmd.undoCommand.getArg( RemoveSourcesCommand.removedSourcesIds ) ).toEqual( cmd.getArg( AddSourcesCommand.addedSourcesIds ) );
  });

  it("NoOpCommand Test", () => {
    const cmd = CommandFactory.createNoOpCommand();
    expect( cmd.id ).toBe( NoOpCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 0 );
    expect( cmd.toString() ).toEqual( "NoOpCommand, []" );
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();
  });

  it("RemoveSourceCommand Test", () => {
    const cmd = CommandFactory.createRemoveSourceCommand( "theRemovedSource" );
    expect( cmd.id ).toBe( RemoveSourceCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( RemoveSourceCommand.removedSourceId ) ).toEqual( "theRemovedSource" );
    expect( cmd.toString() ).toEqual( "RemoveSourceCommand, removedSourceId=theRemovedSource" );
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( RemoveSourceCommand.removedSourceId ) ).toBe( cmd.getArg( RemoveSourceCommand.removedSourceId ) );
  });

  it("RemoveSourceCommand Undo Test", () => {
    const cmd = CommandFactory.createRemoveSourceCommand( "theRemovedSource", true );
    expect( cmd.canUndo() ).toBe( true );
    expect( cmd.undoCommand ).not.toBeNull();
    expect( cmd.undoCommand.id ).toBe( AddSourceCommand.id );
    expect( cmd.undoCommand.args.size ).toBe( 1 );
    expect( cmd.undoCommand.getArg( AddSourceCommand.addedSourceId ) ).toEqual( cmd.getArg( RemoveSourceCommand.removedSourceId ) );
  });

  it("RemoveSourcesCommand Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createRemoveSourcesCommand( sourcesIds );
    expect( cmd.id ).toBe( RemoveSourcesCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );
    expect( cmd.getArg( RemoveSourcesCommand.removedSourcesIds ) ).toEqual( "a,b,c,d" );
    expect( cmd.toString() ).toEqual( "RemoveSourcesCommand, removedSourcesIds=a,b,c,d" );
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( RemoveSourcesCommand.removedSourcesIds ) ).toBe( cmd.getArg( RemoveSourcesCommand.removedSourcesIds ) );
  });

  it("RemoveSourcesCommand Undo Test", () => {
    const sourcesIds: string[] = [ "a", "b", "c", "d" ];
    const cmd = CommandFactory.createRemoveSourcesCommand( sourcesIds, true );
    expect( cmd.canUndo() ).toBe( true );
    expect( cmd.undoCommand ).not.toBeNull();
    expect( cmd.undoCommand.id ).toBe( AddSourcesCommand.id );
    expect( cmd.undoCommand.args.size ).toBe( 1 );
    expect( cmd.undoCommand.getArg( AddSourcesCommand.addedSourcesIds ) ).toEqual( cmd.getArg( RemoveSourcesCommand.removedSourcesIds ) );
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
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();

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
                                                                   "theOldDescription",
                                                                   true );
    expect( cmd.canUndo() ).toBe( true );
    expect( cmd.undoCommand ).not.toBeNull();
    expect( cmd.undoCommand.id ).toBe( UpdateViewDescriptionCommand.id );
    expect( cmd.undoCommand.args.size ).toBe( 2 );
    expect( cmd.undoCommand.getArg( UpdateViewDescriptionCommand.newDescription ) )
                           .toBe( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) );
    expect( cmd.undoCommand.getArg( UpdateViewDescriptionCommand.oldDescription ) )
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
    expect( cmd.canUndo() ).toBe( false );
    expect( cmd.undoCommand ).toBeNull();

    const json = cmd.toJSON();
    const roundtrip = CommandFactory.decode( json );
    expect( roundtrip.getArg( UpdateViewNameCommand.newName ) )
                     .toBe( cmd.getArg( UpdateViewNameCommand.newName ) );
    expect( roundtrip.getArg( UpdateViewNameCommand.oldName ) )
                     .toBe( cmd.getArg( UpdateViewNameCommand.oldName ) );
  });

  it("UpdateViewNameCommand Undo Test", () => {
    const cmd = CommandFactory.createUpdateViewNameCommand( "theNewName",
                                                            "theOldName",
                                                            true );
    expect( cmd.canUndo() ).toBe( true );
    expect( cmd.undoCommand ).not.toBeNull();
    expect( cmd.undoCommand.id ).toBe( UpdateViewNameCommand.id );
    expect( cmd.undoCommand.args.size ).toBe( 2 );
    expect( cmd.undoCommand.getArg( UpdateViewNameCommand.newName ) )
                           .toBe( cmd.getArg( UpdateViewNameCommand.oldName ) );
    expect( cmd.undoCommand.getArg( UpdateViewNameCommand.oldName ) )
                           .toBe( cmd.getArg( UpdateViewNameCommand.newName ) );
  });

});
