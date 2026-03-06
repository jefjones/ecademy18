import { useEffect } from 'react'
import VolunteerOpportunitiesView from '../views/VolunteerOpportunitiesView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionVolunteerOpportunity from '../actions/volunteer-opportunity'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectVolunteerOpportunities, selectVolunteerTypes, selectAccessRoles, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let volunteerOpportunities = selectVolunteerOpportunities(state)
		//We need to get a distinct list of volunteers for the drop down list.
		let volunteerList = []
		volunteerOpportunities && volunteerOpportunities.volunteers && volunteerOpportunities.volunteers.length > 0 && volunteerOpportunities.volunteers.forEach(m => {
				let hasRecord = false
				volunteerList && volunteerList.length > 0 && volunteerList.forEach(v => {
						if (v.id === m.id) hasRecord = true
				})
				if (!hasRecord) {
						volunteerList = volunteerList.concat({id: m.id, label: m.label })
				}
		})


    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerOpportunities,
				accessRoles: selectAccessRoles(state),
				volunteerList,
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerOpportunities: (personId) => dispatch(actionVolunteerOpportunity.getVolunteerOpportunities(personId)),
		removeVolunteerOpportunity: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.removeVolunteerOpportunity(personId, volunteerOpportunityId)),
		addVolunteer: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.addVolunteer(personId, volunteerOpportunityId)),
		removeVolunteer: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.removeVolunteer(personId, volunteerOpportunityId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getVolunteerOpportunities} = props
            getPageLangs(personId, langCode, 'VolunteerOpportunitiesView')
    				getVolunteerOpportunities(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Volunteer Opportunities`})
        
  }, [])

  return <VolunteerOpportunitiesView {...props} />
}

export default Container
