import { useEffect } from 'react'
import VolunteerHoursView from '../views/VolunteerHoursView'
import {doSort} from '../utils/sort'
import * as actionPageLang from '../actions/language-list'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionVolunteerEvent from '../actions/volunteer-event'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectVolunteerEvents, selectVolunteerTypes, selectStudents, selectGuardians, selectAccessRoles,
 						selectFetchingRecord} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let volunteerEvents = selectVolunteerEvents(state)
		let volunteerList = []
		volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.forEach(m => {
				let foundRecord = false
				volunteerList && volunteerList.length > 0 && volunteerList.forEach(v => {
						if (v.id === m.volunteerPersonId) foundRecord = true
				})
				if (!foundRecord) volunteerList = volunteerList.concat({id: m.volunteerPersonId, label: m.volunteerPersonName})
		})

		volunteerList = doSort(volunteerList, { sortField: 'label', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerEvents,
				volunteerList,
				students: selectStudents(state),
				guardians: selectGuardians(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerEvents: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.getVolunteerEvents(personId, volunteerEventId)),
		addVolunteerEvent: (personId, volunteerEvent) => dispatch(actionVolunteerEvent.addVolunteerEvent(personId, volunteerEvent)),
		confirmVolunteerHour: (personId, adminConfirm) => dispatch(actionVolunteerEvent.confirmVolunteerHour(personId, adminConfirm)),
		removeVolunteerHours: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.removeVolunteerHours(personId, volunteerEventId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getVolunteerEvents} = props
    				getVolunteerEvents(personId)
            getPageLangs(personId, langCode, 'VolunteerHoursView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Volunteer Hours`})
        
  }, [])

  return <VolunteerHoursView {...props} />
}

export default Container
