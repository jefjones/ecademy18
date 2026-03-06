import { useEffect } from 'react'
import VolunteerTypesView from '../views/VolunteerTypesView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionVolunteerTypes from '../actions/volunteer-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectVolunteerTypes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let volunteerTypes = selectVolunteerTypes(state)
		let sequenceStart = 1
		let sequenceEnd = volunteerTypes && volunteerTypes.length + 1

    let sequences = []
    for(let i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        volunteerTypes,
				sequences,
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    volunteerTypesInit: (personId) => dispatch(actionVolunteerTypes.init(personId)),
    removeVolunteerType: (personId, volunteerTypeId) => dispatch(actionVolunteerTypes.removeVolunteerType(personId, volunteerTypeId)),
    addOrUpdateVolunteerType: (personId, volunteerType) => dispatch(actionVolunteerTypes.addOrUpdateVolunteerType(personId, volunteerType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, volunteerTypesInit, personId} = props
            getPageLangs(personId, langCode, 'VolunteerTypesView')
            volunteerTypesInit(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Volunteer Types`})
        
  }, [])

  return <VolunteerTypesView {...props} />
}

export default Container
