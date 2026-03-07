import { useEffect } from 'react'
import LunchMenuOptionSetupView from '../views/LunchMenuOptionSetupView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLunchMenuOptions from '../actions/lunch-menu-options'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectLunchMenuOptions } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let lunchMenuOptions = selectLunchMenuOptions(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        lunchMenuOptions,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getLunchMenuOptions: (personId) => dispatch(actionLunchMenuOptions.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeLunchMenuOption: (personId, carpoolAreaId) => dispatch(actionLunchMenuOptions.removeLunchMenuOption(personId, carpoolAreaId)),
    addOrUpdateLunchMenuOption: (personId, carpoolArea) => dispatch(actionLunchMenuOptions.addOrUpdateLunchMenuOption(personId, carpoolArea)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getLunchMenuOptions, personId} = props
            getPageLangs(personId, langCode, 'LunchMenuOptionSetupView')
            getLunchMenuOptions(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Lunch Menu Options`})
        
  }, [])

  return <LunchMenuOptionSetupView {...props} />
}

export default Container
