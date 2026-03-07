import { useEffect } from 'react'
import VolunteerOpportunityAddView from '../views/VolunteerOpportunityAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionVolunteerOpportunity from '../actions/volunteer-opportunity'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectVolunteerOpportunities, selectVolunteerTypes } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let volunteerOpportunities = selectVolunteerOpportunities(state)
		let volunteerOpportunityId = props.params && props.params.volunteerOpportunityId
		let volunteerOpportunity = (volunteerOpportunityId && volunteerOpportunities && volunteerOpportunities.length > 0 && volunteerOpportunities.filter(m => m.volunteerOpportunityId === volunteerOpportunityId)[0]) || {}

    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerOpportunity,
				volunteerOpportunityId,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerOpportunities: (personId) => dispatch(actionVolunteerOpportunity.getVolunteerOpportunities(personId)),
		addOrUpdateVolunteerOpportunity: (personId, volunteerOpportunity) => dispatch(actionVolunteerOpportunity.addOrUpdateVolunteerOpportunity(personId, volunteerOpportunity)),
		removeVolunteerOpportunity: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.removeVolunteerOpportunity(personId, volunteerOpportunityId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getVolunteerOpportunities} = props
            getPageLangs(personId, langCode, 'VolunteerOpportunityAddView')
    				getVolunteerOpportunities(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Volunteer Opportunity`})
        
  }, [])

  return <VolunteerOpportunityAddView {...props} />
}

export default Container
