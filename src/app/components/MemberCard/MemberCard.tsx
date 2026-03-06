import { useEffect, useState } from 'react';import styles from './MemberCard.css'
import classes from 'classnames'

function SelectMultiplePopover(props) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener("click", handleClosed)
            dropdown.addEventListener("click", handleDisplay)
        
    return () => {
      
              document.body.removeEventListener("click", handleClosed)
          
    }
  }, [])

  const {member={}, className=""} = props
          
          return (
              <div className={classes(className, styles.container)}>
                  <div className={classes(styles.labelLink, className, (opened ? styles.menuTick : '' ))} ref={(ref) => dropdown = ref}>
                          {member.title.label}
                  </div>
                  <div className={classes(styles.dropdown, (opened && styles.opened), (opened && styles.arrow))}>
                      <h3 className={styles.popoverTitle}>
                          {member.title.label && <span className={styles.leftTitle}>{member.title.label}
                              {member.title.parenthetical && <span className=""> {`(${member.title.parenthetical})`}</span>}
                          </span>}
                          {member.title.rightSide && (<span className={styles.rightTitle}>{member.title.rightSide}</span>)}
                      </h3>
                      {member.data && member.data.map((d, n) => (
                          <div key={n} className={styles.dataContainer}>
                              <span className={styles.dataLabel}>{d.label}</span><br/>
                              {d.type === "EMAILLINK"
                              ?    <a href={`mailto:${d.text}`} className={styles.dataLink}>{d.text}</a>
                              : d.type === "PHONELINK"
                                  ? <a href={`tel:${d.text}`} className={styles.dataLink}>{d.text}</a>
                                  : d.type === "LINEDIVIDER" ?
                                      <hr className={styles.divider}/>
                              : <span className={styles.dataText}>{d.text}</span> }
                          </div>
                      ))}
                      <button className={styles.button}>View Member Profile</button>
                  </div>
              </div>
          )
}
export default SelectMultiplePopover
