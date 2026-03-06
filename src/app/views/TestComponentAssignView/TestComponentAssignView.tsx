import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './TestComponentAssignView.css'
const p = 'TestComponentAssignView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'

function TestComponentAssignView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(false)
  const [testComponentAssign, setTestComponentAssign] = useState({
				testComponentAssignId: '',
				testComponentId: '',
				testId: '',
				possibleScore: '',
      })
  const [testComponentAssignId, setTestComponentAssignId] = useState('')
  const [testComponentId, setTestComponentId] = useState('')
  const [testId, setTestId] = useState('')
  const [possibleScore, setPossibleScore] = useState('')
  const [errors, setErrors] = useState({
				testComponentId: '',
				testId: '',
      })
  const [p, setP] = useState(undefined)
  const [name, setName] = useState(<L p={p} t={`Component is required`}/>)

  const {testSettings={}, fetchingRecord} = props
      
  		let tests = testSettings.tests
  		let testComponents = testSettings.testComponents
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Test`}/>, tightText: true},
  			{label: <L p={p} t={`Component`}/>, tightText: true},
  			{label: <L p={p} t={`Possible score`}/>, tightText: true},
  			{label: <L p={p} t={`Used in`}/>, tightText: true},
  		]
  
      let data = []
  		let currentTest = ''
  
      if (tests && tests.length > 0) {
          tests.forEach(m => {
  						m && m.testComponentsAssigned && m.testComponentsAssigned.length > 0 && m.testComponentsAssigned.forEach(c => {
  								let testName = currentTest !== m.name ? m.name : ''
  								currentTest = m.name
  		         		data.push([
  										{value: <a onClick={() => handleEdit(c.testComponentAssignId, m.testId, c.testComponentId, c.possibleScore)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
  			              {value: <a onClick={() => handleRemoveItemOpen(c.testComponentAssignId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  										{value: testName},
  										{value: c.testComponentName},
  										{value: c.possibleScore},
  										{value: c.usedIn},
  		            ])
  						})
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Assign Components to Tests`}/>
              </div>
  						<div>
  								<SelectSingleDropDown
  										id={`testId`}
  										name={`testId`}
  										label={<L p={p} t={`Test`}/>}
  										value={testComponentAssign.testId || ''}
  										options={tests}
  										height={'medium'}
  										className={styles.moreBottomMargin}
  										onChange={handleChange}/>
  						</div>
  						<div>
  								<SelectSingleDropDown
  										id={`testComponentId`}
  										name={`testComponentId`}
  										label={<L p={p} t={`Test Component`}/>}
  										value={testComponentAssign.testComponentId || ''}
  										options={testComponents}
  										height={'medium'}
  										className={styles.moreBottomMargin}
  										onChange={handleChange}
  										error={errors.testComponentId}/>
  						</div>
  						<InputText
  								id={`possibleScore`}
  								name={`possibleScore`}
  								size={"super-short"}
  								label={<L p={p} t={`Points Possible`}/>}
  								numberOnly={true}
  								value={testComponentAssign.possibleScore || ''}
  								onChange={handleChange}/>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} isFetchingRecord={fetchingRecord.testSettings}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this Test Component Assignment?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this test component assignment?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This test component assignment is in use`}/>}
  										explainJSX={<L p={p} t={`This test component assignment has been used by at least one test and cannot be deleted.`}/>}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default TestComponentAssignView
