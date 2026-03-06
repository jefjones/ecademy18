import React, {Component} from 'react';
import VolunteerTypesView from '../views/VolunteerTypesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionVolunteerTypes from '../actions/volunteer-types';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectVolunteerTypes, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let volunteerTypes = selectVolunteerTypes(state);
		let sequenceStart = 1;
		let sequenceEnd = volunteerTypes && volunteerTypes.length + 1;

    let sequences = [];
    for(var i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)};
        sequences = sequences ? sequences.concat(option) : [option];
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        volunteerTypes,
				sequences,
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    volunteerTypesInit: (personId) => dispatch(actionVolunteerTypes.init(personId)),
    removeVolunteerType: (personId, volunteerTypeId) => dispatch(actionVolunteerTypes.removeVolunteerType(personId, volunteerTypeId)),
    addOrUpdateVolunteerType: (personId, volunteerType) => dispatch(actionVolunteerTypes.addOrUpdateVolunteerType(personId, volunteerType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, volunteerTypesInit, personId} = this.props;
        getPageLangs(personId, langCode, 'VolunteerTypesView');
        volunteerTypesInit(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Volunteer Types`});
    }

    render() {
        return <VolunteerTypesView {...this.props} />;
    }
}

export default storeConnector(Container);
