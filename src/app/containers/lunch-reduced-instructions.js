import React, {Component} from 'react';
import LunchReducedInstructionsView from '../views/LunchReducedInstructionsView';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
	    langCode: me.langCode,
    }
};

const bindActionsToDispatch = dispatch => ({
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'LunchReducedInstructionsView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Reduced Lunch Instructions`});
    }

    render() {
        return <LunchReducedInstructionsView {...this.props} />;
    }
}

export default storeConnector(Container);
