import { useEffect } from 'react'
import CurbsideCheckInOrOutView from '../views/CurbsideCheckInOrOutView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCheckInOrOut from '../actions/curbside-check-in-out'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectStudents, selectCheckInOrOuts, selectCheckInOrOutReasons } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let students = selectStudents(state)
		let reasons = selectCheckInOrOutReasons(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        students,
				reasons,
				checkInOrOuts: selectCheckInOrOuts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getCheckInOrOuts: (personId, curbsideCheckInOrOutId) => dispatch(actionCheckInOrOut.getCheckInOrOuts(personId, curbsideCheckInOrOutId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getCheckInOrOutReasons: (personId) => dispatch(actionCheckInOrOut.getCheckInOrOutReasons(personId)),
		addCheckInOrOut: (personId, checkInOrOut) => dispatch(actionCheckInOrOut.addCheckInOrOut(personId, checkInOrOut)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getCheckInOrOutReasons, getCheckInOrOuts} = props
            getPageLangs(personId, langCode, 'CurbsideCheckInOrOutView')
            getCheckInOrOutReasons(personId)
    				getCheckInOrOuts(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Curbside check-in/out`})
        
  }, [])

  return <CurbsideCheckInOrOutView {...props} />
}

export default Container
