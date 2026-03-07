import { useEffect } from 'react'
import CourseEntryView from '../views/CourseEntryView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseEntry from '../actions/course-entry'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionLearningPathways from '../actions/learning-pathways'
import * as actionFocusAreas from '../actions/learning-focus-areas'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionStandardsRating from '../actions/standards-rating'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionCoursePrerequisites from '../actions/course-prerequisites'
import {doSort} from '../utils/sort'
import { selectLearningPathways, selectLearningFocusAreas, selectCourseTypes, selectMe, selectCoursesBase, selectCompanyConfig, selectGradeLevels,
					selectFetchingRecord, selectMyFrequentPlaces, selectCoursePrerequisites, selectStandardsRating } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let courseEntry = props.params && props.params.courseEntryId && selectCoursesBase(state) && selectCoursesBase(state).filter(m => m.courseEntryId === props.params.courseEntryId)[0]
		let courseGradeLevels = courseEntry && doSort(courseEntry.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true })
		if (courseEntry) {
				courseEntry.fromGradeLevelId = courseGradeLevels && courseGradeLevels.length > 0 && courseGradeLevels[0].gradeLevelId
				courseEntry.toGradeLevelId = courseGradeLevels && courseGradeLevels.length > 0 && courseGradeLevels[courseGradeLevels.length-1*1].gradeLevelId
		}

		let standardsRatings = selectStandardsRating(state)
		let standardsRatingTables = standardsRatings && standardsRatings.length > 0 && standardsRatings.reduce((acc, m) => {
				let alreadyEntered = false
				acc && acc.length > 0 && acc.forEach(g => {
					if (m.standardsRatingTableId === g.id) alreadyEntered = true
				})
				if (!alreadyEntered) {
						let scaleGradeLevels = doSort(m.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true })
						let fromGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[0].name
						let toGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[scaleGradeLevels.length-1*1].name
						let standardsRatingNameChosen = `${m.standardsRatingName} (${fromGradeLevelName} - ${toGradeLevelName})`

						let option = {
								id: m.standardsRatingTableId,
								label: standardsRatingNameChosen
						}
						acc = acc ? acc.concat(option) : [option]
				}
				return acc
		}, [])

		let coursePrerequisites = selectCoursePrerequisites(state)
		let thisCoursePrerequisites = coursePrerequisites && coursePrerequisites.length > 0 && props.params.courseEntryId && coursePrerequisites.filter(m => m.courseEntryId === props.params.courseEntryId)[0]
		if (thisCoursePrerequisites && thisCoursePrerequisites.courseName) {
				let firstList = thisCoursePrerequisites.firstList
				let secondList = thisCoursePrerequisites.secondList
				let thirdList = thisCoursePrerequisites.thirdList
				firstList = firstList && firstList.length > 0 && firstList.map(m => {
						m.id = m.courseEntryId
						m.label = m.courseName
						return m
				})
				secondList = secondList && secondList.length > 0 && secondList.map(m => {
						m.id = m.courseEntryId
						m.label = m.courseName
						return m
				})
				thirdList = thirdList && thirdList.length > 0 && thirdList.map(m => {
						m.id = m.courseEntryId
						m.label = m.courseName
						return m
				})
				thisCoursePrerequisites.firstList = firstList
				thisCoursePrerequisites.secondList = secondList
				thisCoursePrerequisites.thirdList = thirdList
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
        courses: selectCoursesBase(state),
        courseEntry,
        learningPathways: selectLearningPathways(state),
        learningFocusAreas: selectLearningFocusAreas(state),
        courseTypes: selectCourseTypes(state),
        companyConfig: selectCompanyConfig(state),
        fetchingRecord: selectFetchingRecord(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				gradeLevels: selectGradeLevels(state),
				standardsRatings,
				standardsRatingTables,
				thisCoursePrerequisites,
		}
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getCoursesBase: (personId) => dispatch(actionCourseEntry.getCoursesBase(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateCourse: (personId, course, runFunction) => dispatch(actionCourseEntry.addOrUpdateCourse(personId, course, runFunction)),
    resolveFetchingRecordCourses: () => dispatch(actionFetchingRecord.resolveFetchingRecordCourses()),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getFocusAreas: (personId) => dispatch(actionFocusAreas.init(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		getCoursePrerequisites: (personId) => dispatch(actionCoursePrerequisites.getCoursePrerequisites(personId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, setMyVisitedPage, getLearningPathways, getFocusAreas, getStandardsRating} = props
    		    getPageLangs(personId, langCode, 'CourseEntryView')
    		    getLearningPathways(personId)
    				getFocusAreas(personId)
    				getStandardsRating(personId)
    				//getCoursePrerequisites(personId);  This is already called when logging in even as Manheim
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Entry`})
    	  
  }, [])

  const {fetchingRecord, learningPathways} = props
  	    return <CourseEntryView {...props} />
  			// return learningPathways && learningPathways.length > 0 //&& learnerOutcomes && learnerOutcomes.length > 0
  			// 	&& fetchingRecord && (!fetchingRecord.courses || fetchingRecord.courses === "ready")
  			// 	? <CourseEntryView {...props} />
  			// 	: null;
}

export default Container
