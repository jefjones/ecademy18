import React, {Component} from 'react';
import styles from './MobileHeader.css';
import Logo from '../../assets/logos/ecademyapp logo super small no text.png';
import MainMenu from '../MainMenu';
import {browserHistory} from 'react-router';
import Idle from 'react-idle';
import MediaQuery from 'react-responsive';
const p = 'component';
import L from '../../components/PageLanguage';

export default class MobileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal: false,
            clickedOnCaret: false, //On clicking a second time, close the modal.  The isShowingModal is not dependable since the handleSummaryClose gets called somehow in between caret clicks.
            isShowingOffline: false,
        };
    }

    handleDeleteWork = (personId, workId) => {
        const {deleteWork} = this.props;
        deleteWork(personId, workId);

        this.handleSummaryClose(this.sendHome());
    }

    componentDidMount() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    handleLogout = () => {
        browserHistory.push(this.sendHome())
        this.props.logout();
    }

    handleHome = () => {
      browserHistory.push(this.sendHome());
    }

    sendHome = () => {
      let x = window.matchMedia("(min-width: 700px)");
      if (x.matches) {
          return "/login";
      } else {
          //return "/firstNav";
					return "/login";
      }
    }

    handleOffline = () => {
        this.setState({isShowingOffline: true})
    }

    handleOnline = () => {
        this.setState({isShowingOffline: false})
    }

    setWorkCurrentSelectedPlusClose = (personId, workId, chapterId, languageId_current, goToPage) => {
        this.props.setWorkCurrentSelected(personId, workId, chapterId, languageId_current, goToPage);
        if (goToPage !== "STAY") {
            this.handleSummaryClose();
        }
    }

    handleSummaryClose = (sendToPage) => {
    }

    handleSummaryOpen = () => {
        const {clickedOnCaret} = this.state;
        this.setState({isShowingModal: !clickedOnCaret, clickedOnCaret: !clickedOnCaret})
    }

    render() {
        const {personId, personName, updatePersonConfig, personConfig, companyConfig, schoolYears, intervals, accessRoles, myFrequentPlaces,
								myVisitedPages} = this.props;
        const {isShowingOffline} = this.state;

				let schoolYearName = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === personConfig.schoolYearId)[0];
				schoolYearName = schoolYearName ? schoolYearName.label : '';
				let intervalName = intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === personConfig.intervalId)[0];
				intervalName = intervalName ? intervalName.name : '';

        return (
            <div>
							<div className={styles.container}>
	              	<div className={styles.row}>
		                  <div className={styles.topLogo} onClick={() => browserHistory.push('/firstNav')}>
		                      <img src={Logo} className={styles.logo} alt={`eCademy app`} />
		                  </div>
											<MediaQuery maxWidth={2000} minWidth={701}>
													{(matches) => {
															if (matches) {
																	return <div className={styles.row} onClick={() => browserHistory.push('/firstNav')}>
																						<div className={styles.companyName}>{companyConfig.name}</div>
																						<div className={styles.smallerHeader}>{`${schoolYearName} ${intervalName} `}</div>
																				  </div>
															} else {
																	return null;
															}
													}}
											</MediaQuery>
											<MediaQuery maxWidth={700} minWidth={501}>
													{(matches) => {
															if (matches) {
																	return <div className={styles.companyName} onClick={() => browserHistory.push('/firstNav')}>
																						{companyConfig && companyConfig.name && companyConfig.name.length > 35 ? companyConfig.name.substring(0,35) + '...' : companyConfig.name}
																				</div>
															} else {
																	return null;
															}
													}}
											</MediaQuery>
											<MediaQuery maxWidth={500} minWidth={400}>
													{(matches) => {
															if (matches) {
																	return <div className={styles.companyName} onClick={() => browserHistory.push('/firstNav')}>
																						{companyConfig && companyConfig.name && companyConfig.name.length > 22 ? companyConfig.name.substring(0,22) + '...' : companyConfig.name}
																				 </div>
															} else {
																	return null;
															}
													}}
											</MediaQuery>
											<MediaQuery maxWidth={399}>
													{(matches) => {
															if (matches) {
																	return <div className={styles.companyName} onClick={() => browserHistory.push('/firstNav')}>
																						{companyConfig && companyConfig.name && companyConfig.name.length > 15 ? companyConfig.name.substring(0,15) + '...' : companyConfig.name}
																				 </div>
															} else {
																	return null;
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
	                            //browserHistory.push("/login/timeout");
	                            this.handleLogout();
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
};

//<b className={styles.caret}></b>
