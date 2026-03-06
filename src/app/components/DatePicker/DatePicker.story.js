import React from 'react';
import { storiesOf } from '@kadira/storybook';
import DatePicker from './DatePicker.js';

storiesOf('DatePicker', module)

    .add('default', () => (
        <DatePicker initialDate={'2017-04-02'} placeholderText={"?"}/>
    ))
