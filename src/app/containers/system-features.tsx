import { useEffect } from 'react'
import SystemFeaturesView from '../views/SystemFeaturesView'
import * as actionCompanyConfig from '../actions/company-config'
import * as actionPageLang from '../actions/language-list'
import * as actionContentTypes from '../actions/content-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import {selectMe, selectCompanyConfig} from '../store'

const mapStateToProps = (state, props) => {
	let me = selectMe(state)
    return {
				personId: me.personId,
				langCode: me.langCode,
				companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleCompanyFeature: (personId, feature) => dispatch(actionCompanyConfig.toggleCompanyFeature(personId, feature)),
		toggleBenchmarkTests: (personId, setOn) => dispatch(actionContentTypes.toggleBenchmarkTests(personId, setOn)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, personId} = props
            getPageLangs(personId, langCode, 'SystemFeaturesView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `System Features`})
        
  }, [])

  return <SystemFeaturesView {...props} />
}

export default Container
