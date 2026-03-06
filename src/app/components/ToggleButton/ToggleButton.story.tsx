import { storiesOf } from '@kadira/storybook'
import ToggleButton from './ToggleButton'


storiesOf('ToggleButton', module)

    .add('default', () => (
        <ToggleButton className="" label={'Show'} caret={true} onClick={()=>{}}/>
    ))
