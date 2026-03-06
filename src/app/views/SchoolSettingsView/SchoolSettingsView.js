import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import styles from './SchoolSettingsView.css';
const p = 'SchoolSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import SchoolSetup from '../../components/SchoolSetup';

class SchoolSettingsView extends Component {
    constructor(props) {
      super(props);

      this.state = {
      }
    }

		render() {
				const {personId, myFrequentPlaces, setMyFrequentPlace, companyConfig, schoolYears, setCompanyConfig, admins, removeDemoRecords,
								removeLogoFileUpload, saveCompanyWebsiteLink, removeCompanyDocumentFile, getCompanyConfig, removeSignatureFileUpload,
								removeOfficialSealFileUpload, intervals, frontDesks, counselors} = this.props;

		    return (
		        <div className={styles.container}>
		            <div className={globalStyles.pageTitle}>
		              <L p={p} t={`School Settings`}/>
		            </div>
								{false && <Link to={`/newSchoolCheckList`} className={styles.menuHeader}><L p={p} t={`New school check list`}/></Link>}
								<hr/>
								<div onClick={() => {browserHistory.push(`/systemFeatures`); setCompanyConfig(personId, 'hasOpenedSettings', true);}} className={styles.menuHeader}><L p={p} t={`Choose system features`}/></div>
								<hr/>
								<SchoolSetup personId={personId} companyConfig={companyConfig} schoolYears={schoolYears} setCompanyConfig={setCompanyConfig}
										admins={admins} removeDemoRecords={removeDemoRecords} removeLogoFileUpload={removeLogoFileUpload}
										removeSignatureFileUpload={removeSignatureFileUpload} saveCompanyWebsiteLink={saveCompanyWebsiteLink}
										removeCompanyDocumentFile={removeCompanyDocumentFile} removeOfficialSealFileUpload={removeOfficialSealFileUpload}
										getCompanyConfig={getCompanyConfig} intervals={intervals} frontDesks={frontDesks} counselors={counselors}/>
								<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`School Settings`}/>} path={'schoolSettings'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
								<OneFJefFooter />
		        </div>
		    )
		};
}

export default SchoolSettingsView;
