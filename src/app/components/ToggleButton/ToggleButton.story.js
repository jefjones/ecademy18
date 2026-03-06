import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ToggleButton from './ToggleButton.js';


storiesOf('ToggleButton', module)

    .add('default', () => (
        <ToggleButton className="" label={'Show'} caret={true} onClick={()=>{}}/>
    ))
