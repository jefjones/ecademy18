import { useEffect } from 'react'
import MentorNotAssignedView from '../views/MentorNotAssignedView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMentorsAssigned from '../actions/mentors-assigned'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectUsers, selectMentorsAssigned, selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let learnersNot = selectMentorsAssigned(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        learnersNot,
        mentors: selectUsers(state, 'Mentor'),
        companyConfig: selectCompanyConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getUnassignedLearnersMentors: (personId) => dispatch(actionMentorsAssigned.getUnassignedLearnersMentors(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addLearnersMentorsAssign: (personId, learnersChosen, learningCoach) => dispatch(actionMentorsAssigned.addLearnersMentorsAssign(personId, learnersChosen, learningCoach)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getUnassignedLearnersMentors, personId} = props
            getPageLangs(personId, langCode, 'MentorNotAssignedView')
            getUnassignedLearnersMentors(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Mentor Not Assigned`})
        
  }, [])

  return <MentorNotAssignedView {...props} />
}

export default Container
