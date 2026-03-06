import { useEffect } from 'react'
import StudentAddBulkConfirmView from '../views/StudentAddBulkConfirmView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLearners from '../actions/learners'
import * as actionFileFields from '../actions/file-fields'
import * as reducerfileFields from '../reducers/file-fields'
import { selectMe, selectLearners, selectCompanyConfig, selectFileFields } from '../store'

const mapStateToProps = (state, props) => {
	let me = selectMe(state)
    return {
				personId: me.personId,
				langCode: me.langCode,
        companyConfig: selectCompanyConfig(state),
        learners: selectLearners(state),
				fileFields: selectFileFields(state),
				personConfigEntry: reducerfileFields.selectPersonConfigStudentBulkEntry(state.fileFields),
        studentBulkEntryDetails: reducerfileFields.selectStudentBulkEntryDetails(state.fileFields),
    }
}

const bindActionsToDispatch = dispatch => ({
		getLearners: (personId) => dispatch(actionLearners.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFileFields: () => dispatch(actionFileFields.init()),
		getPersonConfigFileFields: (personId) => dispatch(actionFileFields.getPersonConfigFileFields(personId)),
		getStudentBulkEntryDetails: (personId) => dispatch(actionFileFields.getStudentBulkEntryDetails(personId)),
		processStudentBulkEntry: (personId) => dispatch(actionLearners.processStudentBulkEntry(personId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, getLearners, personId, getFileFields, getPersonConfigFileFields, getStudentBulkEntryDetails} = props
    				getPageLangs(personId, langCode, 'StudentAddBulkConfirmView')
    				getStudentBulkEntryDetails(personId)
    				getLearners(personId)
    				getFileFields()
    				getPersonConfigFileFields(personId)
    		
  }, [])

  return <StudentAddBulkConfirmView {...props} />
}

export default Container
