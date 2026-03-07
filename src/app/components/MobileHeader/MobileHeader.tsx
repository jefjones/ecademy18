import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './MobileHeader.css'
import Logo from '../../assets/logos/ecademyapp logo super small no text.png'
import MainMenu from '../MainMenu'
import Idle from '../../utils/Idle'
import MediaQuery from 'react-responsive'
const p = 'component'
import L from '../../components/PageLanguage'

function MobileHeader(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [clickedOnCaret, setClickedOnCaret] = useState(false)
  const [isShowingOffline, setIsShowingOffline] = useState(false)

  useEffect(() => {
    
            window.addEventListener('online', handleOnline)
            window.addEventListener('offline', handleOffline)
        
  }, [])

  const {personId, personName, updatePersonConfig, personConfig, companyConfig, schoolYears, intervals, accessRoles, myFrequentPlaces,
  								myVisitedPages} = props
          
  
  				let schoolYearName = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === personConfig.schoolYearId)[0]
  				schoolYearName = schoolYearName ? schoolYearName.label : ''
  				let intervalName = intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === personConfig.intervalId)[0]
  				intervalName = intervalName ? intervalName.name : ''
  
          return (
              <div>
  							<div className={styles.container}>
  	              	<div className={styles.row}>
  		                  <div className={styles.topLogo} onClick={() => navigate('/firstNav')}>
  		                      <img src={Logo} className={styles.logo} alt={`eCademy app`} />
  		                  </div>
  											<MediaQuery maxWidth={2000} minWidth={701}>
  													{(matches) => {
  															if (matches) {
  																	return <div className={styles.row} onClick={() => navigate('/firstNav')}>
  																						<div className={styles.companyName}>{companyConfig.name}</div>
  																						<div className={styles.smallerHeader}>{`${schoolYearName} ${intervalName} `}</div>
  																				  </div>
  															} else {
  																	return null
  															}
  													}}
  											</MediaQuery>
  											<MediaQuery maxWidth={700} minWidth={501}>
  													{(matches) => {
  															if (matches) {
  																	return <div className={styles.companyName} onClick={() => navigate('/firstNav')}>
  																						{companyConfig && companyConfig.name && companyConfig.name.length > 35 ? companyConfig.name.substring(0,35) + '...' : companyConfig.name}
  																				</div>
  															} else {
  																	return null
  															}
  													}}
  											</MediaQuery>
  											<MediaQuery maxWidth={500} minWidth={400}>
  													{(matches) => {
  															if (matches) {
  																	return <div className={styles.companyName} onClick={() => navigate('/firstNav')}>
  																						{companyConfig && companyConfig.name && companyConfig.name.length > 22 ? companyConfig.name.substring(0,22) + '...' : companyConfig.name}
  																				 </div>
  															} else {
  																	return null
  															}
  													}}
  											</MediaQuery>
  											<MediaQuery maxWidth={399}>
  													{(matches) => {
  															if (matches) {
  																	return <div className={styles.companyName} onClick={() => navigate('/firstNav')}>
  																						{companyConfig && companyConfig.name && companyConfig.name.length > 15 ? companyConfig.name.substring(0,15) + '...' : companyConfig.name}
  																				 </div>
  															} else {
  																	return null
  															}
  													}}
  											</MediaQuery>
  									</div>
  									<MainMenu className={styles.nav} personId={personId} personName={personName} updatePersonConfig={updatePersonConfig}
  											accessRoles={accessRoles} myFrequentPlaces={myFrequentPlaces} myVisitedPages={myVisitedPages} companyConfig={companyConfig}/>
  	                </div>
  	                {isShowingOffline && <div className={styles.offlineText}><L p={p} t={`You appear to be offline.`}/></div>}
  	                <Idle
  	                    className={styles.highZIndex}
  	                    timeout={1200000}
  	                    onChange={({ idle}) => {
  	                        if (idle) {
  	                            //navigate("/login/timeout");
  	                            handleLogout()
  	                        }
  	                      }}
  	                    render={({ idle }) =>
  	                        <div>
  	                            {idle
  	                              ? <div className={styles.expiredText}><L p={p} t={`It appears that your session may have expired.`}/></div>
  	                              : <div></div>
  	                            }
  	                        </div>
  	                    }
                  />
              </div>
          )
}

//<b className={styles.caret}></b>
export default MobileHeader
