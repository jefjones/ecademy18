import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './LunchMenuOptionSetupView.css'
const p = 'LunchMenuOptionSetupView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'

function LunchMenuOptionSetupView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [lunchMenuOptionId, setLunchMenuOptionId] = useState('')
  const [lunchMenuOption, setLunchMenuOption] = useState({
				lunchMenuOptionId: '',
        name: '',
        contents: '',
      })
  const [name, setName] = useState('')
  const [contents, setContents] = useState('')
  const [errors, setErrors] = useState({
        name: '',
        contents: '',
      })
  const [p, setP] = useState(undefined)

  const {lunchMenuOptions} = props
      
  
      let headings = [{}, {},
  				{label: <L p={p} t={`Name`}/>, tightText: true},
  				{label: <L p={p} t={`Contents`}/>, tightText: true},
  		]
  
      let data = []
  
      if (lunchMenuOptions && lunchMenuOptions.length > 0) {
          data = lunchMenuOptions.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.lunchMenuOptionId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
                {id: m.lunchMenuOptionId, value: <a onClick={() => handleRemoveItemOpen(m.lunchMenuOptionId)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
                {id: m.lunchMenuOptionId, value: m.name},
                {id: m.lunchMenuOptionId, value: m.contents},
              ])
          })
      } else {
          data = [[{value: ''}, {colSpan: 4, value: <i><L p={p} t={`No lunch menu options entered yet.`}/></i> }]]
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Lunch Menu Option Setup`}/>
              </div>
              <div>
  								<InputText
  										id={'name'}
  										name={'name'}
  										value={lunchMenuOption.name}
  										label={<L p={p} t={`Area name`}/>}
  										size={"medium"}
  										onChange={handleChange}
  										required={true}
  										whenFilled={lunchMenuOption && lunchMenuOption.name}
                      error={errors.name}/>
              </div>
  						<div>
  								<InputTextArea label={<L p={p} t={`Contents`}/>} rows={5} cols={45} value={lunchMenuOption.contents} onChange={handleChange} id={'contents'} name={'contents'}
  										required={true}
  										whenFilled={lunchMenuOption && lunchMenuOption.contents}
  										className={styles.commentBox} boldText={true}/>
              </div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this lunch menu option?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this lunch menu option?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
        </div>
      )
}
export default LunchMenuOptionSetupView
