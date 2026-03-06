import { useEffect } from 'react'
import CourseWeightedScoreView from '../views/CourseWeightedScoreView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseWeightedScore from '../actions/course-weighted-score'
import * as actionContentTypes from '../actions/content-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCourseWeightedScore, selectCompanyConfig, selectCoursesBase, selectContentTypes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let courseEntryId = props.params && props.params.courseEntryId
		let courses = selectCoursesBase(state)
		let course = (courseEntryId && courses && courses.length > 0 && courses.filter(m => m.courseEntryId === courseEntryId)[0]) || {}
		let weightedScores = selectCourseWeightedScore(state)
		let contentTypes = selectContentTypes(state)

		// //In case there is not a currently entered weightedScore set of records.
		if (!weightedScores || weightedScores.length === 0) {
				weightedScores = contentTypes && contentTypes.length > 0 && contentTypes.map(m => ({
						contentTypeId: m.id,
						contentTypeName: m.label,
						scorePercent: '',
						courseEntryId,
						blankRecords: true
				}))
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseEntryId,
				course,
				contentTypes,
        weightedScores,
				companyConfig: selectCompanyConfig(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getCourseWeightedScore: (courseEntryId) => dispatch(actionCourseWeightedScore.init(courseEntryId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updateCourseWeightedScores: (personId, courseEntryId, weightedScores) => dispatch(actionCourseWeightedScore.updateCourseWeightedScores(personId, courseEntryId, weightedScores)),
		clearCourseWeightedScores: () => dispatch(actionCourseWeightedScore.clearCourseWeightedScores()),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getCourseWeightedScore, courseEntryId, getContentTypes} = props
            getPageLangs(personId, langCode, 'CourseWeightedScoreView')
            getCourseWeightedScore(courseEntryId)
    				getContentTypes(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Weighted Score`})
        
  }, [])

  return props.courseEntryId ? <CourseWeightedScoreView {...props} /> : null
}

export default Container
