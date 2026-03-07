import { useEffect } from 'react'
import DoctorNoteAddView from '../views/DoctorNoteAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionDoctorNoteAdd from '../actions/doctor-note-add'
import * as actionSchools from '../actions/schools'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectSchools, selectStudents, selectDoctorNoteInvites } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let students = selectStudents(state)
		let doctorNoteInviteId = props.params.doctorNoteInviteId
		let doctorNoteInvites = selectDoctorNoteInvites(state)
		//Don't include distant education students who don't have an attendance record.
		students = students && students.length > 0 && students.filter(m => m.studentType !== 'DE')

		let doctorNoteInvite = doctorNoteInviteId && doctorNoteInvites && doctorNoteInvites.length > 0 && doctorNoteInvites.filter(m => m.doctorNoteInviteId === doctorNoteInviteId)[0]
		let newDoctorNote = doctorNoteInvite && doctorNoteInvite.doctorNoteInviteId
				? {
							companyId: doctorNoteInvite.companyId,
							doctorPersonId: me.personId,
							studentPersonId: doctorNoteInvite.studentPersonId,
							fromDate: doctorNoteInvite.fromDate,
							toDate: doctorNoteInvite.toDate,
					}
				: {}

		let student = doctorNoteInvite && doctorNoteInvite.studentPersonId && students && students.length > 0 && students.filter(m => m.id === doctorNoteInvite.studentPersonId)[0]

    return {
        personId: me.personId,
        langCode: me.langCode,
				schools: selectSchools(state),
				students,
				student,
				newDoctorNote,
				doctorNoteInviteId, //This needs to be sent through so after this new DoctorNote is recorded, the DoctorNoteInvite gets deleted.
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		addOrUpdateDoctorNote: (personId, doctorNote) => dispatch(actionDoctorNoteAdd.addOrUpdateDoctorNote(personId, doctorNote)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeDoctorNoteFileUpload: (personId, fileUploadId) => dispatch(actionDoctorNoteAdd.removeDoctorNoteFileUpload(personId, fileUploadId)),
		getSchools: (personId) => dispatch(actionSchools.getSchools(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getSchools} = props
            getPageLangs(personId, langCode, 'DoctorNoteAddView')
            getSchools(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Doctor Note`})
        
  }, [])

  return <DoctorNoteAddView {...props} />
}

export default Container
