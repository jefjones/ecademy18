import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CarpoolAdminAreaEntryView.css'
const p = 'CarpoolAdminAreaEntryView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'

function CarpoolAdminAreaEntryView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [carpoolAreaId, setCarpoolAreaId] = useState('')
  const [carpoolArea, setCarpoolArea] = useState({
				carpoolAreaId: '',
        areaName: '',
        description: '',
      })
  const [areaName, setAreaName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
        areaName: '',
        description: '',
      })
  const [p, setP] = useState(undefined)
  const [isShowingModal_requests, setIsShowingModal_requests] = useState(true)
  const [listUsedIn, setListUsedIn] = useState([])

  const {personId, myFrequentPlaces, setMyFrequentPlace, carpoolAreas} = props
      
  
      let headings = [{}, {},
  				{label: <L p={p} t={`Area name`}/>, tightText: true},
  				{label: <L p={p} t={`Description`}/>, tightText: true},
  				{label: <L p={p} t={`Requests`}/>, tightText: true}]
  
      let data = []
  
      if (carpoolAreas && carpoolAreas.length > 0) {
          data = carpoolAreas.map(m => {
              return ([
  							{value: <a onClick={() => handleEdit(m.carpoolAreaId)} className={styles.edit}>
  													<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  											</a>},
                {id: m.carpoolAreaId, value: <a onClick={() => handleRemoveItemOpen(m.carpoolAreaId, m.requests)} className={styles.remove}>
  																								<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
  																						</a>},
                {id: m.carpoolAreaId, value: m.areaName},
                {id: m.carpoolAreaId, value: m.description},
  							{value: m.requests && m.requests.length, clickFunction: () => handleShowUsedInOpen(m.requests)},
              ])
          })
      } else {
          data = [[{value: ''}, {value: <i><L p={p} t={`No carpool area names entered yet.`}/></i> }]]
      }
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Carpool Areas`}/>
              </div>
  						<div className={styles.instructions}>
                  {'The parent/guardian drivers can also add area names in case they want a specific area identified.'}
              </div>
              <div>
  								<InputText
  										id={'areaName'}
  										name={'areaName'}
  										value={carpoolArea.areaName}
  										label={<L p={p} t={`Area name`}/>}
  										size={"medium"}
  										onChange={changeArea}
  										required={true}
  										whenFilled={carpoolArea && carpoolArea.areaName}
                      error={errors.areaName}/>
              </div>
  						<div>
  								<InputText
  										id={'description'}
  										name={'description'}
  										value={carpoolArea.description}
  										label={<L p={p} t={`Description (optional)`}/>}
  										size={"long"}
  										onChange={changeArea}/>
              </div>
  
  						<div>
  								<InputText
  										id={'city'}
  										name={'city'}
  										value={carpoolArea.city}
  										label={<L p={p} t={`City (optional)`}/>}
  										size={"super-short"}
  										onChange={changeArea}/>
              </div>
  
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)}/>
              </div>
              <hr />
              <EditTable labelClass={styles.tableLabelClass} headings={headings}
                  data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                  sendToReport={handlePathLink}/>
              <hr />
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Carpool Areas`}/>} path={'carpoolAreas'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this carpool area?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this carpool area?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
  						{isShowingModal_requests &&
                  <MessageModal handleClose={handleShowUsedInClose} heading={<L p={p} t={`This Carpool Area has requests `}/>}
  										explainJSX={<L p={p} t={`This carpool area has requests pending from other drivers.  This carpool area cannot be deleted until the requests have been deleted or answered.`}/>}
  										onClick={handleShowUsedInClose}/>
              }
        </div>
      )
}
export default CarpoolAdminAreaEntryView
