import { useEffect } from 'react'
import FinanceCourseFeeAddView from '../views/FinanceCourseFeeAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceCourseFee from '../actions/finance-course-fee'
import * as actionFinanceFeeTypes from '../actions/finance-fee-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers'
import * as actionFinanceGLCodes from '../actions/finance-gl-codes'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceCourseFees, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces, selectCoursesBase,
					selectFetchingRecord, selectPersonConfig, selectFinanceLowIncomeWaivers, selectFinanceGLCodes} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let financeFeeTypes = selectFinanceFeeTypes(state)
		financeFeeTypes = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.isCourseTypeByUser)

		let refundOptions = [
				{ label: 'Not refundable', id: 'NotRefundable' },
				{ label: '100% refundable', id: 'FULLREFUNDABLE' },
				{ label: 'Refund schedule', id: 'REFUNDSCHEDULE' },
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				refundOptions,
				financeCourseFees: selectFinanceCourseFees(state),
				financeFeeTypes,
        companyConfig: selectCompanyConfig(state),
				personConfig: selectPersonConfig(state),
				accessRoles: selectAccessRoles(state),
				financeGLCodes: selectFinanceGLCodes(state),
				financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				baseCourses: selectCoursesBase(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinanceCourseFees: (personId) => dispatch(actionFinanceCourseFee.getFinanceCourseFees(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeFinanceCourseFee: (personId, financeCourseFeeId) => dispatch(actionFinanceCourseFee.removeFinanceCourseFee(personId, financeCourseFeeId)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		addOrUpdateFinanceCourseFee: (personId, financeCourseFee) => dispatch(actionFinanceCourseFee.addOrUpdateFinanceCourseFee(personId, financeCourseFee)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
		getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceCourseFees, getFinanceFeeTypes, getFinanceGLCodes, getFinanceLowIncomeWaivers } = props
        	getPageLangs(personId, langCode, 'FinanceCourseFeeAddView')
    	    getFinanceCourseFees(personId)
    			getFinanceFeeTypes(personId)
    			getFinanceGLCodes(personId)
    			getFinanceLowIncomeWaivers(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Course Fee`})
      
  }, [])

  return <FinanceCourseFeeAddView {...props} />
}

export default Container
