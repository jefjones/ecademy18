import React from 'react';
import { storiesOf } from '@kadira/storybook';
import WorkFilter from './WorkFilter.js';
import styles from './WorkFilter.css';

var workFilter =
{
    mine: true,
    others: false,
    active: true,
    completed: false,
    language: [1],
    orderBy: "name",
    sort: "desc",
    dueDate_from: "",
    dueDate_to: '2017-07-12',
    searchText: "test",
    orderBy: [
        {
            label: "Due date",
            id: "DueDate"
        },
        {
            label: "Name",
            id: "Name"
        },
        {
            label: "Modified Most Recently",
            id: "Recent"
        },
        {
            label: "Project",
            id: "Project"
        },
    ],
    orderSort: [
        {
            label: "Descending",
            id: "desc"
        },
        {
            label: "Ascending",
            id: "asc"
        },
    ],
    languages: [
        {
            label: "English",
            id: "eng"
        },
        {
            label: "russian",
            id: "rus"
        },
    ]

};

storiesOf('WorkFilter', module)
    .add('default', () => (
        <WorkFilter workFilter={workFilter} />
    ));
