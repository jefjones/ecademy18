import { useEffect } from 'react'
import StudentAddManualView from '../views/StudentAddManualView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLearners from '../actions/learners'
import * as actionStudent from '../actions/student'
import * as actionGradeLevel from '../actions/grade-level'
import * as loginUser from '../actions/login'
import * as actionPersonConfig from '../actions/person-config'
import * as actionGender from '../actions/gender'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import { selectMe, selectMyFrequentPlaces, selectLearners, selectTheStudent, selectUsers, selectCompanyConfig, selectGradeLevels, selectSchoolYears, selectPersonConfig,
					selectGender } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let student = selectTheStudent(state)
    if (student && student.id) {
        student.studentId = student.externalId
        student.birthDate = student.birthDate.indexOf('T') > -1 ? student.birthDate.substring(0, student.birthDate.indexOf('T')) : student.birthDate
    }

    return {
				loginData: selectMe(state),
				langCode: me.langCode,
        student,
        companyConfig: selectCompanyConfig(state),
        personId: selectMe(state) && selectMe(state).personId,
        existingLearners: selectLearners(state), //Leave this old call since it gets all records for the students when the getStudents gets minimal loginData
        mentors: selectUsers(state, 'Mentor'),
				gradeLevels: selectGradeLevels(state),
				schoolYears: selectSchoolYears(state),
				personConfig: selectPersonConfig(state),
				genders: selectGender(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addLearner: (personId, learners) => dispatch(actionLearners.addLearner(personId, learners)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updateLearner: (personId, learner) => dispatch(actionLearners.updateLearner(personId, learner)),
    removeLearner: (personId, member_personId) => dispatch(actionLearners.removeLearner(personId, member_personId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
		getLearners: (personId) => dispatch(actionLearners.init(personId)), //Leave this old call since it gets all records for the students when the getStudents gets minimal loginData
		getTheStudent: (personId, studentPersonId) => dispatch(actionStudent.getTheStudent(personId, studentPersonId)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		getGender: () => dispatch(actionGender.init()),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, getLearners, getTheStudent, personId, getGradeLevels, getGender, studentPersonId} = props
    				getPageLangs(personId, langCode, 'StudentAddManualView')
    				getGradeLevels()
    				getLearners(personId)
    				getGender()
    				getTheStudent(personId, studentPersonId)
    		
  }, [])

  return <StudentAddManualView {...props} />
}

export default Container
