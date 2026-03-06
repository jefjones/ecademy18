import { storiesOf } from '@kadira/storybook'
import Checkbox from './Checkbox'


storiesOf('Checkbox', module)

    .add('default', () => (
        <Checkbox checkboxClass="" labelClass="" label={'Testing of this checkbox'} defaultChecked={true} onClick={()=>{}}/>
    ))
