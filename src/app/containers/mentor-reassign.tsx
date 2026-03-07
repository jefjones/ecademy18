import { useEffect } from 'react'
import LearnerMentorReassignView from '../views/LearnerMentorReassignView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import {guidEmpty} from '../utils/guidValidate'
import * as actionMentorsAssigned from '../actions/mentors-assigned'
import * as actionLearners from '../actions/learners'
import * as actionLearnerFilter from '../actions/learner-filter'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectLearnerOutcomes, selectLearningPathways, selectLearningFocusAreas, selectUsers, selectLearnerOutcomeTargets,
          selectLearners, selectMe, selectLearnerFilter, selectMentorsAssigned, selectCompanyConfig } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let mentors = selectUsers(state, 'Mentor')
    let mentorsAssigned = selectMentorsAssigned(state)

    //help:  We still need to get the course assignments in order to determine if there are any conflicts.  But do that on a one-by-one basis for each student.
    let learners = selectLearners(state)
    let learnerFilterList = selectLearnerFilter(state)
    let learnerFilterOptions = learnerFilterList && learnerFilterList.length > 0 && learnerFilterList.filter(m => !m.scratchFlag)
    learnerFilterOptions = learnerFilterOptions && learnerFilterOptions.length > 0
        && learnerFilterOptions.map(m => ({id: m.learnerFilterId, label: m.savedSearchName.length > 25 ? m.savedSearchName.substring(0,25) + '...' : m.savedSearchName}))
    let filterScratch_learner = learnerFilterList && learnerFilterList.length > 0 && learnerFilterList.filter(m => m.scratchFlag)[0]

    if (learners && filterScratch_learner.birthDateFrom && filterScratch_learner.birthDateTo) {
        learners = learners.filter(w => w.birthDate >= filterScratch_learner.birthDateFrom && w.birthDate <= filterScratch_learner.birthDateTo)
    } else if (learners && filterScratch_learner.birthDateFrom) {
        learners = learners.filter(w => w.birthDate >= filterScratch_learner.birthDateFrom)
    } else if (learners && filterScratch_learner.birthDateTo) {
        learners = learners.filter(w => w.birthDate <= filterScratch_learner.birthDateTo)
    }
    if (learners && filterScratch_learner.learningPathwayId) {
        learners = !!learners.courses && learners.courses.filter(w => w.learningPathwayId === filterScratch_learner.learningPathwayId)
    }
    if (learners && filterScratch_learner.learningFocusAreaId) {
        learners = !!learners.courses && learners.courses.filter(w => w.learningFocusAreaId === filterScratch_learner.learningFocusAreaId)
    }
    if (learners && filterScratch_learner.selectedLearnerOutcomeTargets) {
        learners = !!learners.learnerOutcomes && learners.learnerOutcomes.filter(w => w.gradeTarget === filterScratch_learner.selectedLearnerOutcomeTargets)
    }
    if (learners && filterScratch_learner.selectedLearnerOutcomes) {
        learners = !!learners.courses && learners.courses.filter(w => filterScratch_learner.selectedLearnerOutcomes.includes(w.learnerOutcomeId))
    }
    if (learners && filterScratch_learner.facilitatorPersonId && filterScratch_learner.facilitatorPersonId !== guidEmpty) {
        learners = !!learners.courses && learners.courses.filter(w => w.facilitatorPersonId === filterScratch_learner.facilitatorPersonId)
    }
    if (learners && filterScratch_learner.mentorPersonId && filterScratch_learner.mentorPersonId !== guidEmpty) {
        learners = learners.filter(w => w.mentorPersonId === filterScratch_learner.mentorPersonId)
    }

    if (learners && filterScratch_learner.loProficient) {
        learners = !!learners.learnerOutcomes && learners.learnerOutcomes.filter(w => w.rating === 'proficient')
    }
    if (learners && filterScratch_learner.loInProgress) {
        learners = !!learners.learnerOutcomes && learners.learnerOutcomes.filter(w => w.rating === 'inProgress')
    }
    if (learners && filterScratch_learner.loNotStarted) {
        learners = !!learners.learnerOutcomes && learners.learnerOutcomes.filter(w => w.rating === 'notStarted' || !w.rating)
    }

    learners = learners && learners.length > 0 && learners.map(m => {
        let mentorAssign = mentorsAssigned && mentorsAssigned.length > 0 && mentorsAssigned.filter(f => f.studentPersonId === m.personId)[0]
        let mentor = mentorAssign && mentors && mentors.length > 0 && mentors.filter(f => f.personId === mentorAssign.mentorPersonId)[0]
        let mentorName = mentor && mentor.firstName + ' ' + mentor.lastName
        if (mentorName && m.label.indexOf(mentorName) === -1) {
            m.label = m.label.indexOf(' [') > -1 ? m.label.substring(0, m.label.indexOf(' [')-2) : m.label
            m.label += '  [' + mentorName + ']'
            m.mentorName = mentorName
        }
        return m
    })

    return {
        personId: me.personId,
        langCode: me.langCode,
        learners,
        mentors,
        facilitators: selectUsers(state, 'Facilitator'),
        learningPathways: selectLearningPathways(state),
        learnerOutcomes: selectLearnerOutcomes(state),
        learnerOutcomeTargets: selectLearnerOutcomeTargets(state),
        learningFocusAreas: selectLearningFocusAreas(state),
        learnerFilterOptions,
        filterScratch_learner,
        savedFilterIdCurrent_learner: filterScratch_learner && filterScratch_learner.savedFilterIdCurrent,
        companyConfig: selectCompanyConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    learnersInit: (personId) => dispatch(actionLearners.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    learnerFilterInit: (personId) => dispatch(actionLearnerFilter.init(personId)),
    getAllLearnersMentors: (personId) => dispatch(actionMentorsAssigned.getAllLearnersMentors(personId)),
    addLearnersMentorsAssign: (personId, learnersChosen, learningCoach) => dispatch(actionMentorsAssigned.addLearnersMentorsAssign(personId, learnersChosen, learningCoach)),
    clearFilters_learner: (personId) => dispatch(actionLearnerFilter.clearFilters(personId)),
    saveNewSavedSearch_learner: (personId, savedSearchName) => dispatch(actionLearnerFilter.saveNewSavedSearch(personId, savedSearchName)),
    updateSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.updateSavedSearch(personId, learnerFilterId)),
    deleteSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.deleteSavedSearch(personId, learnerFilterId)),
    chooseSavedSearch_learner: (personId, learnerFilterId) => dispatch(actionLearnerFilter.chooseSavedSearch(personId, learnerFilterId)),
    updateFilterByField_learner: (personId, field, value) => dispatch(actionLearnerFilter.updateFilterByField(personId, field, value)),
    updateFilterDefaultFlag_learner: (personId, savedFilterIdCurrent, setValue) => dispatch(actionLearnerFilter.updateFilterDefaultFlag(personId, savedFilterIdCurrent, setValue)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getAllLearnersMentors, learnersInit, learnerFilterInit, personId} = props
            getPageLangs(personId, langCode, 'LearnerMentorReassignView')
            learnersInit(personId)
            learnerFilterInit(personId)
            getAllLearnersMentors(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Mentor Reassign`})
        
  }, [])

  return <LearnerMentorReassignView {...props} />
}

export default Container
