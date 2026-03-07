import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as styles from './CourseAssignByAdminAddView.css'
const p = 'CourseAssignByAdminAddView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import Loading from '../../components/Loading'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import Checkbox from '../../components/Checkbox'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import RadioGroup from '../../components/RadioGroup'
import EditTable from '../../components/EditTable'
import Paper from '@mui/material/Paper'
import TableVirtualFast from '../../components/TableVirtualFast'
import classes from 'classnames'
import {doSort} from '../../utils/sort'
import {withAlert} from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'

function CourseAssignByAdminAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_description, setIsShowingModal_description] = useState(false)
  const [partialNameText, setPartialNameText] = useState('')
  const [learningPathwayId, setLearningPathwayId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [sortByHeadings, setSortByHeadings] = useState({
							sortField: '',
							isAsc: '',
							isNumber: ''
					})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')
  const [courseName, setCourseName] = useState('')
  const [description, setDescription] = useState('')
  const [localCourseAssign, setLocalCourseAssign] = useState([])
  const [requiredOrSuggested, setRequiredOrSuggested] = useState('')
  const [id, setId] = useState('')
  const [studentIdList, setStudentIdList] = useState([])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])
  const [isShowingModal_assignOne, setIsShowingModal_assignOne] = useState(true)
  const [chosenType, setChosenType] = useState('')
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')

  const {me, baseCourses, learningPathways, companyConfig={}, fetchingRecord, students, coursesScheduled, personConfig={} } = props; //departments,
        
  
  			let localBaseCourses = baseCourses
  			if (localBaseCourses && localBaseCourses.length > 0 ) {
  					if (partialNameText) {
  							let cutBackTextFilter = partialNameText.toLowerCase()
  							//cutBackTextFilter = cutBackTextFilter && cutBackTextFilter.length > 15 ? cutBackTextFilter.substring(0,15) : cutBackTextFilter;
  							localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1))
  					}
  					// if (departmentId && departmentId !== '0' && departmentId !== guidEmpty) {
  					// 		localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(m => m.departmentId === Number(departmentId));
  					// }
  					if (learningPathwayId && learningPathwayId !== '0' && learningPathwayId !== guidEmpty) {
  							localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.filter(m => m.learningPathwayId === learningPathwayId)
  					}
  					if (!!onlineOrTraditionalOnly && onlineOrTraditionalOnly !== 'all' && localBaseCourses && localBaseCourses.length > 0) {
  							localBaseCourses = onlineOrTraditionalOnly === 'online'
  									? localBaseCourses.filter(m => m.onlineName === 'Online' || m.online)
  									: localBaseCourses.filter(m => !m.onlineName && !m.online)
  					}
  					if (courseScheduledId && courseScheduledId !== '0') {
  
  					}
  			}
  			if (sortByHeadings && sortByHeadings.sortField) {
  					localBaseCourses = doSort(localBaseCourses, sortByHeadings)
  			}
  
  			localBaseCourses = localBaseCourses && localBaseCourses.length > 0 && localBaseCourses.map(m => {
  					m.courseId = m.externalId
  					m.choose = <div className={classes(styles.cellText, styles.backGray)}>
  													{m.studentList && m.studentList.length >= m.maxSeats && !me.salta
  															? <div className={classes(styles.cellText, styles.white)}>FULL</div>
  															: <div onClick={() => toggleCourse(m.courseEntryId, m)} className={classes(styles.cellText, (m.studentList && m.studentList.length >= m.maxSeats ? styles.backRed : ''))}>
  																		<Icon pathName={isSelectedCourse(m.courseEntryId) ? 'checkmark' : 'square_empty'} premium={!isSelectedCourse(m.courseEntryId)}
  																				className={classes(styles.iconSquare, styles.backWhite)} fillColor={isSelectedCourse(m.courseEntryId) ? 'green' : 'black'}/>
  																</div>
  													}
  											</div>
  					m.course = <div onClick={!m.description ? () => {} : () => handleDescriptionOpen(m.courseName, m.description)} className={classes(styles.wrap, (m.description ? styles.link : ''))}>
  														{m.courseName}
  												 </div>
  
  					m.creditCount = <div className={styles.cellText}>{m.credits}</div>
  					return m
  			})
  
  			let columns = [
  				{
  					width: 70,
  					label: <L p={p} t={`Course Id`}/>,
  					dataKey: 'courseId',
  				},
  				{
  					width: 50,
  					label: '',
  					dataKey: 'choose',
  				},
  				{
  					width: 220,
  					label: <L p={p} t={`Course`}/>,
  					dataKey: 'course',
  				},
  				{
  					width: 40,
  					label: <L p={p} t={`Credits`}/>,
  					dataKey: 'creditCount',
  					numeric: true,
  				},
  			]
  
  			let headings = [{},
  					{label: <L p={p} t={`Id`}/>, tightText: true},
  					{label: <L p={p} t={`Course`}/>, tightText: true},
  					{label: <L p={p} t={`Credits`}/>, tightText: true}]
  
  			let data =[]
  			let totalCredits = 0
  
  			localCourseAssign && localCourseAssign.length > 0 && localCourseAssign.forEach(m => {
  					data.push([
  							{value: <div className={globalStyles.remove} onClick={() => handleRemoveOpen(m.id)}><L p={p} t={`remove`}/></div>},
  							{value: m.externalId},
  							{value: m.courseName},
  							{value: m.credits},
  					])
  					totalCredits += m.credits
  			})
  			localCourseAssign && localCourseAssign.length > 0 && data.push([{}, {}, {value: <div className={styles.textRight}><L p={p} t={`Total`}/></div>}, {value: totalCredits}])
  
        return (
          <div className={styles.container} id={'topContainer'}>
  						<div>
  		            <div className={styles.marginLeft}>
  		                <div className={globalStyles.pageTitle}>
  		                  	<L p={p} t={`Assign Courses by Admin (Required or Suggested)`}/>
  		                </div>
  										<div className={styles.rowWrap}>
  												<div>
  														<div className={classes(styles.subHeading, styles.littleLeft)}><L p={p} t={`New Required or Suggested Courses`}/></div>
  														<EditTable headings={headings} data={data} emptyMessage={'No courses chosen yet'} />
  														<hr/>
  												</div>
  												<div className={classes(styles.row, styles.moreLeft)} onClick={() => navigate(`/courseAssignByAdminList`)}>
  														<Icon pathName={'list3'} className={styles.icon} premium={true}/>
  														<Link to={`/courseAssignByAdminList`} className={styles.menuItem}><L p={p} t={`Go to course assignment list`}/></Link>
  												</div>
  										</div>
  										<div className={classes(globalStyles.instructionsBigger, styles.moreBottom)}>
  												<L p={p} t={`Student or Grade Level`}/>
  										</div>
  										<div className={styles.rowWrap}>
  												<div className={styles.inputPosition}>
  														<InputDataList
  																label={<L p={p} t={`Choose one or more students`}/>}
  																name={'studentIdList'}
  																options={students}
  																value={studentIdList || []}
  																multiple={true}
  																height={`medium`}
  																onChange={(values) => dataListChange('studentIdList', values)}
  																removeFunction={removeStudent}/>
  												</div>
  												<div>
  														<SelectSingleDropDown
  																id={`courseScheduledId`}
  																name={`courseScheduledId`}
  																label={<L p={p} t={`Students by course`}/>}
  																value={courseScheduledId}
  																options={coursesScheduled}
  																className={styles.moreBottomMargin}
  																maxwidth={`medium`}
  																height={`medium`}
  																onChange={changeFilters}
  																onEnterKey={handleEnterKey}/>
  												</div>
  												<div className={styles.moreLeft}>
  														<span className={styles.textRating}><L p={p} t={`Or choose by one or more grade levels`}/></span>
  														<div className={styles.rowWrap}>
  																{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
  																		<Checkbox
  																				key={i}
  																				id={m.gradeLevelId}
  																				label={m.name}
  																				checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && (selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
  																				onClick={() => toggleGradeLevel(m.gradeLevelId)}
  																				labelClass={styles.labelCheckbox}
  																				checkboxClass={styles.checkbox} />
  																)}
  														</div>
  												</div>
  												<div className={classes(styles.moreTop, styles.row)}>
  														<div>
  																<div className={classes(globalStyles.instructionsBigger, styles.instructionsWidth)}>
  																		<L p={p} t={`You can choose a course to be required and another course as suggested, but save them as two separately submitted records.`}/>
  																</div>
  																<RadioGroup
  																		title={<L p={p} t={`Required or suggested`}/>}
  																		data={[{ id: 'required', label: <L p={p} t={`Required`}/>}, { id: 'suggested', label: <L p={p} t={`Suggested`}/>}]}
  																		horizontal={true}
  																		className={styles.radio}
  																		initialValue={requiredOrSuggested}
  																		required={true}
  																		whenFilled={requiredOrSuggested}
  																		labelClass={styles.radioLabel}
  																		onClick={changeRequiredOrSuggested}/>
  														</div>
  														<div className={styles.muchMoreTop}>
  																<ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Submit`}/>} onClick={processForm}/>
  														</div>
  												</div>
  										</div>
  										<hr/>
  										<div className={classes(styles.grayBack, styles.moreBottom, styles.rowWrap)}>
  												<InputText
  														id={"partialNameText"}
  														name={"partialNameText"}
  														size={"medium"}
  														label={<L p={p} t={`Name search`}/>}
  														value={partialNameText || ''}
  														onChange={changeItem}/>
  												<div>
  														<SelectSingleDropDown
  																id={`learningPathwayId`}
  																label={companyConfig.urlcode === `Manheim` ? <L p={p} t={`Content Area`}/> : <L p={p} t={`Discipline`}/>}
  																value={learningPathwayId || ''}
  																options={learningPathways}
  																height={`medium`}
  																onChange={changeItem}/>
  												</div>
  												{/*<div>
  														<SelectSingleDropDown
  																id={`departmentId`}
  																label={<L p={p} t={`Department`}/>}
  																value={Number(departmentId) || ''}
  																options={departments}
  																height={`medium`}
  																onChange={changeItem}/>
  												</div>*/}
  												<a onClick={clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
  														<L p={p} t={`Clear filters`}/>
  												</a>
  										</div>
  								</div>
  								<Loading isLoading={fetchingRecord.baseCourses} />
  								<Paper style={{ height: 400, width: '90vw', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(localBaseCourses && localBaseCourses.length) || 0}
  												rowGetter={({ index }) => (localBaseCourses && localBaseCourses.length > 0 && localBaseCourses[index]) || ''}
  												columns={columns} />
  								</Paper>
  								{!fetchingRecord.baseCourses && !(localBaseCourses && localBaseCourses.length > 0) &&
  										<span className={styles.noRecords}><L p={p} t={`no courses found`}/></span>
  								}
  						</div>
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this course?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_description &&
                  <MessageModal handleClose={handleDescriptionClose} heading={courseName}
                     explain={description}  onClick={handleDescriptionClose} />
              }
  						{isShowingModal_assignOne &&
                  <MessageModal handleClose={handleStudentOrGradeLevelClose} heading={<L p={p} t={`Choose either Students or Grade Levels`}/>}
                     explainJSX={<L p={p} t={`You have chosen a ${chosenType}. You can choose either one or more students or one or more grade levels. Your previous ${chosenType} choice will be deleted.`}/>}
  									 onClick={handleStudentOrGradeLevelClose} />
              }
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
          </div>
      )
}

export default withAlert(CourseAssignByAdminAddView)
