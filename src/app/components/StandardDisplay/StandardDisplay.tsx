import { useState } from 'react'
import styles from './StandardDisplay.css'
import globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../MessageModal'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function StandardDisplay(props) {
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [description, setDescription] = useState(standard.code + ' - ' + standard.name)

  const {standards=[]} = props
  			
  
  	    return (
  					<div className={styles.container}>
  							<hr/>
  							{standards.map((s, i) =>
  									<div key={i} className={classes(styles.text, (s.name && s.name.length > 100 ? globalStyles.link : ''))}
  													onClick={s.name && s.name.length > 100 ? () => handleDisplayOpen(s) : () => {}}>
  											{s.name && s.name.length > 100
  													? s.code + ' - ' + s.name.substring(0, 100) + '...'
  													: s.code + ' - ' + s.name
  											}
  									</div>
  							)}
  							<hr/>
  							{isShowingModal &&
  	                <MessageModal handleClose={handleDisplayClose} heading={<L p={p} t={`Standard Code and Name`}/>}
  	                   explain={description} onClick={handleDisplayClose}/>
  	            }
  					</div>
  	    )
}
export default StandardDisplay
