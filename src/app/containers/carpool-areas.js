import React, {Component} from 'react';
import CarpoolAdminAreaEntryView from '../views/CarpoolAdminAreaEntryView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import {doSort} from '../utils/sort.js';
import * as actionCarpool from '../actions/carpool';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectCarpool } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let carpool = selectCarpool(state);
		let carpoolAreas = carpool && carpool.carpoolAreas;
		carpoolAreas = doSort(carpoolAreas, { sortField: 'areaName', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
        carpoolAreas,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    carpoolInit: (personId) => dispatch(actionCarpool.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeCarpoolArea: (personId, carpoolAreaId) => dispatch(actionCarpool.removeCarpoolArea(personId, carpoolAreaId)),
    addOrUpdateCarpoolArea: (personId, carpoolArea) => dispatch(actionCarpool.addOrUpdateCarpoolArea(personId, carpoolArea)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, carpoolInit, personId} = this.props;
        getPageLangs(personId, langCode, 'CarpoolAdminAreaEntryView');
        carpoolInit(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Carpool Areas`});
    }

    render() {
        return <CarpoolAdminAreaEntryView {...this.props} />;
    }
}

export default storeConnector(Container);
