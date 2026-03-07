import { useEffect } from 'react'
import DoctorInviteLoginView from '../views/DoctorInviteLoginView'
import { useSelector, useDispatch, connect } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionDoctorNoteInvite from '../actions/doctor-note-invite'
import * as actionCompanyConfig from '../actions/company-config'
import * as actionUsStates from '../actions/us-states'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAccessRoles, selectCompanyConfig, selectDoctorNoteInvites, selectUSStates } from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let doctorNoteInviteId = props.params && props.params.doctorNoteInviteId
		let doctorNoteInvites = selectDoctorNoteInvites(state)
		let doctorNoteInvite = doctorNoteInviteId &&  doctorNoteInvites && doctorNoteInvites.length > 0 && doctorNoteInvites.filter(m => m.doctorNoteInviteId === doctorNoteInviteId)[0]

    return {
				loginData: me,
				langCode: me.langCode,
				doctorNoteInvite,
				accessRoles: selectAccessRoles(state),
				doctorNoteInviteId,
				companyConfig: selectCompanyConfig(state),
				usStates: selectUSStates(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getCompanyConfig: (personId, schoolCode, doctorNoteInviteId) => dispatch(actionCompanyConfig.init(personId, schoolCode, doctorNoteInviteId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getDoctorNoteInvites: (personId) => dispatch(actionDoctorNoteInvite.getDoctorNoteInvites(personId)),
		setDoctorNoteInviteIdLogin: (doctorNoteInviteId) => dispatch(actionDoctorNoteInvite.setDoctorNoteInviteIdLogin(doctorNoteInviteId)),
		loginDoctorOffice: (office, doctorNoteInviteId) => dispatch(actionDoctorNoteInvite.loginDoctorOffice(office, doctorNoteInviteId)),
		getUsStates: () => dispatch(actionUsStates.init()),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})



function HomeContainer(props) {
  useEffect(() => {
    
    				const {getPageLangs, langCode, setMyVisitedPage, getCompanyConfig, getDoctorNoteInvites, loginData, doctorNoteInviteId, setDoctorNoteInviteIdLogin, getUsStates} = props
    				getPageLangs(personId, langCode, 'DoctorInviteLoginView')
    				getCompanyConfig(loginData && loginData.personId, '', doctorNoteInviteId)
    				getDoctorNoteInvites(loginData && loginData.personId, doctorNoteInviteId)
    				setDoctorNoteInviteIdLogin(doctorNoteInviteId)
    				getUsStates()
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Doctor Invite Login`})
    		
  }, [])

  return <DoctorInviteLoginView {...props} />
}

export default connect(mapStateToProps, bindActionsToDispatch)(HomeContainer)
