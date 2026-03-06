import { useEffect, useState } from 'react'
import CourseToScheduleView from '../views/CourseToScheduleView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import {guidEmpty} from '../utils/guidValidate'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionContentTypes from '../actions/content-types'
import * as actionCourseTypes from '../actions/course-types'
import * as actionClassPeriods from '../actions/class-periods'
import * as actionGradeScale from '../actions/grade-scale'
import * as actionStandardsRating from '../actions/standards-rating'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from '../utils/sort'
import { selectUsers, selectMe, selectCoursesScheduled, selectLearnerOutcomes, selectCompanyConfig, selectClassPeriods, selectPersonConfig,
					selectIntervals, selectCoursesBase, selectCourseTypes, selectFetchingRecord, selectSchoolYears, selectGradeScale,
					selectColleges, selectStandardsRating } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let baseCourses = selectCoursesBase(state)
		let personConfig = selectPersonConfig(state)
    let durationOptions = []
		let companyConfig = selectCompanyConfig(state)
		let gradeScales = selectGradeScale(state)
		let schoolYears = selectSchoolYears(state)
		schoolYears = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.yearInt > 2019)

		let gradeScaleTableIds = gradeScales && gradeScales.length > 0 && gradeScales.reduce((acc, m) => {
				let alreadyEntered = false
				acc && acc.length > 0 && acc.forEach(id => {
					if (m.gradeScaleTableId === id) alreadyEntered = true
				})
				if (!alreadyEntered) {
						acc = acc ? acc.concat(m.gradeScaleTableId) : [m.gradeScaleTableId]
				}
				return acc
		}, [])

    for (let i = 5; i < 60; i += 5) {
      durationOptions.push({ id: i, label: i + ' min'})
    }
    for (let hour = 1; hour <= 10; hour++) {
      for (i = 0; i < 60; i += 5) {
        let hourLabel = hour === 1 ? 'hour' : 'hours'
        let minLabel = i > 0 ? i + ' min' : ''
        durationOptions.push({ id: (hour * 60) + i, label: hour + ' ' + hourLabel + '  ' + minLabel})
      }
    }

    let campusLocationOptions = [
        {
            label: "On campus",
            id: "onCampus"
        },
        {
            label: "Off campus",
            id: "offCampus"
        },
    ]
		let selectedIntervals = []
		let course = {}

		if (props.params.newOrEdit === 'new') {
				course = baseCourses && baseCourses.length > 0 && baseCourses.filter(m => m.courseEntryId === props.params.id)[0]
				if (course && course.courseEntryId) course.schoolYearId = personConfig && personConfig.schoolYearId
		} else {
				let coursesScheduled = selectCoursesScheduled(state)
				if (coursesScheduled && coursesScheduled.length > 0) {
						course = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => m.courseScheduledId === props.params.id)[0]
						if (course && course.id) {
								course.fromDate = course.fromDate && course.fromDate.indexOf('T') > -1 ? course.fromDate.substring(0, course.fromDate.indexOf('T')) : course.fromDate
								course.toDate = course.toDate && course.toDate.indexOf('T') > -1 ? course.toDate.substring(0, course.toDate.indexOf('T')) : course.toDate
								course.startTime = course.startTime && course.startTime.indexOf('T') > -1 ? course.startTime.substring(0, course.startTime.indexOf('T')) : course.startTime
								course.gradingType = course.gradingType ? course.gradingType : companyConfig.gradingType
								if (gradeScaleTableIds && gradeScaleTableIds.length === 1) {
										course.gradeScaleTableId = course.gradeScaleTableId
												? course.gradeScaleTableId
												: gradeScaleTableIds[0]
								}
								if (course && course.intervals && course.intervals.length > 0) {
										course.intervals = course.intervals.reduce((acc,m) => {
												if (typeof m === 'string') {
														acc = acc && acc.length > 0 ? acc.concat(m) : [m]
												} else if (m && m.intervalId) {
														acc = acc && acc.length > 0 ? acc.concat(m.intervalId) : [m.intervalId]
												}
												return acc
										}, [])
								}
						}
				}
		}
		let gradeScaleTableDefault = ''
		let gradeScaleTables = gradeScales && gradeScales.length > 0 && gradeScales.reduce((acc, m) => {
				let alreadyEntered = false
				acc && acc.length > 0 && acc.forEach(g => { if (m.gradeScaleTableId === g.id) alreadyEntered = true; })
				if (!alreadyEntered) {
						if (m.gradeScaleName.indexOf('default') > -1) {
								gradeScaleTableDefault = m.gradeScaleTableId
						} else if (!gradeScaleTableDefault) {
								gradeScaleTableDefault = m.gradeScaleTableId
						}
						acc = acc ? acc.concat(m) : [m]
				}
				return acc
		}, [])

		if (course && (!course.gradeScaleTableId || course.gradeScaleTableId === guidEmpty) && gradeScaleTables && gradeScaleTables.length > 0)
				course.gradeScaleTableId = gradeScaleTables[0].gradeScaleTableId

		let whereTaughtCampus = [
				{id: 'C', label: 'College campus'},
				{id: 'H', label: 'High School campus'},
		]

		let instructionalSettings = [
				{id: 'FF', label: 'Face to Face'},
				{id: 'BC', label: 'Broadcast Course'},
				{id: 'CC', label: 'Correspondence Course'},
				{id: 'EC', label: 'Early College, Not Concurrent'},
				{id: 'AV', label: 'Interactive Audio/Video  course'},
				{id: 'ON', label: 'Online course'},
				{id: 'IS', label: 'Independent Study'},
				{id: 'OP', label: 'Online course for students under SB 65'},
		]


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


    return {
        personId: me.personId,
        langCode: me.langCode,
				params: props && props.params,
        course,
				selectedIntervals,
        campusLocationOptions,
				gradeScaleTables,
				intervals: selectIntervals(state),
        facilitators: selectUsers(state, 'Facilitator'),
				learnerOutcomes: selectLearnerOutcomes(state),
        durationOptions,
        companyConfig,
				classPeriods: selectClassPeriods(state),
				baseCourses,
				courseTypes: selectCourseTypes(state),
				fetchingRecord: selectFetchingRecord(state),
				schoolYears,
				personConfig,
				gradeScales,
				whereTaughtCampus,
				instructionalSettings,
				colleges: selectColleges(state),
				standardsRatings,
				standardsRatingTables,
    }
}

const bindActionsToDispatch = dispatch => ({
		addOrUpdateCourseToSchedule: (personId, courseToSchedule) => dispatch(actionCourseToSchedule.addOrUpdateCourseToSchedule(personId, courseToSchedule)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		resolveFetchingRecordCourseToSchedule: () => dispatch(actionFetchingRecord.resolveFetchingRecordCourseToSchedule()),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
		getCourseTypes: (personId) => dispatch(actionCourseTypes.init(personId)),
		getClassPeriods: (personId) => dispatch(actionClassPeriods.init(personId)),
		clearCourseToSchedule: () => dispatch(actionCourseToSchedule.clearCourseToSchedule()),
		gradeScaleInit: (personId) => dispatch(actionGradeScale.init(personId)),
		//setLocalCourseScheduled: (field, value) => dispatch(actionCourseToSchedule.setLocalCourseScheduled(field, value)),
		getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		getCourseDaysScheduled: (personId, courseScheduledId) => dispatch(actionCourseToSchedule.getCourseDaysScheduled(personId, courseScheduledId)),

})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [didUpdate, setDidUpdate] = useState(false)
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, params, setMyVisitedPage, getContentTypes, getCourseTypes, getClassPeriods, gradeScaleInit, getStandardsRating, getCourseDaysScheduled} = props
    				getPageLangs(personId, langCode, 'CourseToScheduleView')
    				getContentTypes(personId)
    				getCourseTypes(personId)
    				getClassPeriods(personId)
            gradeScaleInit(personId)
            getStandardsRating(personId)
    				if (params.newOrEdit === 'edit') getCourseDaysScheduled(personId, params.id)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Section Entry`})
    		
  }, [])

  return <CourseToScheduleView {...props} />
}

export default Container
