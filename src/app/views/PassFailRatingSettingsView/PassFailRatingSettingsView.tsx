import { useEffect, useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import styles from './PassFailRatingSettingsView.css'
const p = 'PassFailRatingSettingsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import Icon from '../../components/Icon'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {doSort} from '../../utils/sort'

function PassFailRatingSettingsView(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSequence, setNewSequence] = useState('')
  const [passFailRatings, setPassFailRatings] = useState([])
  const [isInitialized, setIsInitialized] = useState(true)
  const [sequence, setSequence] = useState('')

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {passFailRatings} = props
    			
    			if (!isInitialized && passFailRatings && passFailRatings.length > 0) {
    					setIsInitialized(true); setPassFailRatings(passFailRatings)
    			}
    	
  }, [])

  		passFailRatings = doSort(passFailRatings, { sortField: 'sequence', isAsc: true, isNumber: true })
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Pass Fail Rating Settings`}/>
              </div>
  						{passFailRatings.map((m, i) =>
  								<div key={i} className={classes(styles.moreLeft, styles.row, styles.moreTop)}>
  										<div onClick={() => handleRemoveItemOpen(m.id)} className={styles.iconPosition}>
  												<Icon pathName={'cross_circle'} premium={true} fillColor={'maroon'} className={styles.icon}/>
  										</div>
  
  										<InputText
  												id={`sequence`}
  												name={`sequence`}
  												description={`sequence`}
  												max-length={1}
  												numberOnly={true}
  												size={"super-short"}
  												label={<L p={p} t={`Sequence`}/>}
  												value={m.sequence === 0 ? 0 : m.sequence ? m.sequence : ''}
  												onChange={(event) => handleOldChange(m.id, event)}
  												onBlur={(event) => { !!event.target.value && !!m.name && setPassFailRating(personId, m.name, event.target.value) }}
  												required={true}
  												whenFilled={m.sequence === 0 ? '0' : m.sequence} />
  
  										<div className={styles.moreLeft}>
  												<InputText
  														id={`name`}
  														name={`name`}
  														size={"medium"}
  														label={<L p={p} t={`Name`}/>}
  														value={m.name || ''}
  														onChange={(event) => handleOldChange(m.id, event)}
  														onBlur={(event) => { !!event.target.value && !!m.sequence && setPassFailRating(personId, event.target.value, m.sequence) }}
  														required={true}
  														whenFilled={m.name} />
  										</div>
  								</div>
  						)}
  						<div className={classes(styles.addBackground, styles.moreTop)}>
  								<div className={styles.header}>Add new rating</div>
  								<div className={styles.row}>
  										<InputText
  												id={`newSequence`}
  												name={`newSequence`}
  												max-length={1}
  												numberOnly={true}
  												size={"super-short"}
  												label={<L p={p} t={`Sequence`}/>}
  												value={newSequence || ''}
  												onChange={handleNewChange} />
  
  										<div className={styles.moreLeft}>
  												<InputText
  														id={`newName`}
  														name={`newName`}
  														size={"medium"}
  														label={<L p={p} t={`Name`}/>}
  														value={newName || ''}
  														onChange={handleNewChange} />
  										</div>
  										<div className={styles.buttonHeight}>
  												<ButtonWithIcon label={<L p={p} t={`Add`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  										</div>
  								</div>
  						</div>
  						<hr/>
              <div className={styles.rowRight}>
                  <button className={styles.submitButton} onClick={() => navigate("/schoolSettings")}>
                      <L p={p} t={`Done`}/>
                  </button>
              </div>
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this Pass / Fail rating?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this Pass / Fail rating?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
        </div>
      )
}
export default PassFailRatingSettingsView
