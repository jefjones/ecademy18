import React, {Component} from 'react';
import 'normalize.css';
import styles from './AppView.css';
const p = 'AppView';
import L from '../../components/PageLanguage';
import MediaQuery from 'react-responsive';
import MobileHeader from '../../components/MobileHeader';
import FirstNavView from '../FirstNavView';
import CalendarAndEventsView from '../CalendarAndEventsView';
import AdminResponsePendings from '../../components/AdminResponsePendings';
import ReactHintFactory from 'react-hint';
const ReactHint = ReactHintFactory(React)
import classes from 'classnames';

export default class AppView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastTouchY: 0
        }
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.touchmoveHandler = this.touchmoveHandler.bind(this);
    }

    touchstartHandler(e) {
        if (e.touches.length !== 1) return;
        this.setState({ lastTouchY: e.touches[0].clientY });
    }

    touchmoveHandler(e) {
        const {lastTouchY} = this.state;
        var touchY = e.touches[0].clientY;
        var touchYDelta = touchY - lastTouchY;
        this.setState({lastTouchY: touchY });

        //if (window.pageYOffset === 0) {
            if (touchYDelta > 0) {
                e.preventDefault();
                return;
            }
        //}
    }

    onRenderContent = (target, content) => {
        return <L p={target.dataset.page} t={target.dataset.text}/>
    }

    render() {
        const {personId, children, accessRoles={}, adminResponsePendings, confirmSafetyAlert, confirmCheckInOrOut, confirmVolunteerHour,
								companyConfig} = this.props;
				//const {chosenHomePage} = this.state

        return (
            <div className={personId ? styles.app : styles.divCenter}>
                {/* <ReactHint autoPosition events delay={100} />
                <ReactHint persist attribute="data-custom" onRenderContent={this.onRenderContent}/> */}

                {personId &&
                    <MobileHeader {...this.props} />
                }
                {personId &&
										<MediaQuery minWidth={696}>
		                  {(matches) => {
		                    if (matches) {
		                      return (
                              <div className={personId ? styles.rowScroll : styles.divCenter}>
                                  <div className={personId ? styles.divLeft : ''}>
																			{personId &&
																					<FirstNavView {...this.props} />
																			}
                                  </div>
                                  <div className={personId ? classes(styles.divMiddle, styles.divLeftMarginRight) : ''}>
                                      {personId && children && children.props.location.pathname.indexOf('/firstNav') > -1
																					? accessRoles.doctor
																							? ''
																							: !accessRoles.hasEnrolledStudent && accessRoles.observer
																									? '' //<TutorialVideoView  {...this.props} tutorialLabel={<L p={p} t={`Registration by primary guardian`}/>} />
																									: companyConfig.urlcode === 'Manheim'
																											? ''
																											: <CalendarAndEventsView {...this.props} />
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
		                        );
		                    } else {
		                      return (
		                        <div className={styles.moreTop}>
		                            {children}
		                        </div>
		                      );
		                    }
		                  }}
		                </MediaQuery>
								}
								{!personId && <div>{children}</div>}
            </div>
        )
    }
}
