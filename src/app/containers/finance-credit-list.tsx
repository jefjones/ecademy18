import { useEffect } from 'react'
import FinanceCreditListView from '../views/FinanceCreditListView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceCredit from '../actions/finance-credit'
import * as actionFinanceCreditTypes from '../actions/finance-credit-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceCredits, selectFinanceCreditTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page.
				students: selectStudents(state),
				financeCredits: selectFinanceCredits(state),
				financeCreditTypes: selectFinanceCreditTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinanceCredits: (personId) => dispatch(actionFinanceCredit.getFinanceCredits(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeFinanceCredit: (personId, financeCreditId) => dispatch(actionFinanceCredit.removeFinanceCredit(personId, financeCreditId)),
		getFinanceCreditTypes: (personId) => dispatch(actionFinanceCreditTypes.getFinanceCreditTypes(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceCredits, getFinanceCreditTypes } = props
        	getPageLangs(personId, langCode, 'FinanceCreditListView')
    	    getFinanceCredits(personId)
    			getFinanceCreditTypes(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Credit List`})
      
  }, [])

  return <FinanceCreditListView {...props} />
}

export default Container
