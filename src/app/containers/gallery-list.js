import React, {Component} from 'react';
import GalleryListView from '../views/GalleryListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionGalleryList from '../actions/gallery-list';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectGalleryList, selectAccessRoles, selectStudents, selectFetchingRecord, selectPersonConfig,} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let students = selectStudents(state);
    let galleryList = selectGalleryList(state);
    if (galleryList && galleryList.length > 0) {
        students = students && students.length > 0 && students.filter(s => {
            let found = false;
            galleryList.forEach(g => {
                g.peopleInPicture && g.peopleInPicture.length > 0 && g.peopleInPicture.forEach(p => {
                    if (p.personId === s.personId) found = true;
                })
            })
            return found;
        })
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        students,
				galleryList,
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				personConfig: selectPersonConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getGalleryList: (personId) => dispatch(actionGalleryList.getGalleryList(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		constructor(props) {
				super(props);

				this.state = {
						isInit: false,
				}
		}

		componentDidMount(prevProps) {
		    const {getPageLangs, langCode, personId, getGalleryList} = this.props;
		    getPageLangs(personId, langCode, 'GalleryListView');
				getGalleryList(personId);
	  }

	  render() {
	    	return <GalleryListView {...this.props} />;
	  }
}


export default storeConnector(Container);
