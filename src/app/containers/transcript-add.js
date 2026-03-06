import React, {Component} from 'react';
import TranscriptAddView from '../views/TranscriptAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionPersonConfig from '../actions/person-config';
import * as actionTranscripts from '../actions/transcripts';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectPersonConfig, selectSchoolYears, selectGradeLevels,
					selectTranscripts, selectMyFrequentPlaces, selectFetchingRecord} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let studentPersonId = props.params && props.params.studentPersonId;

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				transcripts: selectTranscripts(state),
				gradeLevels: selectGradeLevels(state),
				students: selectStudents(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				personConfig: selectPersonConfig(state),
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getTranscripts: (personId, studentPersonId, includeInternal) => dispatch(actionTranscripts.getTranscripts(personId, studentPersonId, includeInternal)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		addOrUpdateTranscript: (personId, transcript) => dispatch(actionTranscripts.addOrUpdateTranscript(personId, transcript)),
		removeTranscript: (personId, transcriptId) => dispatch(actionTranscripts.removeTranscript(personId, transcriptId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
		    const {getPageLangs, langCode, personId, setMyVisitedPage, studentPersonId, getTranscripts} = this.props;
		    getPageLangs(personId, langCode, 'TranscriptAddView');
				getTranscripts(personId, studentPersonId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Transcript`});
	  }

	  render() {
	    	return <TranscriptAddView {...this.props} />;
	  }
}

export default storeConnector(Container);
