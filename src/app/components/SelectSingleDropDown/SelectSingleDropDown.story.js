import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SelectSingleDropDown from './SelectSingleDropDown.js';

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
