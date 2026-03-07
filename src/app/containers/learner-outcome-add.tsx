import { useEffect } from 'react'
import LearnerOutcomeAddView from '../views/LearnerOutcomeAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLearnerOutcomes from '../actions/learner-outcomes'
import { selectMe, selectLearnerOutcomes, selectLearningPathways, selectLearnerOutcomeTargets } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
		let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        tabsData: {chosenTab: 'FieldEntry', tabs: [{id: 'FieldEntry', label: 'Field Entry'}, {id: 'BulkPaste', label: 'Bulk Paste'}]},
				learningPathways: selectLearningPathways(state),
        learnerOutcomes: selectLearnerOutcomes(state),
        learnerOutcomeTargets: selectLearnerOutcomeTargets(state),
        bulkDelimiterOptions: [{id: 'comma', label: ', comma'},
            {id: 'semicolon', label: '; semicolon'},
            {id: 'hyphen', label: '- hyphen'},
            {id: 'tab', label: 'tab'},
        ],
        fieldOptions: [
            {id: 'learningPathway', label: 'learning pathway'},
            {id: 'learnerOutcomeId', label: 'learner outcome id'},
            {id: 'description', label: 'description'},
        ],
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addLearnerOutcome: (personId, learnerOutcomes) => dispatch(actionLearnerOutcomes.addLearnerOutcome(personId, learnerOutcomes)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeLearnerOutcome: (personId, learnerOutcomeId) => dispatch(actionLearnerOutcomes.removeLearnerOutcome(personId, learnerOutcomeId)),
		updateLearnerOutcome: (personId, learnerOutcome) => dispatch(actionLearnerOutcomes.updateLearnerOutcome(personId, learnerOutcome)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    			const {getPageLangs, personId, langCode} = props
    			getPageLangs(personId, langCode, 'LearnerOutcomeAddView')
    	
  }, [])

  return <LearnerOutcomeAddView {...props} />
}

export default Container
