import { useEffect } from 'react'
import AbsenceUnexcusedView from '../views/AbsenceUnexcusedView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAbsenceUnexcused from '../actions/absence-unexcused'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAbsenceUnexcused, selectFetchingRecord, selectAccessRoles, selectCompanyConfig } from '../store'
//import {guidEmpty} from '../utils/guidValidate';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let absenceUnexcused = selectAbsenceUnexcused(state)
		let pendingApproval = props.params && props.params.pendingApproval

    return {
        personId: me.personId,
        langCode: me.langCode,
        absenceUnexcused,
				fetchingRecord: selectFetchingRecord(state),
				pendingApproval,
				accessRoles: selectAccessRoles(state),
				companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getAbsenceUnexcused: (personId, isPendingApproval) => dispatch(actionAbsenceUnexcused.getAbsenceUnexcused(personId, isPendingApproval)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setAbsenceExcused: (personId, absenceUnexcused) => dispatch(actionAbsenceUnexcused.setAbsenceExcused(personId, absenceUnexcused)),
		removeAbsenceExcusedFileUpload: (personId, fileUploadId) => dispatch(actionAbsenceUnexcused.removeAbsenceExcusedFileUpload(personId, fileUploadId)),
		reduxAbsenceExcusedFiles: (fileUploads) => dispatch(actionAbsenceUnexcused.reduxAbsenceExcusedFiles(fileUploads)),
    approveAbsenceExcused: (personId, excusedAbsenceId, declineOrApprove) => dispatch(actionAbsenceUnexcused.approveAbsenceExcused(personId, excusedAbsenceId, declineOrApprove)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
	})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, getAbsenceUnexcused, personId, pendingApproval, setMyVisitedPage} = props
            getPageLangs(personId, langCode, 'AbsenceUnexcusedView')
            getAbsenceUnexcused(personId, pendingApproval)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Unexcused Absences`})
        
  }, [])

  return <AbsenceUnexcusedView {...props} />
}

export default Container
