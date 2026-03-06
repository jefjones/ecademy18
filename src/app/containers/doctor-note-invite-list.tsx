import { useEffect } from 'react'
import DoctorNoteInviteListView from '../views/DoctorNoteInviteListView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionDoctorNoteInvite from '../actions/doctor-note-invite'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {returnDistinctList} from '../utils/javascriptUtils'
import { selectMe, selectFetchingRecord, selectAccessRoles, selectCompanyConfig, selectDoctorNoteInvites } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let doctorNoteInvites = selectDoctorNoteInvites(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				doctorNoteInvites,
				doctorList: returnDistinctList(doctorNoteInvites, 'doctorPersonId', 'doctorOfficeName'),
				doctorEmailAddressList: returnDistinctList(doctorNoteInvites, 'doctorEmailAddress', 'doctorEmailAddress'),
				studentList: returnDistinctList(doctorNoteInvites, 'studentPersonId', 'studentName'),
				fetchingRecord: selectFetchingRecord(state),
				accessRoles: selectAccessRoles(state),
				companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getDoctorNoteInvites: (personId) => dispatch(actionDoctorNoteInvite.getDoctorNoteInvites(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeDoctorNoteInvite: (personId, doctorNoteInviteId) => dispatch(actionDoctorNoteInvite.removeDoctorNoteInvite(personId, doctorNoteInviteId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getDoctorNoteInvites, personId} = props
            getPageLangs(personId, langCode, 'DoctorNoteInviteListView')
            getDoctorNoteInvites(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Doctor Note Invite List`})
        
  }, [])

  return <DoctorNoteInviteListView {...props} />
}

export default Container
