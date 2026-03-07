import { useEffect } from 'react'
import DoctorNoteInviteView from '../views/DoctorNoteInviteView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionDoctors from '../actions/doctors'
import * as actionDoctorNoteInvite from '../actions/doctor-note-invite'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectStudents, selectDoctors } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				students: selectStudents(state),
        doctors: selectDoctors(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getDoctors: (personId) => dispatch(actionDoctors.getDoctors(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateDoctorNoteInvite: (personId, doctorNoteInvite) => dispatch(actionDoctorNoteInvite.addOrUpdateDoctorNoteInvite(personId, doctorNoteInvite)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getDoctors, personId} = props
            getPageLangs(personId, langCode, 'DoctorNoteInviteView')
            getDoctors(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Doctor Note Invite`})
        
  }, [])

  return <DoctorNoteInviteView {...props} />
}

export default Container
