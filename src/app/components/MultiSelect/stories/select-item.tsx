// @flow
import { Component } from 'react'
import {storiesOf} from '@kadira/storybook'
import SelectItem from '../select-item'

import type {
    Option,
} from '../select-item'

const option: Option = {
    label: "one",
    value: 1,
}

function StatefulSelectItem(props) {
  const [option, setOption] = useState(option)
  const [checked, setChecked] = useState(false)

  return <div>
            <SelectItem
                option={option}
                checked={checked}
                onSelectionChanged={handleChange.bind(this)}
                onClick={() => {}}
            />

            <h2>Selected:</h2>
            {checked ? 'true' : 'false'}
        </div>
}

storiesOf('SelectItem', module)
    .add('default view', () => <StatefulSelectItem />)
