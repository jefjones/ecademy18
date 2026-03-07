import { useEffect } from 'react'
import SemesterIntervalsSettingsView from '../views/SemesterIntervalsSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionIntervals from '../actions/semester-intervals'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectIntervals, selectCoursesScheduled, selectFetchingRecord, selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let intervals = selectIntervals(state)
		let sequenceStart = 1
		let sequenceEnd = intervals && intervals.length + 1

    let sequences = []
    for(let i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }

		let days = []
    for(let i = 1; i <= 31; i++) {
        let option = { id: String(i), label: String(i)}
        days = days ? days.concat(option) : [option]
    }

		let months = [
        {id: 0, label: 'SemesterIntervalsSettingsView'},
				{id: 1, label: 'January'},
				{id: 2, label: 'February'},
				{id: 3, label: 'March'},
				{id: 4, label: 'April'},
				{id: 5, label: 'May'},
				{id: 6, label: 'June'},
				{id: 7, label: 'July'},
				{id: 8, label: 'August'},
				{id: 9, label: 'September'},
				{id: 10, label: 'October'},
				{id: 11, label: 'November'},
				{id: 12, label: 'December'},
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
        intervals,
				sequences,
				days,
				months,
				coursesScheduled: selectCoursesScheduled(state),
				fetchingRecord: selectFetchingRecord(state),
        companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    intervalsInit: (personId) => dispatch(actionIntervals.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeInterval: (personId, intervalId) => dispatch(actionIntervals.removeInterval(personId, intervalId)),
    addOrUpdateInterval: (personId, interval) => dispatch(actionIntervals.addOrUpdateInterval(personId, interval)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, intervalsInit, personId} = props
            getPageLangs(personId, langCode, 'SemesterIntervalsSettingsView')
            intervalsInit(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Semester/Quarter Intervals`})
        
  }, [])

  return <SemesterIntervalsSettingsView {...props} />
}

export default Container
