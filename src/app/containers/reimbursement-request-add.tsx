import { useEffect } from 'react'
import ReimbursementRequestAddView from '../views/ReimbursementRequestAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionReimbursementRequest from '../actions/reimbursement-request'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectReimbursementRequests } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				reimbursementRequests: selectReimbursementRequests(state),
				reimbursementRequestId: props.params && props.params.reimbursementRequestId,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getReimbursementRequests: (personId, curbsideReimbursementRequestsId) => dispatch(actionReimbursementRequest.getReimbursementRequests(personId, curbsideReimbursementRequestsId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addReimbursementRequest: (personId, checkInOrOut) => dispatch(actionReimbursementRequest.addReimbursementRequest(personId, checkInOrOut)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getReimbursementRequests} = props
            getPageLangs(personId, langCode, 'ReimbursementRequestAddView')
    				getReimbursementRequests(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Reimbursement Request`})
        
  }, [])

  return <ReimbursementRequestAddView {...props} />
}

export default Container
