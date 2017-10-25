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

import { PropertyDefinition } from "@shared/property-form/property-definition.model";

/**
 * An enumeration of control types for a property.
 */

export enum PropertyControlType {

  /**
   * Render the property as a checkbox.
   */
  CHECKBOX,

  /**
   * Render the property as a dropdown.
   */
  DROPDOWN,

  /**
   * Render the property as a masked textbox.
   */
  PASSWORD,

  /**
   * Render the property as a textbox.
   */
  TEXT

}

/**
 * Namespace to allow methods on the enum.
 */
export namespace PropertyControlType {

  /**
   * @param {PropertyDefinition<any>} propDefn the property whose control type is being requested
   * @returns {PropertyControlType} the control type to render the property value
   */
  export function toControlType( propDefn: PropertyDefinition< any > ): PropertyControlType {
    if ( propDefn.isConstrainedToAllowedValues() ) {
      return PropertyControlType.DROPDOWN;
    }

    if ( propDefn.getTypeClassName() === "java.lang.Boolean" ) {
      return PropertyControlType.CHECKBOX;
    }

    if ( propDefn.isMasked() || propDefn.getId() === "password" ) {
      return PropertyControlType.PASSWORD;
    }

    // defaults to a text control
    return PropertyControlType.TEXT;
  }

}
