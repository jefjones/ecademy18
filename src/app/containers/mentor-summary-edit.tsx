import { useEffect } from 'react'
import MentorSummaryEditView from '../views/MentorSummaryEditView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMentorSummary from '../actions/mentor-summary-edit'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectLearners, selectMe, selectLearnerPathways, selectPathwayComments, selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				pathwayComments: selectPathwayComments(state),
        learners: selectLearners(state),
				entries: selectLearnerPathways(state),
        companyConfig: selectCompanyConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getLearnerPathways: (personId, studentPersonId) => dispatch(actionMentorSummary.getLearnerPathways(personId, studentPersonId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getMentorComments: (personId, studentPersonId, limitReturn) => dispatch(actionMentorSummary.getMentorComments(personId, studentPersonId, limitReturn)),
		removeMentorComment: (personId, mentorCommentId) => dispatch(actionMentorSummary.removeMentorComment(personId, mentorCommentId)),
		addOrUpdateMentorComment: (personId, mentorComment) => dispatch(actionMentorSummary.addOrUpdateMentorComment(personId, mentorComment)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, setMyVisitedPage, getMentorComments, personId, studentPersonId} = props
    				getPageLangs(personId, langCode, 'MentorSummaryEditView')
    				getMentorComments(personId, studentPersonId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Mentor Summary`})
        
  }, [])

  return <MentorSummaryEditView {...props} />
}

export default Container
