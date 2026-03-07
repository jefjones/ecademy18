import { useEffect } from 'react'
import PassFailRatingSettingsView from '../views/PassFailRatingSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionPassFailRating from '../actions/pass-fail-rating'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectPassFailRating } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let passFailRatings = selectPassFailRating(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        passFailRatings,
    }
}

const bindActionsToDispatch = dispatch => ({
		getPassFailRatings: (personId) => dispatch(actionPassFailRating.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setPassFailRating: (personId, name, sequence) => dispatch(actionPassFailRating.setPassFailRating(personId, name, sequence)),
    removePassFailRating: (personId, passFailRatingId) => dispatch(actionPassFailRating.removePassFailRating(personId, passFailRatingId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getPassFailRatings, personId} = props
            getPageLangs(personId, langCode, 'PassFailRatingSettingsView')
            getPassFailRatings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Pass/Fail Ratings`})
        
  }, [])

  return <PassFailRatingSettingsView {...props} />
}

export default Container
