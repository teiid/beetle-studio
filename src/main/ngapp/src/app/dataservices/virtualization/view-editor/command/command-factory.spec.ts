import { SchemaNode } from "@connections/shared/schema-node.model";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { NoOpCommand } from "@dataservices/virtualization/view-editor/command/no-op-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";

describe( "Command Factory Tests", () => {

  it("AddSourcesCommand Test", () => {
    const node1 = SchemaNode.create( { connectionName: "node1", path: "node1Path" } );
    const node2 = SchemaNode.create( { connectionName: "node2", path: "node2Path" } );
    const tempCmd = CommandFactory.createAddSourcesCommand( [ node1, node2 ] );
    expect( tempCmd instanceof AddSourcesCommand ).toBe( true );

    const cmd = tempCmd as AddSourcesCommand;
    expect( cmd.id ).toBe( AddSourcesCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );

    const expected = "2, connectionName=node1, path=node1Path, connectionName=node2, path=node2Path";
    expect( cmd.getArg( AddSourcesCommand.addedSources ) ).toEqual( expected );
    expect( cmd.toString() ).toBe( "AddSourcesCommand, sources=" + expected );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const tempRoundtrip = CommandFactory.decode( json );
    expect( tempRoundtrip instanceof AddSourcesCommand ).toBe( true );

    const roundtrip = tempRoundtrip as AddSourcesCommand;
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( AddSourcesCommand.addedSources ) ).toBe( cmd.getArg( AddSourcesCommand.addedSources ) );
  });

  it("AddSourcesCommand Undo Test", () => {
    const node1 = SchemaNode.create( { connectionName: "node1", path: "node1Path" } );
    const node2 = SchemaNode.create( { connectionName: "node2", path: "node2Path" } );
    const tempCmd = CommandFactory.createAddSourcesCommand( [ node1, node2 ] );
    expect( tempCmd instanceof AddSourcesCommand ).toBe( true );

    const cmd = tempCmd as AddSourcesCommand;
    const tempUndoCmd = CommandFactory.createUndoCommand( cmd );
    expect( tempUndoCmd instanceof RemoveSourcesCommand ).toBe( true );

    const undoCmd = tempUndoCmd as RemoveSourcesCommand;
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( RemoveSourcesCommand.id );
    expect( undoCmd.args.size ).toBe( 1 );
    expect( undoCmd.getArg( RemoveSourcesCommand.removedSources ) ).toEqual( cmd.getArg( AddSourcesCommand.addedSources ) );
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
    const error = CommandFactory.createUndoCommand( cmd );
    expect( error instanceof Error).toBe( true );
  });

  it("RemoveSourcesCommand Test", () => {
    const node1 = SchemaNode.create( { connectionName: "node1", path: "node1Path" } );
    const node2 = SchemaNode.create( { connectionName: "node2", path: "node2Path" } );
    const temp = CommandFactory.createRemoveSourcesCommand( [ node1, node2 ] );
    expect( temp instanceof RemoveSourcesCommand ).toBe( true );

    const cmd = temp as RemoveSourcesCommand;
    expect( cmd.id ).toBe( RemoveSourcesCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 1 );

    const expected = "2, connectionName=node1, path=node1Path, connectionName=node2, path=node2Path";
    expect( cmd.getArg( RemoveSourcesCommand.removedSources ) ).toEqual( expected );
    expect( cmd.toString() ).toEqual( "RemoveSourcesCommand, sources=" + expected );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const tempRoundtrip = CommandFactory.decode( json );
    expect( tempRoundtrip instanceof RemoveSourcesCommand ).toBe( true );

    const roundtrip = tempRoundtrip as RemoveSourcesCommand;
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( RemoveSourcesCommand.removedSources ) ).toBe( cmd.getArg( RemoveSourcesCommand.removedSources ) );
  });

  it("RemoveSourcesCommand Undo Test", () => {
    const node1 = SchemaNode.create( { connectionName: "node1", path: "node1Path" } );
    const node2 = SchemaNode.create( { connectionName: "node2", path: "node2Path" } );
    const tempCmd = CommandFactory.createRemoveSourcesCommand( [ node1, node2 ] );
    expect( tempCmd instanceof RemoveSourcesCommand ).toBe( true );

    const cmd = tempCmd as RemoveSourcesCommand;
    const tempUndoCmd = CommandFactory.createUndoCommand( cmd );
    expect( tempUndoCmd instanceof AddSourcesCommand ).toBe( true );

    const undoCmd = tempUndoCmd as AddSourcesCommand;
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( AddSourcesCommand.id );
    expect( undoCmd.args.size ).toBe( 1 );
    expect( undoCmd.getArg( AddSourcesCommand.addedSources ) ).toEqual( cmd.getArg( RemoveSourcesCommand.removedSources ) );
  });

  it("UpdateViewDescriptionCommand Test", () => {
    const temp = CommandFactory.createUpdateViewDescriptionCommand( "theNewDescription",
                                                                    "theOldDescription" );
    expect( temp instanceof UpdateViewDescriptionCommand ).toBe( true );

    const cmd = temp as UpdateViewDescriptionCommand;
    expect( cmd.id ).toBe( UpdateViewDescriptionCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 2 );
    expect( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) ).toEqual( "theNewDescription" );
    expect( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) ).toEqual( "theOldDescription" );
    expect( cmd.toString() ).toEqual( "UpdateViewDescriptionCommand, newDescription=theNewDescription, oldDescription=theOldDescription" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const tempRoundtrip = CommandFactory.decode( json );
    expect( tempRoundtrip instanceof UpdateViewDescriptionCommand ).toBe( true );

    const roundtrip = tempRoundtrip as UpdateViewDescriptionCommand;
    expect( roundtrip.id ).toBe( cmd.id );
    expect( roundtrip.args.size ).toBe( cmd.args.size );
    expect( roundtrip.getArg( UpdateViewDescriptionCommand.newDescription ) )
                     .toBe( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
    expect( roundtrip.getArg( UpdateViewDescriptionCommand.oldDescription ) )
                     .toBe( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) );
  });

  it("UpdateViewDescriptionCommand Undo Test", () => {
    const tempCmd = CommandFactory.createUpdateViewDescriptionCommand( "theNewDescription",
                                                                   "theOldDescription" );
    expect( tempCmd instanceof UpdateViewDescriptionCommand ).toBe( true );

    const cmd = tempCmd as UpdateViewDescriptionCommand;
    const tempUndoCmd = CommandFactory.createUndoCommand( cmd );
    expect( tempUndoCmd instanceof UpdateViewDescriptionCommand ).toBe( true );

    const undoCmd = tempUndoCmd as UpdateViewDescriptionCommand;
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( UpdateViewDescriptionCommand.id );
    expect( undoCmd.args.size ).toBe( 2 );
    expect( undoCmd.getArg( UpdateViewDescriptionCommand.newDescription ) )
                   .toBe( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ) );
    expect( undoCmd.getArg( UpdateViewDescriptionCommand.oldDescription ) )
                   .toBe( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
  });

  it("UpdateViewNameCommand Test", () => {
    const newName = "theNewName";
    const oldName = "theOldName";
    const temp = CommandFactory.createUpdateViewNameCommand( newName, oldName );
    expect( temp instanceof UpdateViewNameCommand ).toBe( true );

    const cmd = temp as UpdateViewNameCommand;
    expect( cmd.id ).toBe( UpdateViewNameCommand.id );
    expect( cmd.args ).not.toBeNull();
    expect( cmd.args.size ).toBe( 2 );
    expect( cmd.getArg( UpdateViewNameCommand.newName ) ).toEqual( newName );
    expect( cmd.getArg( UpdateViewNameCommand.oldName ) ).toEqual( oldName );
    expect( cmd.toString() ).toEqual( "UpdateViewNameCommand, newName=theNewName, oldName=theOldName" );
    expect( cmd.isUndoable() ).toBe( true );

    const json = cmd.toJSON();
    const tempRoundtrip = CommandFactory.decode( json );
    expect( tempRoundtrip instanceof UpdateViewNameCommand ).toBe( true );

    const roundtrip = tempRoundtrip as UpdateViewNameCommand;
    expect( roundtrip.getArg( UpdateViewNameCommand.newName ) ).toBe( cmd.getArg( UpdateViewNameCommand.newName ) );
    expect( roundtrip.getArg( UpdateViewNameCommand.oldName ) ).toBe( cmd.getArg( UpdateViewNameCommand.oldName ) );
  });

  it("UpdateViewNameCommand Undo Test", () => {
    const tempCmd = CommandFactory.createUpdateViewNameCommand( "theNewName",
                                                                "theOldName" );
    expect( tempCmd instanceof UpdateViewNameCommand ).toBe( true );

    const cmd = tempCmd as UpdateViewNameCommand;
    const tempUndoCmd = CommandFactory.createUndoCommand( cmd );
    expect( tempUndoCmd instanceof UpdateViewNameCommand ).toBe( true );

    const undoCmd = tempUndoCmd as UpdateViewNameCommand;
    expect( undoCmd ).not.toBeNull();
    expect( undoCmd.id ).toBe( UpdateViewNameCommand.id );
    expect( undoCmd.args.size ).toBe( 2 );
    expect( undoCmd.getArg( UpdateViewNameCommand.newName ) ).toBe( cmd.getArg( UpdateViewNameCommand.oldName ) );
    expect( undoCmd.getArg( UpdateViewNameCommand.oldName ) ).toBe( cmd.getArg( UpdateViewNameCommand.newName ) );
  });

});
