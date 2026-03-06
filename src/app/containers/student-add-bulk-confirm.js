import React, {Component} from 'react';
import StudentAddBulkConfirmView from '../views/StudentAddBulkConfirmView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLearners from '../actions/learners.js';
import * as actionFileFields from '../actions/file-fields';
import * as reducerfileFields from '../reducers/file-fields';
import { selectMe, selectLearners, selectCompanyConfig, selectFileFields } from '../store.js';

const mapStateToProps = (state, props) => {
	let me = selectMe(state);
    return {
				personId: me.personId,
				langCode: me.langCode,
        companyConfig: selectCompanyConfig(state),
        learners: selectLearners(state),
				fileFields: selectFileFields(state),
				personConfigEntry: reducerfileFields.selectPersonConfigStudentBulkEntry(state.fileFields),
        studentBulkEntryDetails: reducerfileFields.selectStudentBulkEntryDetails(state.fileFields),
    }
};

const bindActionsToDispatch = dispatch => ({
		getLearners: (personId) => dispatch(actionLearners.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFileFields: () => dispatch(actionFileFields.init()),
		getPersonConfigFileFields: (personId) => dispatch(actionFileFields.getPersonConfigFileFields(personId)),
		getStudentBulkEntryDetails: (personId) => dispatch(actionFileFields.getStudentBulkEntryDetails(personId)),
		processStudentBulkEntry: (personId) => dispatch(actionLearners.processStudentBulkEntry(personId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, getLearners, personId, getFileFields, getPersonConfigFileFields, getStudentBulkEntryDetails} = this.props;
				getPageLangs(personId, langCode, 'StudentAddBulkConfirmView');
				getStudentBulkEntryDetails(personId);
				getLearners(personId);
				getFileFields();
				getPersonConfigFileFields(personId);
		}

    render() {
        return <StudentAddBulkConfirmView {...this.props} />
    }
}

export default storeConnector(Container);
