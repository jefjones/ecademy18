import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './TestComponentSettingsView.css'
const p = 'TestComponentSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import InputTextArea from '../../components/InputTextArea'
import OneFJefFooter from '../../components/OneFJefFooter'

function TestComponentSettingsView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(false)
  const [testComponent, setTestComponent] = useState({
				testComponentId: '',
        name: '',
				description: '',
      })
  const [testComponentId, setTestComponentId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
				name: '',
      })
  const [p, setP] = useState(undefined)

  const {testComponents, fetchingRecord} = props
      
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Used in`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  		]
  
      let data = []
  
      if (testComponents && testComponents.length > 0) {
          data = testComponents.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.testComponentId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.testComponentId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.name},
  							{value: m.usedIn},
  							{value: m.description},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Test Component List'}
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={testComponent.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={testComponent.name}
  								autoComplete={'dontdoit'}
  								error={errors.name} />
  						<InputTextArea
  								label={<L p={p} t={`Description`}/>}
  								name={'description'}
  								value={testComponent.description || ''}
  								autoComplete={'dontdoit'}
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
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this Test Component?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this test component?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This test component is in use`}/>}
  										explainJSX={<L p={p} t={`This test component has been taken by at least one test and cannot be deleted.`}/>}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default TestComponentSettingsView
