import { useEffect } from 'react'
import FacilitatorMentorSetView from '../views/FacilitatorMentorSetView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMentors from '../actions/mentors'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectUsers, selectCompanyConfig, } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let me = selectMe(state)
    let mentors = selectUsers(state, 'Mentor')
    let facilitators = selectUsers(state, 'Facilitator')

    return {
        mentors,
        langCode: me.langCode,
        facilitators,
        personId: me.personId,
        companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addFacilitatorAsMentor: (personId, facilitatorPersonId) => dispatch(actionMentors.addFacilitatorAsMentor(personId, facilitatorPersonId)),
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
            getPageLangs(personId, langCode, 'FacilitatorMentorSetView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Set Facilitator as Mentor`})
        
  }, [])

  return <FacilitatorMentorSetView {...props} />
}

export default Container
