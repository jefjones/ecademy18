import * as types from '../actions/actionTypes'
//import {doSort} from '../utils/sort';

//The selectors were named to be descriptive in the singular and plural (for example - and now there is also a larger set for translation.
// selectEditWorkEditorSectionsCounts
// selectEditWorkEditorsCounts
// selectEditWorks_EditorCounts
// selectEditWorksEditorsOneCount
//
//So that selectEditWorkEditorSectionsCounts infers there is a single work, multiple editors, and the sections are going to be shows for that single work.
//another example: selectEditWorks_EditorCounts infers multiple works by a single editor so that all edit counts will be displayed.
//ok, another one:  selectEditWorksEditorsOneCount - multiple works, multiple editors, but only one edit count is going to show.  A drop down list will be provided to determine what that count represents.

export default function(state = [], action) {
    switch(action.type) {
        case types.CONTRIBUTOR_REPORT_INIT:
            return action.payload

        default:
            return state
    }
}

export const selectContributorReport = (state) => state

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

const transCounts = {
    "wordCount": 'Word Count',
    "sentenceCount": 'Sentence Count',
    "transCompletePercent": '% Complete',
    "transInProcessPercent": '% In Process',
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

    //(workId === 'works' && personId === 'editors')    OR   (workId === 'works')   OR   } else {
export const selectEditWorksEditorsOneCount = (state, editTypeCount) => {
    //Table headers:  Editor first names
    //row left column: work names
    editTypeCount = editTypeCount ? editTypeCount : 'edits'
    let headings = [{ id: 0, label: 'Total edits made by each editor', tightText: true,}];  //The first label is the top left which is header for the list of works.
    state && state.length > 0 && state.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId === nativeLanguageId) {
                    let option = {
                        id : e.personId,
                        label: e.firstName,
                        pathLink: '/report/e/edit/works/' + e.personId,
                        verticalText: true
                    }
                    let alreadyIncluded = false
                    headings.forEach(o => {
                        if (o.id === e.personId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.firstName) {
                        headings.push(option)
                    }
                }
            })
        })
    })
    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = []
        let nativeLanguageId = w.languageId
        row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: 0,
            value: w.workName.length > 35 ? w.workName.substring(0,35) + '...' : w.workName,
            pathLink: '/report/e/edit/' + w.workId
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //personId is headings[i].id
        }
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                row = row.map(r => {
                    if (e.personId && r.headingId === e.personId && e.languageId === nativeLanguageId) {
                        if (!isNaN(e[editTypeCount])) {
                            r.value += e[editTypeCount]; //editTypeCount is a parameter to set the single count edit type:  edits, comments, upVotes, etc.
                        }
                        r.value = editTypeCount === "wordCount"
                                    ? w.wordCount
                                    : editTypeCount === "sentenceCount"
                                        ? w.sentenceCount
                                        : editTypeCount === "transInProcessPercent" || editTypeCount === "transCompletePercent"
                                            ? r.value + '%'
                                            : r.value
                        r.pathLink = '/report/e/edit/' + w.workId + '/' + e.personId + '/sections'
                    }
                    return r
                })
            })
        })
        data.push(row)
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectEditWorks_EditorCounts = (state, personId) => {
    //Table headers:  Edit count types
    //row left column: work names
    let personName = ""
    state.forEach(w => w.reportChapters.forEach(c =>
        c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
            if (e.personId === personId && e.firstName) personName = e.firstName + ' ' + e.lastName
        })
    ))
    let headings = [
        { id: '0', label: 'Documents', tightText: true, upperHeader: 'Edits by ' + personName},   //The first label is the top left which is header for the list of works.
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

    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = []
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0, pathLink: '/report/e/edit/' + w.workId + '/' + headings[i].id}); //personId is headings[i].id
        }
        //Start the row by setting the columns which will then be used to loop through the chapters and accumulate the counts
        let nativeLanguageId = w.languageId
        row = [{
            headingId: 0,
            value: w.workName.length > 25 ? w.workName.substring(0,25) + '...' : w.workName,
            nowrap: true,
            pathLink: '/report/e/edit/' + w.workId + '/' + personId + '/sections',
        }]
        for(let index = 0; index < labels.length; index++) {
            row = row.concat({ headingId: ids[index], value: 0})
        }
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === nativeLanguageId && r.personId === personId)
            reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                for(let index = 0; index < labels.length; index++) {
                    if (!isNaN(e[ids[index]])) {
                        row[Number(index)+Number(1)].value += e[ids[index]]
                        row[Number(index)+Number(1)].pathLink = '/report/e/edit/' + w.workId + '/' + personId + '/sections'
                    }
                }
            })
        })
        data.push(row)
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectEditWorkEditorSectionsCounts = (state, workId, personId) => {
    //Table headers:  Edit count types
    //row left column: names of the work's sections/chapters
    let personName = ""
    state.forEach(w => w.reportChapters.forEach(c =>
        c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
            if (e.personId === personId && e.firstName) personName = e.firstName + ' ' + e.lastName
        })
    ))
    let workName = ""
    state.forEach(w => {if (w.workId === workId) workName = w.workName})
    workName = workName.length > 25 ? workName.substring(0,25) + '...' : workName

    let headings = [
        { id: '0', label: 'Document', tightText: true, upperHeader: 'Edits by ' + [personName], subUpperHeader: workName},   //The first label is the top left which is header for the list of works.
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

    let data = []
    let work = state && state.length > 0 && state.filter(m => m.workId === workId)

    work && work.length > 0 && work.forEach(w => {
        let row = []
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0, pathLink: '/report/e/edit/' + w.workId + '/' + headings[i].id}); //personId is headings[i].id
        }
        //Start the row by setting the columns which will then be used to loop through the chapters and accumulate the counts
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            row = [{
                headingId: 0,
                value: c.name.length > 25 ? c.name.substring(0,25) + '...' : c.name,
                nowrap: true,
            }]
            for(let index = 0; index < labels.length; index++) {
                row = row.concat({ headingId: ids[index], value: 0})
            }
            let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === nativeLanguageId && r.personId === personId)
            reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                for(let index = 0; index < labels.length; index++) {
                    if (!isNaN(e[ids[index]])) {
                        row[Number(index)+Number(1)].value = e[ids[index]]
                    }
                }
            })
            data.push(row)
        })
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectEditWorkEditorsCounts = (state, workId) => {
    //Table headers:  Edit count types
    //row left column: names of the editors
    let workName = ""
    state.forEach(w => {if (w.workId === workId) workName = w.workName})
    workName = workName.length > 40 ? workName.substring(0,40) + '...' : workName

    let headings = [
        { id: '0', label: 'Editors', tightText: true, upperHeader: workName },   //The first label is the top left which is header for the list of works.
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

    let data = []
    let work = state && state.length > 0 && state.filter(m => m.workId === workId)
    let editors = []

    work && work.length > 0 && work.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === nativeLanguageId); //id is the personId
            reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                let option = {headingId : e.personId, value: e.firstName, pathLink: '/report/e/edit/' + w.workId + '/' + e.personId + '/sections'}
                let alreadyIncluded = false
                editors.forEach(o => {
                    if (o.headingId === e.personId) {
                        alreadyIncluded = true
                    }
                })
                if (!alreadyIncluded && e.firstName) {
                    editors.push(option)
                }
            })
        })
    })

    //Be sure to add on the counts for each section, if there are more than one sections.  Otherwise, there are additional rows concatenated to the right on teh report.
    editors.forEach(editor => {
        let row = [editor]
        let hasRowAlready = false
        work && work.length > 0 && work.forEach(w => {
            let nativeLanguageId = w.languageId
            w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === nativeLanguageId && r.personId === editor.headingId); //headingId is the personId
                reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                    for(let i = 0; i < ids.length; i++) {
                        if (hasRowAlready) {
                            for(let rowIndex = 0; rowIndex < row.length; rowIndex++) {
                                if (row[rowIndex].headingId === ids[i] && !isNaN(e[ids[i]])) {
                                    row[rowIndex].value += e[ids[i]]
                                }
                            }
                        } else {
                            row = row.concat({headingId: ids[i], value: !isNaN(e[ids[i]]) ? e[ids[i]] : 0})
                        }
                    }
                    hasRowAlready = true
                })
            })
        })
        data.push(row)
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

//******** TRANSLATION FUNCTION *********//
//These function names do not have 'translate' in them since they are quite long already.

export const selectWorksLangsEditorsOneCount = (state, editTypeCount, languageList) => {
    //Table header:  languages
    //Row Left column:  Work names
    editTypeCount = editTypeCount ? editTypeCount : 'transCompletePercent'
    let headings = [{ id: 0, label: 'Documents', tightText: true, upperHeader: 'Actions by each translator'}];  //The first label is the top left which is header for the list of works.
    state && state.length > 0 && state.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId !== nativeLanguageId) {
                    let option = {
                        id : e.languageId,
                        label: languageList.filter(l => l.id === e.languageId)[0].label,
                        pathLink: '/report/t/translate/works/' + e.languageId,
                        verticalText: true
                    }
                    let alreadyIncluded = false
                    headings.forEach(o => {
                        if (o.id === e.languageId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.languageId) {
                        headings.push(option)
                    }
                }
            })
        })
    })

    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = []
        row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: w.workId,
            value: w.workName.length > 35 ? w.workName.substring(0,35) + '...' : w.workName,
            pathLink: '/report/t/translate/' + w.workId
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //languageId is headings[i].id
        }
        data.push(row)
    })

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) { //Work by rowIndex
        for(let colIndex = 1; colIndex < headings.length; colIndex++) { //language (languageId) by column Index (colIndex)
            let editCounts = 0
            //workId is data[rowIndex][0].headingId
            let work = state.filter(w => w.workId === data[rowIndex][0].headingId); //eslint-disable-line
            work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
                w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                    let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === headings[colIndex].id)
                    reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                        if (!isNaN(e[editTypeCount])) {
                            editCounts += e[editTypeCount]; //editTypeCount is a parameter to set the single count edit type:  edits, comments, upVotes, etc.
                        }
                    })
                })
                editCounts = editTypeCount === "wordCount"
                            ? w.wordCount
                            : editTypeCount === "sentenceCount"
                                ? w.sentenceCount
                                : editTypeCount === "transInProcessPercent" || editTypeCount === "transCompletePercent"
                                    ? editCounts + '%'
                                    : editCounts
                data[rowIndex][colIndex].value = editCounts
                data[rowIndex][colIndex].pathLink = '/report/t/translate/' + w.workId + '/' + headings[colIndex].id
            })
        }
    }

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorksLangEditorsOneCount = (state, languageId, editTypeCount, languageList) => {
    //Table header:  Editor first names
    //Row Left column:  Work names
    editTypeCount = editTypeCount ? editTypeCount : 'transCompletePercent'
    let languageName = languageList.filter(l => l.id === Number(languageId))[0].label

    let headings = [{ id: 0, label: 'Documents', subLabel: languageName, tightText: true, upperHeader: 'Actions by each translator'}];  //The first label is the top left which is header for the list of works.
    state && state.length > 0 && state.forEach(w => {
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId === Number(languageId)) {
                    let option = {
                        id : e.personId,
                        label: e.firstName,
                        pathLink: '/report/t/translate/works/' + languageId + '/' + e.personId,
                        verticalText: true
                    }
                    let alreadyIncluded = false
                    headings.forEach(o => {
                        if (o.id === e.personId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.firstName) {
                        headings.push(option)
                    }
                }
            })
        })
    })
    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = []
        row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: 0,
            value: w.workName.length > 35 ? w.workName.substring(0,35) + '...' : w.workName,
            pathLink: '/report/t/translate/' + w.workId + '/' + languageId,
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //personId is headings[i].id
        }
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                row = row.map(r => {
                    if (e.personId && r.headingId === e.personId && e.languageId === Number(languageId)) {
                        if (!isNaN(e[editTypeCount])) {
                            r.value += e[editTypeCount]; //editTypeCount is a parameter to set the single count edit type:  edits, comments, upVotes, etc.
                        }
                        r.value = editTypeCount === "wordCount"
                                    ? w.wordCount
                                    : editTypeCount === "sentenceCount"
                                        ? w.sentenceCount
                                        : editTypeCount === "transInProcessPercent" || editTypeCount === "transCompletePercent"
                                            ? r.value + '%'
                                            : r.value
                        r.pathLink = '/report/t/translate/' + w.workId + '/' + e.languageId + '/' + e.personId + '/sections'
                    }
                    return r
                })
            })
        })
        data.push(row)
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorksLangsEditorOneCount = (state, personId, editTypeCount, languageList) => {
    //Table header:  languages
    //Row Left column:  Work names
    editTypeCount = editTypeCount ? editTypeCount : 'transCompletePercent'
    let personName = ""
    state.forEach(w => w.reportChapters.forEach(c =>
        c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
            if (e.personId === personId && e.firstName) personName = e.firstName + ' ' + e.lastName
        })
    ))

    let headings = [{ id: 0, label: 'Documents', subLabel: personName, tightText: true, upperHeader: 'Translation counts'}];  //The first label is the top left which is header for the list of works.

    state && state.length > 0 && state.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId !== nativeLanguageId && e.personId === personId) {
                    let option = {
                        id : e.languageId,
                        label: languageList.filter(l => l.id === e.languageId)[0].label,
                        pathLink: '/report/t/translate/works/' + e.languageId + '/' + personId,
                        verticalText: true
                    }
                    let alreadyIncluded = false
                    headings.forEach(o => {
                        if (o.id === e.languageId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.languageId) {
                        headings.push(option)
                    }
                }
            })
        })
    })

    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = []
        row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: w.workId,
            value: w.workName.length > 35 ? w.workName.substring(0,35) + '...' : w.workName,
            pathLink: '/report/t/translate/' + w.workId
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //languageId is headings[i].id
        }
        data.push(row)
    })

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) { //Work by rowIndex
        for(let colIndex = 1; colIndex < headings.length; colIndex++) { //language (languageId) by column Index (colIndex)
            let editCounts = 0
            //workId is data[rowIndex][0].headingId
            let work = state.filter(w => w.workId === data[rowIndex][0].headingId); //eslint-disable-line
            work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
                w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                    let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === headings[colIndex].id && r.personId === personId)
                    reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                        if (!isNaN(e[editTypeCount])) {
                            editCounts += e[editTypeCount]; //editTypeCount is a parameter to set the single count edit type:  edits, comments, upVotes, etc.
                        }
                    })
                })
                editCounts = editTypeCount === "wordCount"
                            ? w.wordCount
                            : editTypeCount === "sentenceCount"
                                ? w.sentenceCount
                                : editTypeCount === "transInProcessPercent" || editTypeCount === "transCompletePercent"
                                    ? editCounts + '%'
                                    : editCounts
                data[rowIndex][colIndex].value = editCounts
                data[rowIndex][colIndex].pathLink = '/report/t/translate/' + w.workId + '/' + headings[colIndex].id + '/' + personId
            })
        }
    }

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorkLangsEditorCounts = (state, workId, personId, languageList) => {
    //Table header:  edit type counts
    //Row Left column:  Language names
    let personName = ""
    state.forEach(w => w.reportChapters.forEach(c =>
        c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
            if (e.personId === personId && e.firstName) personName = e.firstName + ' ' + e.lastName
        })
    ))
    let workName = ""
    state.forEach(w => {if (w.workId === workId) workName = w.workName})
    workName = workName.length > 25 ? workName.substring(0,25) + '...' : workName

    let headings = [
        { id: '0', label: 'Languages', subLabel: workName, tightText: true, upperHeader: 'Edits by ' + [personName]},   //The first label is the top left which is header for the list of works.
    ]

    let ids = Object.keys(transCounts); //See the transCounts object above.
    let labels = Object.values(transCounts)
    for(let i = 0; i < ids.length; i++) {
        headings = headings.concat({
            id: ids[i],
            label: labels[i],
            verticalText: true,
        })
    }

    let data = []

    //Get the language names first followed by the edits
    let work = state && state.length > 0 && state.filter(m => m.workId === workId)
    work && work.length > 0 && work.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId !== nativeLanguageId && e.personId === personId) {
                    let row = [{
                        headingId: e.languageId,
                        languageId: e.languageId,
                        value: languageList.filter(l => l.id === e.languageId)[0].label,
                        pathLink: '/report/t/translate/' + workId + '/' + e.languageId + '/' + personId + '/sections',
                    }]

                    let alreadyIncluded = false
                    data.forEach(d => {
                        if (d[0].headingId === e.languageId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.languageId) {
                        for(let i = 0; i < ids.length; i++) {
                            row = row.concat({
                                headingId: ids[i],
                                value: 0, //This is the accummulator for the edit type counts.
                                verticalText: true,
                            })
                        }
                        data.push(row)
                    }
                }
            })
        })
    })

    //And now add the counts by matching up the language.
    work = state && state.length > 0 && state.filter(m => m.workId === workId)

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
            w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === data[rowIndex][0].languageId && r.personId === personId)
                reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                    for(let index = 0; index < labels.length; index++) {
                        if (!isNaN(e[ids[index]])) {
                            data[rowIndex][Number(index)+Number(1)].value += e[ids[index]];  //Help here?  [rowIndex]?
                        }
                    }
                })
            })
        })
    }
    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorkLangsEditorsOneCount = (state, workId, editTypeCount, languageList) => {
    //Table header:  Editor first names
    //Row Left column:  Language names
    editTypeCount = editTypeCount ? editTypeCount : 'transCompletePercent'
    let workName = ""
    state.forEach(w => {if (w.workId === workId) workName = w.workName})
    workName = workName.length > 25 ? workName.substring(0,25) + '...' : workName

    let headings = [{ id: 0, label: 'Languages', tightText: true, upperHeader: 'Actions by each translator', subUpperHeader: workName }];  //The first label is the top left which is header for the list of works.

    let work = state && state.length > 0 && state.filter(m => m.workId === workId)
    work && work.length > 0 && work.forEach(w => {
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                let option = {
                    id : e.personId,
                    label: e.firstName,
                    pathLink: '/report/t/translate/' + workId + '/languages/' + e.personId,
                    verticalText: true
                }
                let alreadyIncluded = false
                headings.forEach(o => {
                    if (o.id === e.personId) {
                        alreadyIncluded = true
                    }
                })
                if (!alreadyIncluded && e.firstName) {
                    headings.push(option)
                }
            })
        })
    })
    let data = []

    work = state && state.length > 0 && state.filter(m => m.workId === workId)
    work && work.length > 0 && work.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId !== nativeLanguageId) {
                    let row = [{
                        headingId: e.languageId,
                        languageId: e.languageId,
                        value: languageList.filter(l => l.id === e.languageId)[0].label,
                        pathLink: '/report/t/translate/' + workId + '/' + e.languageId,
                    }]

                    let alreadyIncluded = false
                    data.forEach(d => {
                        if (d[0].headingId === e.languageId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.languageId) {
                        for(let i = 1; i < headings.length; i++) {
                            row = row.concat({
                                headingId: headings[i].id,
                                value: 0, //This is the accummulator for the edit type counts.
                            })
                        }
                        data.push(row)
                    }
                }
            })
        })
    })

    //And now add the editTypeCount by matching up the personId.
    work = state && state.length > 0 && state.filter(m => m.workId === workId);//eslint-disable-line

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) { //language by rowIndex
        for(let colIndex = 1; colIndex < headings.length; colIndex++) { //editor (personId) by column Index (colIndex)
            work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
                w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                    let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === data[rowIndex][0].languageId && r.personId === headings[colIndex].id); //headings[colIndex].id is the personId
                    reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                        data[rowIndex][colIndex].value += e[editTypeCount]
                    })
                })
                data[rowIndex][colIndex].value = editTypeCount === "wordCount"
                            ? w.wordCount
                            : editTypeCount === "sentenceCount"
                                ? w.sentenceCount
                                : editTypeCount === "transInProcessPercent" || editTypeCount === "transCompletePercent"
                                    ? data[rowIndex][colIndex].value + '%'
                                    : data[rowIndex][colIndex].value
            })
        }
    }
    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorkLangEditorsCounts = (state, workId, languageId, languageList) => {
    //Table header:  Edit type counts
    //Row Left column:  Editor first names
    if (!languageList || languageList.length === 0) {
        return
    }
    let workName = ""
    state.forEach(w => {if (w.workId === workId) workName = w.workName})
    workName = workName.length > 40 ? workName.substring(0,40) + '...' : workName

    let languageName = languageList.filter(l => l.id === Number(languageId))[0].label

    let headings = [
        { id: '0', label: 'Editors', upperHeader: workName, subUpperHeader: '(' + languageName + ')', tightText: true },   //The first label is the top left which is header for the list of works.
    ]

    let ids = Object.keys(transCounts); //See the transCounts object above.
    let labels = Object.values(transCounts)
    for(let i = 0; i < ids.length; i++) {
        headings = headings.concat({
            id: ids[i],
            label: labels[i],
            verticalText: true,
        })
    }

    let data = []
    let work = state && state.length > 0 && state.filter(m => m.workId === workId)
    let editors = []

    work && work.length > 0 && work.forEach(w => {
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === Number(languageId)); //id is the personId
            reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                let option = {headingId : e.personId, value: e.firstName, pathLink: '/report/t/translate/' + w.workId + '/' + e.languageId + '/' + e.personId + '/sections'}
                let alreadyIncluded = false
                editors.forEach(o => {
                    if (o.headingId === e.personId) {
                        alreadyIncluded = true
                    }
                })
                if (!alreadyIncluded && e.firstName) {
                    editors.push(option)
                }
            })
        })
    })

    editors.forEach(editor => {
        let row = [editor]
        work && work.length > 0 && work.forEach(w => {
            w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === Number(languageId) && r.personId === editor.headingId); //headingId is the personId
                reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                    for(let i = 0; i < ids.length; i++) {
                        row = row.concat({headingId: ids[i], value: e[ids[i]]})
                    }
                })
            })
        })
        data.push(row)
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorkLangEditorSectionsCounts = (state, workId, languageId, personId, languageList) => {
    //Table header:  Edit type counts
    //Row Left column:  Chapter/section names
    let personName = ""
    state && state.length > 0 && state.forEach(w => w.reportChapters.forEach(c =>
        c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e =>
            {
                if (e.personId === personId && e.firstName)
                    personName = e.firstName + ' ' + e.lastName
            })
        )
    )

    let workName = ""
    state.forEach(w => {if (w.workId === workId) workName = w.workName})
    workName = workName.length > 25 ? workName.substring(0,25) + '...' : workName

    let languageName = languageList.filter(l => l.id === Number(languageId))[0].label

    let headings = [ //This first label is the top left which is header for the list of works.
        {
            id: '0',
            label: 'Sections/Chapters',
            upperHeader: 'Edits by ' + personName,
            subUpperHeader: workName + ' (' + languageName + ')',
            tightText: true,
        },
    ]

    let ids = Object.keys(transCounts); //See the transCounts object above.
    let labels = Object.values(transCounts)
    for(let i = 0; i < ids.length; i++) {
        headings = headings.concat({
            id: ids[i],
            label: labels[i],
            verticalText: true,
        })
    }

    let data = []
    let work = state && state.length > 0 && state.filter(m => m.workId === workId)

    work && work.length > 0 && work.forEach(w => {
        let row = []
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0, pathLink: '/report/t/translate/' + w.workId + '/' + headings[i].id}); //personId is headings[i].id
        }
        //Start the row by setting the columns which will then be used to loop through the chapters and accumulate the counts
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            row = [{
                headingId: 0,
                value: c.name.length > 25 ? c.name.substring(0,25) + '...' : c.name,
                nowrap: true,
            }]
            for(let index = 0; index < labels.length; index++) {
                row = row.concat({
                    headingId: ids[index],
                    value: ids[index] === 'wordCount' ? c.wordCount : ids[index] === 'sentenceCount' ? c.sentenceCount : 0 })
            }
            let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === Number(languageId) && r.personId === personId)
            reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                for(let index = 0; index < labels.length; index++) {
                    //if (!isNaN(e[ids[index]])) {
                        row[Number(index)+Number(1)].value = e[ids[index]]
                    //}
                }
            })
            data.push(row)
        })
    })

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}

export const selectWorksLangsCountEditors = (state, languageList) => {
    //Table header:  languages
    //Row Left column:  Work names
    //The count number is the number of editors for that work and languages
    let headings = [{ id: 0, label: 'Documents', upperHeader: 'Editors by language and document', tightText: true,}];  //The first label is the top left which is header for the list of works.
    state && state.length > 0 && state.forEach(w => {
        let nativeLanguageId = w.languageId
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                if (e.languageId !== nativeLanguageId) {
                    let option = {
                        id : e.languageId,
                        languageId : e.languageId,
                        label: languageList.filter(l => l.id === e.languageId)[0].label,
                        pathLink: '/report/t/translate/works/' + e.languageId,
                        verticalText: true
                    }
                    let alreadyIncluded = false
                    headings.forEach(o => {
                        if (o.id === e.languageId) {
                            alreadyIncluded = true
                        }
                    })
                    if (!alreadyIncluded && e.languageId) {
                        headings.push(option)
                    }
                }
            })
        })
    })

    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: w.workId,
            value: w.workName.length > 35 ? w.workName.substring(0,35) + '...' : w.workName,
            pathLink: '/report/t/translate/' + w.workId
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //languageId is headings[i].id
        }
        data.push(row)
    })

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) { //language by rowIndex
        for(let colIndex = 1; colIndex < headings.length; colIndex++) { //editor (personId) by column Index (colIndex)
            let editors = []
            let work = state.filter(w => w.workId === data[rowIndex][0].headingId); //eslint-disable-line
            work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
                w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                    let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === headings[colIndex].languageId)
                    reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                        if (editors.indexOf(e.personId) === -1) {
                            editors.push(e.personId)
                        }
                    })
                })
                data[rowIndex][colIndex].value = editors.length
                data[rowIndex][colIndex].pathLink = '/report/t/translate/' + w.workId + '/' + headings[colIndex].languageId
            })
        }
    }

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}

}

export const selectWorksEditorsCountLangs = (state) => {
    //Table header:  Editor first names
    //Row Left column:  Work names
    //The count numbe is the number of languages that the editor is assigned to the work.
    let headings = [{ id: 0, label: 'Documents', upperHeader: 'Total languages translated', subUpperHeader: 'by each editor', tightText: true,}];  //The first label is the top left which is header for the list of works.
    state && state.length > 0 && state.forEach(w => {
        w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
            c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
                let option = {
                    id : e.personId,
                    personId : e.personId,
                    label: e.firstName,
                    pathLink: '/report/t/translate/works/languages/' + e.personId,
                    verticalText: true
                }
                let alreadyIncluded = false
                headings.forEach(o => {
                    if (o.id === e.personId) {
                        alreadyIncluded = true
                    }
                })
                if (!alreadyIncluded && e.firstName) {
                    headings.push(option)
                }
            })
        })
    })

    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: w.workId,
            value: w.workName.length > 35 ? w.workName.substring(0,35) + '...' : w.workName,
            pathLink: '/report/t/translate/' + w.workId
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //languageId is headings[i].id
        }
        data.push(row)
    })

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) { //Editor by rowIndex
        for(let colIndex = 1; colIndex < headings.length; colIndex++) { //language (languageId) by column Index (colIndex)
            let languages = []
            let work = state.filter(w => w.workId === data[rowIndex][0].headingId); //eslint-disable-line
            work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
                let nativeLanguageId = w.languageId
                w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                    let reportEditDetails = c.reportEditDetails.filter(r => r.personId === headings[colIndex].id && r.languageId !== nativeLanguageId)
                    reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                        if (languages.indexOf(e.languageId) === -1) {
                            languages.push(e.languageId)
                        }
                    })
                })
                data[rowIndex][colIndex].value = languages.length
                data[rowIndex][colIndex].pathLink = '/report/t/translate/' + w.workId + '/languages/' + headings[colIndex].id; //headings[colIndex].id is personId
            })
        }
    }

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}


export const selectWorksLangEditorCounts = (state, languageId, personId, languageList) => {
    //Table header:  edit type counts
    //Row Left column:  Work names
    let personName = ""
    state.forEach(w => w.reportChapters.forEach(c =>
        c.reportEditDetails && c.reportEditDetails.length > 0 && c.reportEditDetails.forEach(e => {
            if (e.personId === personId && e.firstName) personName = e.firstName + ' ' + e.lastName
        })
    ))

    let languageName = languageList.filter(l => l.id === Number(languageId))[0].label

    let headings = [
        { id: '0', label: 'Documents', upperHeader: 'Edits by ' + [personName], subUpperHeader: languageName, tightText: true,},   //The first label is the top left which is header for the list of works.
    ]

    let ids = Object.keys(transCounts); //See the transCounts object above.
    let labels = Object.values(transCounts)
    for(let i = 0; i < ids.length; i++) {
        headings = headings.concat({
            id: ids[i],
            label: labels[i],
            verticalText: true,
        })
    }

    let data = []

    state && state.length > 0 && state.forEach(w => {
        let row = []
        row = [{   //The first cell on the left is the work which will link to the work report.
            headingId: w.workId,
            value: w.workName.length > 25 ? w.workName.substring(0,25) + '...' : w.workName,
            pathLink: '/report/t/translate/' + w.workId + '/' + languageId,
            nowrap: true,
        }]
        for(let i = 1; i < headings.length; i++) { //Notice that we start with 1 and not 0 since we picked up that up above for the work record.
            row = row.concat({headingId: headings[i].id, value: 0}); //languageId is headings[i].id
        }
        data.push(row)
    })

    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) { //Work by rowIndex
        for(let colIndex = 1; colIndex < headings.length; colIndex++) { //language (languageId) by column Index (colIndex)
            //workId is data[rowIndex][0].headingId
            let work = state.filter(w => w.workId === data[rowIndex][0].headingId); //eslint-disable-line
            work && work.length > 0 && work.forEach(w => {  //eslint-disable-line
                w.reportChapters && w.reportChapters.length > 0 && w.reportChapters.forEach(c => {
                    let reportEditDetails = c.reportEditDetails.filter(r => r.languageId === Number(languageId) && r.personId === personId)
                    reportEditDetails && reportEditDetails.length > 0 && reportEditDetails.forEach(e => {
                        for(let index = 0; index < labels.length; index++) {
                            if (!isNaN(e[ids[index]])) {
                                data[rowIndex][Number(index)+Number(1)].value = e[ids[index]]
                                data[rowIndex][Number(index)+Number(1)].pathLink = '/report/t/translate/' + w.workId + '/' + languageId + '/' + personId + '/sections'
                            }
                        }
                    })
                })
            })
        }
    }

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data}
}
