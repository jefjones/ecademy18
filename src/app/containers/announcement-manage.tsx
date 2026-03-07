import { useEffect } from 'react'
import AnnouncementManageView from '../views/AnnouncementManageView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAnnouncement from '../actions/announcements'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAnnouncementsAdmin, selectCompanyConfig } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let announcements = selectAnnouncementsAdmin(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        announcements,
        companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getAnnouncementsAdmin: (personId) => dispatch(actionAnnouncement.getAnnouncementsAdmin(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeAnnouncementAdmin: (personId, announcementId) => dispatch(actionAnnouncement.removeAnnouncementAdmin(personId, announcementId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    	    const {getPageLangs, langCode, setMyVisitedPage, getAnnouncementsAdmin, personId} = props
    	    getPageLangs(personId, langCode, 'AnnouncementManageView')
    	    getAnnouncementsAdmin(personId)
          props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Manage Announcements`})
      
  }, [])

  return <AnnouncementManageView {...props} />
}

export default Container
