import { useEffect } from 'react'
import BenchmarkTestStudentComparisonView from '../views/BenchmarkTestStudentComparisonView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBenchmarkTextReport from '../actions/benchmark-test-report'
import * as actionBenchmarkTests from '../actions/benchmark-tests'
import * as actionStandardardsRating from '../actions/standards-rating'
import {guidEmpty} from '../utils/guidValidate'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectStandardsRating, selectBenchmarkTestStudentComparison, selectBenchmarkTests, selectAccessRoles} from '../store'

//The difference between the class comparison and the student comparison report is right HERE:  We will split out the various students into their own listed
//	from the TestAssign's ScoredAnswer.
//			Class
//			   testAssign
//						ScoredAnswers (which goes to the StandardsAssignmentResult component for standards circle display)
//
//  which will be converted now to:
//			Class
//			   StudentTest
//			   		TestAssign (in order to list the scored answers to the first test taking, second test taking, third test taking, .... to the last attempt)
//								ScoredAnswers (which goes to the StandardsAssignmentResult component for standards circle display)
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let benchmarkTestStudentComparison = selectBenchmarkTestStudentComparison(state)
		let standardsRatings = selectStandardsRating(state)
		let standardsRatingTableId = ''
		benchmarkTestStudentComparison && benchmarkTestStudentComparison.length > 0 && benchmarkTestStudentComparison.forEach(m => {
				if (m.standardsRatingTableId && m.standardsRatingTableId !== guidEmpty) {
						standardsRatingTableId = m.standardsRatingTableId
				}
		})
		standardsRatings = standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId)

    return {
        personId: me.personId,
        langCode: me.langCode,
				benchmarkTestId: props.params.benchmarkTestId,
				benchmarkTestStudentComparison,
				standardsRatings,
				standardsRatingTableId,
				benchmarkTests: selectBenchmarkTests(state),
				fetchingRecord: selectFetchingRecord(state),
				accessRoles: selectAccessRoles(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getBenchmarkTestStudentComparison: (personId, benchmarkTestId) => dispatch(actionBenchmarkTextReport.getBenchmarkTestStudentComparison(personId, benchmarkTestId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		getStandardsRating: (personId) => dispatch(actionStandardardsRating.getStandardsRating(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getBenchmarkTestStudentComparison, getBenchmarkTests, benchmarkTestId, getStandardsRating} = props
            getPageLangs(personId, langCode, 'BenchmarkTestStudentComparisonView')
    				benchmarkTestId && benchmarkTestId !== guidEmpty && getBenchmarkTestStudentComparison(personId, benchmarkTestId)
    				getBenchmarkTests(personId)
    				getStandardsRating(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Benchmark Test Student Comparison`})
        
  }, [])

  return <BenchmarkTestStudentComparisonView {...props} />
}

export default Container
