import { useEffect } from 'react'
import RegStudentView from '../views/RegStudentView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionRegStudents from '../actions/reg-student'
import * as actionRegistrationCourses from '../actions/registration-courses'
import * as actionCountries from '../actions/countries'
import * as actionUSStates from '../actions/us-states'
import * as actionMaritalStatus from '../actions/marital-status'
import * as actionGender from '../actions/gender'
import * as actionGradeLevel from '../actions/grade-level'
import * as actionLanguageList from '../actions/language-list'
import * as actionHowLearnOfUs from '../actions/how-learn-of-us'
import * as actionIntervals from '../actions/semester-intervals'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectRegistration, selectGender, selectCountries, selectUSStates, selectGradeLevels, selectLanguageList, selectPersonConfig,
 					selectHowLearnOfUsList, selectRegistrationCourses, selectIntervals, selectCompanyConfig} from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let registration = selectRegistration(state)

		//This is part of the coordinated auto-save.  If the params.studentPersonId is 0 and not a 36-character string that would most likely be a guid, then we will pick up the last
		//	students entered.  The back end retrieves the students in order of entry so that the last one in the list is the latest, which is the one we are picking up here.
		let studentPersonId = props.params && props.params.studentPersonId
		let pickUpLast = props.params && props.params.pickUpLast
		if (pickUpLast && registration.students && registration.students.length > 0) {
				studentPersonId = registration.students[registration.students.length-1].personData.personId
		}
		let students = registration && registration.students
		let student = {}
		if (students && students.length > 0) {
				student = students.filter(m => m.personData.personId === studentPersonId)[0]
		}
		let personConfig = selectPersonConfig(state)

    return {
				registration,
				langCode: me.langCode,
        personId: me.personId,
				studentPersonId,
        personEntry: student && student.personData,
        peopleApprovedToPickup: student && student.peopleApprovedToPickup,
				accreditation: student && student.accreditation,
				medical: student && student.medical,
				background: student && student.background,
        races: registration && registration.races,
				vaccinationFiles: student && student.vaccinationFiles,
				birthCertificateFiles: student && student.birthCertificateFiles,
				transcriptFiles: student && student.transcriptFiles,
				courtFiles: student && student.courtFiles,
				genders: selectGender(state),
				countries: selectCountries(state),
				usStates: selectUSStates(state),
				gradeLevels: selectGradeLevels(state),
				languages: selectLanguageList(state),
				howLearnOfUsList: selectHowLearnOfUsList(state),
				registrationCourses: selectRegistrationCourses(state),
				intervals: selectIntervals(state),
				companyConfig: selectCompanyConfig(state),
				schoolYearId: personConfig && personConfig.schoolYearId,
				personConfig,
    }
}

const bindActionsToDispatch = dispatch => ({
    addOrUpdateStudent: (personId, person, accreditation, medical, background, stayOrFinish, schoolYearId) => dispatch(actionRegStudents.addOrUpdateStudent(personId, person, accreditation, medical, background, stayOrFinish, schoolYearId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionLanguageList.getPageLangs(personId, langCode, page)),
		removeStudent: (personId, studentPersonId) => dispatch(actionRegStudents.removeRegStudent(personId, studentPersonId)),
		removeRegStudentFileUpload: (personId, fileUploadId) => dispatch(actionRegStudents.removeRegStudentFileUpload(personId, fileUploadId)),
		getRegistrationCourses: (personId) => dispatch(actionRegistrationCourses.init(personId)),
		setRegistrationCourses: (personId, studentPersonId, registrationTableId, courseRequests) => dispatch(actionRegistrationCourses.setRegistrationCourses(personId, studentPersonId, registrationTableId, courseRequests)),
		getCountries: () => dispatch(actionCountries.init()),
		getUSStates: () => dispatch(actionUSStates.init()),
		getMaritalStatus: (personId) => dispatch(actionMaritalStatus.init(personId)),
		getGender: () => dispatch(actionGender.init()),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		getLanguageList: () => dispatch(actionLanguageList.init()),
		getHowLearnOfUs: () => dispatch(actionHowLearnOfUs.init()),
		getIntervals: (personId)  => dispatch(actionIntervals.init(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getCountries, getUSStates, getGender, getMaritalStatus, getGradeLevels, getLanguageList, getHowLearnOfUs,
    								getIntervals, getRegistrationCourses} = props
            getPageLangs(personId, langCode, 'RegStudentView')
    				getCountries()
    				getUSStates()
    				getMaritalStatus(personId)
    				getGender()
    				getGradeLevels()
    				getLanguageList()
    				getHowLearnOfUs()
    				getIntervals(personId)
    				getRegistrationCourses(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add or Edit Student Registration`})
    		
  }, [])

  return <RegStudentView {...props} />
}

export default Container
