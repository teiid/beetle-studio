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
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { NoOpCommand } from "@dataservices/virtualization/view-editor/command/no-op-command";
import { Undoable } from "@dataservices/virtualization/view-editor/command/undo-redo/undoable";

export class CommandFactory {

  /**
   * @param {string | SchemaNode[]} addedSources the JSON representation of or the schema nodes of the sources being added
   * @returns {Command} the add sources command or a no op command if sources are empty
   */
  public static createAddSourcesCommand( addedSources: string | SchemaNode[] ): Command {
    if ( !addedSources || addedSources.length === 0 ) {
      return NoOpCommand.NO_OP;
    }

    return new AddSourcesCommand( addedSources );
  }

  /**
   * @returns {Command} a no op command (never `null`)
   */
  public static createNoOpCommand(): Command {
    return NoOpCommand.NO_OP;
  }

  /**
   * @param {string | SchemaNode[]} removedSources the JSON representation of or the schema nodes of the sources being removed
   * @returns {Command} the remove sources command or a no op command if sources are `undefined` or `null`
   */
  public static createRemoveSourcesCommand( removedSources: string | SchemaNode[] ): Command {
    if ( !removedSources || removedSources.length === 0 ) {
      return NoOpCommand.NO_OP;
    }

    return new RemoveSourcesCommand( removedSources );
  }

  /**
   *
   * @param {Command} cmd the command whose undoable is being requested
   * @returns {Undoable | Error} the undoable or an error if an undoable cannot be created
   */
  public static createUndoable( cmd: Command ): Undoable | Error {
    if ( cmd.isUndoable() ) {
      const undoOrError = CommandFactory.createUndoCommand( cmd );

      if ( undoOrError instanceof Command ) {
        return new Undoable( undoOrError as Command, cmd );
      }

      return undoOrError;
    }

    return new Error( "The '" + cmd.id + "' command does not have an undo command" );
  }

  /**
   * @param {Command} cmd the command whose undo command is being requested
   * @returns {Command | Error} the undo command or an error if an undo command cannot be created
   */
  public static createUndoCommand( cmd: Command ): Command | Error {
    switch ( cmd.id ) {
      case AddSourcesCommand.id: {
        const value = cmd.getArg( AddSourcesCommand.addedSourcePaths );
        return CommandFactory.createRemoveSourcesCommand( value );
      }
      case RemoveSourcesCommand.id: {
        const value = cmd.getArg( RemoveSourcesCommand.removedSourcePaths );
        return CommandFactory.createAddSourcesCommand( value );
      }
      case UpdateViewDescriptionCommand.id: {
        return CommandFactory.createUpdateViewDescriptionCommand( cmd.getArg( UpdateViewDescriptionCommand.oldDescription ),
                                                                  cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
      }
      case UpdateViewNameCommand.id: {
        return CommandFactory.createUpdateViewNameCommand( cmd.getArg( UpdateViewNameCommand.oldName ),
                                                           cmd.getArg( UpdateViewNameCommand.newName ) );
      }
      default: {
        return new Error( "The '" + cmd.id + "' command does not have an undo command" );
      }
    }
  }

  /**
   * @param {string} newDescription the new view description (can be `null` or empty if old description has a value)
   * @param {string} oldDescription the view description being replaced (can be `null` or empty if new description has a value)
   * @returns {Command | Error} the update view description command or an error if both the new an old description is missing
   */
  public static createUpdateViewDescriptionCommand( newDescription: string,
                                                    oldDescription: string ): Command | Error {
    if ( newDescription || oldDescription ) {
      if ( newDescription === oldDescription ) {
        return CommandFactory.createNoOpCommand();
      }

      return new UpdateViewDescriptionCommand( newDescription, oldDescription );
    }

    return new Error( "Must have either a new description or an old description when creating an UpdateViewDescriptionCommand" );
  }

  /**
   * @param {string} newName the new view name (can be `null` or empty if the old name has a value)
   * @param {string} oldName the view name being replaced (can be `null` or empty if the new name has a value)
   * @returns {Command | Error} the update view name command or an error if both the new and old name is missing
   */
  public static createUpdateViewNameCommand( newName: string,
                                             oldName: string ): Command | Error {
    if ( newName || oldName ) {
      if ( newName === oldName ) {
        return CommandFactory.createNoOpCommand();
      }

      return new UpdateViewNameCommand( newName, oldName );
    }

    return new Error( "Must have either a new name or an old name when creating an UpdateViewNameCommand" );
  }

  /**
   * Constructs a command object from JSON.
   *
   * @param {object} json the JSON being converted to a command
   * @returns {Command | Error} the decoded command or an error if one could not be constructed
   */
  public static decode( json: object = {} ): Command | Error {
    const cmdId = json[ Command.idPropJson ];

    switch ( cmdId ) {
      case AddSourcesCommand.id: {
        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === AddSourcesCommand.addedSourcePaths ) {
            return CommandFactory.createAddSourcesCommand( entry[ Command.argValueJson ] as string );
          }
        }

        return new Error( "Unable to decode AddSourcesCommand: " + json );
      }
      case RemoveSourcesCommand.id: {
        for ( const entry of json[ Command.argsPropJson ] ) {
          if ( entry[ Command.argNameJson ] === RemoveSourcesCommand.removedSourcePaths ) {
            return CommandFactory.createRemoveSourcesCommand( entry[ Command.argValueJson ] as string );
          }
        }

        return new Error( "Unable to decode RemoveSourcesCommand: " + json );
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
          return CommandFactory.createUpdateViewDescriptionCommand( newViewDescription, replacedViewDescription );
        }

        return new Error( "Unable to decode UpdateViewDescriptionCommand: " + json );
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
          return CommandFactory.createUpdateViewNameCommand( newViewName, replacedViewName );
        }

        return new Error( "Unable to decode UpdateViewNameCommand: " + json );
      }
      default: {
        return new Error( "Unhandled command: " + cmdId );
      }
    }
  }

}
