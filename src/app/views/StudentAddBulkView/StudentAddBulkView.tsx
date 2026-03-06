import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
import styles from './StudentAddBulkView.css'
const p = 'StudentAddBulkView'
import L from '../../components/PageLanguage'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import { withAlert } from 'react-alert'
import DropZone from 'react-dropzone-component'
import classes from 'classnames'

let file = {}
//let fileSubmitted = false;

function StudentAddBulkView(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [personConfigLocal, setPersonConfigLocal] = useState(props.personConfigEntry)
  const [bulk, setBulk] = useState({
					lineStart: 1,
          firstField: 'firstName',
          secondField: 'lastName',
          thirdField: 'emailAddress',
          fourthField: 'birthDate',
          fifthField: 'gradeLevelCode',
          sixthField: 'firstNameParent1',
          seventhField: 'lastNameParent1',
          eighthField: 'emailAddressParent1',
          ninthField: 'phoneParent1',
          tenthField: '',
          memberData: '', //This should always be text for the textarea.  Never an array of objects.
      })
  const [lineStart, setLineStart] = useState(1)
  const [firstField, setFirstField] = useState('firstName')
  const [secondField, setSecondField] = useState('lastName')
  const [thirdField, setThirdField] = useState('emailAddress')
  const [fourthField, setFourthField] = useState('birthDate')
  const [fifthField, setFifthField] = useState('gradeLevelCode')
  const [sixthField, setSixthField] = useState('firstNameParent1')
  const [seventhField, setSeventhField] = useState('lastNameParent1')
  const [eighthField, setEighthField] = useState('emailAddressParent1')
  const [ninthField, setNinthField] = useState('phoneParent1')
  const [tenthField, setTenthField] = useState('')
  const [memberData, setMemberData] = useState('')
  const [hasInit, setHasInit] = useState(true)
  const [isShowingNoBulkEntryMessage, setIsShowingNoBulkEntryMessage] = useState(true)
  const [isFileChosen, setIsFileChosen] = useState(false)
  const [file, setFile] = useState(undefined)
  const [fileSubmitted, setFileSubmitted] = useState(true)
  const [courseScheduledschoolYearId, setCourseScheduledschoolYearId] = useState(target.value)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			if (!hasInit && props.personConfigEntry !== personConfigLocal)
    					setPersonConfigLocal(props.personConfigEntry); setHasInit(true)
    	
  }, [])

  const {fileFieldOptions, schoolYears, personConfig, companyConfig} = props
      
  		const config = componentConfig
  		const djsConfig = djsConfig
  
  		const eventHandlers = {
  				init: dz => dropzone = dz,
  				addedfile: handleFileAdded,
  		}
  
      return (
          <div className={styles.container}>
  						<form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
  		            <div className={globalStyles.pageTitle}>
  		                Add Students in Bulk
  		            </div>
  								<div>
  										<div className={classes(styles.row, styles.space)}>
  												<div className={styles.optionLabel}>Step</div>
  												<div className={styles.optionCount}>1</div>
  												<div className={styles.description}>Upload a spreadsheet (.xlsx) or a comma-delimited file (.csv)</div>
  										</div>
  										<div className={classes(styles.row, styles.space)}>
  												<div className={styles.optionLabel}>Step</div>
  												<div className={styles.optionCount}>2</div>
  												<div className={styles.description}>Choose which line has the first record in order to skip header information</div>
  										</div>
  										<div className={classes(styles.row, styles.space)}>
  												<div className={styles.optionLabel}>Step</div>
  												<div className={styles.optionCount}>3</div>
  												<div className={styles.description}>Indicate the data which is found in each column.  You can skip columns which contain unrelated information. The lists are pre-set with a default. Your choices are saved for the next time you come to this page.</div>
  										</div>
  										<div className={classes(styles.row, styles.space)}>
  												<div className={styles.optionLabel}>Note</div>
  												<div className={styles.optionCount}> </div>
  												<div className={styles.description}>
  														If this option does not work well for you, we can take care of it for you.
  														Choose option #2 in the <span onClick={() => navigate('/studentAddOptions')} className={styles.link}>Student Add option</span> page.
  												</div>
  										</div>
  								</div>
  								<hr/>
  								<div className={styles.labelDropZone}>
  										Click on the box below to browse for a file, or drag-and-drop a file into the box.
  								</div>
  								<div className={styles.labelDropZone}>
  										ONLY COMMA-DELIMITED FILES (CSV) ARE ALLOWED. You can save an Excel spreadsheet as a comma-delimited-file with the .csv extension.
  								</div>
  								<div className={styles.maxWidth}>
  										<DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}>
  												Click here to upload or
  										</DropZone>
  								</div>
  								<div className={styles.background}>
  										<div>
  												<SelectSingleDropDown
  														id={`schoolYearId`}
  														label={`School year`}
  														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
  														options={schoolYears}
  														height={`medium`}
  														onChange={handleUpdateSchoolYear}/>
  										</div>
  		                <div>
  												<SelectSingleDropDown
  		                        id={`lineStart`}
  		                        label={`On which line does the data start? (skip column headings)`}
  		                        value={bulk.delimiter}
  														noBlank={true}
  		                        options={[
  																{id: 0, label: 'first line'},
  																{id: 1, label: 'second line'},
  																{id: 2, label: 'third line'},
  																{id: 3, label: 'fourth line'},
  																{id: 4, label: 'fifth line'},
  																{id: 5, label: 'sixth line'},
  																{id: 6, label: 'seventh line'},
  																{id: 7, label: 'eighth line'},
  																{id: 8, label: 'ninth line'},
  														]}
  		                        height={`medium`}
  		                        onChange={changeBulk} />
  										</div>
  								</div>
  								<div>
                      <SelectSingleDropDown
                          id={1}
                          label={`First field`}
                          value={isValueSet(1)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={2}
                          label={`Second field`}
                          value={isValueSet(2)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={3}
                          label={`Third field`}
                          value={isValueSet(3)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={4}
                          label={`Fourth field`}
                          value={isValueSet(4)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={5}
                          label={`Fifth field`}
                          value={isValueSet(5)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={6}
                          label={`Sixth field`}
                          value={isValueSet(6)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={7}
                          label={`Seventh field`}
                          value={isValueSet(7)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={8}
                          label={`Eighth field`}
                          value={isValueSet(8)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={9}
                          label={`Ninth field`}
                          value={isValueSet(9)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
                      <SelectSingleDropDown
                          id={10}
                          label={`Tenth field`}
                          value={isValueSet(10)}
                          options={fileFieldOptions}
                          height={`medium`}
                          onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={11}
  												label={`Eleventh field`}
  												value={isValueSet(11)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={12}
  												label={`Twelfth field`}
  												value={isValueSet(12)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={13}
  												label={`Thirteenth field`}
  												value={isValueSet(13)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={14}
  												label={`Fourteenth field`}
  												value={isValueSet(14)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={15}
  												label={`Fifteenth field`}
  												value={isValueSet(15)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={16}
  												label={`Sixteenth field`}
  												value={isValueSet(16)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
  										<SelectSingleDropDown
  												id={17}
  												label={`Seventeenth field`}
  												value={isValueSet(17)}
  												options={fileFieldOptions}
  												height={`medium`}
  												onChange={changeBulk} />
                  </div>
  								<div className={styles.buttonDiv}>
  										<a onClick={() => goBack()} className={styles.cancelLink}>Cancel</a>
  										{!fileSubmitted &&
  												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} className={file && file.name ? '' : styles.lowOpacity}
  														onClick={file && file.name ? handleSubmit : handleNoFileOpen} />
  										}
  										{fileSubmitted &&
  												<div className={styles.text}>Loading... you will be redirected</div>
  										}
  								</div>
  						</form>
              <OneFJefFooter />
  						{isShowingModal &&
                  <MessageModal handleClose={handleNoFileClose} heading={<L p={p} t={`No File Chosen`}/>}
                     explainJSX={<L p={p} t={`If you just entered a file, wait for just a moment until it finishing uploading.  Otherwise, please choose a file with student information before choosing to submit a file`}/>}
                     onClick={handleNoFileClose} />
              }
          </div>
      )
}

export default withAlert(StudentAddBulkView)
