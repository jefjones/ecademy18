import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './StudentClipboard.css'
import classes from 'classnames'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import StudentListTable from '../../components/StudentListTable'
const p = 'component'
import L from '../../components/PageLanguage'

function StudentClipboard(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)

  const {personId, students, companyConfig, gradeLevels, setStudentsSelected, getStudentSchedule, studentAssignmentsInit,
  								singleRemoveFromClipboard, hideIcons, isFetchingRecord} = props
  				
  
  	      return (
  						<div className={styles.studentSection}>
  								<div className={classes(styles.row, styles.littleLeft)}>
  										<div className={styles.countText}>{`Count: ${(students && students.length) || 0}`}</div>
  										<a onClick={handleClearStudentsOpen} className={classes(styles.row, styles.link)}>
  												<Icon pathName={'cross_circle'} premium={true} className={styles.iconSmall}/><L p={p} t={`Clear clipboard`}/>
  										</a>
  										<a onClick={() => navigate('/learnerSearch')} className={classes(styles.row, styles.link, styles.muchLeft)}>
  												<Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
  												{students && students.length > 0 ? <L p={p} t={`Choose more students`}/> : <L p={p} t={`Choose students`}/>}
  										</a>
  								</div>
  								<div className={styles.scrollable}>
  										<StudentListTable students={students} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
  												setStudentsSelected={setStudentsSelected} getStudentSchedule={getStudentSchedule} isFetchingRecord={isFetchingRecord}
  												personId={personId} studentAssignmentsInit={studentAssignmentsInit} emptyMessage={'No students chosen'}
  												includeRemoveClipboardIcon={true} singleRemoveFromClipboard={singleRemoveFromClipboard} hideIcons={hideIcons}/>
  								</div>
  								{isShowingModal &&
                       <MessageModal handleClose={handleClearStudentsClose} heading={<L p={p} t={`Clear the Student Clipboard?`}/>}
                          explainJSX={<L p={p} t={`Are you sure you want to clear the student clipboard?`}/>} isConfirmType={true}
                          onClick={handleClearStudents} />
                  }
  						</div>
  	    	)
}

export default StudentClipboard
