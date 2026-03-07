import { useEffect } from 'react'
import LunchMenuStudentDayView from '../views/LunchMenuStudentDayView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLunchMenuOptions from '../actions/lunch-menu-options'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectLunchMenuStudentDays } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				lunchMenuStudentDays: selectLunchMenuStudentDays(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getLunchMenuStudentDays: (personId) => dispatch(actionLunchMenuOptions.getLunchMenuStudentDays(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleLunchMenuStudentDay: (personId, day, studentPersonId) => dispatch(actionLunchMenuOptions.toggleLunchMenuStudentDay(personId, day, studentPersonId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, setMyVisitedPage, getLunchMenuStudentDays, personId} = props
    				getPageLangs(personId, langCode, 'LunchMenuStudentDayView')
    				getLunchMenuStudentDays(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Lunch Menu Student Days`})
    		
  }, [])

  return <LunchMenuStudentDayView {...props} />
}

export default Container
