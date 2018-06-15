import { AddSourceCommand } from "@dataservices/virtualization/view-editor/command/add-source-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { RemoveSourceCommand } from "@dataservices/virtualization/view-editor/command/remove-source-command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";

describe( "Command Factory Tests", () => {

  it("AddSourceCommand Test", () => {
    const cmd = CommandFactory.createAddSourceCommand( "theNewSource" );
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

  it("RemoveSourceCommand Test", () => {
    const cmd = CommandFactory.createRemoveSourceCommand( "theRemovedSource" );
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

  it("UpdateViewDescriptionCommand Test", () => {
    const cmd = CommandFactory.createUpdateViewDescriptionCommand( "theNewDescription",
                                                                   "theOldDescription" );
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
