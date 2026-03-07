import { useEffect } from 'react'
import ContentTypesSettingsView from '../views/ContentTypesSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionContentTypes from '../actions/content-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectContentTypes, selectFetchingRecord, selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let contentTypes = selectContentTypes(state)
		let sequenceStart = 1
		let sequenceEnd = contentTypes && contentTypes.length + 1

    let sequences = []
    for(let i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        contentTypes,
				sequences,
				fetchingRecord: selectFetchingRecord(state),
				companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    contentTypesInit: (personId) => dispatch(actionContentTypes.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeContentType: (personId, contentTypeId) => dispatch(actionContentTypes.removeContentType(personId, contentTypeId)),
    addOrUpdateContentType: (personId, contentType) => dispatch(actionContentTypes.addOrUpdateContentType(personId, contentType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, contentTypesInit, personId} = props
            getPageLangs(personId, langCode, 'ContentTypesSettingsView')
            contentTypesInit(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Content Types`})
        
  }, [])

  return <ContentTypesSettingsView {...props} />
}

export default Container
