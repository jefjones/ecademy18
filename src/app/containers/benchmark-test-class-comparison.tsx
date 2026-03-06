import { useEffect } from 'react'
import BenchmarkTestClassComparisonView from '../views/BenchmarkTestClassComparisonView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBenchmarkTextReport from '../actions/benchmark-test-report'
import * as actionBenchmarkTests from '../actions/benchmark-tests'
import * as actionStandardardsRating from '../actions/standards-rating'
import {guidEmpty} from '../utils/guidValidate'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectStandardsRating, selectBenchmarkTestClassComparison, selectBenchmarkTests} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let benchmarkTestClassComparison = selectBenchmarkTestClassComparison(state)
		let standardsRatings = selectStandardsRating(state)
		let standardsRatingTableId = ''
		benchmarkTestClassComparison && benchmarkTestClassComparison.length > 0 && benchmarkTestClassComparison.forEach(m => {
				if (m.standardsRatingTableId && m.standardsRatingTableId !== guidEmpty) {
						standardsRatingTableId = m.standardsRatingTableId
				}
		})
		standardsRatings = standardsRatingTableId && standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId)

    return {
        personId: me.personId,
        langCode: me.langCode,
				benchmarkTestId: props.params.benchmarkTestId,
				benchmarkTestClassComparison,
				standardsRatings,
				standardsRatingTableId,
				benchmarkTests: selectBenchmarkTests(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getBenchmarkTestClassComparison: (personId, benchmarkTestId) => dispatch(actionBenchmarkTextReport.getBenchmarkTestClassComparison(personId, benchmarkTestId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getBenchmarkTests: (personId) => dispatch(actionBenchmarkTests.getBenchmarkTests(personId)),
		getStandardsRating: (personId) => dispatch(actionStandardardsRating.getStandardsRating(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getBenchmarkTestClassComparison, getBenchmarkTests, benchmarkTestId, getStandardsRating} = props
            getPageLangs(personId, langCode, 'BenchmarkTestClassComparisonView')
    				benchmarkTestId && benchmarkTestId !== guidEmpty && getBenchmarkTestClassComparison(personId, benchmarkTestId)
    				getBenchmarkTests(personId)
    				getStandardsRating(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Benchmark Test Class Comparison`})
        
  }, [])

  return <BenchmarkTestClassComparisonView {...props} />
}

export default Container
