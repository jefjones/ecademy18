import React, {Component} from 'react';
import GalleryAddView from '../views/GalleryAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionGalleryList from '../actions/gallery-list';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeGalleryFileUpload: (personId, fileUploadId) => dispatch(actionGalleryList.removeGalleryFileUpload(personId, fileUploadId)),
    addOrUpdateGalleryFile: (personId, carContact) => dispatch(actionGalleryList.addOrUpdateGalleryFile(personId, carContact)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'GalleryAddView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Gallery Photo`});
    }

    render() {
        return <GalleryAddView {...this.props} />;
    }
}

export default storeConnector(Container);
