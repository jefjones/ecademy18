import { useState } from 'react'
import styles from './DistributedCoursesView.css'
const p = 'DistributedCoursesView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import Loading from '../../components/Loading'
import InputText from '../../components/InputText'
import Checkbox from '../../components/Checkbox'
import InputDataList from '../../components/InputDataList'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Paper from '@mui/material/Paper'
import TableVirtualFast from '../../components/TableVirtualFast'
import classes from 'classnames'
import {withAlert} from 'react-alert'

function DistributedCoursesView(props) {
  const [partialNameText, setPartialNameText] = useState('')
  const [studentIdList, setStudentIdList] = useState([])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([])

  const {personId, distributedCourses, fetchingRecord, students, personConfig={}, activateDistributedCourses } = props
        
  
  			let localList = distributedCourses
  			if (localList && localList.length > 0 ) {
  					if (partialNameText) {
  							let cutBackTextFilter = partialNameText.toLowerCase()
  							localList = localList && localList.length > 0 && localList.filter(w => (w.courseName && w.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (w.code && w.code.toLowerCase().indexOf(cutBackTextFilter) > -1))
  					}
  					if (studentIdList && studentIdList.length > 0) {
  							localList = localList && localList.length > 0 && localList.filter(w => studentIdList.indexOf(w.studentPersonId) > -1)
  					}
  					if (selectedGradeLevels && selectedGradeLevels.length > 0) {
  							localList = localList && localList.length > 0 && localList.filter(w => selectedGradeLevels.indexOf(w.gradeLevelId) > -1)
  					}
  			}
  
  			localList = localList && localList.length > 0 && localList.map(m => {
  					m.distribute = <ButtonWithIcon icon={'checkmark_circle'} label={<L p={p} t={`Distribute`}/>} onClick={() => activateDistributedCourses(personId, [m.studentPersonId])} addClassName={styles.button}/>
  					m.student = <div className={styles.cellText}>{m.studentName}</div>
  					m.grade = <div className={styles.cellText}>{m.gradeLevelName}</div>
  					m.courseCount = <div className={styles.cellText}>{(m.coursesUnassigned && m.coursesUnassigned.length) || '0'}</div>
  					m.unresolved = <div className={styles.cellText}>{m.unresolvedCount > 0 ? m.unresolvedCount : ''}</div>
  					return m
  			})
  
  			let columns = [
  				{
  					width: 120,
  					label: '',
  					dataKey: 'distribute',
  				},
  				{
  					width: 160,
  					label: <L p={p} t={`Student`}/>,
  					dataKey: 'student',
  				},
  				{
  					width: 50,
  					label: <L p={p} t={`Grade`}/>,
  					dataKey: 'grade',
  				},
  				{
  					width: 70,
  					label: <L p={p} t={`Courses`}/>,
  					dataKey: 'courseCount',
  				},
  				{
  					width: 70,
  					label: <L p={p} t={`Unresolved`}/>,
  					dataKey: 'unresolved',
  					numeric: true,
  				},
  			]
  
        return (
          <div className={styles.container} id={'topContainer'}>
  						<div>
  		            <div className={styles.marginLeft}>
  		                <div className={globalStyles.pageTitle}>
  		                  	<L p={p} t={`Distribute Courses`}/>
  		                </div>
  										<div className={classes(styles.bold, styles.text)}>
  												<L p={p} t={`Filters:`}/>
  										</div>
  										<div className={styles.rowWrap}>
  												<InputText
  														id={"partialNameText"}
  														name={"partialNameText"}
  														size={"medium"}
  														label={<L p={p} t={`Name search`}/>}
  														value={partialNameText || ''}
  														onChange={changeItem}/>
  
  												<div className={styles.moreTop}>
  														<InputDataList
  																label={<L p={p} t={`Student(s)`}/>}
  																name={'studentIdList'}
  																options={students}
  																value={studentIdList || []}
  																multiple={true}
  																height={`medium`}
  																className={styles.moreSpace}
  																labelClass={styles.checkboxLabel}
  																onChange={(values) => dataListChange('studentIdList', values)}
  																removeFunction={removeStudent}/>
  												</div>
  
  												<div className={classes(styles.moreTop, styles.moreLeft, styles.moreBottom)}>
  														<span className={styles.textRating}>Grade level(s)</span>
  														<div className={styles.row}>
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
  
  												<a onClick={clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
  														<L p={p} t={`Clear filters`}/>
  												</a>
  										</div>
  								</div>
  								<Loading isLoading={fetchingRecord.courseAssignByAdmin} />
  								<Paper style={{ height: 400, width: '100%', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(localList && localList.length) || 0}
  												rowGetter={({ index }) => (localList && localList.length > 0 && localList[index]) || ''}
  												columns={columns} />
  								</Paper>
  						</div>
          </div>
      )
}

export default withAlert(DistributedCoursesView)
