import { useEffect } from 'react'
import AssessmentCorrectSameAllView from '../views/AssessmentCorrectSameAllView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import {doSort} from '../utils/sort'
import * as actionAssessmentCorrect from '../actions/assessment-correct'
import * as actionAssessmentQuestions from '../actions/assessment-questions'
import * as actionAssessment from '../actions/assessment'
import * as actionPenspringTransfer from '../actions/penspring-transfer'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAssessmentQuestions, selectAssessment, selectAssessmentCorrectSameAllStudents, selectStudents, selectAccessRoles,
 					selectFetchingRecord, selectCoursesBase } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let courses = selectCoursesBase(state)
		let students = selectStudents(state)
		let assessmentCorrectSameAllStudents = selectAssessmentCorrectSameAllStudents(state)
		students = assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.studentsCompleted && assessmentCorrectSameAllStudents.studentsCompleted.length > 0
				? students.length > 0 && students.filter(m => {
							let foundStudent = false
							assessmentCorrectSameAllStudents.studentsCompleted && assessmentCorrectSameAllStudents.studentsCompleted.length > 0 && assessmentCorrectSameAllStudents.studentsCompleted.forEach(s => {
									if (m.id === s.id) foundStudent = true
							})
							return foundStudent
					})
				: []
		let course = {}
		let assessment = selectAssessment(state)
		if (assessment && assessment.courseEntryId) course = courses && courses.length > 0 && courses.filter(m => m.courseEntryId === assessment.courseEntryId)[0]
		let assessmentQuestions = selectAssessmentQuestions(state)
		assessmentQuestions = assessmentQuestions && assessmentQuestions.length > 0 && assessmentQuestions.map(m =>
				({
						...m,
						id: m.assessmentQuestionId,
						label: m.sequence + '. - ' + m.questionText,
						assessmentQuestionId: m.assessmentQuestionId,
						questionText: m.questionText,
				})
		)
		assessmentQuestions = doSort(assessmentQuestions, { sortField: 'sequence', isAsc: true, isNumber: true })

		let correctionTypeFilter = [{
				label: 'All',
				id: 'all',
			},
			{
				label: 'Pending essays',
				id: 'pendingEssays',
			},
			{
				label: 'Wrong answers',
				id: 'wrongAnswers',
			},
			{
				label: 'Correct answer',
				id: 'correctAnswers',
			},
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				assignmentId: props.params.assignmentId,
				correctionTypeFilter,
        accessRoles: selectAccessRoles(state),
        learnerFullName: me.fname + ' ' + me.lname,
        assessmentQuestionId: (props.params && props.params.assessmentQuestionId) || '',
        assessmentId: props.params && props.params.assessmentId,
        students,
				assessment,
				course,
				assessmentQuestions,
        assessmentCorrectSameAllStudents: assessmentCorrectSameAllStudents && assessmentCorrectSameAllStudents.details,
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getAssessment: (personId, assessmentId) => dispatch(actionAssessment.getAssessment(personId, assessmentId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		assessmentQuestionsInit: (personId, studentPersonId, assessmentId, assignmentId) => dispatch(actionAssessmentQuestions.init(personId, studentPersonId, assessmentId, assignmentId)),
    getCorrectedAssessment: (personId, studentPersonId, assessmentId, assignmentId) => dispatch(actionAssessmentCorrect.getCorrectedAssessment(personId, studentPersonId, assessmentId, assignmentId)),
		retakeTest: (personId, assignmentId, assessmentId) => dispatch(actionAssessmentCorrect.retakeTest(personId, assignmentId, assessmentId)),
		teacherEssayResponse: (personId, teacherResponse) => dispatch(actionAssessmentCorrect.teacherEssayResponse(personId, teacherResponse)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		getSameCorrectedAssessmentAllStudents: (personId, assessmentId, assessmentQuestionId) => dispatch(actionAssessmentCorrect.getSameCorrectedAssessmentAllStudents(personId, assessmentId, assessmentQuestionId)),
		updateTeacherAssessmentLearnerAnswer: (personId, studentPersonId, assessmentQuestionId, score, assignmentId) => dispatch(actionAssessmentQuestions.updateTeacherAssessmentLearnerAnswer(personId, studentPersonId, assessmentQuestionId, score, assignmentId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, getSameCorrectedAssessmentAllStudents, studentPersonId, assessmentId, assessmentQuestionId, assessmentQuestionsInit,
    								setMyVisitedPage, getAssessment, assignmentId} = props
            getPageLangs(personId, langCode, 'AssessmentCorrectSameAllView')
    				getAssessment(personId, assessmentId)
            getSameCorrectedAssessmentAllStudents(personId, assessmentId, assessmentQuestionId)
    				assessmentQuestionsInit(personId, studentPersonId, assessmentId, assignmentId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Correct Same Assessment Question for All Students`})
        
  }, [])

  const {fetchingRecord} = props
  	    return fetchingRecord && !fetchingRecord.assessment  ? <AssessmentCorrectSameAllView {...props} /> : null
}

export default Container
