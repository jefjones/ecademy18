export const contactFilter =
{
    filterPanelOpen: false,
    launchOpenText: 'search',
    launchCloseText: 'close search',
    source_options: [
        {
            label: "All",
            id: "all"
        },
        {
            label: "Editors",
            id: "editors"
        },
        {
            label: "Not Assigned",
            id: "notAssigned"
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
    source_chosen: "all",
    status_chosen: "active",
    editors: true,
    notAssigned: true,
    active: true,
    completed: false,
    language: [1],
    dueDate_from: "",
    dueDate_to: "",
    searchText: "",
    orderByChosen: "fullName",
    orderSortChosen: "asc",
    orderBy_options: [
        {
            label: "Due date",
            id: "editorSoonestDueDate"
        },
        {
            label: "Contact Name",
            id: "fullName"
        },
        {
            label: "Modified Most Recently",
            id: "editorLastUpdate"
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
