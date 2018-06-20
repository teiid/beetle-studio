/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { AddSourceCommand } from "@dataservices/virtualization/view-editor/command/add-source-command";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourceCommand } from "@dataservices/virtualization/view-editor/command/remove-source-command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { NoOpCommand } from "@dataservices/virtualization/view-editor/command/no-op-command";

export class CommandFactory {

  /**
   * @param {string} addedSourceId the ID of the source being added (cannot be `null` or empty)
   * @param {boolean} createUndoCommand `true` if an undo command should be created
   * @returns {Command} the add source command (never `null`)
   */
  public static createAddSourceCommand( addedSourceId: string,
                                        createUndoCommand: boolean = false ): Command {
    const cmd = new AddSourceCommand( addedSourceId );

    if ( createUndoCommand ) {
      cmd.undoCommand = CommandFactory.createUndoCommand( cmd );
    }

    return cmd;
  }

  /**
   * @param {string[] | SchemaNode[]} addedSources the IDs of the sources or the source schema nodes being added
   * @param {boolean} createUndoCommand `true` if an undo command should be created
   * @returns {Command} the add sources command or a no op command if sources are `undefined` or `null`
   */
  public static createAddSourcesCommand( addedSources: string[] | SchemaNode[],
                                         createUndoCommand: boolean = false ): Command {
    if ( !addedSources || addedSources.length === 0 ) {
      return NoOpCommand.NO_OP;
    }

    let addedSourcesIds: string[];

    if ( typeof addedSources[ 0 ] === "string" ) {
      addedSourcesIds = addedSources as string[];
    } else {
      addedSourcesIds = [];

      const sources = addedSources as SchemaNode[];

      sources.forEach( ( source ) => {
        addedSourcesIds.push( source.getName() );
      } );
    }

    const cmd = new AddSourcesCommand( addedSourcesIds );

    if ( createUndoCommand ) {
      cmd.undoCommand = CommandFactory.createUndoCommand( cmd );
    }

    return cmd;
  }

  /**
   * @returns {Command} a no op command (never `null`)
   */
  public static createNoOpCommand(): Command {
    return NoOpCommand.NO_OP;
  }

  /**
   * @param {string} removedSourceId the ID of the source being removed (cannot be `null` or empty)
   * @param {boolean} createUndoCommand `true` if an undo command should be created
   * @returns {Command} the remove source command (never `null`)
   */
  public static createRemoveSourceCommand( removedSourceId: string,
                                           createUndoCommand: boolean = false ): Command {
    const cmd = new RemoveSourceCommand( removedSourceId );

    if ( createUndoCommand ) {
      cmd.undoCommand = CommandFactory.createUndoCommand( cmd );
    }

    return cmd;
  }

  /**
   * @param {string[] | SchemaNode[]} removedSources the IDs of the sources or the source schema nodes being removed
   * @param {boolean} createUndoCommand `true` if an undo command should be created
   * @returns {Command} the remove sources command or a no op command if sources are `undefined` or `null`
   */
  public static createRemoveSourcesCommand( removedSources: string[] | SchemaNode[],
                                            createUndoCommand: boolean = false ): Command {
    if ( !removedSources || removedSources.length === 0 ) {
      return NoOpCommand.NO_OP;
    }

    let removedSourcesIds: string[];

    if ( typeof removedSources[ 0 ] === "string" ) {
      removedSourcesIds = removedSources as string[];
    } else {
      removedSourcesIds = [];

      const sources = removedSources as SchemaNode[];

      sources.forEach( ( source ) => {
        removedSourcesIds.push( source.getName() );
      } );
    }

    const cmd = new RemoveSourcesCommand( removedSourcesIds );

    if ( createUndoCommand ) {
      cmd.undoCommand = CommandFactory.createUndoCommand( cmd );
    }

    return cmd;
  }

  /**
   * @param {Command} cmd the command whose undo command is being requested
   * @returns {Command | null} the undo command or `null` if one cannot be created
   */
  public static createUndoCommand( cmd: Command ): Command | null {
    let undoCmd: Command = null;

    switch ( cmd.id ) {
      case AddSourceCommand.id: {
        undoCmd = CommandFactory.createRemoveSourceCommand( cmd.getArg( AddSourceCommand.addedSourceId ) );
        break;
      }
      case AddSourcesCommand.id: {
        const value = cmd.getArg( AddSourcesCommand.addedSourcesIds );
        const ids = value.split( Command.idsDelimiter );
        undoCmd = CommandFactory.createRemoveSourcesCommand( ids );
        break;
      }
      case RemoveSourceCommand.id: {
        undoCmd = CommandFactory.createAddSourceCommand( cmd.getArg( RemoveSourceCommand.removedSourceId ) );
        break;
      }
      case RemoveSourcesCommand.id: {
        const value = cmd.getArg( RemoveSourcesCommand.removedSourcesIds );
        const ids = value.split( Command.idsDelimiter );
        undoCmd = CommandFactory.createAddSourcesCommand( ids );
        break;
      }
      case UpdateViewDescriptionCommand.id: {
        undoCmd = CommandFactory.createUpdateViewDescriptionCommand( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ),
                                                                     cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
        break;
      }
      case UpdateViewNameCommand.id: {
        undoCmd = CommandFactory.createUpdateViewNameCommand( cmd.getArg( UpdateViewNameCommand.oldName ),
                                                              cmd.getArg( UpdateViewNameCommand.newName ) );
        break;
      }
      default: {
        break;
      }
    }

    return undoCmd;
  }

  /**
   * @param {string} newViewDescription the new view description (can be `null` or empty)
   * @param {string} replacedViewDescription the view description being replaced (can be `null` or empty)
   * @param {boolean} createUndoCommand `true` if an undo command should be created
   * @returns {Command} the update view description command (never `null`)
   */
  public static createUpdateViewDescriptionCommand( newViewDescription: string,
                                                    replacedViewDescription: string,
                                                    createUndoCommand: boolean = false ): Command {
    const cmd = new UpdateViewDescriptionCommand( newViewDescription, replacedViewDescription );

    if ( createUndoCommand ) {
      cmd.undoCommand = CommandFactory.createUndoCommand( cmd );
    }

    return cmd;
  }

  /**
   * @param {string} newViewName the new view name (can be `null` or empty)
   * @param {string} replacedViewName the view name being replaced (can be `null` or empty)
   * @param {boolean} createUndoCommand `true` if an undo command should be created
   * @returns {Command} the update view name command (never `null`)
   */
  public static createUpdateViewNameCommand( newViewName: string,
                                             replacedViewName: string,
                                             createUndoCommand: boolean = false ): Command {
    const cmd = new UpdateViewNameCommand( newViewName, replacedViewName );

    if ( createUndoCommand ) {
      cmd.undoCommand = CommandFactory.createUndoCommand( cmd );
    }

    return cmd;
  }

  /**
   * Constructs a command object from JSON.
   *
   * @param {object} json the JSON being converted to a command
   * @returns {Command | null} the command or `null` if one could not be constructed
   */
  public static decode( json: object = {} ): Command | null {
    const cmdId = json[ Command.idPropJson ];
    let cmd: Command = null;

    switch ( cmdId ) {
      case AddSourceCommand.id: {
        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === AddSourceCommand.addedSourceId ) {
            cmd = CommandFactory.createAddSourceCommand( entry[ Command.argValueJson ] );
            break;
          }
        }

        break;
      }
      case AddSourcesCommand.id: {
        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === AddSourcesCommand.addedSourcesIds ) {
            const args = entry[ Command.argValueJson ].split( Command.idsDelimiter );
            cmd = CommandFactory.createAddSourcesCommand( args );
            break;
          }
        }

        break;
      }
      case RemoveSourceCommand.id: {
        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === RemoveSourceCommand.removedSourceId ) {
            cmd = CommandFactory.createRemoveSourceCommand( entry[ Command.argValueJson ] );
            break;
          }
        }

        break;
      }
      case RemoveSourcesCommand.id: {
        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === RemoveSourcesCommand.removedSourcesIds ) {
            const args = entry[ Command.argValueJson ].split( Command.idsDelimiter );
            cmd = CommandFactory.createRemoveSourcesCommand( args );
            break;
          }
        }

        break;
      }
      case UpdateViewDescriptionCommand.id: {
        let newViewDescription: string = null;
        let replacedViewDescription: string = null;

        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === UpdateViewDescriptionCommand.newDescription ) {
            newViewDescription = entry[ Command.argValueJson ];
          }
          else if ( entry[ Command.argNameJson ] === UpdateViewDescriptionCommand.oldDescription ) {
            replacedViewDescription = entry[ Command.argValueJson ];
          }

          if ( newViewDescription && replacedViewDescription ) {
            break;
          }
        }

        if ( newViewDescription && replacedViewDescription ) {
          cmd = CommandFactory.createUpdateViewDescriptionCommand( newViewDescription, replacedViewDescription );
        }

        break;
      }
      case UpdateViewNameCommand.id: {
        let newViewName: string = null;
        let replacedViewName: string = null;

        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === UpdateViewNameCommand.newName ) {
            newViewName = entry[ Command.argValueJson ];
          }
          else if ( entry[ Command.argNameJson ] === UpdateViewNameCommand.oldName ) {
            replacedViewName = entry[ Command.argValueJson ];
          }

          if ( newViewName && replacedViewName ) {
            break;
          }
        }

        if ( newViewName && replacedViewName ) {
          cmd = CommandFactory.createUpdateViewNameCommand( newViewName, replacedViewName );
        }

        break;
      }
      default: {
        console.error( "Unable to create command from json: " + json );
        break;
      }
    }

    return cmd;
  }

}
