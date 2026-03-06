import { Link } from 'react-router-dom'
import { navigate, navigateReplace, goBack } from './'
import { useEffect, useState } from 'react';import styles from './MainMenu.css'
import globalStyles from '../../utils/globalStyles.css'
import classes from 'classnames'
import Icon from '../Icon'
import DateMoment from '../DateMoment'
const p = 'component'
import L from '../../components/PageLanguage'


function MainMenu(props) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener("click", handleClosed)
            dropdown.addEventListener("click", handleDisplay)
    				menuLines.addEventListener("click", handleDisplay)
            //menuText.addEventListener("click", handleDisplay);
            grayArea.addEventListener("click", handleDisplay)
            document.body.addEventListener('keyup', checkForKeypress)
        
    return () => {
      
      				document.body.removeEventListener("click", handleClosed)
      				dropdown.removeEventListener("click", handleDisplay)
      				menuLines.removeEventListener("click", handleDisplay)
      				//menuText.removeEventListener("click", handleDisplay);
      				grayArea.removeEventListener("click", handleDisplay)
      				document.body.removeEventListener('keyup', checkForKeypress)
          
    }
  }, [])

  const {personName, accessRoles, myFrequentPlaces, myVisitedPages, companyConfig} = props
          
  
          return (
              <div className={styles.container}>
                  <input type="checkbox" className={styles.check} id="checked" checked={opened} ref={(ref) => (dropdown = ref)} onChange={()=>{}}/>
  								<div className={classes(globalStyles.link, styles.whiteMenu, styles.muchRight)} onClick={() => navigate('/firstNav')} ref={(ref) => (menuText = ref)}><L p={p} t={`HOME`}/></div>
                  <label className={styles.menuBtn}  ref={(ref) => (menuLines = ref)}>
                      <span className={classes(styles.bar, styles.top)}></span>
                      <span className={classes(styles.bar, styles.middle)}></span>
                      <span className={classes(styles.bar, styles.bottom)}></span>
                  </label>
                  <label className={styles.closeMenu} ref={(ref) => (grayArea = ref)}></label>
                  <nav className={styles.drawerMenu}>
                      <span className={styles.loggedIn}><L p={p} t={`Signed in:`}/></span>
                      <span className={styles.personName}>{personName}</span>
  										<Link to={`/firstNav`} className={classes(styles.menuItem, styles.row)}>
  												<Icon pathName={'menu_lines'} premium={true} className={styles.icon}/>
  												<div className={styles.moreTop}><L p={p} t={`Main Menu (home)`}/></div>
  										</Link>
  										{accessRoles.admin && <hr />}
  										{accessRoles.admin &&
  												<Link to={`/schoolSettings`} className={classes(styles.row, styles.menuItem)}>
  														<Icon pathName={'cog'} premium={true} className={styles.icon}/>
  														<div className={styles.moreTop}><L p={p} t={`School Settings`}/></div>
  												</Link>
  										}
  										<hr />
  										{companyConfig.urlcode !== 'Manheim' &&
  												<Link to={`/myProfile`} className={classes(styles.menuItem, styles.row)}>
  														<Icon pathName={'portrait'} premium={true} className={styles.icon}/>
  														<div className={styles.moreTop}><L p={p} t={`My Profile`}/></div>
  												</Link>
  										}
  										<Link to={`/logout`} className={classes(styles.menuItem, styles.row)}>
  												<Icon pathName={'stop_circle'} premium={true} className={styles.icon}/>
  												<div className={styles.moreTop}><L p={p} t={`Logout`}/></div>
  										</Link>
  										<hr />
  										<div>
  												<div className={styles.subHeader}><L p={p} t={`My frequent places`}/></div>
  												{myFrequentPlaces && myFrequentPlaces.length > 0 && myFrequentPlaces.map((m, i) =>
  														<Link to={`/${m.path}`} key={i} className={styles.menuItem}>
  																{m.pageName}
  														</Link>
  												)}
  												{!(myFrequentPlaces && myFrequentPlaces.length > 0) &&
  														<div className={classes(globalStyles.instructionsBig, styles.moreLeft)}>
  																<L p={p} t={`Most page will have a checkbox at the bottom:  'My frequent place'.  By choosing that, the link to that page will appear here for your convenience.`}/>
  														</div>
  												}
  										</div>
  										<hr />
  										<div>
  												<div className={styles.subHeader}><L p={p} t={`My visited pages`}/></div>
  												{myVisitedPages && myVisitedPages.length > 0 && myVisitedPages.map((m, i) =>
  														<div key={i}>
  																<Link to={`${m.path}`} className={styles.menuItem}>
  																		<div className={styles.text}>{m.description}</div>
  																</Link>
  																<DateMoment date={m.entryDate} minusHours={0} className={styles.positionDate}/>
  														</div>
  												)}
  										</div>
                  </nav>
              </div>
          )
}


//<li><Link to={`/bidRequests`} className={styles.menuItem}>Bid Requests</Link></li>
export default MainMenu
