import { useEffect, useState } from 'react'
import styles from './DocumentPopupMenu.css'
import Icon from '../Icon/Icon'
import classNames from 'classnames'


function DocumentPopupMenu(props) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener("click", handleClosed)
            button.addEventListener("click", handleDisplay)
        
    return () => {
      
              document.body.removeEventListener("click", handleClosed)
          
    }
  }, [])

  const {className, children, label, icon, iconSize} = props
          
  
          return (
              <div className={classNames(styles.container, className)}>
                  <div className={styles.button} ref={(ref) => (button = ref)}>
                      <Icon pathName={icon} iconSize={iconSize}/>
                      <span className={styles.label}>{label}</span>
                  </div>
                  <div className={classNames(styles.children, (opened && styles.opened))}>
                      {children}
                  </div>
              </div>
          )
}
export default DocumentPopupMenu
