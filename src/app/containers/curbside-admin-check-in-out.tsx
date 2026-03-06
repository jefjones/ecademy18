import { useEffect } from 'react'
import CurbsideAdminCheckInOrOutView from '../views/CurbsideAdminCheckInOrOutView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionGuardians from '../actions/guardians'
import * as actionCheckInOrOut from '../actions/curbside-check-in-out'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectStudents, selectCheckInOrOuts, selectGuardians, selectAccessRoles, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        students: selectStudents(state),
				guardians: selectGuardians(state),
				checkInOrOuts: selectCheckInOrOuts(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getCheckInOrOuts: (personId, curbsideCheckInOrOutId) => dispatch(actionCheckInOrOut.getCheckInOrOuts(personId, curbsideCheckInOrOutId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		confirmCheckInOrOut: (personId, adminConfirm) => dispatch(actionCheckInOrOut.confirmCheckInOrOut(personId, adminConfirm)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getCheckInOrOuts, getGuardians} = props
            getPageLangs(personId, langCode, 'CurbsideAdminCheckInOrOutView')
    				getCheckInOrOuts(personId)
    				getGuardians(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Curbside Check-in/out (admin)`})
        
  }, [])

  return <CurbsideAdminCheckInOrOutView {...props} />
}

export default Container
