import { storiesOf, action } from '@kadira/storybook'
import SwitchOnOff from './SwitchOnOff'

let value = true
let toggleSomething = (value) => alert('this value: ' + value)

storiesOf('SwitchOnOff', module)
    .add('default', () => (
        <SwitchOnOff
            value={`inside stuff`}
            toggleSomething={toggleSomething}
        />
    ))
