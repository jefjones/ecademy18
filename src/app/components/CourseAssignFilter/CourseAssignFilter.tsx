import { useState } from 'react'
import * as styles from './CourseAssignFilter.css'
import Icon from '../Icon'
import CourseAssignFilterModal from '../../components/CourseAssignFilterModal'
import TextDisplay from '../../components/TextDisplay'
import InputText from '../../components/InputText'
import {guidEmpty} from '../../utils/guidValidate'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function CourseAssignFilter(props) {
  const [isShowingModal, setIsShowingModal] = useState(true)

  const handleModalOpen = () => {
    return setIsShowingModal(true)
  }

  const handleModalClose = () => {
    return setIsShowingModal(false)
  }

  const {companyConfig, intervals, classPeriods, learningPathways, partialNameText, filterIntervalId, learningPathwayId, departmentId, classPeriodId,
  						facilitatorName, showAlertsOnly, showOpenCoursesOnly, onlineOrTraditionalOnly, departments, clearFilters, changeItem, handleRadio,
  						hideRegistrationOptions, alerts, teachers, toggleShowOpenCoursesOnly, toggleShowAlertsOnly, bypassGradeRestriction} = props
  		
  
      return (
          <div className={styles.container}>
  						<div className={classes(styles.grayBack, styles.moreBottom, styles.rowWrap)}>
  								<InputText
  										id={"partialNameText"}
  										name={"partialNameText"}
  										size={"medium"}
  										label={<L p={p} t={`Name search`}/>}
  										value={partialNameText || ''}
  										onChange={changeItem}/>
  								<a onClick={handleModalOpen} className={classes(styles.linkStyle, styles.moreRight, styles.row, styles.muchTop)}>
  										advanced search
  										<Icon pathName={'magnifier'} premium={true} className={styles.icon} />
  								</a>
  								{/*partialNameText &&
  										<TextDisplay label={'Name search'} text={partialNameText} />
  								*/}
                  {bypassGradeRestriction &&
  										<TextDisplay label={<L p={p} t={`Bypass Grade Restriction`}/>}
  												text={'On'} />
  								}
  								{departmentId && departmentId !== "0" &&
  										<TextDisplay label={<L p={p} t={`Department`}/>}
  												text={!!(departments && departments.length > 0 && departments.filter(m => Number(m.id) === Number(departmentId))[0]) ? departments.filter(m => Number(m.id) === Number(departmentId))[0].label : ''} />
  								}
  								{filterIntervalId && filterIntervalId !== guidEmpty &&
  										<TextDisplay label={companyConfig.urlcode === 'Manheim' ? `Marking Periods` : <L p={p} t={`Interval`}/>}
  												text={!!(intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === filterIntervalId)[0]) ? intervals.filter(m => m.intervalId === filterIntervalId)[0].label : ''} />
  								}
  								{classPeriodId && classPeriodId !== guidEmpty &&
  										<TextDisplay label={companyConfig.urlcode === 'Manheim' ? `Block` : <L p={p} t={`Period`}/>}
  												text={!!(classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodId === classPeriodId)[0]) ? classPeriods.filter(m => m.classPeriodId === classPeriodId)[0].label : ''} />
  								}
  								{facilitatorName &&
  										<TextDisplay label={<L p={p} t={`Teacher`}/>} text={facilitatorName} />
  								}
  								{learningPathwayId && learningPathwayId !== guidEmpty &&
  										<TextDisplay label={companyConfig.urlcode === 'Manheim' ? `Content Area` : <L p={p} t={`Subject/Discipline`}/>}
  												text={!!(learningPathways && learningPathways.length > 0 && learningPathways.filter(m => m.learningPathwayId === learningPathwayId)[0]) ? learningPathways.filter(m => m.learningPathwayId === learningPathwayId)[0].label : ''} />
  								}
  								{showAlertsOnly && !hideRegistrationOptions &&
  										<TextDisplay label={<L p={p} t={`Alerts`}/>} text={<L p={p} t={`Only show courses with alerts`}/>} />
  								}
  								{showOpenCoursesOnly && !hideRegistrationOptions &&
  										<TextDisplay label={<L p={p} t={`Courses`}/>} text={<L p={p} t={`Show courses with open seats only`}/>} />
  								}
  								{onlineOrTraditionalOnly && onlineOrTraditionalOnly !== 'all' &&
  										<TextDisplay label={`Format`} text={onlineOrTraditionalOnly === 'traditional' ? <L p={p} t={`Traditional only`}/> : <L p={p} t={`Online only`}/>} />
  								}
  								{(partialNameText || (departmentId && departmentId !== "0") || (filterIntervalId && filterIntervalId !== guidEmpty) || (classPeriodId && classPeriodId !== guidEmpty)
  												|| facilitatorName || facilitatorName || (learningPathwayId && learningPathwayId !== guidEmpty) || showAlertsOnly || showAlertsOnly
  												|| showAlertsOnly || (onlineOrTraditionalOnly && onlineOrTraditionalOnly !== 'all')) &&
  										<a onClick={clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
  												<L p={p} t={`Clear filters`}/>
  										</a>
  								}
  						</div>
  						{isShowingModal &&
  								<CourseAssignFilterModal {...props} handleClose={handleModalClose} onClick={handleModalClose} hideRegistrationOptions={hideRegistrationOptions}
                      handleRadio={handleRadio} partialNameText={partialNameText} departments={departments} intervals={intervals} classPeriods={classPeriods}
                      learningPathways={learningPathways} alerts={alerts} teachers={teachers} filterIntervalId={filterIntervalId} learningPathwayId={learningPathwayId}
                      departmentId={departmentId} classPeriodId={classPeriodId} facilitatorName={facilitatorName} showAlertsOnly={showAlertsOnly}
                      showOpenCoursesOnly={showOpenCoursesOnly} onlineOrTraditionalOnly={onlineOrTraditionalOnly} toggleShowAlertsOnly={toggleShowAlertsOnly} clearFilters={clearFilters}
                      toggleShowOpenCoursesOnly={toggleShowOpenCoursesOnly}/>
  
  						}
          </div>
      )
}
export default CourseAssignFilter
