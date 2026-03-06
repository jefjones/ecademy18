import React, {Component} from 'react';
import styles from './LearnerMentorReassignView.css';
import globalStyles from '../../utils/globalStyles.css';
import { browserHistory } from 'react-router';
import EditTable from '../../components/EditTable';
import MultiSelect from '../../components/MultiSelect';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateMoment from '../../components/DateMoment';
import LearnerFilter from '../../components/LearnerFilter';
import Accordion from '../../components/ListAccordion/Accordion/Accordion.js';
import AccordionItem from '../../components/ListAccordion/AccordionItem/AccordionItem.js';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

class LearnerMentorReassignView extends Component {
    constructor(props) {
      super(props);

      this.state = {
          isShowingModal: false,
          selectedLearners: [], //This is not the same as learnersChosen since the user can continue to accumulate the selected learners in learnersChosen
          learnersChosen: [], //This is the final list that is sent to the add function ultimately. The selectedLearners is the multiSelect which can be reset for the next choices to add to learnersChosen
          learningCoach: '',
          errorLearningCoach: '',
          errorLearnersChosen: '',
      }
    }

    handleMentorChange = (event) => {
        this.setState({ learningCoach: event.target.value });
    }

    removeLearner = (id) => {
        //Remove the chosen learner from the table list as well as the select list (although the select list is secondary, it would be convenience to unselect them in case the user wants to add them again)
        let learnersChosen = [...this.state.learnersChosen];
        let selectedLearners = [...this.state.selectedLearners];
        learnersChosen = learnersChosen.filter(row => row[0].id !== id);
        selectedLearners = selectedLearners.filter(m => m !== id);
        this.setState({ selectedLearners, learnersChosen });
    }

    handleSelectedLearners = (selectedLearners) => {
        const {learners} = this.props;
        //Loop through the selectedLearners and add to learnersChosen IF the learner is not already included in that list.
        let learnersChosen = [...this.state.learnersChosen];
        selectedLearners.forEach(id => {
            let alreadyIncluded = false;
            learnersChosen.forEach(row => {  if (row[0].id === id) alreadyIncluded = true;  })
            if (!alreadyIncluded) {
                let learner = learners.filter(f => f.id === id)[0];
                let newData = [
                    {id: id, value: <a onClick={() => this.removeLearner(id)} className={styles.remove}>remove</a>},
                    {id: id, value: learner.label},
                    {id: id, value: <DateMoment date={learner.birthDate} includeTime={false}/>},
                    {id: id, value: learner.mentorName},
                ];
                learnersChosen = learnersChosen && learnersChosen.length > 0 ? learnersChosen.concat([newData]) : [newData];
            }
        });
        this.setState({ selectedLearners, learnersChosen });
    }

    processForm = (event) => {
        const {addLearnersMentorsAssign, getAllLearnersMentors, personId} = this.props;
        const {selectedLearners, learningCoach} = this.state;
        // prevent default action. in this case, action is the form submission event
        event && event.preventDefault();
        let hasError = false;

        if (!selectedLearners || selectedLearners.length === 0) {
            hasError = true;
            this.setState({errorLearnersChosen: "At least one learner is required" });
        }
        if (!learningCoach) {
            hasError = true;
            this.setState({errorLearningCoach: "Please choose a learning coach" });
        }
        if (!hasError) {
            addLearnersMentorsAssign(personId, selectedLearners, learningCoach);
            getAllLearnersMentors(personId);
            this.setState({
                isShowingModal: false,
                selectedLearners: [],
                learnersChosen: [],
                learningCoach: '',
                errorLearningCoach: '',
                errorLearnersChosen: '',
            });
        }
    }

    learnerValueRenderer = (selected, options) => {
        const {companyConfig} = this.props;
        return companyConfig.isMcl ? `Learners:  ${selected.length} of ${options.length}` : `Students:  ${selected.length} of ${options.length}`;
    }

    render() {
      const {personId, learnerOutcomes, learnerOutcomeTargets, learningPathways, learningFocusAreas, facilitators, mentors, learners,
                filterScratch_learner, savedFilterIdCurrent_learner, learnerFilterOptions_learner, updateFilterByField_learner,
                clearFilters_learner, updateSavedSearch_learner, updateFilterDefaultFlag_learner, deleteSavedSearch_learner,
                chooseSavedSearch_learner, saveNewSavedSearch_learner, companyConfig={}} = this.props;
      const { errorLearningCoach, errorLearnersChosen, selectedLearners, learningCoach } = this.state;

      let learnerHeadings = [{label: ''}, {label: companyConfig.isMcl ? 'Learner Name' : 'Student Name', tightText: true}, {label: 'Birth Date', tightText: true}, {label: 'Learning Coach', tightText: true}];
      let learnerData = [...this.state.learnersChosen];
      learnerData = learnerData.length > 0 ? learnerData : [[{value: ''}, {value: companyConfig.isMcl ? <i>No learners chosen yet.</i> : <i>No students chosen, yet.</i> }]];

      return (
        <div className={styles.container}>
            <div className={styles.marginLeft}>
                <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    {companyConfig.isMcl ? `Reassign Learning Coaches to Learners` : `Reassign Learning Coaches to Students`}
                </div>
                <div className={styles.classification}>Learner(s)</div>
                <span className={styles.error}>{errorLearnersChosen}</span>
                <EditTable labelClass={styles.tableLabelClass} headings={learnerHeadings} data={learnerData} noCount={true}/>
                <Accordion noShowExpandAll={true}>
                    <AccordionItem expanded={false} filterScratch={filterScratch_learner} filterOptions={learnerFilterOptions_learner} savedFilterIdCurrent={savedFilterIdCurrent_learner}
                            updateSavedSearch={updateSavedSearch_learner} deleteSavedSearch={deleteSavedSearch_learner} chooseSavedSearch={chooseSavedSearch_learner}
                            updateFilterByField={updateFilterByField_learner} updateFilterDefaultFlag={updateFilterDefaultFlag_learner} personId={personId}
                            clearFilters={clearFilters_learner}>
                        <LearnerFilter personId={personId} learnerFilter={filterScratch_learner} className={styles.workFilter} updateFilterByField={updateFilterByField_learner}
                            clearFilters={clearFilters_learner} saveNewSavedSearch={saveNewSavedSearch_learner} savedSearchOptions={learnerFilterOptions_learner}
                            learnerOutcomes={learnerOutcomes} learnerOutcomeTargets={learnerOutcomeTargets} learningPathways={learningPathways}
                            learningFocusAreas={learningFocusAreas} facilitators={facilitators} mentors={mentors} companyConfig={companyConfig}/>
                    </AccordionItem>
                </Accordion>
                <div className={styles.multiSelect}>
                    <MultiSelect
                        name={'learners'}
                        options={learners || []}
                        onSelectedChanged={this.handleSelectedLearners}
                        valueRenderer={this.learnerValueRenderer}
                        getJustCollapsed={() => {}}
                        selected={selectedLearners}/>
                </div>
                <hr />
                <div>
                    <SelectSingleDropDown
                        id={`mentor`}
                        label={`Learning coach`}
                        value={learningCoach}
                        options={mentors}
                        className={styles.singleSelect}
                        height={`medium`}
                        onChange={this.handleMentorChange}
                        error={errorLearningCoach} />
                </div>
                <div className={classes(styles.rowCenter)}>
                    <a className={styles.cancelLink} onClick={() => browserHistory.push('/firstNav')}>Close</a>
										<ButtonWithIcon label={'Save'} icon={'checkmark_circle'} onClick={this.processForm}/>
                </div>
            </div>
            <OneFJefFooter />
        </div>
    )};
}

export default LearnerMentorReassignView;
