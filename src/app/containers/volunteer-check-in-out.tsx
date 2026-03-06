import { useEffect } from 'react'
import VolunteerCheckInOutView from '../views/VolunteerCheckInOutView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionVolunteerEvent from '../actions/volunteer-event'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectVolunteerEvents, selectVolunteerTypes } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let volunteerEvents = selectVolunteerEvents(state)

		let volunteerEventId = props.params && props.params.volunteerEventId
		volunteerEvents = volunteerEventId
				? volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.filter(m => m.volunteerEventId === volunteerEventId)
				: volunteerEvents

    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerEvents,
				volunteerEventId,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerEvents: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.getVolunteerEvents(personId, volunteerEventId)),
		addVolunteerEvent: (personId, volunteerEvent) => dispatch(actionVolunteerEvent.addVolunteerEvent(personId, volunteerEvent)),
		setVolunteerCheckOut: (personId, checkOutDetails) => dispatch(actionVolunteerEvent.setVolunteerCheckOut(personId, checkOutDetails)),
		removeVolunteerHours: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.removeVolunteerHours(personId, volunteerEventId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getVolunteerEvents} = props
    				getVolunteerEvents(personId)
            getPageLangs(personId, langCode, 'VolunteerCheckInOutView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Volunteer check-in/out`})
        
  }, [])

  return <VolunteerCheckInOutView {...props} />
}

export default Container
