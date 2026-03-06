// @flow
/**
 * This component represents the entire panel which gets dropped down when the
 * user selects the component.  It encapsulates the search filter, the
 * Select-all item, and the list of options.
 */
import {filterOptions} from 'fuzzy-match-utils'
import { Component } from 'react'

import SelectItem from './select-item'
import SelectList from './select-list'

import type {
    Option,
} from './select-item'

function SelectPanel(props) {
  const [searchHasFocus, setSearchHasFocus] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [focusIndex, setFocusIndex] = useState(0)

  useEffect(() => {
    return () => {
      
              props.getJustCollapsed ? props.getJustCollapsed() : () => {}; //Updated here in order for the editorAssign record to be saved if the user clicks outside of the drop down area anywhere else.
          
    }
  }, [])

  const {ItemRenderer, selectAllLabel, hideSelectAll} = props
  
          const selectAllOption = {
              label: selectAllLabel || "Select All",
              value: "",
          }
  
          const focusedSearchStyle = searchHasFocus
              ? styles.searchFocused
              : undefined
  
          return <div
              style={styles.panel}
              role="listbox"
              onKeyDown={handleKeyDown}
          >
              <div style={styles.searchContainer}>
                  <input
                      placeholder="Search"
                      type="text"
                      onChange={handleSearchChange}
                      style={{...styles.search, ...focusedSearchStyle}}
                      onFocus={() => handleSearchFocus(true)}
                      onBlur={() => handleSearchFocus(false)}
                  />
              </div>
  
  						{!hideSelectAll &&
  		            <SelectItem
  		                focused={focusIndex === 0}
  		                checked={allAreSelected()}
  		                option={selectAllOption}
  		                onSelectionChanged={selectAllChanged}
  		                onClick={() => handleItemClicked(0)}
  		                ItemRenderer={ItemRenderer}
  		            />
  						}
  
              <SelectList
                  {...props}
                  options={filteredOptions()}
                  focusIndex={focusIndex - 1}
                  onClick={(e, index) => handleItemClicked(index + 1)}
                  ItemRenderer={ItemRenderer}
              />
          </div>
}

const styles = {
    panel: {
        boxSizing : 'border-box',
    },
    search: {
        display: "block",

        maxWidth: "100%",
        borderRadius: "3px",

        boxSizing : 'border-box',
        height: '30px',
        lineHeight: '24px',
        border: '1px solid',
        borderColor: '#dee2e4',
        padding: '10px',
        width: "100%",
        outline: "none",
    },
    searchFocused: {
        borderColor: "#78c008",
    },
    searchContainer: {
        width: "100%",
        boxSizing : 'border-box',
        padding: "0.5em",
    },
}

export default SelectPanel
