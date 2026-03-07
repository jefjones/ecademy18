import { useEffect } from 'react'
import LunchReducedApplyView from '../views/LunchReducedApplyView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLunchReducedApply from '../actions/lunch-reduced-apply'
import * as actionUsStates from '../actions/us-states'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectStudents, selectLunchReducedApply, selectUSStates } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        students: selectStudents(state),
        lunchReducedApply: selectLunchReducedApply(state),
				fetchingRecord: selectFetchingRecord(state),
        uSStates: selectUSStates(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getLunchReducedApply: (personId) => dispatch(actionLunchReducedApply.getLunchReducedApply(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateLunchReducedApplyTable: (personId, lunchReducedApply) => dispatch(actionLunchReducedApply.addOrUpdateLunchReducedApplyTable(personId, lunchReducedApply)),
    removeLunchReducedApply: (personId, lunchReducedApplyTableId) => dispatch(actionLunchReducedApply.removeLunchReducedApply(personId, lunchReducedApplyTableId)),
    addOrUpdateLunchReducedApplyStudents: (personId, lunchReducedApplyTableId, lunchReducedStudents) => dispatch(actionLunchReducedApply.addOrUpdateLunchReducedApplyStudents(personId, lunchReducedApplyTableId, lunchReducedStudents)),
    addOrUpdateLunchReducedApplyAdults: (personId, lunchReducedApplyTableId, lunchReducedAdults) => dispatch(actionLunchReducedApply.addOrUpdateLunchReducedApplyAdults(personId, lunchReducedApplyTableId, lunchReducedAdults)),
    getUsStates: () => dispatch(actionUsStates.init()),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getLunchReducedApply, personId, getUsStates} = props
            getPageLangs(personId, langCode, 'LunchReducedApplyView')
            getLunchReducedApply(personId)
            getUsStates()
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Apply for Reduced Lunch`})
        
  }, [])

  return <LunchReducedApplyView {...props} />
}

export default Container
