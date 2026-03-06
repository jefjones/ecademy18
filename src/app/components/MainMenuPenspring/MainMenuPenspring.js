import React from 'react';
import {Component} from 'react'
import styles from './MainMenuPenspring.css';
import { Link } from 'react-router';
import classes from 'classnames';
import WorkSummary from '../WorkSummary';
import GroupSummary from '../GroupSummary';
import InvitesPending from '../InvitesPending';
import Icon from '../Icon';
import OneFJefFooter from '../OneFJefFooter';
import {formatNumber} from '../../utils/numberFormat.js';

export default class MainMenuPenspring extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }

        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleClosed = this.handleClosed.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener("click", this.handleClosed);
        this.dropdown.addEventListener("click", this.handleDisplay);
        this.menuThing.addEventListener("click", this.handleDisplay);
        this.grayArea.addEventListener("click", this.handleDisplay);
        document.body.addEventListener('keyup', this.checkForKeypress);
    }

    componentWillUnmount() {
        document.body.removeEventListener("click", this.handleClosed);
    }

    checkForKeypress = (evt) => {
        evt.key === 'Escape' && this.state.opened && this.setState({ opened: false });
    }

    handleDisplay(ev, preventAction) {
        ev.stopPropagation();
        this.setState({opened: !this.state.opened});
    }

    handleClosed() {
        this.setState({opened: false});
    }

    render() {
        const {workSummary, groupSummary, personId, setWorkCurrentSelected, personName, editorScore, deleteWork, deleteChapter,
                setGroupCurrentSelected, deleteGroup, groupSummaries, updatePersonConfig, personConfig, editorInvitePending,
                deleteInvite, acceptInvite, resendInvite} = this.props;
        const {opened} = this.state;

        return (
            <div className={styles.container}>
                <input type="checkbox" className={styles.check} id="checked" checked={opened} ref={(ref) => (this.dropdown = ref)}/>
                <label className={styles.menuBtn}  ref={(ref) => (this.menuThing = ref)}>
                    <span className={classes(styles.bar, styles.top)}></span>
                    <span className={classes(styles.bar, styles.middle)}></span>
                    <span className={classes(styles.bar, styles.bottom)}></span>
                </label>
                <label className={styles.closeMenu} ref={(ref) => (this.grayArea = ref)}></label>
                <nav className={styles.drawerMenu}>
                    <span className={styles.loggedIn}>Logged in:</span>
                    <span className={styles.personName}>{personName}</span>
                    <span className={styles.score}>{formatNumber(editorScore, true, false, 1)}</span>
                    {workSummary &&
                        <div className={styles.current}>
                            <WorkSummary summary={workSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={true} hideCaret={true}
                                setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} deleteChapter={deleteChapter} indexName={`MainMenuPenspring`}
                                updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                        </div>
                    }
                    <hr />
                    {groupSummary &&
                        <div className={styles.current}>
                            <GroupSummary summary={groupSummary} className={styles.workSummary} personId={personId} isHeaderDisplay={true} hideCaret={true}
                                setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup} isMainMenuPenspring={true}
                                updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                        </div>
                    }
                    {groupSummary && <hr />}
                    <ul className={styles.unorderedList}>
										<li>
												<Link to={`/myWorks`} className={classes(styles.bold, styles.menuItem, styles.row)}>
														<Icon pathName={'files'} premium={true} className={styles.icon}/>
														My Documents
												</Link>
										</li>
												<li>
														<Link to={`/myContacts`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'users0'} premium={true} className={styles.icon}/>
																My Contacts
														</Link>
												</li>
												{groupSummaries && groupSummaries.length > 0  &&
														<li>
																<Link to={`/myGroupsReport`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																		<Icon pathName={'users0'} premium={true} className={styles.icon}/>
																		My Groups
																</Link>
														</li>
												}
												{workSummary && personId === workSummary.authorPersonId && <li><hr /></li>}
												{workSummary && personId === workSummary.authorPersonId &&
														<li>
																<Link to={`/workSettings`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																		<Icon pathName={'cog'} premium={true} className={styles.icon}/>
																		{`This Document's Settings`}
																</Link>
														</li>
												}
												<li><hr /></li>
												<li>
														<Link to={'/workAddNew'} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
																Add New Document
														</Link>
												</li>
		                    <li>
		                        <Link to={'/editorInviteNameEmail'} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'user'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
																Invite New Editor
														</Link>
                            {editorInvitePending && editorInvitePending.length > 0 &&
                                <InvitesPending invites={editorInvitePending} personId={personId} deleteInvite={deleteInvite} acceptInvite={acceptInvite}
                                    resendInvite={resendInvite} expanded={true}/>
                            }
                        </li>
												<li>
														<Link to={'/groupTypeChoice'} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'users0'} premium={true} superscript={'plus'} supFillColor={'green'} className={styles.icon}/>
																Create New Editor Group
														</Link>
												</li>
		                    <li><hr /></li>
		                    <li>
														<Link to={`/report/e/edit`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'graph_report'} premium={true} className={styles.icon}/>
																Editor Reports
														</Link>
												</li>
		                    <li><hr /></li>
		                    <li>
														<Link to={`/openCommunity`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'earth'} premium={true} className={styles.icon}/>
																Open Community
														</Link>
												</li>
		                    <li><hr /></li>
		                    <li>
														<Link to={`/myProfile`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'portrait'} premium={true} className={styles.icon}/>
																My Profile
														</Link>
												</li>
		                    <li>
														<Link to={`/logout`} className={classes(styles.bold, styles.menuItem, styles.row)}>
																<Icon pathName={'stop_circle'} premium={true} className={styles.icon}/>
																Logout
														</Link>
												</li>
                    </ul>
                    <ul>
                        <OneFJefFooter />
                    </ul>
                </nav>
            </div>
        )
    }
}


//<li><Link to={`/bidRequests`} className={styles.menuItem}>Bid Requests</Link></li>
