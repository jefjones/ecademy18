import { useState } from 'react'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import 'normalize.css'
import styles from './AppView.css'
const p = 'AppView'
import L from '../../components/PageLanguage'
import MediaQuery from 'react-responsive'
import MobileHeader from '../../components/MobileHeader'
import FirstNavView from '../FirstNavView'
import CalendarAndEventsView from '../CalendarAndEventsView'
import AdminResponsePendings from '../../components/AdminResponsePendings'
import classes from 'classnames'

// AppView — wrapped in a functional component to access the useLocation hook
// while keeping the class-based component logic intact.
function AppViewWrapper(props) {
    const location = useLocation()
    return <AppView {...props} currentPathname={location.pathname} />
}

export default AppViewWrapper

export function AppView(props) {
  const [lastTouchY, setLastTouchY] = useState(0)

  const onRenderContent = (target, content) => {
    
            return <L p={target.dataset.page} t={target.dataset.text}/>
        
  }

  const {personId, children, currentPathname, accessRoles={}, adminResponsePendings, confirmSafetyAlert, confirmCheckInOrOut, confirmVolunteerHour,
  								companyConfig} = props
  				return (
              <div className={personId ? styles.app : styles.divCenter}>
                  {/* <ReactHint autoPosition events delay={100} />
                  <ReactHint persist attribute="data-custom" onRenderContent={onRenderContent}/> */}
  
                  {personId &&
                      <MobileHeader {...props} />
                  }
                  {personId &&
  										<MediaQuery minWidth={696}>
  		                  {(matches) => {
  		                    if (matches) {
  		                      return (
                                <div className={personId ? styles.rowScroll : styles.divCenter}>
                                    <div className={personId ? styles.divLeft : ''}>
  																			{personId &&
  																					<FirstNavView {...props} />
  																			}
                                    </div>
                                    <div className={personId ? classes(styles.divMiddle, styles.divLeftMarginRight) : ''}>
                                        {personId && children && currentPathname && currentPathname.indexOf('/firstNav') > -1
  																					? accessRoles.doctor
  																							? ''
  																							: !accessRoles.hasEnrolledStudent && accessRoles.observer
  																									? '' //<TutorialVideoView  {...props} tutorialLabel={<L p={p} t={`Registration by primary guardian`}/>} />
  																									: companyConfig.urlcode === 'Manheim'
  																											? ''
  																											: <CalendarAndEventsView {...props} />
  																					: children
  																			}
                                    </div>
  																	{accessRoles.admin && adminResponsePendings && adminResponsePendings.length > 0 &&
  																			<div className={styles.divRight}>
  																					<AdminResponsePendings adminResponsePendings={adminResponsePendings} confirmSafetyAlert={confirmSafetyAlert}
  																							confirmCheckInOrOut={confirmCheckInOrOut} confirmVolunteerHour={confirmVolunteerHour}/>
  																			</div>
  																	}
                                </div>
  		                        )
  		                    } else {
  		                      return (
  		                        <div className={styles.moreTop}>
  		                            {children}
  		                        </div>
  		                      )
  		                    }
  		                  }}
  		                </MediaQuery>
  								}
  								{!personId && <div>{children}</div>}
              </div>
          )
}
