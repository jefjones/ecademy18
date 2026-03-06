import { storiesOf } from '@kadira/storybook'
import FilterOptions from './FilterOptions'
//import styles from './FilterOptions.css';

const data = [
    {
        type: "SearchText",
        className: "",
        searchText: ""
    },
    {
        type: "SelectMultiplePopover",
        className: "",
        label: "Show",
        options: [
            {
                id: 'test',
                label: 'Testing 1',
                isChosen: false,
            },
            {
                id: 'test2',
                label: 'Another Test',
                isChosen: false,
            },
            {
                id: '3',
                label: 'Third Test',
                isChosen: true,
            }
        ]
    },
    {
        type: "SelectSingleDropDown",
        className: "",
        label: "Testing label",
        id: "singleText",
        initialValue: "",
        options: [
            {
                id: "1",
                label: "First"
            },
            {
                id: "2",
                label: "Second"
            },
            {
                id: "3",
                label: "Third"
            }
        ],
        size: "medium"
    },
    {
        type: "Checkbox",
        className: "",
        id: 'textCheck',
        label: 'This is a test',
        isChosen: true
    }
]

storiesOf('FilterOptions', module)

    .add('default', () => (
        <FilterOptions
            data={data}
        />
    ))
