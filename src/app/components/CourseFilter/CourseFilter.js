import React, {Component} from 'react';
import styles from './CourseFilter.css';
import MultiSelect from '../MultiSelect';
import SelectSingleDropDown from '../SelectSingleDropDown';
import InputText from '../InputText';
import Icon from '../Icon';
const p = 'component';
import L from '../../components/PageLanguage';

//The course filter has the capacity to provide saved and named versions of a search to be used in the future.
//Since the courseFilter record is saved persistently with any movement, that gives us the advantage to update an existing saved searchText
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
          errorSearchName: '',
          checkedDefault: false,
          searchText: '',
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
              this.setState({errorSearchName: <L p={p} t={`Duplicate name.`}/>})
          }
      })
      return noDuplicate;
  }

  handleSearchNameEnterKey = (event) => {
      event.key === "Enter" && this.handleSearchTextSubmit();
  }

  handleSaveSearchEnterKey = (event) => {
      if (event.key === "Enter" && this.avoidDupicateSearchName()) {
          this.handleSearchNameSubmit();
      }
  }

  handleSearchNameChange = (event) => {
      this.setState({ savedSearchName: event.target.value, errorSearchName: '' });
  }

  handleSearchNameSubmit = () => {
      const {savedSearchName} = this.state;
      const {saveNewSavedSearch, personId} = this.props;

      if (savedSearchName && this.avoidDupicateSearchName()) {
          saveNewSavedSearch(personId, savedSearchName)
          this.setState({ savedSearchName: '' });
      } else if (!savedSearchName) {
          this.setState({ errorSearchName: <L p={p} t={`Search name is missing.`}/>})
      }
  }

  handleSelectedLearnerOutcomes = (selectedLearnerOutcomes) => {
      const {updateFilterByField, learnerFilter} = this.props;
      updateFilterByField(learnerFilter.personId, 'selectedLearnerOutcomes', selectedLearnerOutcomes);
  }

  learnerOutcomesValueRenderer = (selected, options) => {
      return <L p={p} t={`Learner Outcomes:  ${selected.length} of ${options.length}`}/>;
  }

  learnerOutcomeTargetsValueRenderer = (selected, options) => {
      return <L p={p} t={`Learner Outcome Targets:  ${selected.length} of ${options.length}`}/>;
  }

  render() {
    const {courseFilter, updateFilterByField, learnerOutcomes, learnerOutcomeTargets, learningPathways, learningFocusAreas,
              facilitators, companyConfig={}} = this.props;
    const {savedSearchName, errorSearchName} = this.state;
    const wf = courseFilter;

    let g_learnerOutcomes = learnerOutcomes;
    let g_learningFocusAreas = learningFocusAreas;

    if (wf.learningPathwayId) {
        g_learnerOutcomes = g_learnerOutcomes.filter(m => m.learningPathwayId === wf.learningPathwayId);
        g_learningFocusAreas = g_learningFocusAreas.filter(m => m.learningPathwayId === wf.learningPathwayId);
    }
    if (wf.selectedLearnerOutcomeTargets && wf.selectedLearnerOutcomeTargets.length > 0) {
        g_learnerOutcomes = g_learnerOutcomes.filter(m => wf.selectedLearnerOutcomeTargets.includes(m.gradeTarget));
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.marginLeft}>
                    <div>
                        <SelectSingleDropDown
                            id={`learningPathwayId`}
                            name={`learningPathway`}
                            label={<L p={p} t={`Subject/Discipline`}/>`}
                            value={wf.learningPathwayId}
                            options={learningPathways}
                            className={styles.moreBottomMargin}
                            height={`medium`}
                            onChange={(event) => updateFilterByField(wf.personId, 'learningPathwayId', event.target.value)}
                            onEnterKey={this.handleEnterKey}/>
                    </div>
                    {companyConfig.isMcl &&
                        <div className={styles.multiSelect}>
                            <MultiSelect
                                options={learnerOutcomeTargets || []}
                                onSelectedChanged={(selected) => updateFilterByField(wf.personId, 'selectedLearnerOutcomeTargets', selected)}
                                valueRenderer={this.learnerOutcomeTargetsValueRenderer}
                                getJustCollapsed={() => {}}
                                selected={wf.selectedLearnerOutcomeTargets || []}/>
                        </div>
                    }
                    {companyConfig.isMcl &&
                        <div className={styles.multiSelect}>
                            <MultiSelect
                                options={g_learnerOutcomes || []}
                                onSelectedChanged={(selected) => updateFilterByField(wf.personId, 'selectedLearnerOutcomes', selected)}
                                valueRenderer={this.learnerOutcomesValueRenderer}
                                getJustCollapsed={() => {}}
                                selected={wf.selectedLearnerOutcomes || []}/>
                        </div>
                    }
                    <hr className={styles.divider}/>
                    <SelectSingleDropDown
                        id={`learningFocusAreaId`}
                        label={<L p={p} t={`Sub discipline`}/>}
                        value={wf.learningFocusAreaId}
                        options={g_learningFocusAreas}
                        height={`medium`}
                        onChange={(event) => updateFilterByField(wf.personId, 'learningFocusAreaId', event.target.value)} />
                    <SelectSingleDropDown
                        id={`facilitatorPersonId`}
                        label={<L p={p} t={`Teacher`}/>}
                        value={wf.facilitatorPersonId}
                        options={facilitators}
                        height={`medium`}
                        onChange={(event) => updateFilterByField(wf.personId, 'facilitatorPersonId', event.target.value)} />
                </div>
                <hr/>
                <div className={styles.row}>
                    <span className={styles.textSave}>Save search</span>
                    <InputText
                        size={"medium"}
                        name={"name"}
                        value={savedSearchName}
                        onChange={this.handleSearchNameChange}
                        onEnterKey={this.handleSaveSearchEnterKey}
                        error={errorSearchName} />
                    <a onClick={this.handleSearchNameSubmit} className={styles.linkStyle}>
                        <Icon pathName={`plus`} className={styles.image}/>
                    </a>
                </div>
            </div>
        </div>
    )
}};
