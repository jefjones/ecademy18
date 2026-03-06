import React, {Component} from 'react';
import {Link} from 'react-router';
import Icon from '../Icon';
import styles from './MenuHeaderIcons.css';

export default class MenuHeaderIcons extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
				const {firstName} = this.props;

        return (
            <div className={styles.container}>
								<div className={styles.firstName}>{firstName}</div>
								<Link to={`/myWorks`} className={styles.menuItem} data-rh={'My documents'}>
										<Icon pathName={'files'} premium={true} className={styles.icon} fillColor={'white'}/>
								</Link>
								<Link to={`/myContacts`} className={styles.menuItem} data-rh={'My contacts'}>
										<Icon pathName={'users0'} premium={true} className={styles.icon} fillColor={'white'}/>
								</Link>
								<Link to={'/workAddNew'} className={styles.menuItem} data-rh={'Add new document'}>
										<Icon pathName={'document0'} premium={true} superscript={'plus'} supFillColor={'#fbd56f'} className={styles.icon} fillColor={'white'}/>
								</Link>
								<Link to={'/editorInviteNameEmail'} className={styles.menuItem} data-rh={'Invite new editor'}>
										<Icon pathName={'user'} premium={true} superscript={'plus'} supFillColor={'#fbd56f'} className={styles.icon} fillColor={'white'}/>
								</Link>
								<Link to={`/report/e/edit`} className={styles.menuItem} data-rh={'Editing reports'}>
										<Icon pathName={'graph_report'} premium={true} className={styles.icon} fillColor={'white'}/>
								</Link>
            </div>
        )
    }
};

//<b className={styles.caret}></b>
