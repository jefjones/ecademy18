import { useEffect } from 'react'
import SchoolContactManagerView from '../views/SchoolContactManagerView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionSchoolContacts from '../actions/school-contact-manager'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionUsStates from '../actions/us-states'
import * as actionPersonConfig from '../actions/person-config'
import { selectMe, selectMyFrequentPlaces, selectSchoolContacts, selectFetchingRecord, selectUSStates, selectPersonConfig } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        schoolContacts: selectSchoolContacts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
        usStates: selectUSStates(state),
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getSchoolContacts: (personId) => dispatch(actionSchoolContacts.getSchoolContacts(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeSchoolContact: (personId, schoolContactId) => dispatch(actionSchoolContacts.removeSchoolContact(personId, schoolContactId)),
    removeSchoolContactFileUpload: (personId, fileUploadId) => dispatch(actionSchoolContacts.removeSchoolContactFileUpload(personId, fileUploadId)),
    addOrUpdateSchoolContact: (personId, schoolContact) => dispatch(actionSchoolContacts.addOrUpdateSchoolContact(personId, schoolContact)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getUsStates: () => dispatch(actionUsStates.init()),
    setPersonConfigChoice: (personId, configKey, value) => dispatch(actionPersonConfig.setPersonConfigChoice(personId, configKey, value)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, getUsStates, setMyVisitedPage, getSchoolContacts, personId} = props
            getPageLangs(personId, langCode, 'SchoolContactManagerView')
            getSchoolContacts(personId)
            getUsStates()
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `School Contact Manager (Jef)`})
        
  }, [])

  return <SchoolContactManagerView {...props} />
}

export default Container
