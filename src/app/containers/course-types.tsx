import { useEffect } from 'react'
import CourseTypesSettingsView from '../views/CourseTypesSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseTypes from '../actions/course-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCourseTypes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let courseTypes = selectCourseTypes(state)
		let sequenceStart = 1
		let sequenceEnd = courseTypes && courseTypes.length + 1

    let sequences = []
    for(let i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        courseTypes,
				sequences,
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    courseTypesInit: (personId) => dispatch(actionCourseTypes.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeCourseType: (personId, courseTypeId) => dispatch(actionCourseTypes.removeCourseType(personId, courseTypeId)),
    addOrUpdateCourseType: (personId, courseType) => dispatch(actionCourseTypes.addOrUpdateCourseType(personId, courseType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, courseTypesInit, personId} = props
            getPageLangs(personId, langCode, 'CourseTypesSettingsView')
            courseTypesInit(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Types`})
        
  }, [])

  return <CourseTypesSettingsView {...props} />
}

export default Container
