import React, {Component} from 'react';
import PassFailRatingSettingsView from '../views/PassFailRatingSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionPassFailRating from '../actions/pass-fail-rating';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectPassFailRating } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let passFailRatings = selectPassFailRating(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        passFailRatings,
    }
};

const bindActionsToDispatch = dispatch => ({
		getPassFailRatings: (personId) => dispatch(actionPassFailRating.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setPassFailRating: (personId, name, sequence) => dispatch(actionPassFailRating.setPassFailRating(personId, name, sequence)),
    removePassFailRating: (personId, passFailRatingId) => dispatch(actionPassFailRating.removePassFailRating(personId, passFailRatingId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getPassFailRatings, personId} = this.props;
        getPageLangs(personId, langCode, 'PassFailRatingSettingsView');
        getPassFailRatings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Pass/Fail Ratings`});
    }

    render() {
        return <PassFailRatingSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
