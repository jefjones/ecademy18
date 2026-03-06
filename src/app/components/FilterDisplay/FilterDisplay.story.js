import React from 'react';
import { storiesOf } from '@kadira/storybook';
import FilterDisplay from './FilterDisplay.js';
//import styles from './FilterDisplay.css';

const display= {
    data: [1,2,3,4,5,6,6],
    reportSections: [[4,5,6],[1,2],[3,4,5,6,7,8,9]],
    sectionsList: [
        {
            id: 'leadership',
            label: 'Leadership',
            isChosen: true
        },
        {
            id: 'instructor',
            label: 'Instructor',
            isChosen: true
        },
        {
            id: 'hometeachingSupervisors',
            label: 'Hometeaching Supervisors',
            isChosen: true
        }
    ],
    sectionsToShow: ['leadership', 'instructor', 'hometeachingSupervisors']
};


storiesOf('FilterDisplay', module)

    .add('default', () => (
        <FilterDisplay display={display}/>
    ));
