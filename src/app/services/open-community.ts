import {doSort} from '../utils/sort'

export const filterWorks = (works, filterScratch, personId) => {
    if (!works || works.length === 0) {
        return []
    }

    if (works && filterScratch.searchText) {
        works = works.filter(w => w.title && w.title.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    }

    works = works.filter(w => w.personId === personId)
    works = works.filter(w => !w.completed)

    if (works && filterScratch.dueDateFrom && filterScratch.dueDateTo) {
        works = works.filter(w => w.dueDate >= filterScratch.dueDateFrom && w.dueDate <= filterScratch.dueDateTo)
    } else if (works && filterScratch.dueDateFrom) {
        works = works.filter(w => w.dueDate >= filterScratch.dueDateFrom)
    } else if (works && filterScratch.dueDateTo) {
        works = works.filter(w => w.dueDate <= filterScratch.dueDateTo)
    }

    let sortByHeadings = {
        sortField: filterScratch.orderByChosen,
        isAsc: filterScratch.orderSortChosen === 'asc' ? true : false,
        isNumber: false //None of the options are numbers in this case
    }
    return doSort(works, sortByHeadings)
}

export const filterOpenCommunity = (openCommunity, filterScratch, personId) => {
    if (!openCommunity || openCommunity.length === 0) {
        return []
    }

    //There is only a single nativelanguageId per openCommunity entry record.
    if (filterScratch.nativeLanguageIds && filterScratch.nativeLanguageIds.length > 0) {
        openCommunity = openCommunity.filter(w => filterScratch.nativeLanguageIds.indexOf(w.nativeLanguageId) > -1)
    }

    //There can be many translateLanguageIds openCommunity entry record, so it is necessary to loop through the array.
    if (filterScratch.translateLanguageIds && filterScratch.translateLanguageIds.length > 0) {
        openCommunity = openCommunity.filter(w => {
            let hasMatch = false
            w.translateLanguageIds.forEach(languageId => {
                if (filterScratch.translateLanguageIds.indexOf(languageId) > -1) {
                    hasMatch =  true
                }
            })
            return hasMatch
        })
    }

    if (filterScratch.genreIds && filterScratch.genreIds.length > 0) {
        openCommunity = openCommunity.filter(w => {
            let hasMatch = false
            w.genreIds.forEach(genreId => {
                if (filterScratch.genreIds.indexOf(genreId) > -1) {
                    hasMatch = true
                }
            })
            return hasMatch
        })
    }

    if (filterScratch.dueDateFrom && filterScratch.dueDateTo) {
        openCommunity = openCommunity.filter(w => w.dueDate >= filterScratch.dueDateFrom && w.dueDate <= filterScratch.dueDateTo)
    } else if (filterScratch.dueDateFrom) {
        openCommunity = openCommunity.filter(w => w.dueDate >= filterScratch.dueDateFrom)
    } else if (filterScratch.dueDateTo) {
        openCommunity = openCommunity.filter(w => w.dueDate <= filterScratch.dueDateTo)
    }

    if (filterScratch.wordCountFrom && filterScratch.wordCountTo && filterScratch.wordCountTo <= 10000) { //Anything over 10000 is unlimited for wordCountTo
        openCommunity = openCommunity.filter(w => w.wordCount >= filterScratch.wordCountFrom && w.wordCount <= filterScratch.wordCountTo)
    } else if (filterScratch.wordCountFrom) {
        openCommunity = openCommunity.filter(w => w.wordCount >= filterScratch.wordCountFrom)
    } else if (filterScratch.wordCountTo) {
        openCommunity = openCommunity.filter(w => w.wordCount <= filterScratch.wordCountTo)
    }

    if (filterScratch.searchText) {
        openCommunity = openCommunity.filter(w => w.title && w.title.toLowerCase().indexOf(filterScratch.searchText.toLowerCase()) > -1)
    }

    //There is only a single editSeverityId per openCommunity entry record.
    if (filterScratch.editSeverityIds && filterScratch.editSeverityIds.length > 0) {
        openCommunity = openCommunity.filter(w => filterScratch.editSeverityIds.indexOf(w.editSeverityId) > -1)
    }

    let sortByHeadings = {
        sortField: filterScratch.orderByChosen,
        isAsc: filterScratch.orderSortChosen === 'asc' ? true : false,
        isNumber: false //None of the options are numbers in this case
    }

    return doSort(openCommunity, sortByHeadings)
}

export const getEditorsCountOptions = () => {
    let editorsCountOptions = []
    for(let i = 1; i <= 20; i++) {
        editorsCountOptions = editorsCountOptions && editorsCountOptions.length > 0 ? editorsCountOptions.concat({id: i, label: i}) : [{id: i, label: i}]
    }
    return editorsCountOptions
}


export const getTabEntryCounts = (openCommunityFull, personId, workOptions) => {
    let volunteerCount = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.personId !== personId && !m.hasCommittedOpenCommunity)
    volunteerCount = volunteerCount ? volunteerCount.length : ''

    let committedCount = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.hasCommittedOpenCommunity)
    committedCount = committedCount ? committedCount.length : ''

    let toSubmitCount = workOptions && workOptions.length > 0 && workOptions.length

    let submittedCount = openCommunityFull && openCommunityFull.length > 0 && openCommunityFull.filter(m => m.personId === personId)
    submittedCount = submittedCount ? submittedCount.length : ''

    return [ volunteerCount, committedCount, toSubmitCount,submittedCount]
}

export const getTabs =() => {
    return [{
            label: "To Volunteer",
            id: "ToVolunteer",
        },
        {
            label: "Committed",
            id: "Committed",
        },
        {
            label: "To Submit",
            id: "ToSubmit",
        },
        {
            label: "Submitted",
            id: "Submitted",
        }
    ]
}

export const getWordCountOptions = () => {
     let wordCountOptions = [{label: '', value: -1}] //This shouldn't be 0, otherwise the 0 value will throw the logic on the filtering since 0 is falsy.  You could'nt change the filter back to 0 again.
    for (let index = 100; index < 10000; index += 100) {
        wordCountOptions = wordCountOptions.concat({ label: index, value: index})
    }
    wordCountOptions.concat({ label: "> 10,000", value: 10001 })
    return wordCountOptions
}
