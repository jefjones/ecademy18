import { storiesOf, action } from '@kadira/storybook'
import SelectSingleDropDown from './SelectSingleDropDown'

storiesOf('SelectSingleDropDown', module)

    .add('default', () => (
        <SelectSingleDropDown
            name="first name"
            label="first name"
            value={`inside stuff`}
            onChange={() => {}}
            error={``}
        />
    ))
