import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TabPage from './TabPage.js';

var tabs = [
    {
        label: 'Ordinances',
        id: 'ordinances',
        isChosen: false
    },
    {
        label: 'Mission',
        id: 'mission',
        isChosen: true
    },
    {
        label: 'Interviews',
        id: 'interviews',
        isChosen: false
    }
];

storiesOf('TabPage', module)

    .add('default', () => (<TabPage tabs={tabs} />))
