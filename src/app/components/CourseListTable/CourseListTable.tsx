import { useState } from 'react';  //PropTypes
import * as styles from './CourseListTable.css'
import EditTable from '../EditTable'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import {doSort} from '../../utils/sort'
const p = 'component'
import L from '../../components/PageLanguage'

function CourseListTable(props) {
  const [isShowingModal_description, setIsShowingModal_description] = useState(false)
  const [sortByHeadings, setSortByHeadings] = useState({
								sortField: '',
								isAsc: '',
								isNumber: ''
						})
  const [sortField, setSortField] = useState('')
  const [isAsc, setIsAsc] = useState('')
  const [isNumber, setIsNumber] = useState('')
  const [courseName, setCourseName] = useState(undefined)

  const {courseListType, courses, shortVersion, emptyMessage, singleAddToClipboard, includeAddClipboardIcon, includeRemoveClipboardIcon,
  								courseClipboard, hideIcons, companyConfig, singleRemove, accessRoles} = props
  				
  
  				let localCourses = courses
  				if (sortByHeadings && sortByHeadings.sortField) {
  						localCourses = doSort(localCourses, sortByHeadings)
  				}
  				let headings = []
  
  				let data = localCourses && localCourses.length > 0 && localCourses.map((m, i) => {
  						let row = [
  								{value:
  										<div className={styles.row} key={i}>
  												{includeAddClipboardIcon && (!courseClipboard || !courseClipboard.personList || !courseClipboard.personList.length || (courseClipboard && courseClipboard.personList && courseClipboard.personList.length > 0 && courseClipboard.personList.indexOf(m.personId) === -1)) &&
  														<a onClick={() => singleAddToClipboard(m.personId)}>
  																<Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true} className={styles.iconSuper}/>
  														</a>
  												}
  												{includeAddClipboardIcon && courseClipboard && courseClipboard.personList && courseClipboard.personList.length > 0 && courseClipboard.personList.indexOf(m.personId) > -1 &&
  														<div className={styles.missingIcon}></div>
  												}
  												{includeRemoveClipboardIcon &&
  														<a onClick={() => singleRemove((courseListType === 'courseEntry' || (companyConfig.features && companyConfig.features.selfServiceStudentSignup && (accessRoles.facilitator || accessRoles.counselor)))
  																		? m.courseEntryId
  																		: m.courseScheduledId)
  																} className={styles.remove}>remove</a>
  												}
  												{!hideIcons && !!m.description &&
  														<div onClick={() => handleDescriptionOpen(m.courseName, m.description)}>
  																<Icon pathName={'info'} className={styles.icon}/>
  														</div>
  												}
  										</div>
  								},
  								{
  									value: m.courseName,
  								},
  								{
  									value: m.credits,
  								},
  						]
  
  						return row
  				})
  
  				data = data && data.length > 0
  						? data
  						: [[
  									{value: ''},
  									{value: <i>{emptyMessage}</i>, colSpan: 4}
  							]]
  
  					if (shortVersion) {
  						headings = [
  								{label: ''},
  								{label: <L p={p} t={`Course name`}/>, tightText: true, clickFunction: () => resort('courseName')},
  								{label: <L p={p} t={`Credits`}/>, tightText: true, clickFunction: () => resort('credits')},
  						]
  
  						data.reduce((acc, d) => {
  								if (d.length > 5) {
  										d.splice(5,1)
  										d.splice(3,1)
  										acc = acc ? acc.concat(d) : [d]
  								}
  								return acc
  							}, [])
  				} else {
  						headings = [
  								{label: ''},
  								{label: <L p={p} t={`Course name`}/>, tightText: true, clickFunction: () => resort('courseName')},
  								{label: <L p={p} t={`Credits`}/>, tightText: true, clickFunction: () => resort('credits')},
  						]
  				}
  
          return (
              <div className={styles.container}>
  								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data}/>
  								{isShowingModal_description &&
  		                <MessageModal handleClose={handleDescriptionClose} heading={courseName}
  		                   explain={description}  onClick={handleDescriptionClose} />
  		            }
              </div>
          )
}

export default CourseListTable
