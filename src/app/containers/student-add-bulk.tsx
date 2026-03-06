import { useEffect } from 'react'
import StudentAddBulkView from '../views/StudentAddBulkView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLearners from '../actions/learners'
import * as actionGradeLevel from '../actions/grade-level'
import * as actionFileFields from '../actions/file-fields'
import * as reducerfileFields from '../reducers/file-fields'
import * as actionPersonConfig from '../actions/person-config'
import * as loginUser from '../actions/login'
import { selectMe, selectLearners, selectCompanyConfig, selectGradeLevels, selectFileFields, selectSchoolYears, selectPersonConfig, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let fileFields = selectFileFields(state)
		let fileFieldOptions = fileFields && fileFields.length > 0 && fileFields.reduce((acc, m) => {
				let option = {id: m.fileFieldId, label: m.name}
				return acc ? acc.concat(option) : [option]
		}, [])

		let personConfigEntry = reducerfileFields.selectPersonConfigStudentBulkEntry(state.fileFields)
		let hasRequiredStudentName = false
		personConfigEntry && personConfigEntry.length > 0 && personConfigEntry.forEach(m => {
				fileFields && fileFields.length > 0 && fileFields.forEach(f => {
						if (f.code === 'firstName' || f.code === 'firstNameFirst' || f.code === 'lastNameFirst') {
								if (Number(m.fileFieldId) === Number(f.fileFieldId)) hasRequiredStudentName = true
						}
				})
		})

    return {
				loginData: selectMe(state),
				langCode: me.langCode,
				hasRequiredStudentName,
        companyConfig: selectCompanyConfig(state),
        personId: me.personId,
        learners: selectLearners(state),
				gradeLevels: selectGradeLevels(state),
				fileFieldOptions,
        personConfigEntry,
				schoolYears: selectSchoolYears(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    addLearner: (personId, learners) => dispatch(actionLearners.addLearner(personId, learners)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updateLearner: (personId, learner) => dispatch(actionLearners.updateLearner(personId, learner)),
    removeLearner: (personId, member_personId) => dispatch(actionLearners.removeLearner(personId, member_personId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
		getLearners: (personId) => dispatch(actionLearners.init(personId)),
		getFileFields: () => dispatch(actionFileFields.init()),
		getPersonConfigFileFields: (personId) => dispatch(actionFileFields.getPersonConfigFileFields(personId)),
		setPersonConfigFileFields: (personId, personConfigStudentBulkEntry) => dispatch(actionFileFields.setPersonConfigFileFields(personId, personConfigStudentBulkEntry)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, getLearners, personId, getGradeLevels, getFileFields, getPersonConfigFileFields} = props
    				getPageLangs(personId, langCode, 'StudentAddBulkView')
    				getGradeLevels()
    				getLearners(personId)
    				getFileFields()
    				getPersonConfigFileFields(personId)
    		
  }, [])

  return <StudentAddBulkView {...props} />
}

export default Container
