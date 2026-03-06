// @flow
import { useState } from 'react'
import {storiesOf} from '@kadira/storybook'
import SelectPanel from '../select-panel'

const options = [
    {label: "Brian Genisio", value: 1},
    {label: "John Doe", value: 2},
    {label: "Jane Doe", value: 3},
]

function StatefulSelectPanel(props) {
  const [selected, setSelected] = useState([])

  return <div>
            <SelectPanel
                options={options}
                onSelectedChanged={handleSelectedChanged.bind(this)}
                selected={selected}
            />

            <h2>Selected:</h2>
            {selected.join(', ')}
        </div>
}

storiesOf('SelectPanel', module)
    .add('default view', () => <StatefulSelectPanel />)
