import { useEffect, useState } from 'react';  //PropTypes
import * as styles from './CarpoolMemberStudentsModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import TextDisplay from '../TextDisplay'
import ButtonWithIcon from '../ButtonWithIcon'
import Loading from '../Loading'
import CheckboxGroup from '../CheckboxGroup'
const p = 'component'
import L from '../../components/PageLanguage'

function CarpoolMemberStudentsModal(props) {
  const [isInit, setIsInit] = useState(true)
  const [errorStudents, setErrorStudents] = useState(<L p={p} t={`At least one student is required`}/>)
  const [p, setP] = useState(undefined)
  const [myStudentsInCarpool, setMyStudentsInCarpool] = useState(props.carpool && props.carpool.myStudentsAll && props.carpool.myStudentsAll && props.carpool.myStudentsAll.reduce((acc, m) => m.inCarpool ? acc ? acc.concat(m.studentPersonId) : [m.studentPersonId] : acc, []))

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {carpool, isShowing} = props
    				if (isShowing && !isInit && carpool.myStudentsInCarpool && carpool.myStudentsInCarpool.length > 0) {
    						let myStudentsInCarpool = carpool.myStudentsInCarpool.reduce((acc, m) => m.inCarpool ? acc ? acc.concat(m.studentPersonId) : [m.studentPersonId] : acc, [])
    						setIsInit(true); setMyStudentsInCarpool(myStudentsInCarpool)
    				}
    		
  }, [])

  const {handleClose, carpool} = props
          
  
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose}>
                      <ModalDialog onClose={handleClose}>
                          <div className={styles.dialogHeader}>{<L p={p} t={`Carpool Member Student`}/>}</div>
  												<div className={styles.rowWrap}>
  														<TextDisplay label={<L p={p} t={`Carpool name`}/>} text={carpool.name}/>
  												</div>
  												<div className={styles.moreTop}>
  														<Loading isLoading={!myStudentsInCarpool || myStudentsInCarpool.length === 0} />
  														{myStudentsInCarpool && myStudentsInCarpool.length > 0 &&
  																<CheckboxGroup
  																		name={'myStudents'}
  																		options={carpool.myStudentsAll || []}
  																		horizontal={true}
  																		onSelectedChanged={handleSelectChange}
  																		label={<L p={p} t={`Choose students who will be in this carpool:`}/>}
  																		selected={myStudentsInCarpool}
  																		error={errorStudents}/>
  														}
  												</div>
                          <div className={styles.dialogButtons}>
                              <a className={styles.noButton}  onClick={handleClose}>Cancel</a>
  														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
                          </div>
                      </ModalDialog>
                  </ModalContainer>
              </div>
          )
}
export default CarpoolMemberStudentsModal
