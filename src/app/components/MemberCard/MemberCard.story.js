import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MemberCard from './MemberCard.js';
import styles from './MemberCard.css';

var member = {
    title: {
        label: 'Allen, Dail',
        parenthetical: '44',
        rightSide: 'male'
    },
    data: [
        {
            type: 'PHONELINK',
            label: 'Phone number',
            text: '(801) 888-9999',
        },
        {
            type: 'EMAILLINK',
            label: 'E-mail',
            text: 'testthis@test.com',
        },
        {
            label: 'Current Unit',
            text: 'American Fork 15th Ward (96717)',
        },
        {
            type: 'LINEDIVIDER',
        },
    ]
};

storiesOf('MemberCard', module)

    .add('default', () => (
        <MemberCard member={member}/>
    ));
