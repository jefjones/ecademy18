import * as types from '../actions/actionTypes'
import Icon from '../components/Icon'
import Checkbox from '../components/Checkbox'

export default function(state=[], action) {
    switch(action.type) {
        case types.GROUP_EDIT_REPORT_INIT:
            !!action.payload && localStorage.setItem("groupEditReport", JSON.stringify(action.payload))
            return action.payload ? action.payload : state

        default:
            return state
    }
}

export const selectGroupEditReport = (state) => state

//There will be three reports (and they may have filters to cut back the list of documents or authors in any variety)
//1. All documents (assignments for teacher-class) along the top and All authors (group members) on the left: selectEditWorksEditorsOneCount
//      with a list of edit types to choose from in order to show in the cells below.
//2. A document chosen, all edit type counts along the top and all authors (group members) on the left:  selectEditWorkEditorsEditCounts
//3. An editor chosen for all her works: Edit type counts along the top and the works listed on the left: selectEditWorksEditorEditCounts

const editCounts = {
    "wordCount": 'Word Count',
    "sentenceCount": 'Sentence Count',
    "edits": 'Edits',
    "pendingEdits": 'Pending Edits',
    "comments": 'Comments',
    "pendingComments": 'Pending Comments',
    "upVotes": 'Up Vote',
    "downVotes": 'Down Vote',
    "trollVotes": 'Troll Vote',
    "acceptedEdits": 'Accepted',
    "nonAcceptedEdits": 'Not Accepted',
}

//1. All documents (assignments for teacher-class) along the top and All authors (group members) on the left: selectEditWorksEditorsOneCount
//      with a list of edit types to choose from in order to show in the cells below.
export const selectEditWorksEditorsOneCount = (state, editTypeCount) => {
    //Table headers:  work names
    //row left column: group member names
    editTypeCount = editTypeCount ? editTypeCount : 'edits'
    let headings = [{ id: 0, label: '', tightText: true,}];  //The first label is the top left which is header for the list of works.
    state && state.length > 0 && state.forEach(w => {
        headings.push({
            id : w.masterWorkId,
            label: w.masterWorkName,
            pathLink: '/groupEditReport/e/edit/' + w.masterWorkId,
            verticalText: true
        })
    })

    //1. Create the data-rows framework by taking the first work and going through the member list (the member list will be the same for each work)
    //    to fill in the first, left column with all of the group member's names and ids and pathlinks.
    //2. Then, go through each work one-at-a-time and loop through the data-rows to fill in the next cells so that you are working vertically to the right until you are done.
    let data = []
    state && state.length > 0 && state[0].membersAndEdits && state[0].membersAndEdits.length > 0 && state[0].membersAndEdits.forEach(m => {
        let cell = {
            id: m.editorPersonId,
            value: m.editorFirstName + ' ' + m.editorLastName,
            pathLink: '/groupEditReport/e/edit/works/' + m.editorPersonId,
        }
        let row = [cell]
        data = !!data ? data.concat([row]) : [[row]]
    })

    state && state.length > 0 && state.forEach(w => {
        w.membersAndEdits && w.membersAndEdits.length > 0 && w.membersAndEdits.forEach(m => {
            let cell = {
                id: m.editorWorkId,
                pathLink: '/groupEditReport/e/edit/' + m.editorWorkId + '/' + m.editorPersonId,
            }
            if (!m.editCounts) {
                cell.value = 0
            } else {
                if (!isNaN(m.editCounts[editTypeCount])) {
                    cell.value = m.editCounts[editTypeCount]; //editTypeCount is a parameter to set the single count edit type:  edits, comments, upVotes, etc.
                }
            }
            data = data.map(row => row[0].id === m.editorPersonId ? row.concat(cell) : row)
        })
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}


export const selectEditWorkEditorsCounts = (state, workId) => {
    //Table headers:  Edit count types
    //row left column: names of the editors
    let report = state.filter(m => m.masterWorkId === workId)[0]
    let workName = !!report && report.masterWorkName.length > 40 ? report.masterWorkName.substring(0,40) + '...' : report.masterWorkName

    let headings = [
        { id: '0', label: workName, tightText: true },   //The first label is the top left which is header for the list of works.
    ]

    let ids = Object.keys(editCounts); //See the editCounts object above.s
    let labels = Object.values(editCounts)
    for(let i = 0; i < ids.length; i++) {
        headings = headings.concat({
            id: ids[i],
            label: labels[i],
            verticalText: true,
        })
    }

    //1. Create the data-rows framework by taking the first work and going through the member list (the member list will be the same for each work)
    //    to fill in the first, left column with all of the group member's names and ids and pathlinks.
    //2. Then, go through each work one-at-a-time and loop through the data-rows to fill in the next cells so that you are working vertically to the right until you are done.
    let data = []
    !!report && report.membersAndEdits && report.membersAndEdits.length > 0 && report.membersAndEdits.forEach(m => {
        let cell = {
            id: m.editorPersonId,
            value: m.editorFirstName + ' ' + m.editorLastName,
            pathLink: '/groupEditReport/e/edit/works/' + m.editorPersonId,
        }
        let row = [cell]
        for(let index = 0; index < labels.length; index++) {
            !!m.editCounts && row.push({
                value: !isNaN(m.editCounts[ids[index]]) ? m.editCounts[ids[index]] : 0
            })
        }
        data = !!data ? data.concat([row]) : [[row]]
    })
    //Put in the last row (which might be first if there aren't any data rows to start with) which gives a link to  add a new student.
    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectEditWorks_EditorCounts = (state, personId) => {
    //Table headers:  Edit count types
    //row left column: names of the editors
    let person = {}
    state.forEach(w => w.membersAndEdits.forEach(m => { if (m.editorPersonId === personId) person = m }))

    let personName = !!person && person.editorFirstName + ' ' + person.editorLastName

    let headings = [
        { id: '0', label: personName, tightText: true },   //The first label is the top left which is header for the list of works.
    ]

    let ids = Object.keys(editCounts); //See the editCounts object above.s
    let labels = Object.values(editCounts)
    for(let i = 0; i < ids.length; i++) {
        headings = headings.concat({
            id: ids[i],
            label: labels[i],
            verticalText: true,
        })
    }

    //1. Create the data-rows framework by taking the first work and going through the member list (the member list will be the same for each work)
    //    to fill in the first, left column with all of the group member's names and ids and pathlinks.
    //2. Then, go through each work one-at-a-time and loop through the data-rows to fill in the next cells so that you are working vertically to the right until you are done.
    let data = []
    state && state.length > 0 && state.forEach(w => {
        let row = [{
            id: w.masterWorkId,
            value: w.masterWorkName,
        }]
        w.membersAndEdits && w.membersAndEdits.length > 0 && w.membersAndEdits.forEach(m => {
            if (m.editorPersonId === personId) {
                for(let index = 0; index < labels.length; index++) {
                    let cell = !!m.editCounts ? { value: !isNaN(m.editCounts[ids[index]]) ? m.editCounts[ids[index]] : 0 } : {}
                    row.push(cell)
                }
                data = !!data ? data.concat([row]) : [[row]]
            }
        })
    })
    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectEditorOptions = (state) => {
    let options = []
    state && state.length > 0 && state[0].membersAndEdits && state[0].membersAndEdits.length > 0 && state[0].membersAndEdits.forEach(m => {
        let option = {
            id: m.editorPersonId,
            value: m.editorPersonId,
            label: m.editorFirstName + ' ' + m.editorLastName,
        }
        options = !!options ? options.concat(option) : [option]
    })
    return options
}

export const selectEditWorkResponseEditorsCounts = (state, workId) => {
    //Table headers:  Edit count types
    //row left column: names of the editors
    let report = state.filter(m => m.masterWorkId === workId)[0]
    let uniqueHrefIds = report && report.membersAndEdits ? [...new Set(report.membersAndEdits.filter(m => m.groupWorkStatusName === 'SUBMITTED').map(m => m.editorWorkId))] : []
    let headTitle = report && report.masterWorkName
    headTitle = headTitle && headTitle.length > 120 ? headTitle.substring(0,120) + '...' : headTitle
    let subHeadTitle = uniqueHrefIds.length + ` pending for review`

    let headings = [
        { id: '0', label: '' },
        { id: '0', label: 'Learners', tightText: true },
        { id: '0', label: 'Reviewed?', verticalText: true },
        { id: '0', label: 'Status', verticalText: true },
        { id: '0', label: 'Words', verticalText: true },
        { id: '0', label: 'Sentences', verticalText: true},
        { id: '0', label: 'Edits', verticalText: true},
        { id: '0', label: 'Pending Edits', verticalText: true},
        { id: '0', label: 'Comments', verticalText: true},
        { id: '0', label: 'Pending Comments', verticalText: true},
        { id: '0', label: 'Up Vote', verticalText: true},
        { id: '0', label: 'Down Vote', verticalText: true},
        { id: '0', label: 'Troll Vote', verticalText: true},
        { id: '0', label: 'Accepted', verticalText: true},
        { id: '0', label: 'Not Accepted', verticalText: true},
        { id: '0', label: 'Learner report', verticalText: true},
    ]

    //1. Create the data-rows framework by taking the first work and going through the member list (the member list will be the same for each work)
    //    to fill in the first, left column with all of the group member's names and ids and pathlinks.
    //2. Then, go through each work one-at-a-time and loop through the data-rows to fill in the next cells so that you are working vertically to the right until you are done.
    let data = []
    !!report && report.membersAndEdits && report.membersAndEdits.length > 0 && report.membersAndEdits.forEach(m => {
        let groupWorkStatusIcon = m.groupWorkStatusName === 'ASSIGNED' || m.groupWorkStatusName === 'ACCEPTED' ? 'hourglass'
            : m.groupWorkStatusName === 'SUBMITTED' ? 'inbox'
            : m.groupWorkStatusName === 'INREVIEW' ? 'clipboard_user'
            : m.groupWorkStatusName === 'REVIEWRESPONDED' ? 'compare_docs'
            : m.groupWorkStatusName === 'AUTHORACCEPTED' ? 'reading'
            : m.groupWorkStatusName === 'COMPLETED' ? 'clipboard_check'
            : ''

        let row = [{
                id: m.editorWorkId,
                value: <Icon pathName={'file_text2'} />,
                pathLink: 'EDITREVIEW!!' + m.editorWorkId,
            },
            {
                id: '0',
                value: m.editorFirstName + ' ' + m.editorLastName,
                pathLink: '/groupEditReport/e/edit/works/' + m.editorPersonId, //' + m.editorWorkId + '
            },
            {
                id: m.editorWorkId,
                value: <Checkbox onClick={() => {}} checked={!m.groupWorkStatusName || m.groupWorkStatusName === 'ASSIGNED' || m.groupWorkStatusName === 'ACCEPTED' ? false : true}/>,
                groupWorkStatusName: m.groupWorkStatusName,
                workId: m.editorWorkId,
                pathLink: 'STATUSUPDATE!!' + m.groupWorkStatusName + '^^' + m.editorWorkId,
            },
            { id: '0', value: <Icon pathName={groupWorkStatusIcon} premium={true}/>  },
            { id: '0', value: m.editCounts['wordCount'],  },
            { id: '0', value: m.editCounts['sentenceCount'], },
            { id: '0', value: m.editCounts['edits'], },
            { id: '0', value: m.editCounts['pendingEdits'], },
            { id: '0', value: m.editCounts['comments'], },
            { id: '0', value: m.editCounts['pendingComments'], },
            { id: '0', value: m.editCounts['upVotes'], },
            { id: '0', value: m.editCounts['downVotes'], },
            { id: '0', value: m.editCounts['trollVotes'], },
            { id: '0', value: m.editCounts['acceptedEdits'], },
            { id: '0', value: m.editCounts['nonAcceptedEdits'], },
            {
                id: m.editorWorkId,
                value: <Icon pathName={'stats_dots'} />,
                pathLink: '/groupEditReport/e/edit/works/' + m.editorPersonId, //' + m.editorWorkId + '
            }
        ]
        data = !!data ? data.concat([row]) : [[row]]
    })

    if (report) {
        let row = [{},{
            id: 0,
            value: '[Assign to a learner]',
            pathLink: '/groupWorkAssign/' + report.groupId + '/' + report.masterWorkId,
        }]
        for(let index = 0; index < 10; index++) {
            row.push({ value: 0 })
        }
        data = !!data ? data.concat([row]) : [[row]]
    }
    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headTitle, subHeadTitle, headings, data}
}
