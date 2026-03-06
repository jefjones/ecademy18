import { useEffect } from 'react'
import CalendarEventAddView from '../views/CalendarEventAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCalendarEvent from '../actions/calendar-events'
import moment from 'moment'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectUsers, selectMe, selectCompanyConfig, selectAccessRoles } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let durationOptions = []
		let repeatForWeeksOptions = []
		let calendarDateRange = {
				fromDate: props.params && props.params.fromDate,
				toDate: props.params && props.params.toDate,
		}
		let arrayDate = props.params && props.params.scheduleDate && props.params.scheduleDate.split(' ')
    let months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let dateMoment = moment(arrayDate[3] + '-' + months.indexOf(arrayDate[1]) + '-' + arrayDate[2] + ' ' + arrayDate[4], 'YYYY-MM-DD HH:mm:ss')

    for (let i = 5; i < 60; i += 5) {
      	durationOptions.push({ id: i, label: i + ' min'})
    }
    for (let hour = 1; hour <= 10; hour++) {
	      for (let i = 0; i < 60; i += 5) {
		        let hourLabel = hour === 1 ? 'hour' : 'hours'
		        let minLabel = i > 0 ? i + ' min' : ''
		        durationOptions.push({ id: (hour * 60) + i, label: hour + ' ' + hourLabel + '  ' + minLabel})
	      }
    }
		for (let i = 1; i <= 40; i++) {
				repeatForWeeksOptions.push({ id: i, label: i === 1 ? `${i} week` : `${i} weeks`})
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				dateMoment,
				calendarDateRange,
        facilitators: selectUsers(state, 'Facilitator'),
        mentors: selectUsers(state, 'Mentor'),
        durationOptions,
				repeatForWeeksOptions,
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addCalendarEvent: (personId, calendarEvent, calendarDateRange) => dispatch(actionCalendarEvent.addCalendarEvent(personId, calendarEvent, calendarDateRange)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, setMyVisitedPage, personId} = props
          getPageLangs(personId, langCode, 'CalendarEventAddView')
          props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Calendar Event`})
      
  }, [])

  return <CalendarEventAddView {...props} />
}

export default Container
