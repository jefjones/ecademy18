import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './MyGroupsReportView.css';
const p = 'MyGroupsReportView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class MyGroupsReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.handlePathLink = this.handlePathLink.bind(this);
  }

  handlePathLink(pathLink) {
      pathLink && browserHistory.push(pathLink);
  }

  render() {
    const { headings, data } = this.props;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`My Groups`}/>
            </div>
            <EditTable labelClass={styles.tableLabelClass} headings={headings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <br/>
            <br/>
            <OneFJefFooter />
      </div>
    );
  }
}
