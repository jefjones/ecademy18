// @flow
/**
 * This component represents an unadorned list of SelectItem (s).
 */
import { Component } from 'react'

import SelectItem from './select-item'

import type {
    Option,
} from './select-item'

function SelectList(props) {
  return <ul style={styles.list}>
            {renderItems()}
        </ul>
}

const styles = {
    list: {
        margin: 0,
        paddingLeft: 0,
    },
    listItem: {
        listStyle: 'none',
    },
}

export default SelectList
