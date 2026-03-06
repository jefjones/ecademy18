// @flow
/**
 * This component is designed to be a multi-selct component which supports
 * the selection of several items in a picklist.  It was meant to mimic the
 * style of react-select but the multi-select behavior didn't work for our
 * our needs.
 *
 * Arguments:
 * - options: The {value, label}[] options to be displayed
 * - values: The currently selected values []
 * - onSelectedChanged: An event to notify the caller of new values
 * - valueRenderer: A fn to support overriding the message in the component
 * - isLoading: Show a loading indicator
 */
import { Component } from 'react'
import myStyles from './myStyles.css'

import Dropdown from './dropdown'
import SelectPanel from './select-panel'

import type {
    Option,
} from './select-item'

function MultiSelect(props) {
  const {
              ItemRenderer,
              options,
              selected,
              selectAllLabel,
  						hideSelectAll,
              onSelectedChanged,
              isLoading,
              getJustCollapsed,
              label,
              name
          } = props
  
          return (
              <div className={myStyles.maxWidth}>
                  {label && <span htmlFor={name} className={myStyles.aboveLabel}>{label}</span>}
  
                  <Dropdown
                      isLoading={isLoading}
                      contentComponent={SelectPanel}
                      getJustCollapsed={getJustCollapsed}
                      contentProps={{
                          ItemRenderer,
                          options,
                          selected,
                          selectAllLabel,
  												hideSelectAll,
                          onSelectedChanged,
                          getJustCollapsed,
                      }}
                  >
                      {renderHeader()}
                  </Dropdown>
              </div>
          )
}

export default MultiSelect
export {Dropdown}
