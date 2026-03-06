import { storiesOf, action } from '@kadira/storybook';
import InputSelect from './InputSelect.js';

storiesOf('InputSelect', module)

    .add('default', () => (
        <InputSelect
            name="first name"
            label="first name"
            value={`inside stuff`}
            onChange={() => {}}
            error={``}
        />
    ))
