import { useEffect, useState } from 'react'
import styles from './CourseToScheduleView.css'
const p = 'CourseToScheduleView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import { navigate, navigateReplace, goBack } from './'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import Checkbox from '../../components/Checkbox'
import RadioGroup from '../../components/RadioGroup'
import GradingRatingLegend from '../../components/GradingRatingLegend'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import DateTimePicker from '../../components/DateTimePicker'
import InputDataList from '../../components/InputDataList'
import ScheduleCourseDayTime from '../../components/ScheduleCourseDayTime'
import TextDisplay from '../../components/TextDisplay'
import CheckboxGroup from '../../components/CheckboxGroup'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'
import {wait} from '../../utils/wait'

function CourseToScheduleView(props) {
  const [isRecordComplete, setIsRecordComplete] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const [maxSeats, setMaxSeats] = useState(<L p={p} t={`Number of seats vacant is required`}/>)
  const [p, setP] = useState(undefined)
  const [errorCourseName, setErrorCourseName] = useState('')
  const [errorLearningPathway, setErrorLearningPathway] = useState('')
  const [errorFacilitator, setErrorFacilitator] = useState('')
  const [errorLocation, setErrorLocation] = useState('')
  const [errorSchedule, setErrorSchedule] = useState('')
  const [course, setCourse] = useState({})
  const [isShowingModal_instructions, setIsShowingModal_instructions] = useState(true)
  const [instructions, setInstructions] = useState('')
  const [isShowingModal_dateWarning, setIsShowingModal_dateWarning] = useState(true)
  const [isShowingModal_showList, setIsShowingModal_showList] = useState(true)
  const [gradeScaleTableId, setGradeScaleTableId] = useState(undefined)
  const [gradeScaleList, setGradeScaleList] = useState('')
  const [gradeScaleName, setGradeScaleName] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {course} = props
            
            if (!isInit && course && course.courseName) {
                setIsInit(true); setCourse(course)
            }
    		
  }, [])

  const {durationOptions, facilitators, campusLocationOptions, companyConfig={}, classPeriods, intervals, standardsRatings,
  							baseCourses, courseTypes, schoolYears} = props
  
  			let gradeScaleTables = props.gradeScaleTables && props.gradeScaleTables.length > 0 && props.gradeScaleTables.map(m => {
            m.id = m.gradeScaleTableId
            m.label = <div className={styles.row}>{m.gradeScaleName}<div onClick={(event) => handleGradeScaleListOpen(m.gradeScaleTableId, event)} className={classes(globalStyles.link, styles.viewList)}>{'view list'}</div></div>
            return m
  			})
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    {`Course Section Entry`}
                  </div>
                  {!course.courseScheduledId &&
      								<div>
      										<SelectSingleDropDown
      												id={`courseEntryId`}
      												name={`courseEntryId`}
      												label={`Base Courses`}
      												value={course.courseEntryId || ''}
      												options={baseCourses}
      												className={styles.moreBottomMargin}
      												height={`medium`}
      												onChange={updateBaseCourse}/>
      								</div>
                  }
                  <div className={styles.formLft}>
  										<TextDisplay label={<L p={p} t={`Course name`}/>} text={course.courseName || '  - -'} className={styles.noLeft}/>
                      <TextDisplay label={<L p={p} t={`Subject/Discipline`}/>} text={course.learningPathwayName || '  - -'} className={styles.noLeft}/>
  										<TextDisplay label={<L p={p} t={`Description`}/>} text={course.description || '  - -'} className={styles.noLeft}/>
  										{false && <TextDisplay label={<L p={p} t={`Sub discipline (optional)`}/>} text={course.learningFocusAreaName || '  - -'} className={styles.noLeft}/>}
                      <TextDisplay label={`Grading type`} text={
                          course.gradingType === 'STANDARDSRATING'
                              ? 'Standards-based'
                              : course.gradingType === 'PASSFAIL'
                                  ? 'Pass/Fail'
                                  : 'Traditional'} className={styles.noLeft}
                      />
                      {course.gradingType === 'STANDARDSRATING' &&
                          <TextDisplay label={`Grading type`} className={styles.noLeft}
                              text={<GradingRatingLegend standardsRatings={standardsRatings} gradingType={'STANDARDSRATING'} standardsRatingTableId={course.standardsRatingTableId}/>} />
                      }
  										<SelectSingleDropDown
                          id={`courseTypeId`}
                          name={`courseType`}
                          label={<L p={p} t={`Course Type`}/>}
                          value={course.courseTypeId || ''}
                          options={courseTypes}
                          className={styles.moreBottomMargin}
                          height={`medium`}
                          onChange={changeCourse}
                          onEnterKey={handleEnterKey}
  												required={true}
  												whenFilled={course.courseTypeId}
                          error={errors.courseType} />
  										<hr />
  										<SelectSingleDropDown
                          id={`schoolYearId`}
                          label={<L p={p} t={`School Year`}/>}
                          value={course.schoolYearId || ''}
                          options={schoolYears || []}
                          height={`medium`}
                          onChange={changeCourse}
  												className={styles.moreBottomMargin}
  												required={true}
  												whenFilled={course.schoolYearId}
                          error={errors.schoolYear} />
  										<CheckboxGroup
  												name={'intervalId'}
  												label={<L p={p} t={`Interval duration`}/>}
  												options={intervals}
  												horizontal={false}
  												className={styles.labelTypes}
  												labelClass={styles.labelTypes}
  												onSelectedChanged={changeIntervals}
  												selected={course.intervals || []}
  												required={true}
  												whenFilled={course.intervals && course.intervals.length > 0}
  												error={errors.interval}/>
  										<hr />
                      <div className={styles.moreBottomMargin}>
      										<InputDataList
      												label={<L p={p} t={`Teacher`}/>}
      												name={'teachers'}
      												options={facilitators}
                              listAbove={true}
      												value={course.teachers}
      												height={`medium`}
      												maxwidth={`mediumshort`}
      												multiple={true}
      												className={styles.teacherList}
      												required={true}
      												whenFilled={course.teachers && course.teachers.length > 0}
      												onChange={changeTeacher}
      												error={errors.facilitator}/>
                      </div>
                      <hr/>
  										<RadioGroup
  												data={gradeScaleTables || []}
  												label={<L p={p} t={`Grading scale`}/>}
  												name={'gradeScaleTableId'}
  												horizontal={true}
  												className={styles.radio}
  												labelClass={styles.radioLabels}
  												radioClass={styles.radioClass}
  												initialValue={course.gradeScaleTableId || ''}
  												onClick={(value) => handleRadioChoice('gradeScaleTableId', value)}
  												error={errors.gradingScale}/>
  										<hr />
  										{companyConfig.urlcode === 'Liahona' &&
  												<div>
  														{showMoreInfo
  																? <div onClick={toggleMoreInfo} className={styles.row}><div className={styles.moreInfo}>Less info...</div><Icon pathName={'caret_2'} premium={true} className={styles.flipped}/></div>
  																: <div onClick={toggleMoreInfo} className={styles.row}><div className={styles.moreInfo}>More info...</div><Icon pathName={'caret_2'} premium={true} className={styles.notFlipped}/></div>
  														}
  												</div>
  										}
  										{(showMoreInfo || companyConfig.urlcode !== 'Liahona') &&
  												<div>
  														<InputText
  				                        size={"short"}
  				                        id={"code"}
  				                        name={"code"}
  				                        label={<L p={p} t={`Course code (optional)`}/>}
  				                        value={typeof course.code === 'string' ? course.code : ''}
  				                        onChange={changeCourse}/>
  														<InputText
  				                        size={"short"}
  				                        id={"section"}
  				                        name={"section"}
  				                        label={<L p={p} t={`Section (optional)`}/>}
  				                        value={course.section || ''}
  				                        onChange={changeCourse}/>
  														<InputText
  				                        size={"super-short"}
  				                        id={"maxSeats"}
  				                        name={"maxSeats"}
  																numberOnly={true}
  				                        label={<L p={p} t={`Number of seats available`}/>}
  				                        value={course.maxSeats || ''}
  				                        onChange={changeCourse}/>
  														<hr />
  
  				                    {companyConfig.urlcode !== 'Liahona' && <div className={styles.subHeader}><L p={p} t={`Location`}/></div>}
  														{companyConfig.urlcode !== 'Liahona' &&
  																<div>
  																		<RadioGroup
  								                        data={campusLocationOptions || []}
  								                        name={`campusLocation`}
  								                        horizontal={true}
  								                        className={styles.radio}
  								                        labelClass={styles.radioLabels}
  								                        radioClass={styles.radioClass}
  								                        initialValue={course.onCampus ? 'onCampus' : course.offCampus ? 'offCampus' : 'onCampus'}
  								                        onClick={handleCampusLocation}/>
  
  								                    <Checkbox
  								                        id={`online`}
  								                        label={<L p={p} t={`Online`}/>}
  								                        checked={course.online || ''}
  								                        onClick={(event) => toggleCheckbox('online', event)}
  								                        labelClass={styles.labelCheckbox}
  								                        className={styles.checkbox} />
  								                    <Checkbox
  								                        id={`selfPaced`}
  								                        label={<L p={p} t={`Self-paced`}/>}
  								                        checked={course.selfPaced || ''}
  								                        onClick={(event) => toggleCheckbox('selfPaced', event)}
  								                        labelClass={styles.labelCheckbox}
  								                        className={styles.checkbox} />
  																</div>
  														}
  				                    <InputText
  				                        size={"medium"}
  				                        id={"location"}
  				                        name={"location"}
  				                        label={<L p={p} t={`Location description (optional)`}/>}
  				                        value={course.location || ''}
  				                        onChange={changeCourse}
  				                        error={errors.location}/>
  												</div>
  										}
                      <hr />
                      <span className={styles.error}>{errors.schedule}</span>
                      <div className={styles.classification}>SCHEDULE</div>
  										<div className={styles.headerLabel}>
  												<L p={p} t={`Attendance date range`}/>
  										</div>
  										<div className={styles.row}>
                          <div className={styles.dateColumn}>
                              <DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} required={true} whenFilled={course.fromDate}
  																value={course.fromDate ? course.fromDate === '1900-01-01' ? '' : course.fromDate : ''}
                                  maxDate={course.toDate ? course.toDate : ''}
                                  onChange={(event) => setDate(`fromDate`, event.target.value)}
  																error={errors.fromDate}/>
                              <span className={styles.error}>{errors.fromDate}</span>
                          </div>
                          <div className={styles.dateColumn}>
                              <DateTimePicker id={`toDate`}  label={<L p={p} t={`To date`}/>} required={true} whenFilled={course.toDate}
  																value={course.toDate ? course.toDate === '1900-01-01' ? '' : course.toDate : ''}
                                  minDate={course.fromDate ? course.fromDate : ''}
                                  onChange={(event) => setDate(`toDate`, event.target.value)}
  																error={errors.toDate}/>
                              <span className={styles.error}>{errors.toDate}</span>
                          </div>
                      </div>
  										<hr />
  										<div className={styles.headerLabel}>
  												<L p={p} t={`Days and class period`}/>
  										</div>
  										<div className={styles.moreLeft}>
  												<ScheduleCourseDayTime companyConfig={companyConfig} daysScheduled={course.daysScheduled}
  														setDaySchedule={setDaySchedule} classPeriods={classPeriods} durationOptions={durationOptions}/>
  										</div>
                  </div>
                  <hr/>
                  {course.courseEntryIsInactive &&
                      <div className={classes(styles.moreLeft, styles.label)}><L p={p} t={`This course is marked as inactive on the base course level`}/></div>
                  }
                  <Checkbox
                      id={'isInactive'}
                      label={<L p={p} t={`Do not display this scheduled course to others (admin only)`}/>}
                      checked={course.isInactive || false}
                      onClick={(event) => toggleCheckbox('isInactive', event)} />
  
                  <div className={styles.rowRight}>
  										<div className={classes(globalStyles.link, styles.moreTop)} onClick={sendBack}>Cancel</div>
  										<div>
  												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("FINISH", event)}/>
  										</div>
                  </div>
              </div>
              <OneFJefFooter />
              {isShowingModal_deleteDate &&
                  <MessageModal handleClose={handleDeleteDateClose} heading={<L p={p} t={`Remove this specific date?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this specific date?`}/>} isConfirmType={true}
                     onClick={handleDeleteDate} />
              }
  						{isShowingModal_instructions &&
  								<MessageModal handleClose={handleInstructionsClose} heading={<L p={p} t={`Check your entry for missing information`}/>}
  									 explainJSX={instructions} onClick={handleInstructionsClose} />
  						}
              {isShowingModal_dateWarning &&
  								<MessageModal handleClose={handleMissingDateWarningClose} heading={<L p={p} t={`From Date or To Date Missing`}/>} isConfirmType={true}
  									 explainJSX={<L p={p} t={`The From Date and the To Date are necessary for attendance date ranges.  Are you sure you want to submit this new course section without a date range?`}/>}
                     onClick={handleMissingDateWarningSubmit} />
  						}
  						{isShowingModal_showList &&
                  <MessageModal handleClose={handleGradeScaleListClose} heading={<div className={styles.boldText}>{gradeScaleName}</div>}
                     explain={gradeScaleList} onClick={handleGradeScaleListClose} />
              }
          </div>
      )
}

export default withAlert(CourseToScheduleView)

//toggleDataClearinghouseInfo = () => this.setState({ showDataClearinghouseInfo: !this.state.showDataClearinghouseInfo });

// {showDataClearinghouseInfo
//     ? <div onClick={this.toggleDataClearinghouseInfo} className={styles.row}><div className={styles.moreInfo}>Less info...</div><Icon pathName={'caret_2'} premium={true} className={styles.flipped}/></div>
//     : <div onClick={this.toggleDataClearinghouseInfo} className={styles.row}><div className={styles.moreInfo}>More info...</div><Icon pathName={'caret_2'} premium={true} className={styles.notFlipped}/></div>
// }
// <hr />
// {showDataClearinghouseInfo &&
//     <div>
// 				<div className={styles.classification}>Data Clearinghouse Course Master Record</div>
// 				<InputText
// 						size={"short"}
// 						id={"administrativeWhereTaught"}
// 						name={"administrativeWhereTaught"}
// 						label={"Administrative Where Taught"}
// 						value={course.administrativeWhereTaught || ''}
// 						instructions={'Enter the state Id for the district'}
// 						onChange={this.changeCourse}/>
// 				<InputText
//             size={"short"}
// 						id={"schoolWhereTaught"}
// 						name={"schoolWhereTaught"}
// 						label={"School Where Taught"}
// 						value={course.schoolWhereTaught || ''}
// 						inputClassName={styles.moreBottomMargin}
// 						instructions={'Enter the state Id for the district'}
// 						onChange={this.changeCourse}/>
//
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'GPA'}
// 						name={`excludeFromGPA`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromGPA || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromGPA', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Class Rank'}
// 						name={`excludeFromClassRank`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromClassRank || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromClassRank', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Honor Roll'}
// 						name={`excludeFromHonorRoll`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromHonorRoll || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromHonorRoll', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Use the Course for Lunch'}
// 						name={`useTheCourseForLunch`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.useTheCourseForLunch || false}
// 						onClick={(value) => this.handleRadioChoice('useTheCourseForLunch', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'Grade Report'}
// 						name={`excludeOnGradeReport`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeOnGradeReport || false}
// 						onClick={(value) => this.handleRadioChoice('excludeOnGradeReport', value)}/>
// 				<RadioGroup
// 						data={[{id: false, label: 'Include'}, {id: true, label: 'Exclude'}]}
// 						label={'State Reports'}
// 						name={`excludeFromStateReports`}
// 						horizontal={true}
// 						className={styles.radio}
// 						labelClass={styles.radioLabels}
// 						radioClass={styles.radioClass}
// 						initialValue={course.excludeFromStateReports || false}
// 						onClick={(value) => this.handleRadioChoice('excludeFromStateReports', value)}/>
//
// 				<div>
// 						<SelectSingleDropDown
// 								id={`grantingCreditCollegeId`}
// 								name={`grantingCreditCollegeId`}
// 								label={`College Granting Credit`}
// 								value={course.grantingCreditCollegeId || ''}
// 								options={colleges}
// 								className={styles.moreBottomMargin}
// 								height={`medium`}
// 								onChange={this.changeCourse}/>
// 				</div>
// 				<div>
// 						<SelectSingleDropDown
// 								id={`whereTaughtCampus`}
// 								name={`whereTaughtCampus`}
// 								label={`Where Taught Campus`}
// 								value={course.whereTaughtCampus || ''}
// 								options={whereTaughtCampus}
// 								className={styles.moreBottomMargin}
// 								height={`medium`}
// 								onChange={this.changeCourse}/>
// 				</div>
// 				<div>
// 						<SelectSingleDropDown
// 								id={`instructionalSetting`}
// 								name={`instructionalSetting`}
// 								label={`Instructional Setting`}
// 								value={course.instructionalSetting || ''}
// 								options={instructionalSettings}
// 								className={styles.moreBottomMargin}
// 								height={`medium`}
// 								onChange={this.changeCourse}/>
// 				</div>
//   </div>
// }
