import { useState } from 'react';  //PropTypes
import styles from './OpenRegistrationsList.css'
import EditTable from '../EditTable'
import Icon from '../Icon'
import DateMoment from '../DateMoment'
import MessageModal from '../MessageModal'
const p = 'component'
import L from '../../components/PageLanguage'

function OpenRegistrationsList(props) {
  const [openRegistrationTableId, setOpenRegistrationTableId] = useState('')
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)

  const {openRegistrations, accessRoles, isFetchingRecord} = props
  				
  				let headings = [
  						{},
  						{label: <L p={p} t={`Name`}/>, tightText: true},
  						{label: <L p={p} t={`Students`}/>, tightText: true},
  						{label: <L p={p} t={`From`}/>, tightText: true},
  						{label: <L p={p} t={`To`}/>, tightText: true},
  				]
  
  				let data = openRegistrations && openRegistrations.length > 0 && openRegistrations.map(m => ([
  					{value:
  							accessRoles.admin &&
  							<div className={styles.row}>
  									<a onClick={() => handleRemoveOpen(m.openRegistrationTableId)} className={styles.redLink}>
  											<L p={p} t={`remove`}/>
  									</a>
  									<a onClick={() => handleEdit(m.openRegistrationTableId, m.studentList)}>
  											<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
  									</a>
  							</div>
  					},
  					{ value: m.name },
  					{ value: m.studentList && m.studentList.length },
  					{ value: <DateMoment date={m.openDateFrom} format={`D MMM YYYY`} className={styles.entryDate}/> },
  					{ value: <DateMoment date={m.openDateTo} format={`D MMM YYYY`} className={styles.entryDate}/> },
  				]))
  
          return (
              <div className={styles.container}>
  								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={isFetchingRecord}/>
  								{isShowingModal_remove &&
  		                <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this open registration?`}/>}
  		                   explainJSX={<L p={p} t={`Are you sure you want to remove this open registration?`}/>} isConfirmType={true}
  		                   onClick={handleRemove} />
  		            }
              </div>
          )
}
export default OpenRegistrationsList
