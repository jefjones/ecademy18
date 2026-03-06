import React, {Component} from 'react';
import DoctorNoteInviteView from '../views/DoctorNoteInviteView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionDoctors from '../actions/doctors';
import * as actionDoctorNoteInvite from '../actions/doctor-note-invite';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectStudents, selectDoctors } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				students: selectStudents(state),
        doctors: selectDoctors(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getDoctors: (personId) => dispatch(actionDoctors.getDoctors(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateDoctorNoteInvite: (personId, doctorNoteInvite) => dispatch(actionDoctorNoteInvite.addOrUpdateDoctorNoteInvite(personId, doctorNoteInvite)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getDoctors, personId} = this.props;
        getPageLangs(personId, langCode, 'DoctorNoteInviteView');
        getDoctors(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Doctor Note Invite`});
    }

    render() {
        return <DoctorNoteInviteView {...this.props} />;
    }
}

export default storeConnector(Container);
