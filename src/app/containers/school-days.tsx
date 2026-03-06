import { useEffect } from 'react'
import SchoolDaysSettingsView from '../views/SchoolDaysSettingsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCompanyConfig from '../actions/company-config'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCompanyConfig } from '../store'

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
    setCompanyConfig: (personId, field, value) => dispatch(actionCompanyConfig.setCompanyConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, personId} = props
            getPageLangs(personId, langCode, 'SchoolDaysSettingsView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `School Days`})
        
  }, [])

  return <SchoolDaysSettingsView {...props} />
}

export default Container
