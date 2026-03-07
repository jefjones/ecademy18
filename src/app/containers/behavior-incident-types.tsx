import { useEffect } from 'react'
import BehaviorIncidentTypeView from '../views/BehaviorIncidentTypeView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBehaviorIncidentTypes from '../actions/behavior-incident-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectBehaviorIncidentTypes } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let behaviorIncidentTypes = selectBehaviorIncidentTypes(state)
		let sequenceStart = 1
		let sequenceEnd = behaviorIncidentTypes && behaviorIncidentTypes.length + 1

    let sequences = []
    for(let i = sequenceStart; i <= sequenceEnd; i++) {
        let option = { id: String(i), value: String(i), label: String(i)}
        sequences = sequences ? sequences.concat(option) : [option]
    }

		let levels = [
			{id: 1, label: 1},
			{id: 2, label: 2},
			{id: 3, label: 3},
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
        behaviorIncidentTypes,
				sequences,
				levels,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    behaviorIncidentTypesInit: (personId) => dispatch(actionBehaviorIncidentTypes.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeBehaviorIncidentType: (personId, behaviorIncidentTypeId) => dispatch(actionBehaviorIncidentTypes.removeBehaviorIncidentType(personId, behaviorIncidentTypeId)),
    addOrUpdateBehaviorIncidentType: (personId, behaviorIncidentType) => dispatch(actionBehaviorIncidentTypes.addOrUpdateBehaviorIncidentType(personId, behaviorIncidentType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, behaviorIncidentTypesInit, personId} = props
            getPageLangs(personId, langCode, 'BehaviorIncidentTypeView')
            behaviorIncidentTypesInit(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Behavior Incident Types`})
        
  }, [])

  return <BehaviorIncidentTypeView {...props} />
}

export default Container
