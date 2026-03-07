import { useEffect, useState } from 'react';import * as styles from './SubMenuSideOver.css'
import Icon from '../Icon/Icon'
import classNames from 'classnames'
import workMenuIcon from '../../assets/workMenuIcon.png'

function SubMenuSideOver(props) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            //document.body.addEventListener("click", handleClosed);
            button.addEventListener("click", handleDisplay)
            mainMenuReturn.addEventListener("click", handleDisplay)
        
    return () => {
      
              document.body.removeEventListener("click", handleClosed)
          
    }
  }, [])

  const {className, children, label, icon, iconSize, id} = props
          
  
          return (
              <div className={classNames(styles.container, className)}>
                  <img src={workMenuIcon} className={styles.menuIcon} ref={(ref) => (button = ref)} />
                  <div className={classNames(styles.children, (opened && styles.opened))}>
                    <span className={styles.menuReturnIcon} ref={(ref) => (mainMenuReturn = ref)}>x</span><br />
                      <div className={styles.whiteText}>
                         {children}
                      </div>
                  </div>
              </div>
          )
}
export default SubMenuSideOver
