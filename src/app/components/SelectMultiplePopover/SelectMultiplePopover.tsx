import { useEffect, useState } from 'react';import * as styles from './SelectMultiplePopover.css'
import classes from 'classnames'

function SelectMultiplePopover(props) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener("click", handleClosed)
            if (!props.disabled) {
                dropdown.addEventListener("click", handleDisplay)
            }
        
    return () => {
      
              document.body.removeEventListener("click", handleClosed)
          
    }
  }, [])

  const {label, children, className="", disabled=false} = props
          
          return (
              <div className={classes(className, styles.container)}>
                  <div className={classes(styles.button, className, (opened ? styles.toggledOn : styles.toggledOff), (disabled ? styles.disabled : ''))} ref={(ref) => (disabled ? '' : dropdown = ref)}>
                      {label}
                      <b className={styles.caret}></b>
                  </div>
                  {!disabled && <div className={classes(styles.dropdown, (opened && styles.opened))}>
                      {children}
                  </div>}
              </div>
          )
}
export default SelectMultiplePopover
