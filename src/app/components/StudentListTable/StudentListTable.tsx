import { useState } from 'react';  //PropTypes
import { Link, useNavigate } from 'react-router-dom'
import styles from './StudentListTable.css'
import globalStyles from '../../utils/globalStyles.css'
import TableVirtualFast from '../../components/TableVirtualFast'
import Paper from '@mui/material/Paper'
import Loading from '../../components/Loading'
import Icon from '../Icon'
import DateMoment from '../DateMoment'
import {doSort} from '../../utils/sort'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

//If there is only one student, then the studentSchedule will be sent in and print it below the one student.
function StudentListTable(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [sortByHeadings, setSortByHeadings] = useState({
								sortField: '',
								isAsc: '',
								isNumber: ''
						})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')

  const {personId, students, gradeLevels, shortVersion, companyConfig={}, singleAddToClipboard,
  								includeAddClipboardIcon, singleRemoveFromClipboard, includeRemoveClipboardIcon, hideIcons,
  								resetUserPersonClipboard, isFetchingRecord} = props
  				
  				let localStudents = students
  				if (sortByHeadings && sortByHeadings.sortField) {
  						localStudents = doSort(localStudents, sortByHeadings)
  				}
  				let headings = []
  				localStudents = localStudents && localStudents.length > 0 && localStudents.map((m, i) => {
  						m.icons = <div className={classes(styles.row, globalStyles.cellText)} key={i}>
  												{includeAddClipboardIcon &&
  														<a onClick={() => singleAddToClipboard(m.studentPersonId)} data-rh={'Add to clipboard'}>
  																<Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuper}/>
  														</a>
  												}
  												{includeAddClipboardIcon &&
  														<div className={styles.missingIcon}></div>
  												}
  												{includeRemoveClipboardIcon &&
  														<a onClick={() => singleRemoveFromClipboard(m.studentPersonId)} className={styles.remove}>remove</a>
  												}
  												{!hideIcons &&
  														<a onClick={() => resetUserPersonClipboard(personId, { companyId: companyConfig.companyId, userPersonId: personId, personList: [m.studentPersonId], personType: 'STUDENT'}, 'announcementEdit')}
  																		 data-rh={'Send a message'}>
  																<Icon pathName={'comment_text'} premium={true} className={styles.icon}/>
  														</a>
  												}
  												{!hideIcons &&
  														<a onClick={() => sendToStudentSchedule(m.studentPersonId)} data-rh={`Student's schedule`}>
  																<Icon pathName={'clock3'} premium={true} className={styles.icon}/>
  														</a>
  												}
  												{!hideIcons &&
  														<Link to={'/studentProfile/' + m.studentPersonId} data-rh={'Student profile & parent info'}>
  																<Icon pathName={'info'} className={styles.icon}/>
  														</Link>
  												}
  												{!hideIcons && m.studentType === 'ACADEMY' &&
  														<Link to={'/courseAttendanceSingle/' + m.studentPersonId} data-rh={'Attendance'}>
  																<Icon pathName={'calendar_check'} premium={true} className={styles.icon}/>
  														</Link>
  												}
  										</div>
  						m.student = <a onClick={() => sendToStudentSchedule(m.studentPersonId)} className={classes(styles.link, globalStyles.cellText)}>{m.label}</a>; //We use label here since the database determines if the company is configured for the 'student name first'
  						m.gradeLevel = <div className={globalStyles.cellText}>{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(g => g.id === m.gradeLevelId)[0] && gradeLevels.filter(g => g.id === m.gradeLevelId)[0].label}</div>
  
  						if(companyConfig.urlcode !== 'Manheim') {
  								m.type = <div className={globalStyles.cellText}>{m.studentType}</div>
  						}
  
  						m.creditCount = <div className={globalStyles.cellText}>{m.credits}</div>
  
  						if(companyConfig.urlcode !== 'Manheim') {
  								m.birth = <DateMoment date={m.birthDate} format={`D MMM YYYY`} className={classes(styles.entryDate, globalStyles.cellText)}/>
  						}
  
  						m.lastLogin = m.lastLoginDate > '2010-01-01'
  						 		? <DateMoment date={m.lastLoginDate}  format={'D MMM YYYY  h:mm a'} minusHours={6} className={classes(styles.entryDate, globalStyles.cellText)}/>
  								: ''
  
  						return m
  				})
  
  				let columns = []
  
  				if (shortVersion) {
  						columns = [
  							{
  									width: hideIcons ? 60 : 160,
  									label: '',
  									dataKey: 'icons',
  							},
  							{
  									width: 160,
  									label: <div onClick={() => resort('label')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Student`}/></div>,
  									dataKey: 'student',
  							},
  							{
  									width: 60,
  									label: <div onClick={() => resort('gradeLevelId')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Grade`}/></div>,
  									dataKey: 'gradeLevel',
  							},
  							{
  									width: 60,
  									label: <div onClick={() => resort('credits')} className={classes(globalStyles.link, globalStyles.cellText)}>{companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Credits`}/> : <L p={p} t={`Classes`}/>}</div>,
  									dataKey: 'creditCount',
  							},
  							{
  									width: 160,
  									label: <div onClick={() => resort('lastLoginDate')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Last Login`}/></div>,
  									dataKey: 'lastLogin',
  							},
  						]
  
  						//I don't know what this was supposed to be.  Plus it didn't return anything to the data element or anything else.
  						// data && data.length > 0 && data.reduce((acc, d) => {
  						// 		if (d.length > 5) {
  						// 				d.splice(5,1);
  						// 				d.splice(3,1);
  						// 				acc = acc ? acc.concat(d) : [d];
  						// 		}
  						// 		return acc;
  						// 	}, []);
  				} else {
  						columns = [
  								{
  										width: 60,
  										label: '',
  										dataKey: 'icons',
  								},
  								{
  										width: 160,
  										label: <div onClick={() => resort('label')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Student`}/></div>,
  										dataKey: 'student',
  								},
  								{
  										width: 60,
  										label: <div onClick={() => resort('gradeLevelId')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Grade`}/></div>,
  										dataKey: 'gradeLevel',
  								},
  						]
  						if (companyConfig.urlcode !== 'Manheim') {
  								columns.push({
  										width: 90,
  										label: <div onClick={() => resort('studentType')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Type`}/></div>,
  										dataKey: 'type',
  								})
  						}
  						columns.push({
  								width: 60,
  								label: <div onClick={() => resort('credits')} className={classes(globalStyles.link, globalStyles.cellText)}>{companyConfig.urlcode === 'Manheim' ? <L p={p} t={`Credits`}/> : <L p={p} t={`Classes`}/>}</div>,
  								dataKey: 'creditCount',
  						})
  						if (companyConfig.urlcode !== 'Manheim') {
  								columns.push({
  										width: 60,
  										label: <div onClick={() => resort('birthDate')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Birth Date`}/></div>,
  										dataKey: 'birth',
  								})
  						}
  						headings.push({
  								width: 160,
  								label: <div onClick={() => resort('lastLoginDate')} className={classes(globalStyles.link, globalStyles.cellText)}><L p={p} t={`Last Login`}/></div>,
  								dataKey: 'lastLogin',
  						})
  				}
  
          return (
              <div className={styles.container}>
  								<Loading isLoading={isFetchingRecord} />
  								<Paper style={{ height: 190, width: companyConfig.urlcode === 'Liahona' || companyConfig.urlcode === 'Manheim' ? '700px' : '1260px', marginTop: '8px' }}>
  										<TableVirtualFast rowCount={(localStudents && localStudents.length) || 0}
  												rowGetter={({ index }) => (localStudents && localStudents.length > 0 && localStudents[index]) || ''}
  												columns={columns} />
  								</Paper>
              </div>
          )
}

export default StudentListTable
