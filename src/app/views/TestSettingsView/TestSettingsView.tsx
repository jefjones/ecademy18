import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './TestSettingsView.css'
const p = 'TestSettingsView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import InputTextArea from '../../components/InputTextArea'
import OneFJefFooter from '../../components/OneFJefFooter'

function TestSettingsView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(false)
  const [test, setTest] = useState({
				testId: '',
        name: '',
				possibleScore: '',
				description: '',
      })
  const [testId, setTestId] = useState('')
  const [name, setName] = useState('')
  const [possibleScore, setPossibleScore] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
				name: '',
				possibleScore: '',
      })
  const [p, setP] = useState(undefined)

  const {tests, fetchingRecord} = props
      
      let headings = [{}, {},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Used in`}/>, tightText: true},
  			{label: <L p={p} t={`Description`}/>, tightText: true},
  		]
  
      let data = []
  
      if (tests && tests.length > 0) {
          data = tests.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.testId)}><Icon pathName={'pencil0'} premium={true} className={globalStyles.icon}/></a>},
                {value: <a onClick={() => handleRemoveItemOpen(m.testId)}><Icon pathName={'trash2'} premium={true} className={globalStyles.icon}/></a>},
  							{value: m.name},
  							{value: m.usedIn},
  							{value: m.description},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  {'Test List'}
              </div>
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={test.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={test.name}
  								error={errors.name} />
  						<InputText
  								id={`possibleScore`}
  								name={`possibleScore`}
  								size={"super-short"}
  								label={<L p={p} t={`Points Possible`}/>}
  								numberOnly={true}
  								value={test.possibleScore || ''}
  								required={true}
  								whenFilled={test.possibleScore}
  								onChange={handleChange}
  								error={errors.possibleScore}/>
  						<InputTextArea
  								label={<L p={p} t={`Description`}/>}
  								name={'description'}
  								value={test.description || ''}
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
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this Test?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this test?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This test is in use`}/>}
  										explainJSX={<L p={p} t={`This test has been taken by at least one student and cannot be deleted.`}/>}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default TestSettingsView
