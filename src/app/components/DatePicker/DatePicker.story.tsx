import { storiesOf } from '@kadira/storybook'
import DatePicker from './DatePicker'

storiesOf('DatePicker', module)

    .add('default', () => (
        <DatePicker initialDate={'2017-04-02'} placeholderText={"?"}/>
    ))
