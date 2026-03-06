import React from 'react';
import { storiesOf } from '@kadira/storybook';
import RadioGroup from './RadioGroup.js';

var radioTest = [
    {
        value: '1',
        label: 'Testing first',
        selected: false
    },
    {
        value: '2',
        label: 'Second thing',
        selected: true
    },
    {
        value: '3',
        label: 'And the third',
        selected: false
    }
];


storiesOf('RadioGroup', module)

    .add('default', () => (
        <RadioGroup data={radioTest} name={`testing`} radioClass="" labelClass="" onClick={()=>{}} position="before"/>
    ))
