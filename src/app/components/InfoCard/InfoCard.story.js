import React from 'react';
import { storiesOf } from '@kadira/storybook';
import InfoCard from './InfoCard.js';

var data = [
        {
            label: 'Name',
            value: 'Marsh, Elisabeth'
        },
        {
            label: 'Gender',
            value: 'F'
        },
        {
            label: 'Age',
            value: '8'
        },
        {
            label: 'Birth Date',
            value: '9 Mar 2009'
        },
        {
            label: 'Status',
            value: 'Member'
        },
        {
            label: 'Suggested Action',
            value: 'Baptism'
        },
        {
            label: 'Interview Date',
            value: '2017-04-01'
        }
    ];

storiesOf('InfoCard', module)

    .add('default', () => (
        <InfoCard className="" data={data}/>
    ))
