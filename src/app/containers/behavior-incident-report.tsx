import { useEffect } from 'react'
import BehaviorIncidentReportView from '../views/BehaviorIncidentReportView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBehaviorIncident from '../actions/behavior-incident'
import * as actionBehaviorIncidentTypes from '../actions/behavior-incident-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectUsers, selectBehaviorIncidentTypes, selectBehaviorIncidentResponseTypes, selectStudents, selectBehaviorIncidents,
 					selectAccessRoles, selectMyFrequentPlaces, selectGradeLevels, selectBehaviorIncidentFilterGroups} from '../store'


const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        behaviorIncidents: selectBehaviorIncidents(state),
				behaviorIncidentTypes: selectBehaviorIncidentTypes(state),
				behaviorIncidentResponseTypes: selectBehaviorIncidentResponseTypes(state),
        filterGroups: selectBehaviorIncidentFilterGroups(state),
        gradeLevels: selectGradeLevels(state),
				students: selectStudents(state),
				facilitators: selectUsers(state, 'Facilitator'),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getBehaviorIncidents: (personId) => dispatch(actionBehaviorIncident.getBehaviorIncidents(personId)),
		getResponseTypes: (personId) => dispatch(actionBehaviorIncidentTypes.getResponseTypes(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeBehaviorIncidentFile: (personId, behaviorIncidentId) => dispatch(actionBehaviorIncident.removeBehaviorIncidentFile(personId, behaviorIncidentId)),
    setBehaviorIncidentEdit: (behaviorIncidentList, behaviorIncidentId, behaviorIncidentTypes) => dispatch(actionBehaviorIncident.setBehaviorIncidentEdit(behaviorIncidentList, behaviorIncidentId, behaviorIncidentTypes)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    addOrUpdateBehaviorIncident: (personId, behaviorIncident) => dispatch(actionBehaviorIncident.addOrUpdateBehaviorIncident(personId, behaviorIncident)),
    getFilterGroups: (personId) => dispatch(actionBehaviorIncident.getFilterGroups(personId)),
		addOrUpdateFilterGroup: (personId, messageGroup) => dispatch(actionBehaviorIncident.addOrUpdateFilterGroup(personId, messageGroup)),
		removeFilterGroup: (personId, messageGroupId) => dispatch(actionBehaviorIncident.removeFilterGroup(personId, messageGroupId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {personId, getBehaviorIncidents, getFilterGroups, getPageLangs, langCode, setMyVisitedPage} = props
            getPageLangs(personId, langCode, 'BehaviorIncidentReportView')
            getFilterGroups(personId)
            getBehaviorIncidents(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Behavior Incident Report`})
        
  }, [])

  return <BehaviorIncidentReportView {...props} />
}

export default Container
