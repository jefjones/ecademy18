import * as styles from './BreadCrumb.css'
import Required from '../Required'
import classes from 'classnames'

export default ({options=[], currentIndex, onClick=()=>{}}, bigTextDisplay) => { //options will include whether the required entry has been fulfilled or not
    return (
				<div className={styles.container}>
						{options && options.length > 0 && options.map((m, i) => {
								let index = i+1*1
								return (
										<div key={i} className={classes((bigTextDisplay ? styles.bigText : ''), index === currentIndex ? styles.active : styles.inactive)} onClick={() => onClick(m.id)}>
												{m.label}
												{m.required && index < currentIndex &&
														<div><Required setIf={m.required} setWhen={m.isAnswered} iconWarningJSX={<div className={styles.requiredText}>?</div>}/></div>
												}
										</div>
								)
						})}
				</div>
    )
}
