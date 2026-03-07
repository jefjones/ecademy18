import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './GradeReportView.css'
const p = 'GradeReportView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import Loading from '../../components/Loading'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import DateMoment from '../../components/DateMoment'
import Icon from '../../components/Icon'
import Checkbox from '../../components/Checkbox'
import InputDataList from '../../components/InputDataList'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import AdvancEDLogo from '../../assets/AdvancEd.png'
import ReactToPrint from "react-to-print"
import {guidEmpty} from '../../utils/guidValidate'

function GradeReportView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [intervalList, setIntervalList] = useState('')
  const [schoolYearId, setSchoolYearId] = useState(props.personConfig.schoolYearId)
  const [isInitStudent, setIsInitStudent] = useState(undefined)
  const [student, setStudent] = useState(undefined)
  const [studentPersonId, setStudentPersonId] = useState(undefined)
  const [isInit, setIsInit] = useState(undefined)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(undefined)
  const [showDeleteIcons, setShowDeleteIcons] = useState(undefined)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(undefined)
  const [courseScheduledId, setCourseScheduledId] = useState(undefined)

  useEffect(() => {
    
    				//document.getElementById('studentPersonId').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            const {studentPersonId, students} = props
    				
    				if (!isInitStudent && !(studentPersonId && studentPersonId !== guidEmpty && studentPersonId != 0) //eslint-disable-line
    								&& studentPersonId && studentPersonId !== guidEmpty && students && students.length > 0) {
    						let student = students.filter(m => m.id === studentPersonId)[0]
    						setStudent(student); setStudentPersonId(studentPersonId); setIsInitStudent(true)
    				}
    
    				if (!isInit && props.studentPersonId && (studentPersonId !== props.studentPersonId || prevProps.students !== props.students)){
    						setStudentPersonId(props.studentPersonId); setIsInit(true)
    				}
    		
  }, [])

  const changeStudent = (student) => {
    
          	const {personId, getGradeReport, setStudentChosenSession} = props
    				
    				setStudentPersonId(student && student.id ? student.id : ''); setStudent(student && student.id ? student : {})
    				navigate(`/gradeReport/${student.id}`)
    				getGradeReport(personId, student.id, schoolYearId)
    				setStudentChosenSession(student.id)
    		
  }

  const changeInterval = (event) => {
    
    				let interval = state.interval
    				interval = event.target.value
    				setInterval(interval)
    		
  }

  const toggleInterval = (intervalId) => {
    
  }

  const handleUpdateSchoolYear = ({target}) => {
    
            const {personId, updatePersonConfig, getStudents, studentPersonId, getGradeReport} = props
    				setCourseScheduledschoolYearId(target.value)
    				updatePersonConfig(personId, 'SchoolYearId', target.value, () => getStudents(personId))
    				navigate(`/gradeReport/${studentPersonId}`)
    				getGradeReport(personId, studentPersonId, target.value)
    		
  }

  const toggleCheckbox = (setting) => {
    
            const {setPersonConfigChoice, personId} = props
            let newState = Object.assign({}, state)
            newState[setting] = !newState[setting]
            setState(newState)
            setPersonConfigChoice(personId, setting, newState[setting] ? 'checked' : '')
        
  }

  const toggleShowDeleteIcons = () => {
    return setShowDeleteIcons(!showDeleteIcons)
    

  }
  const deleteStudentGradeFinal = (courseScheduledId, intervalId) => {
    
            const {personId, removeStudentGradeFinal} = props
            
            removeStudentGradeFinal(personId, studentPersonId, courseScheduledId, intervalId)
        
  }

  const handleRemoveStudentGradeFinalOpen = (courseScheduledId, intervalId) => {
    return setIsShowingModal_remove(true); setCourseScheduledId(courseScheduledId); setIntervalId(intervalId)

  }
  const handleRemoveStudentGradeFinalClose = () => {
    return setIsShowingModal_remove(false)

  }
  const handleRemoveStudentGradeFinal = () => {
    
            const {removeStudentGradeFinal, personId, gradeReport} = props
    	      
    	      removeStudentGradeFinal(personId, gradeReport.studentPersonId, courseScheduledId, intervalId)
    	      handleRemoveStudentGradeFinalClose()
    	  
  }

  const showIntervalGPAs = () => {
    
            const {gradeReport={}, intervals} = props
            
    
            if (intervalList && intervalList.length > 0) {
                return <div className={styles.row}>
                          {intervalList.map((intervalId, i) => {
                              let interval = intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === intervalId)[0]
                              return interval && interval.name
                                  ? <div key={i} className={styles.spaceRight}>{interval.name} GPA: <strong>{gradeReport.gpaIntervals && gradeReport.gpaIntervals[intervalId]}</strong></div>
                                  : ''
                          })}
                       </div>
            } else if (intervals && intervals.length > 0) {
                return <div className={styles.row}>
                          {intervals.map((m, i) => {
                              return <div key={i} className={styles.spaceRight}>{m.name} GPA: <strong>{gradeReport.gpaIntervals && gradeReport.gpaIntervals[m.intervalId]}</strong></div>
                          })}
                       </div>
            }
        
  }

  const twoDecimals = (gpa) => {
    
            if (!gpa) return ''
            let frontPart = gpa && gpa.length > 0 ? gpa.substring(0, gpa.indexOf('.')) : ''
            let decimalPart = gpa && gpa.length > 0 ? gpa.substring(gpa.indexOf('.')+1) : ''
            if (decimalPart && decimalPart.length === 1) decimalPart = '.' + decimalPart + '0'
            else return gpa
            return frontPart + decimalPart
    
        
  }

  let {gradeReport} = props
        const {personId, students, fetchingRecord, intervals, schoolYears, personConfig, companyConfig={}, accessRoles={}, myFrequentPlaces,
  							setMyFrequentPlace} = props
        
  
  			let courseGrades = gradeReport.courseGrades
  			if (intervalList && intervalList.length > 0)
  					courseGrades = gradeReport.courseGrades && gradeReport.courseGrades.length > 0 && gradeReport.courseGrades.filter(m => intervalList.indexOf(m.intervalId) > -1)
  
  			let currentCourseName = ''; //eslint-disable-line
  			let totalCredits = 0
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
  								<div className={classes(globalStyles.pageTitle, styles.moreBottomMargin)}>
  										<L p={p} t={`Student Grade Report`}/>
  								</div>
  								<div className={classes(styles.row, styles.moreBottom)}>
  										<div>
  												<SelectSingleDropDown
  														id={`schoolYearId`}
  														label={<L p={p} t={`School year`}/>}
  														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
  														options={schoolYears}
  														height={`medium`}
  														onChange={handleUpdateSchoolYear}/>
  										</div>
  										<div>
  												<InputDataList
  														name={`studentPersonId`}
  														label={<L p={p} t={`Student`}/>}
  														value={student}
  														options={students}
  														height={`medium`}
  														className={styles.inputPosition}
  														onChange={changeStudent}/>
  										</div>
  										<div className={styles.printPosition}>
  												<ReactToPrint trigger={() => <a href="#" className={classes(styles.moveDownRight, styles.link, styles.row)}><Icon pathName={'printer'} premium={true} className={styles.icon}/><L p={p} t={`Print`}/></a>} content={() => componentRef}/>
  										</div>
                      <div className={classes(styles.moreRight, styles.moreTop)}>
  												<Checkbox
  														label={<L p={p} t={`Include the shool year total GPA`}/>}
  														checked={hideTotalSchoolYearGPA || personConfig["gradeReport_hideTotalSchoolYearGPA"] || false}
  														onClick={() => toggleCheckbox('hideTotalSchoolYearGPA')}
  														labelClass={styles.labelCheckbox}
  														checkboxClass={styles.checkbox} />
  										</div>
                      {accessRoles.admin &&
      										<div className={classes(styles.moreRight, styles.moreTop)}>
      												<Checkbox
      														label={<L p={p} t={`Include the principal's siguature`}/>}
      														checked={principalSignatureShow || personConfig["gradeReport_principalSignatureShow"] || false}
      														onClick={() => toggleCheckbox('principalSignatureShow')}
      														labelClass={styles.labelCheckbox}
      														checkboxClass={styles.checkbox} />
      										</div>
                      }
                      {principalSignatureShow &&
                          <div className={classes(styles.moreRight, styles.moreTop)}>
      												<Checkbox
      														label={<L p={p} t={`Include date (principal)`}/>}
      														checked={principalDate || personConfig["gradeReport_principalDate"] || false}
      														onClick={() => toggleCheckbox('principalDate')}
      														labelClass={styles.labelCheckbox}
      														checkboxClass={styles.checkbox} />
      										</div>
                      }
                      <div className={classes(styles.moreRight, styles.moreTop)}>
  												<Checkbox
  														label={<L p={p} t={`Include the teacher's siguature`}/>}
  														checked={teacherSignature || personConfig["gradeReport_teacherSignature"] || false}
  														onClick={() => toggleCheckbox('teacherSignature')}
  														labelClass={styles.labelCheckbox}
  														checkboxClass={styles.checkbox} />
  										</div>
                      <div className={classes(styles.moreRight, styles.moreTop)}>
  												<Checkbox
  														label={<L p={p} t={`Include the parent's siguature`}/>}
  														checked={parentSignature || personConfig["gradeReport_parentSignature"] || false}
  														onClick={() => toggleCheckbox('parentSignature')}
  														labelClass={styles.labelCheckbox}
  														checkboxClass={styles.checkbox} />
  										</div>
                      {accessRoles.admin &&
                          <div className={classes(styles.moreRight, styles.moreTop)}>
      												<Checkbox
      														label={<L p={p} t={`Remove one or more entries`}/>}
      														checked={showDeleteIcons || false}
      														onClick={toggleShowDeleteIcons}
      														labelClass={styles.labelCheckbox}
      														checkboxClass={styles.checkbox} />
      										</div>
                      }
  								</div>
  								<div className={styles.rowWrap}>
  										{intervals && intervals.length > 0 && intervals.map((m, i) =>
  												<Checkbox
  														key={i}
  														id={m.id}
  														label={m.label}
  														checked={(intervalList && intervalList.length > 0 && (intervalList.indexOf(m.id) > -1 || intervalList.indexOf(String(m.id)) > -1)) || ''}
  														onClick={() => toggleInterval(m.id)}
  														labelClass={styles.labelCheckbox}
  														checkboxClass={styles.checkbox} />
  										)}
  								</div>
  								<hr/>
  								<Loading isLoading={studentPersonId && fetchingRecord && fetchingRecord.gradeReport} />
  								{gradeReport && gradeReport.studentPersonId &&
  										<div ref={el => (componentRef = el)} className={classes(styles.center, styles.componentPrint, styles.maxWidth)}>
  												{companyConfig.logoFileUrl &&
  														<img src={companyConfig.logoFileUrl} className={styles.logoTop} alt={`Logo`} />
  												}
  				                <div className={classes(styles.header,globalStyles.centered)}>
  				                  	<div className={classes(styles.header,styles.row)}>
                                  <L p={p} t={`Student Grade Report`}/>
                                  <div className={styles.littleLeft}>
                                      {gradeReport.schoolYearName ? gradeReport.schoolYearName : ''}
                                  </div>
                              </div>
  				                </div>
  												<div className={classes(styles.row, styles.header, styles.center)}>
  				                  	<div><L p={p} t={`Name: `}/><strong>{gradeReport.studentFullName}</strong>  <div className={styles.moreLeft}><L p={p} t={`Grade Level:`}/> <strong>{gradeReport.gradeLevelName}</strong></div></div>
  				                </div>
  												<div className={accessRoles.admin ? styles.tableHeight : ''}>
  														<table className={styles.centerTable}>
  																<tbody>
  																		<tr>
                                          {showDeleteIcons && <th></th>}
  																				<th className={styles.upperHeaderLeft}><L p={p} t={`Courses`}/></th>
  																				<th className={styles.upperHeader}><L p={p} t={`Semester`}/></th>
  																				{((!isNaN(gradeReport.gradeLevelName) && Number(gradeReport.gradeLevelName) >= 8) || companyConfig.urlcode.indexOf('Caritas') > -1) &&
  																						<th className={styles.upperHeader}><L p={p} t={`Credits`}/></th>
  																				}
  																				<th className={styles.upperHeader} colSpan={2}>Grade</th>
  																		</tr>
  
        															{courseGrades && courseGrades.length > 0
        																	? courseGrades.map((m, i) => {
                                              if (!m.letterGrade) return null
  
    																					// totalCredits += (m.gradePointAverage >= 0.1 || m.letterGrade === 'P') && m.courseAssignAccredited && gradeReport.studentAccredited
    																					// 		? !isNaN(m.credits) && (m.courseAssignAccredited || companyConfig.urlcode.indexOf('Caritas') > -1)
    																					// 				? m.credits
    																					// 				: 0
    																					// 		: 0;
                                              totalCredits = m.credits
  
  									                           let row =
    																							<tr key={i}>
                                                      {showDeleteIcons &&
                                                          <td className={styles.data} onClick={() => handleRemoveStudentGradeFinalOpen(m.courseScheduledId, m.intervalId)}>
                                                              <Icon pathName={'trash2'} premium={true} className={styles.icon}/>
                                                          </td>
                                                      }
    																									<td className={styles.data}>{m.courseName}</td>
    																									<td className={styles.data}>{ m.intervalName}</td>
    																									{((!isNaN(gradeReport.gradeLevelName) && Number(gradeReport.gradeLevelName) >= 8) || companyConfig.urlcode.indexOf('Caritas') > -1) &&
    																											<td align={'center'} className={classes(styles.data, styles.fromLeft)}>
    																													 {  (m.gradePointAverage >= 0.1 || m.letterGrade === 'P') ? m.credits : 0.0 }
                                                               {/*  (gradeReport.studentAccredited && m.courseAssignAccredited) || companyConfig.urlcode.indexOf('Caritas') > -1
     																															? (m.gradePointAverage >= 0.1 || m.letterGrade === 'P') && m.courseAssignAccredited
     																																	? m.credits
     																																	: 0.0
     																															: <div className={styles.gray}>{`N/A`}</div>
     																													 */}
    																										  </td>
    																									}
    																									<td className={classes(styles.data, styles.serif)}>{m.letterGrade}</td>
    																									<td className={styles.data}>{m.gradePointAverage === 0 ? 0 : twoDecimals(m.gradePointAverage)}</td>
    																							</tr>
    																					currentCourseName = m.coursename
    																					return row
    																			})
  																		: <tr colSpan={5}><td><div className={styles.noRecords}>{fetchingRecord && !fetchingRecord.gradeReport ? 'no grade report found' : ''}</div></td></tr>
  																}
  																{((!isNaN(gradeReport.gradeLevelName) && Number(gradeReport.gradeLevelName) >= 8) || companyConfig.urlcode.indexOf('Caritas') > -1) &&
  																		<tr>
  																				<td></td>
  																				<td className={styles.data} align={'right'}><L p={p} t={`Total credits`}/></td>
  																				<td className={styles.data} align={'center'} >{totalCredits}</td>
  																		</tr>
  																}
  																</tbody>
  														</table>
  												</div>
  												<div className={classes(styles.center, styles.row, styles.text)}>
                              {showIntervalGPAs()}
  														{!hideTotalSchoolYearGPA && <div><L p={p} t={`School Year GPA: `}/><strong>{gradeReport.schoolYearGPA}</strong></div>}
  				                </div>
  												<div>
                              {principalSignatureShow &&
  																<div className={classes(styles.signatureLine)}>
  																			<div className={classes(styles.center, styles.text)}>
  																					{companyConfig.signatureFileUrl &&
  																							<img src={companyConfig.signatureFileUrl} alt={<L p={p} t={`Signature`}/>} />
  																					}
  																					{!companyConfig.signatureFileUrl &&
  																							<span>____________________________________,</span>
  																					}
  																			</div>
  																			<div className={classes(styles.row, styles.center)}>
  																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Principal Signature`}/></div>
  																					{principalDate && <DateMoment date={new Date()} format={'D MMM YYYY'} className={styles.moreLeft}/>}
  																			</div>
  								                </div>
                              }
                              {teacherSignature &&
  																<div className={classes(styles.signatureLine)}>
  																			<div className={classes(styles.center, styles.text)}>
  																					<span>____________________________________,</span>
  																			</div>
  																			<div className={classes(styles.row, styles.center)}>
  																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Teacher Signature`}/></div>
  																			</div>
  								                </div>
                              }
                              {parentSignature &&
  																<div className={classes(styles.signatureLine)}>
  																			<div className={classes(styles.center, styles.text)}>
  																					<span>____________________________________,</span>
  																			</div>
  																			<div className={classes(styles.row, styles.center)}>
  																					<div className={classes(styles.text, styles.moreRight)}><L p={p} t={`Parent Signature`}/></div>
  																			</div>
  								                </div>
                              }
  														{companyConfig.urlcode === 'Liahona' &&
  																<div className={styles.centeredFooter}>
  								                  	Liahona Preparatory Academy is fully accredited by AdvancED
  								                </div>
  														}
  														{companyConfig.urlcode === 'Liahona' &&
  																<div className={classes(styles.centeredFooter, styles.row)}>
  								                  	<div>Principal: {companyConfig.principalName}</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
  																		<div className={styles.moreLeft}>Administrator: Jordan Long</div>
  								                </div>
  														}
  														{companyConfig.urlcode === 'Liahona' &&
  																<div className={styles.centeredFooter}>
  								                  	2464 West 450 South &nbsp;&nbsp; Pleasant Grove, UT 84062 &nbsp;&nbsp;  Office: (801) 785-7850 &nbsp;&nbsp;  Fax: (801) 406-0071
  								                </div>
  														}
  														{companyConfig.urlcode === 'Liahona' &&
  																<img src={AdvancEDLogo} className={styles.logoBottom} alt={`AdvancED`} />
  														}
  												</div>
  										</div>
  								}
  						</div>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Grade Report`}/>} path={'gradeReport'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						{!accessRoles.admin &&
  								<OneFJefFooter />
  						}
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveStudentGradeFinalClose} heading={<L p={p} t={`Remove this final grade?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this final grade?`}/>} isConfirmType={true}
                     onClick={handleRemoveStudentGradeFinal} />
              }
          </div>
      )
}

export default GradeReportView
