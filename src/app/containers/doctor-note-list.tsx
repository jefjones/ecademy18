import { useEffect } from 'react'
import DoctorNoteListView from '../views/DoctorNoteListView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionDoctorNote from '../actions/doctor-note-add'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {returnDistinctList} from '../utils/javascriptUtils'
import { selectMe, selectAbsenceUnexcused, selectFetchingRecord, selectAccessRoles, selectCompanyConfig, selectDoctorNotes } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let absenceUnexcused = selectAbsenceUnexcused(state)
		let pendingApproval = props.params && props.params.pendingApproval
		let doctorNotes = selectDoctorNotes(state)

		let doctorList = returnDistinctList(doctorNotes, 'doctorPersonId', 'doctorOfficeName')
		let studentList = returnDistinctList(doctorNotes, 'studentPersonId', 'studentName')

    return {
        personId: me.personId,
        langCode: me.langCode,
        absenceUnexcused,
				doctorList,
				studentList,
				fetchingRecord: selectFetchingRecord(state),
				pendingApproval,
				accessRoles: selectAccessRoles(state),
				companyConfig: selectCompanyConfig(state),
				doctorNotes,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getDoctorNotes: (personId) => dispatch(actionDoctorNote.getDoctorNotes(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeDoctorNote: (personId, doctorNoteId) => dispatch(actionDoctorNote.removeDoctorNote(personId, doctorNoteId)),
		approveDoctorNotes: (personId, selectedDoctorNotes, declineOrApprove, note) => dispatch(actionDoctorNote.approveDoctorNotes(personId, selectedDoctorNotes, declineOrApprove, note)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getDoctorNotes, personId} = props
            getPageLangs(personId, langCode, 'DoctorNoteListView')
            getDoctorNotes(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Doctor Note List`})
        
  }, [])

  return <DoctorNoteListView {...props} />
}

export default Container
