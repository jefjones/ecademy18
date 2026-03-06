import React, {Component} from 'react';
import GeoLocationView from '../views/GeoLocationView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import { selectMe} from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
	    langCode: me.langCode,
    }
};

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
			getPageLangs(personId, langCode, 'GeoLocationView');
	}

  render() {
    return <GeoLocationView {...this.props} />;
  }
}

export default storeConnector(Container);
