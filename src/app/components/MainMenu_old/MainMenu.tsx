import { useEffect, useState } from 'react';import styles from './MainMenu.css'
const p = 'StudentScheduleView'
import L from '../../components/PageLanguage'
import { useNavigate } from 'react-router-dom'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function MainMenu(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            //  document.body.addEventListener("click", handleClosed);
            // dropdown.addEventListener("click", handleDisplay);
            menuThing.addEventListener("click", handleDisplay)
            // grayArea.addEventListener("click", handleDisplay);
            //document.body.addEventListener('keyup', checkForKeypress);
        
    return () => {
      
              document.body.removeEventListener("click", handleClosed)
          
    }
  }, [])

  return (
            <div className={classes(styles.container, styles.row)} ref={(ref) => (menuThing = ref)}>
                <input type="checkbox" className={styles.check} id="checked" checked={opened} ref={(ref) => (dropdown = ref)}/>
								{/*<div className={classes(globalStyles.link, styles.whiteMenu)}>MENU</div>*/}
								<div>
		                <label className={styles.menuBtn}>
		                    <span className={classes(styles.bar, styles.top)}></span>
		                    <span className={classes(styles.bar, styles.middle)}></span>
		                    <span className={classes(styles.bar, styles.bottom)}></span>
		                </label>
								</div>
            </div>
        )
}
export default withAlert(MainMenu)

//<li><Link to={`/bidRequests`} className={styles.menuItem}>Bid Requests</Link></li>
