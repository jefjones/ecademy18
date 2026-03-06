import { useEffect } from 'react'
import FinanceWaiverSchedulesView from '../views/FinanceWaiverSchedulesView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceWaiverSchedules from '../actions/finance-waiver-schedules'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceWaiverSchedules, selectFetchingRecord } from '../store'
import {doSort} from '../utils/sort'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

		let days = []
    for(let i = 1; i <= 31; i++) {
        let option = { id: String(i), label: String(i)}
        days = days ? days.concat(option) : [option]
    }

		let months = [
        {id: 0, label: ''},
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

		let financeWaiverSchedules = selectFinanceWaiverSchedules(state)
		financeWaiverSchedules = doSort(financeWaiverSchedules, { sortField: 'percentWaived', isAsc: false, isNumber: true })

    return {
        personId: me.personId,
        langCode: me.langCode,
				days,
				months,
        financeWaiverSchedules,
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceWaiverSchedules: (personId) => dispatch(actionFinanceWaiverSchedules.getFinanceWaiverSchedules(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceWaiverSchedule: (personId, financeWaiverScheduleId) => dispatch(actionFinanceWaiverSchedules.removeFinanceWaiverSchedule(personId, financeWaiverScheduleId)),
    addOrUpdateFinanceWaiverSchedule: (personId, financeWaiverSchedule) => dispatch(actionFinanceWaiverSchedules.addOrUpdateFinanceWaiverSchedule(personId, financeWaiverSchedule)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getFinanceWaiverSchedules, personId} = props
            getPageLangs(personId, langCode, 'FinanceWaiverSchedulesView')
            getFinanceWaiverSchedules(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Waiver Schedule (Finance)`})
        
  }, [])

  return <FinanceWaiverSchedulesView {...props} />
}

export default Container
