import { useEffect } from 'react'
import AssessmentCorrectSummaryView from '../views/AssessmentCorrectSummaryView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAssessmentCorrectSummary from '../actions/assessment-correct-summary'
import {doSort} from '../utils/sort'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAssessmentCorrectSummary} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let correctSummary = selectAssessmentCorrectSummary(state)
		let randomPersonId = correctSummary && correctSummary.details && correctSummary.details.length > 0 && correctSummary.details[0].personId
		let assessmentQuestions = []
		let students = []
		if (randomPersonId) {
				assessmentQuestions = correctSummary.details.filter(m => m.personId === randomPersonId)
				students = correctSummary.studentsCompleted
				students = doSort(students, { sortField: 'label', isAsc: true, isNumber: false })
		}
		if (assessmentQuestions && assessmentQuestions.sequence)
				assessmentQuestions = doSort(assessmentQuestions, { sortField: 'sequence', isAsc: true, isNumber: true })

    return {
        personId: me.personId,
        langCode: me.langCode,
				correctSummary,
				correctDetails: correctSummary && correctSummary.details,
				assessmentQuestions,
				students,
				assessmentId: props.params && props.params.assessmentId,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getAssessmentCorrectSummary: (personId, assessmentId) => dispatch(actionAssessmentCorrectSummary.getAssessmentCorrectSummary(personId, assessmentId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, assessmentId, getAssessmentCorrectSummary} = props
    				getPageLangs(personId, langCode, 'AssessmentCorrectSummaryView')
    				getAssessmentCorrectSummary(personId, assessmentId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assessment Correction Summary`})
    		
  }, [])

  return <AssessmentCorrectSummaryView {...props} />
}

export default Container
