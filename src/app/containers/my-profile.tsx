import { useEffect } from 'react'
import MyProfileView from '../views/MyProfileView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionMyProfile from '../actions/my-profile'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionLanguageList from '../actions/language-list'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectMyProfile, selectLanguageList, selectAccessRoles, selectFetchingRecord } from '../store'

const mapStateToProps = state => {
		let me = selectMe(state)
    return {
        personId: me.personId,
        langCode: me.langCode,
        user: selectMyProfile(state),
        languageOptions: selectLanguageList(state),
				accessRoles: selectAccessRoles(state),
				fetchingrecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getMyProfile: (personId) => dispatch(actionMyProfile.getMyProfile(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setMyProfile: (personId, field, value) => dispatch(actionMyProfile.setMyProfile(personId, field, value)),
    updateMyProfile: (user) => dispatch(actionMyProfile.updateMyProfile(user)),
		resolveFetchingRecordMyProfile: () => dispatch(actionFetchingRecord.resolveFetchingRecordMyProfile()),
		getLanguageList: () => dispatch(actionLanguageList.init()),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    removeProfilePicture: (personId, profilePictureId) => dispatch(actionMyProfile.removeProfilePicture(personId, profilePictureId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getMyProfile, getLanguageList} = props
    				getPageLangs(personId, langCode, 'MyProfileView')
            getMyProfile(personId)
    				getLanguageList()
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `My Profile`})
        
  }, [])

  return <MyProfileView {...props} />
}

export default Container
