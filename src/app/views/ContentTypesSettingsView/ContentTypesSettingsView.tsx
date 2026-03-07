import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './ContentTypesSettingsView.css'
const p = 'ContentTypesSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

function ContentTypesSettingsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [contentTypeId, setContentTypeId] = useState('')
  const [contentType, setContentType] = useState({
        name: '',
				code: '',
        sequence: props.contentTypes && props.contentTypes.length + 1,
      })
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [sequence, setSequence] = useState(props.contentTypes && props.contentTypes.length + 1)
  const [errors, setErrors] = useState({
				name: '',
				code: '',
        sequence: '',
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_usedIn, setIsShowingModal_usedIn] = useState(true)
  const [listUsedIn, setListUsedIn] = useState([])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        	if (props.contentTypes !== prevProps.contentTypes) {
    					setContentType({...contentType, sequence: props.contentTypes && props.contentTypes.length + 1 })
    			}
      
  }, [])

  const {contentTypes, sequences, fetchingRecord, companyConfig} = props
      
  
      let headings = [{}, {},
  			{label: <L p={p} t={`Code`}/>, tightText: true},
  			{label: <L p={p} t={`Name`}/>, tightText: true},
  			{label: <L p={p} t={`Sequence`}/>, tightText: true},
  			{label: <L p={p} t={`Used In`}/>, tightText: true}
  		]
  
      let data = []
  
      if (contentTypes && contentTypes.length > 0) {
          data = contentTypes.map(m => {
              return ([
  							{value: m.code === 'BENCHMARK' ? '' : <a onClick={() => handleEdit(m.contentTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {value: m.code === 'BENCHMARK' ? '' : <a onClick={() => handleRemoveItemOpen(m.contentTypeId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
  							{value: m.code},
  							{value: m.name},
  							{value: m.sequence},
                {value: m.usedIn && m.usedIn.length, clickFunction: () => handleShowUsedInOpen(m.usedIn)},
              ])
          })
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Content Type Settings`}/>
              </div>
  						<InputText
  								id={`code`}
  								name={`code`}
  								size={"short"}
  								label={<L p={p} t={`Code`}/>}
  								value={contentType.code || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={contentType.code} />
  						<InputText
  								id={`name`}
  								name={`name`}
  								size={"medium"}
  								label={<L p={p} t={`Name`}/>}
  								value={contentType.name || ''}
  								onChange={handleChange}
  								required={true}
  								whenFilled={contentType.name}
  								error={errors.name} />
  						<div>
  								<SelectSingleDropDown
  										id={'sequence'}
  										label={<L p={p} t={`Sequence (for list display)`}/>}
  										value={contentType.sequence || ''}
  										noBlank={true}
  										options={sequences}
  										className={styles.dropdown}
  										onChange={handleChange}/>
  						</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.contentTypeSettings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
  						{companyConfig.features.benchmarkTests &&
  								<div className={globalStyles.instructionsBigger}>
  										<L p={p} t={`The Benchmark Test feature is turned on.  The "Benchmark Test" content type is included here which can only be taken out by turning off the feature.`}/>
  								</div>
  						}
  						{companyConfig.features.benchmarkTests && <hr/>}
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this content type?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this content type?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_usedIn &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Content Type is used in these Assignments`}/>}
  										explainJSX={<L p={p} t={`In order to delete this content type please reassign the following courses with a different content type setting:<br/><br/>`}/> + listUsedIn}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default ContentTypesSettingsView
