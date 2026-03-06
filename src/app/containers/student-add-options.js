import React, {Component} from 'react';
import StudentAddOptionsView from '../views/StudentAddOptionsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import {selectMe, selectCompanyConfig} from '../store.js';

const mapStateToProps = (state, props) => {
	let me = selectMe(state);
    return {
			personId: me.personId,
			langCode: me.langCode,
			companyConfig: selectCompanyConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, personId, langCode} = this.props;
				getPageLangs(personId, langCode, 'StudentAddOptionsView');
		}


    render() {
        return <StudentAddOptionsView {...this.props} />
    }
}

export default storeConnector(Container);
