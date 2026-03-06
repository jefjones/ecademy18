import React, {Component} from 'react';
import styles from './LearnerFilter.css';
import Checkbox from '../Checkbox';
import MultiSelect from '../MultiSelect';
import DateTimePicker from '../DateTimePicker';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputText from '../InputText';
import Icon from '../Icon';
import classes from 'classnames';

//The learner filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the learnerFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
//  or to name the current search.  However, that means that a "scratch" record needs to be kept at all times.  We'll keep track of that
//  with a flag called ScratchFlag. That record will probably never have a name associated with it and it won't be included in the savedSearch
//  list.  When a record is chosen, however, it will be overwritten so that that Scratch record can be used to update an existing savedSearch
//  but keep that original savedSearch in tact until the user wants to update criteria, rename it or even delete it.
//The savedSearch list will be kept track of locally.
//There is the option for one of the savedSearch-es to be the default search when the page comes up for the first time.
export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
          savedSearchName: '',
					partialNameText: '',
          errorSearchName: '',
					selectedGradeLevels: [],
          checkedDefault: false,
          searchText: '',
          localDate: {
              birthDateFrom: props.learnerFilter.birthDateFrom,
              birthDateTo: props.learnerFilter.birthDateTo,
          }
      }
  }

  componentDidUpdate(prevProps) {
      if (prevProps.learnerFilter.savedFilterIdCurrent !== this.props.learnerFilter.savedFilterIdCurrent) {
          this.setState({ localDate: {
              birthDateFrom: this.props.learnerFilter.birthDateFrom,
              birthDateTo: this.props.learnerFilter.birthDateTo,
							partialNameText: this.props.learnerFilter.partialNameText
          }});
      }
  }

  avoidDupicateSearchName() {
      const {savedSearchName} = this.state;
      const {savedSearchOptions} = this.props;
      let noDuplicate = true;

      if (!savedSearchName) return true;

      savedSearchOptions && savedSearchOptions.length > 0 && savedSearchOptions.forEach(m => {
          if (m.label.toLowerCase() === savedSearchName.toLowerCase()) {
              noDuplicate = false;
              this.setState({errorSearchName: 'Duplicate name.'})
          }
      })
      return noDuplicate;
  }

  handleSearchNameEnterKey = (event) => {
      event.key === "Enter" && this.handleSearchTextSubmit();
  }

	handlePartialNameEnterKey = (event) => {
      event.key === "Enter" && this.handlePartialNameTextSubmit();
  }

  handleSaveSearchEnterKey = (event) => {
      if (event.key === "Enter" && this.avoidDupicateSearchName()) {
          this.handleSearchNameSubmit();
      }
  }

  handleSearchNameChange = (event) => {
      this.setState({ savedSearchName: event.target.value, errorSearchName: '' });
  }

	handlePartialNameChange = (event) => {
      this.setState({ partialNameText: event.target.value });
  }

	handlePartialNameTextSubmit = () => {
		  const {updateFilterByField, learnerFilter} = this.props;
			const {partialNameText} = this.state;
      updateFilterByField(learnerFilter.personId, 'partialNameText', partialNameText);
	}

  handleSearchNameSubmit = () => {
      const {saveNewSavedSearch, personId} = this.props;
			const {savedSearchName} = this.state;

      if (savedSearchName && this.avoidDupicateSearchName()) {
          saveNewSavedSearch(personId, savedSearchName)
          this.setState({ savedSearchName: '' });
      } else if (!savedSearchName) {
          this.setState({ errorSearchName: 'Search name is missing.'})
      }
  }

  handleSelectedLearnerOutcomes = (selectedLearnerOutcomes) => {
      const {updateFilterByField, learnerFilter} = this.props;
      updateFilterByField(learnerFilter.personId, 'selectedLearnerOutcomes', selectedLearnerOutcomes);
  }

  learnerOutcomesValueRenderer = (selected, options) => {
      return `Learner Outcomes:  ${selected.length} of ${options.length}`;
  }

  learnerOutcomeTargetsValueRenderer = (selected, options) => {
      return `Learner Outcome Targets:  ${selected.length} of ${options.length}`;
  }

  changeReoccurringSchedule = (field, event) => {
	    const localDate = Object.assign({}, this.state.localDate);
	    localDate[field] = event.target.value;
	    this.setState({ localDate });
  }

  setBirthDateFrom = () => {
	    const {updateFilterByField, learnerFilter} = this.props;
	    updateFilterByField(learnerFilter.personId, "birthDateFrom", this.state.localDate.birthDateFrom);
  }

  setBirthDateTo = () => {
	    const {updateFilterByField, learnerFilter} = this.props;
	    updateFilterByField(learnerFilter.personId, "birthDateTo", this.state.localDate.birthDateTo);
  }

	toggleGradeLevel = (gradeLevelId) => {
			const {updateFilterByField, learnerFilter} = this.props;
			let selectedGradeLevels = [...this.state.selectedGradeLevels];
			selectedGradeLevels = selectedGradeLevels.indexOf(gradeLevelId) > -1
					? selectedGradeLevels.filter(id => id !== gradeLevelId)
					: selectedGradeLevels && selectedGradeLevels.length > 0
							? selectedGradeLevels.concat(gradeLevelId)
							: [gradeLevelId];
			this.setState({ selectedGradeLevels });
			updateFilterByField(learnerFilter.personId, "selectedGradeLevels", selectedGradeLevels);
	}

  render() {
    const {learnerFilter, updateFilterByField, learnerOutcomes, learnerOutcomeTargets, learningFocusAreas, facilitators, mentors,
							scheduledCourses, clearFilters, personId, gradeLevels, companyConfig={}} = this.props;
    const {selectedGradeLevels, localDate, partialNameText} = this.state;
    const lf = learnerFilter;

    let g_learnerOutcomes = learnerOutcomes;
    let g_learningFocusAreas = learningFocusAreas;

    if (lf.learningPathwayId) {
        g_learnerOutcomes = g_learnerOutcomes.filter(m => m.learningPathwayId === lf.learningPathwayId);
        g_learningFocusAreas = g_learningFocusAreas.filter(m => m.learningPathwayId === lf.learningPathwayId);
    }
    if (lf.selectedLearnerOutcomeTargets && lf.selectedLearnerOutcomeTargets.length > 0) {
        g_learnerOutcomes = g_learnerOutcomes.filter(m => lf.selectedLearnerOutcomeTargets.includes(m.gradeTarget));
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={classes(styles.littleLeft, styles.row)}>
                    <div className={styles.dateRow}>
                        <span className={styles.text}>Birth date - From</span>
                        <DateTimePicker id={`birthDateFrom`} value={localDate.birthDateFrom} maxDate={lf.birthDateTo}
                            onChange={(event) => this.changeReoccurringSchedule('birthDateFrom', event)}
                            onBlur={this.setBirthDateFrom}/>
                    </div>
                    <div className={styles.dateRow}>
                        <span className={styles.text}>To</span>
                        <DateTimePicker id={`birthDateTo`} value={localDate.birthDateTo} minDate={lf.birthDateFrom ? lf.birthDateFrom : ''}
                            onChange={(event) => this.changeReoccurringSchedule('birthDateTo', event)}
                            onBlur={this.setBirthDateTo}/>
                    </div>
										<a onClick={() => clearFilters(personId)} className={classes(styles.lower, styles.linkStyle)}>
												Clear filters
										</a>
                </div>
                <hr className={styles.divider}/>
                <div className={styles.marginLeft}>
										<div className={styles.row}>
		                    <InputText
		                        size={"medium"}
		                        name={"name"}
														label={'Name search'}
		                        value={partialNameText || ''}
		                        onChange={this.handlePartialNameChange}
														inputClassName={styles.partialText}
		                        onEnterKey={this.handlePartialNameEnterKey}/>
		                    <a onClick={this.handlePartialNameTextSubmit} className={styles.nameLinkStyle}>
		                        <Icon pathName={`plus`} className={styles.image}/>
		                    </a>
		                </div>
										<div>
												<SelectSingleDropDown
														id={`courseScheduledId`}
														name={`courseScheduledId`}
														label={companyConfig.isMcl ? `Learning opportunities` : `Courses`}
														value={lf.courseScheduledId}
														options={scheduledCourses}
														className={styles.moreBottomMargin}
														height={`medium`}
														onChange={(event) => updateFilterByField(lf.personId, 'courseScheduledId', event.target.value)}
														onEnterKey={this.handleEnterKey}/>
										</div>
										{/*<div>
		                    <SelectSingleDropDown
		                        id={`learningPathwayId`}
		                        name={`learningPathway`}
		                        label={companyConfig.isMcl ? `Learning pathway` : `Course discipline`}
		                        value={lf.learningPathwayId}
		                        options={learningPathways}
		                        className={styles.moreBottomMargin}
		                        height={`medium`}
		                        onChange={(event) => updateFilterByField(lf.personId, 'learningPathwayId', event.target.value)}
		                        onEnterKey={this.handleEnterKey}/>
										</div>*/}
                    {companyConfig.isMcl &&
                        <div className={styles.multiSelect}>
                            <MultiSelect
                                options={learnerOutcomeTargets || []}
                                onSelectedChanged={(selected) => updateFilterByField(lf.personId, 'selectedLearnerOutcomeTargets', selected)}
                                valueRenderer={this.learnerOutcomeTargetsValueRenderer}
                                getJustCollapsed={() => {}}
                                selected={lf.selectedLearnerOutcomeTargets || []}/>
                        </div>
                    }
                    {companyConfig.isMcl &&
                        <div className={styles.multiSelect}>
                            <MultiSelect
                                options={g_learnerOutcomes || []}
                                onSelectedChanged={this.handleSelectedLearnerOutcomes}
                                valueRenderer={this.learnerOutcomesValueRenderer}
                                getJustCollapsed={() => {}}
                                selected={lf.selectedLearnerOutcomes || []}/>
                        </div>
                    }
										{companyConfig.isMcl &&
		                    <div className={styles.row}>
		                        <span className={styles.textRating}>Rating</span>
		                        <Checkbox
		                            id={`loProficient`}
		                            label={`Proficient`}
		                            checked={lf.loProficient}
		                            onClick={(event) => updateFilterByField(lf.personId, 'loProficient', event)}
		                            labelClass={styles.labelCheckbox}
		                            className={styles.checkbox} />
		                        <Checkbox
		                            id={`loInProgress`}
		                            label={`In progress`}
		                            checked={lf.loInProgress}
		                            onClick={(event) => updateFilterByField(lf.personId, 'loInProgress', event)}
		                            labelClass={styles.labelCheckbox}
		                            className={styles.checkbox} />
		                        <Checkbox
		                            id={`loNotStarted`}
		                            label={`Not started`}
		                            checked={lf.loNotStarted}
		                            onClick={(event) => updateFilterByField(lf.personId, 'loNotStarted', event)}
		                            labelClass={styles.labelCheckbox}
		                            className={styles.checkbox} />
		                    </div>
										}
										{companyConfig.isMcl && <hr className={styles.divider}/>}
										{companyConfig.isMcl &&
												<div>
				                    <SelectSingleDropDown
				                        id={`learningFocusAreaId`}
				                        label={companyConfig.isMcl ? `Focus areas` : `Sub discipline`}
				                        value={lf.learningFocusAreaId}
				                        options={g_learningFocusAreas}
				                        height={`medium`}
				                        onChange={(event) => updateFilterByField(lf.personId, 'learningFocusAreaId', event.target.value)} />
												</div>
										}
										<div>
		                    <SelectSingleDropDown
		                        id={`facilitatorPersonId`}
		                        label={companyConfig.isMcl ? `Facilitator` : `Teacher`}
		                        value={lf.facilitatorPersonId}
		                        options={facilitators}
		                        height={`medium`}
		                        onChange={(event) => updateFilterByField(lf.personId, 'facilitatorPersonId', event.target.value)} />
										</div>
										{companyConfig.isMcl &&
												<div>
				                    <SelectSingleDropDown
				                        id={`mentorPersonId`}
				                        label={`Learning coach`}
				                        value={lf.mentorPersonId}
				                        options={mentors}
				                        height={`medium`}
				                        onChange={(event) => updateFilterByField(lf.personId, 'mentorPersonId', event.target.value)} />
												</div>
										}
										{!companyConfig.isMcl &&
												<div>
														<hr />
														<span className={classes(styles.textRating, styles.moreTop)}>Grade Level</span>
														<div className={styles.row}>
																{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.label.length <= 2).map((m, i) =>
																		<Checkbox
																				key={i}
																				id={m.id}
																				label={m.label}
																				checked={selectedGradeLevels.indexOf(m.id) > -1 || ''}
																				onClick={() => this.toggleGradeLevel(m.id)}
																				labelClass={styles.labelCheckbox}
																				className={styles.checkbox} />
																)}
														</div>
												</div>
										}
                </div>
            </div>
        </div>
    )
}};


// <hr/>
// <div className={styles.row}>
//     <span className={styles.textSave}>Save search</span>
//     <InputText
//         size={"medium"}
//         name={"name"}
//         value={savedSearchName}
//         onChange={this.handleSearchNameChange}
//         onEnterKey={this.handleSaveSearchEnterKey}
//         error={errorSearchName} />
//     <a onClick={this.handleSearchNameSubmit} className={styles.linkStyle}>
//         <Icon pathName={`plus`} className={styles.image}/>
//     </a>
// </div>
