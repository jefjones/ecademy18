import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SelectMultiplePopover from './SelectMultiplePopover.js';
import Checkbox from '../Checkbox/Checkbox.js';
import RadioGroup from '../RadioGroup/RadioGroup.js';
import styles from './SelectMultiplePopover.css';

var radioTest = [
    {
        value: '1',
        label: 'Scheduled and Unscheduled',
        selected: true
    },
    {
        value: '2',
        label: 'Scheduled Only',
        selected: false
    },
    {
        value: '3',
        label: 'Unscheduled Only',
        selected: false
    }
];


storiesOf('SelectMultiplePopover', module)

    .add('default', () => (
        <SelectMultiplePopover label='testing'>
            <Checkbox label={'All Sections'} checked={true} onChange={()=>{}} checkboxClass={styles.child}/>
            <hr className={styles.divider}/>
            <Checkbox label={'Bishop’s Youth Interviews'} checked={true} onChange={()=>{}} checkboxClass={styles.child}/>
            <Checkbox label={'Bishopric Counselor Youth Interviews'} checked={true} onChange={()=>{}} checkboxClass={styles.child}/>
            <Checkbox label={'Young Single Adult Interviews'} checked={true} onChange={()=>{}} checkboxClass={styles.child}/>
            <hr className={styles.divider}/>
            <RadioGroup data={radioTest} name={`interviews`} onClick={()=>{}} radioClass={styles.child}/>
            <br/>
        </SelectMultiplePopover>
    ));
