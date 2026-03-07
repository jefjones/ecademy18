import { useEffect } from 'react'
import RegSelfServiceCourseCountView from '../views/RegSelfServiceCourseCountView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRegSelfServiceCourseCount from '../actions/reg-self-service-course-count'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from '../utils/sort'
import { selectMe, selectRegSelfServiceCourseCount, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let counts = selectRegSelfServiceCourseCount(state)
    counts = doSort(counts, { sortField: 'grade', isAsc: true, isNumber: true })

    return {
        personId: me.personId,
        langCode: me.langCode,
        counts,
        fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getRegSelfServiceCourseCount: (personId) => dispatch(actionRegSelfServiceCourseCount.getRegSelfServiceCourseCount(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getRegSelfServiceCourseCount, personId} = props
            getPageLangs(personId, langCode, 'RegSelfServiceCourseCountView')
            getRegSelfServiceCourseCount(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Self Service Student Course Count`})
        
  }, [])

  return <RegSelfServiceCourseCountView {...props} />
}

export default Container
