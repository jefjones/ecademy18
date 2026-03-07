import { useEffect } from 'react'
import AssessmentPendingEssayView from '../views/AssessmentPendingEssayView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAssessmentCorrect from '../actions/assessment-correct'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectStudents, selectAccessRoles, selectFetchingRecord, selectAssessmentPendingEssay } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

		let testTypeFilter = [{
				label: 'All',
				id: 'all',
			},
			{
				label: 'Quiz',
				id: 'QUIZ',
			},
			{
				label: 'Exams',
				id: 'MIDTERM',
			},
			{
				label: 'Final',
				id: 'FINAL',
			},
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				testTypeFilter,
        accessRoles: selectAccessRoles(state),
        studentFullName: me.fname + ' ' + me.lname,
        studentPersonId: props.params && props.params.studentPersonId,
        assessmentId: props.params && props.params.assessmentId,
        students: selectStudents(state),
				fetchingRecord: selectFetchingRecord(state),
				assessmentPendingEssay: selectAssessmentPendingEssay(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getAssessmentsPendingEssay: (personId) => dispatch(actionAssessmentCorrect.getAssessmentsPendingEssay(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getAssessmentsPendingEssay} = props
            getPageLangs(personId, langCode, 'AssessmentPendingEssayView')
    				getAssessmentsPendingEssay(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assessment pending essay`})
        
  }, [])

  return <AssessmentPendingEssayView {...props} />
}

export default Container
