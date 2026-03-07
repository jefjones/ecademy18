import { useEffect } from 'react'
import RatingBookView from '../views/RatingBookView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRatingBook from '../actions/rating-book'
import { selectMe, selectRatingBook, selectCoursesBase, selectStudents, selectUsers, selectLearnerOutcomes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        studentPersonId: props.params && props.params.studentPersonId,
        students: selectStudents(state),
        courses: selectCoursesBase(state),
        facilitators: selectUsers(state, 'Facilitator'),
        learnerOutcomes: selectLearnerOutcomes(state),
        ratingBook: selectRatingBook(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    ratingBookInit: (personId, studentPersonId) => dispatch(actionRatingBook.init(personId, studentPersonId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setRatingBook: (personId, studentPersonId, learnerOutcomeId, rating) => dispatch(actionRatingBook.setRatingBook(personId, studentPersonId, learnerOutcomeId, rating)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, ratingBookInit, personId, studentPersonId} = props
            getPageLangs(personId, langCode, 'RatingBookView')
            ratingBookInit(personId, studentPersonId)
        
  }, [])

  return <RatingBookView {...props} />
}

export default Container
