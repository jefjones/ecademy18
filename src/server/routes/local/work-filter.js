export const workFilter =
{
    filterPanelOpen: false,
    launchOpenText: 'search',
    launchCloseText: 'close search',
    source_chosen: "all",
    status_chosen: "active",
    mine: true,
    others: true,
    active: true,
    completed: false,
    language: [1],
    dueDate_from: "",
    dueDate_to: "",
    searchText: "",
    orderByChosen: "title",
    orderSortChosen: "asc",
    source_options: [
        {
            label: "All",
            id: "all"
        },
        {
            label: "Mine",
            id: "mine"
        },
        {
            label: "Others'",
            id: "others"
        },
    ],
    status_options: [
        {
            label: "All",
            id: "all"
        },
        {
            label: "Active",
            id: "active"
        },
        {
            label: "Completed",
            id: "completed"
        },
    ],
    orderBy_options: [
        {
            label: "Due date",
            id: "dueDate"
        },
        {
            label: "Title",
            id: "title"
        },
        {
            label: "Modified Most Recently",
            id: "lastUpdated"
        },
        {
            label: "Project",
            id: "project"
        },
    ],
    orderSort_options: [
        {
            label: "Ascending",
            id: "asc"
        },
        {
            label: "Descending",
            id: "desc"
        },
    ]
};
