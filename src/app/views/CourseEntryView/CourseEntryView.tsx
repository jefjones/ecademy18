import { useEffect, useState } from 'react'
import styles from './CourseEntryView.css'
const p = 'CourseEntryView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import RadioGroup from '../../components/RadioGroup'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import InputDataList from '../../components/InputDataList'
import InputTextArea from '../../components/InputTextArea'
import Checkbox from '../../components/Checkbox'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import {guidEmpty} from '../../utils/guidValidate'
import classes from 'classnames'

function CourseEntryView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isRecordComplete, setIsRecordComplete] = useState(false)
  const [errorCourseName, setErrorCourseName] = useState('')
  const [errorLearningPathway, setErrorLearningPathway] = useState('')
  const [errorLearnerOutcomes, setErrorLearnerOutcomes] = useState('')
  const [errorLearningFocusArea, setErrorLearningFocusArea] = useState('')
  const [errorFacilitator, setErrorFacilitator] = useState('')
  const [errorLocation, setErrorLocation] = useState('')
  const [errorSchedule, setErrorSchedule] = useState('')
  const [errorCredits, setErrorCredits] = useState('')
  const [selectedLearnerOutcomeTargets, setSelectedLearnerOutcomeTargets] = useState([])
  const [course, setCourse] = useState({
            courseName: '',
            learningPathwayId: '',
            learnerOutcomesList: [],
            learningFocusAreaId: '',
        })
  const [courseName, setCourseName] = useState('')
  const [learningPathwayId, setLearningPathwayId] = useState('')
  const [learnerOutcomesList, setLearnerOutcomesList] = useState([])
  const [learningFocusAreaId, setLearningFocusAreaId] = useState('')
  const [isInit, setIsInit] = useState(undefined)
  const [localCoursePrerequisites, setLocalCoursePrerequisites] = useState(undefined)
  const [p, setP] = useState(undefined)
  const [errorStandardsRating, setErrorStandardsRating] = useState(undefined)
  const [errorFromGradeLevelId, setErrorFromGradeLevelId] = useState(undefined)
  const [errorToGradeLevelId, setErrorToGradeLevelId] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(undefined)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState(undefined)
  const [firstList, setFirstList] = useState(undefined)
  const [secondList, setSecondList] = useState(undefined)
  const [thirdList, setThirdList] = useState(undefined)

  useEffect(() => {
    
          if (!!props.courseEntry) {
              setCourse(props.courseEntry)
          }
    			//document.getElementById('courseName').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          const {resolveFetchingRecordCourses, fetchingRecord, courseEntry, thisCoursePrerequisites} = props
          
          if ((prevProps.courseEntry !== courseEntry) || (fetchingRecord && fetchingRecord.courses === "ready")) {
              //Make sure that the course.code is not an object but just a string.
              if (typeof courseEntry.code !== 'string') courseEntry.code = ''
    
              setCourse(courseEntry)
              resolveFetchingRecordCourses()
          }
          if (!isInit && localCoursePrerequisites !== thisCoursePrerequisites) {
              setIsInit(true); setLocalCoursePrerequisites(thisCoursePrerequisites)
          }
        
  }, [])

  const changeCourse = (event) => {
    
            const field = event.target.name
            const course = Object.assign({}, course)
            course[field] = event.target.value
            setCourse(course)
        
  }

  const toggleCheckbox = () => {
    
            const course = Object.assign({}, course)
            course.isInactive = !course.isInactive
            setCourse(course)
        
  }

  const isDuplicateName = (courseName, code) => {
    
    				const {courses, courseEntry} = props
    				if (!courseEntry || courseEntry.length === 0) return false
    				let duplicateName = courses && courses.length > 0 && courses.filter(m => m.courseName === courseName && m.code === code && m.courseEntryId !== courseEntry.courseEntryId)[0]
    				return duplicateName && duplicateName.courseName ? true : false
    		
  }

  const processForm = () => {
     //, event
          const {addOrUpdateCourse, personId, getCoursePrerequisites} = props
          
          let course = Object.assign({}, course)
          let missingInfoMessage = []
          if (typeof course.code !== 'string') course.code = ''
    
          if (!course.courseName) {
              setErrorCourseName(<L p={p} t={`Course name is required`}/>)
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Course name`}/></div>
          }
          if (!course.learningPathwayId) {
              setErrorLearningPathway(<L p={p} t={`Please choose discipline (subject)`}/>)
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Discipline (subject)`}/></div>
          }
    			// if (!course.credits) {
          //     hasError = true;
          //     setErrorCredits("Please enter a credit amount for this course");
          // }
    
    			if (course.gradingType === 'STANDARDSRATING' && (!course.standardsRatingTableId || course.standardsRatingTableId === guidEmpty)) {
    					setErrorStandardsRating(<L p={p} t={`Standards rating scale is required`}/>)
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Standards rating scale is required`}/></div>
    			}
    
    			if (!course.fromGradeLevelId) {
    	        setErrorFromGradeLevelId(<L p={p} t={`Required`}/>)
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
    	    }
    
    			if (!course.toGradeLevelId) {
    	        setErrorToGradeLevelId(<L p={p} t={`Required`}/>)
    					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
    	    }
    
          if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
              // if (isDuplicateName(course.courseName, course.code)) {
              //     send an alert to the user ... just an alert that comes up as info and it doesn't stop them.
              // }
              //We need to interpret the id/label value pair to the courseEntryIdand courseName in order to send it to the server for saving.
              //First list, if any
              let prerequisitesReceive = {}
              if (localCoursePrerequisites) {
                  prerequisitesReceive.firstList = localCoursePrerequisites.firstList && localCoursePrerequisites.firstList.length > 0 && localCoursePrerequisites.firstList.reduce((acc, m) => {
                      let option = {
                        courseEntryId: m.id,
                        courseName: m.label,
                      }
                      return acc && acc.length > 0 ? acc.concat(option) : [option]
                  }, [])
    
                  //Second list, if any
                  prerequisitesReceive.secondList = localCoursePrerequisites.secondList && localCoursePrerequisites.secondList.length > 0 && localCoursePrerequisites.secondList.reduce((acc, m) => {
                      let option = {
                        courseEntryId: m.id,
                        courseName: m.label,
                      }
                      return acc && acc.length > 0 ? acc.concat(option) : [option]
                  }, [])
    
                  //Third list, if any
                  prerequisitesReceive.thirdList = localCoursePrerequisites.thirdList && localCoursePrerequisites.thirdList.length > 0 && localCoursePrerequisites.thirdList.reduce((acc, m) => {
                      let option = {
                        courseEntryId: m.id,
                        courseName: m.label,
                      }
                      return acc && acc.length > 0 ? acc.concat(option) : [option]
                  }, [])
    
                  if (!prerequisitesReceive.firstList) prerequisitesReceive.firstList = []
                  if (!prerequisitesReceive.secondList) prerequisitesReceive.secondList = []
                  if (!prerequisitesReceive.thirdList) prerequisitesReceive.thirdList = []
              }
    
              delete course.codeDisplay
              delete course.icons
              delete course.name
              delete course.content
              delete course.creditsDisplay
              delete course.contentArea
              delete course.gradeLevels
              delete course.classRank
              delete course.content
              delete course.contentArea
              delete course.courseForLunch
              delete course.creditsDisplay
              delete course.gpa
              delete course.gradeReport
              delete course.honorRoll
              delete course.stateId
              delete course.stateReports
              course.prerequisitesReceive = prerequisitesReceive
              addOrUpdateCourse(personId, course, () => getCoursePrerequisites(personId))
              navigate(`/baseCourses`)
    			} else {
    					handleMissingInfoOpen(missingInfoMessage)
          }
        
  }

  const handleSelectedLearnerOutcomeTargets = (selectedLearnerOutcomeTargets) => {
    
            setSelectedLearnerOutcomeTargets(selectedLearnerOutcomeTargets)
        
  }

  const handleSelectedLearnerOutcomes = (selectedLearnerOutcomes) => {
    
            let course = course
            course.learnerOutcomesList = selectedLearnerOutcomes
            setCourse(course)
        
  }

  const learnerOutcomesValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Learner Outcomes:  ${selected.length} of ${options.length}`}/>
        
  }

  const learnerOutcomeTargetsValueRenderer = (selected, options) => {
    
            return <L p={p} t={`Grade Targets (FILTER for learner outcomes):  ${selected.length} of ${options.length}`}/>
        
  }

  const handleRadioChoice = (field, value) => {
    
    				const {standardsRatingTables} = props
    				if (field === 'gradingType' && value === 'STANDARDSRATING' && standardsRatingTables && standardsRatingTables.length === 1) {
    						course['gradingType'] = 'STANDARDSRATING'
    						course['standardsRatingTableId'] = standardsRatingTables[0].standardsRatingTableId
    				}
    				setCourse(course)
    		
  }

  const handleMissingInfoOpen = (messageInfoIncomplete) => {
    return setIsShowingModal_missingInfo(true); setMessageInfoIncomplete(messageInfoIncomplete)
    

  }
  const handleMissingInfoClose = () => {
    return setIsShowingModal_missingInfo(false); setMessageInfoIncomplete('')
    

  }
  const handleStandardsRatingChoice = (standardsRatingTableId) => {
    
  }

  const changePrerequisiteFirst = (values) => {
    return setLocalCoursePrerequisites({...localCoursePrerequisites, firstList: values })
  }

  const changePrerequisiteSecond = (values) => {
    return setLocalCoursePrerequisites({...localCoursePrerequisites, secondList: values })
  }

  const changePrerequisiteThird = (values) => {
    return setLocalCoursePrerequisites({...localCoursePrerequisites, thirdList: values })
  }

  const {personId, myFrequentPlaces, setMyFrequentPlace, learningPathways, companyConfig={}, gradeLevels, standardsRatingTables, courses=[]} = props
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    <L p={p} t={`Course Entry`}/>
                  </div>
  								<div className={classes(globalStyles.instructionsBigger, styles.maxWidth)}><L p={p} t={`A base course is intended to be used so that it can be scheduled multiple times.  The course content is created for a base course so that it does not have to be entered repetitively.  If the course content is going to vary, create another base course. A duplicate can be made from a base course with content and then the content can be modified.`}/></div>
                  <div className={styles.formLeft}>
                      <InputText
                          id={`courseName`}
                          name={`courseName`}
                          size={"long"}
                          label={<L p={p} t={`Course name`}/>}
                          value={course.courseName || ''}
                          onChange={changeCourse}
  												required={true}
  												whenFilled={course.courseName}
                          error={errorCourseName} />
                      <SelectSingleDropDown
                          id={`learningPathwayId`}
                          name={`learningPathway`}
                          label={<L p={p} t={`Discipline (subject)`}/>}
                          value={course.learningPathwayId || ''}
                          options={learningPathways}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={changeCourse}
  												required={true}
  												whenFilled={course.learningPathwayId}
                          error={errorLearningPathway} />
                      <InputTextArea
                          label={<L p={p} t={`Description`}/>}
                          name={'description'}
                          value={course.description || ''}
                          autoComplete={'dontdoit'}
                          onChange={changeCourse}/>
  										<InputText
                          id={`credits`}
                          name={`credits`}
                          size={'short'}
                          align={'right'}
  												numberOnly={true}
                          label={<L p={p} t={`Credits (optional)`}/>}
                          value={course.credits || ''}
                          onChange={changeCourse}
                          error={errorCredits} />
  										<InputText
                          id={`code`}
                          name={`code`}
                          size={"short"}
                          label={<L p={p} t={`Code (optional)`}/>}
                          value={typeof course.code !== 'string' ? '' : course.code}
                          onChange={changeCourse}
  												maxLength={25}/>
  										<hr/>
  										<div className={classes(styles.moreLeft, styles.headLabel)}><L p={p} t={`Grade level range:`}/></div>
  										<div className={classes(styles.moreLeft, styles.row)}>
  												<div>
  														<SelectSingleDropDown
  																id={'fromGradeLevelId'}
  																label={<L p={p} t={`From`}/>}
  																value={course.fromGradeLevelId || ''}
  																onChange={changeCourse}
  																options={gradeLevels}
  																height={'medium'}
  																required={true}
  																whenFilled={course.fromGradeLevelId}
  																error={errorFromGradeLevelId}/>
  												</div>
  												<div>
  														<SelectSingleDropDown
  																id={'toGradeLevelId'}
  																label={<L p={p} t={`To`}/>}
  																value={course.toGradeLevelId || ''}
  																onChange={changeCourse}
  																options={gradeLevels}
  																height={'medium'}
  																required={true}
  																whenFilled={course.toGradeLevelId}
  																error={errorToGradeLevelId}/>
  												</div>
  										</div>
  										<hr/>
  										<RadioGroup
  												data={[
  														{id: 'TRADITIONAL', label: <L p={p} t={`Traditional`}/>},
  														{id: 'STANDARDSRATING', label: <L p={p} t={`Standards-based`}/>},
  														{id: 'PASSFAIL', label: <L p={p} t={`Pass / Fail`}/>}]}
  												label={<L p={p} t={`Grading Type`}/>}
  												name={`gradingType`}
  												horizontal={true}
  												className={styles.radio}
  												labelClass={styles.radioLabels}
  												radioClass={styles.radioClass}
  												initialValue={course.gradingType || companyConfig.gradingType || 'TRADITIONAL'}
  												onClick={(value) => handleRadioChoice('gradingType', value)}/>
  
  										{course.gradingType === 'STANDARDSRATING' &&
  												<div className={styles.moreLeft}>
  														<div className={styles.muchLeft}>
  																<RadioGroup
  																		label={<L p={p} t={`Standards based rating scales`}/>}
  																		data={standardsRatingTables || []}
  																		name={`standardsRatingTables`}
  																		horizontal={false}
  																		className={styles.radio}
  																		initialValue={course.standardsRatingTableId || ''}
  																		onClick={handleStandardsRatingChoice}/>
  														</div>
                              {(!standardsRatingTables || standardsRatingTables.length ===0) &&
                                  <div className={classes(styles.moreLeft, globalStyles.errorText)}>
                                      <L p={p} t={`There are not any standards-based rating scales to choose from.  Please see your administrator.`}/>
                                  </div>
                              }
  												</div>
  										}
  										<hr/>
                      <div className={styles.prereqSection}>
                          <div className={styles.headLabel}><L p={p} t={`Prerequisites (optional)`}/></div>
                          <div className={styles.moreBottomMargin}>
          										<InputDataList
          												label={<L p={p} t={`Students must take one of these classes`}/>}
          												name={'firstList'}
          												options={courses}
                                  listAbove={true}
          												value={(localCoursePrerequisites && localCoursePrerequisites.firstList) || []}
          												height={`medium`}
          												maxwidth={`mediumshort`}
          												multiple={true}
          												onChange={changePrerequisiteFirst}/>
                          </div>
                          <div className={styles.moreBottomMargin}>
          										<InputDataList
          												label={<L p={p} t={`AND students must take one of these classes`}/>}
          												name={'secondList'}
          												options={courses}
                                  listAbove={true}
          												value={(localCoursePrerequisites && localCoursePrerequisites.secondList) || []}
          												height={`medium`}
          												maxwidth={`mediumshort`}
          												multiple={true}
          												onChange={changePrerequisiteSecond}/>
                          </div>
                          <div className={styles.moreBottomMargin}>
          										<InputDataList
          												label={<L p={p} t={`AND students must take one of these classes`}/>}
          												name={'thirdList'}
          												options={courses}
                                  listAbove={true}
          												value={(localCoursePrerequisites && localCoursePrerequisites.thirddList) || []}
          												height={`medium`}
          												maxwidth={`mediumshort`}
          												multiple={true}
          												onChange={changePrerequisiteThird}/>
                          </div>
                      </div>
  
  										{/*companyConfig.urlcode !== 'Liahona' &&
  												<div>
  														<InputText
  																size={"short"}
  																id={"stateCourseId"}
  																name={"stateCourseId"}
  																label={"State course id"}
  																value={course.stateCourseId || ''}
  																inputClassName={styles.moreBottomMargin}
  																onChange={changeCourse}/>
  
  														<RadioGroup
  																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
  																label={'GPA'}
  																name={`excludeFromGPA`}
  																horizontal={true}
  																className={styles.radio}
  																labelClass={styles.radioLabels}
  																radioClass={styles.radioClass}
  																initialValue={course.excludeFromGPA || false}
  																onClick={(value) => handleRadioChoice('excludeFromGPA', value)}/>
  														<RadioGroup
  																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
  																label={'Class Rank'}
  																name={`excludeFromClassRank`}
  																horizontal={true}
  																className={styles.radio}
  																labelClass={styles.radioLabels}
  																radioClass={styles.radioClass}
  																initialValue={course.excludeFromClassRank || false}
  																onClick={(value) => handleRadioChoice('excludeFromClassRank', value)}/>
  														<RadioGroup
  																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
  																label={'Honor Roll'}
  																name={`excludeFromHonorRoll`}
  																horizontal={true}
  																className={styles.radio}
  																labelClass={styles.radioLabels}
  																radioClass={styles.radioClass}
  																initialValue={course.excludeFromHonorRoll || false}
  																onClick={(value) => handleRadioChoice('excludeFromHonorRoll', value)}/>
  														<RadioGroup
  																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
  																label={'Use the Course for Lunch'}
  																name={`useTheCourseForLunch`}
  																horizontal={true}
  																className={styles.radio}
  																labelClass={styles.radioLabels}
  																radioClass={styles.radioClass}
  																initialValue={course.useTheCourseForLunch || false}
  																onClick={(value) => handleRadioChoice('useTheCourseForLunch', value)}/>
  														<RadioGroup
  																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
  																label={'Grade Report'}
  																name={`excludeOnGradeReport`}
  																horizontal={true}
  																className={styles.radio}
  																labelClass={styles.radioLabels}
  																radioClass={styles.radioClass}
  																initialValue={course.excludeOnGradeReport || false}
  																onClick={(value) => handleRadioChoice('excludeOnGradeReport', value)}/>
  														<RadioGroup
  																data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
  																label={'State Reports'}
  																name={`excludeFromStateReports`}
  																horizontal={true}
  																className={styles.radio}
  																labelClass={styles.radioLabels}
  																radioClass={styles.radioClass}
  																initialValue={course.excludeFromStateReports || false}
  																onClick={(value) => handleRadioChoice('excludeFromStateReports', value)}/>
  												</div>
  										*/}
                      <hr/>
                      <Checkbox
                          id={'isInactive'}
                          label={<L p={p} t={`Do not display this course to others (admin only)`}/>}
                          checked={course.isInactive || false}
                          onClick={toggleCheckbox}/>
  
  		                <div className={classes(styles.row, styles.centerRowRight)}>
  												<Link className={styles.cancelLink} to={'/baseCourses'}>Close</Link>
  												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}
  														disabled={!(course.courseName && course.courseName.length > 3 && course.learningPathwayId && course.learningPathwayId !== "0")}/>
  		                </div>
  								</div>
              </div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Course Entry`}/>} path={'courseEntry'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
          </div>
      )
}

export default CourseEntryView
