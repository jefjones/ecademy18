import React, {Component} from 'react';
import styles from './RatingBookView.css';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MultiSelect from '../../components/MultiSelect';
import Checkbox from '../../components/Checkbox';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class RatingBookView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentPersonId: props.studentPersonId,
      selectedLearnerOutcomes: [],
      selectedCourses: [],
      selectUsers: [],
      proficient: false,
      inProgress: false,
      notStarted: false,
    }
  }

  handleLearnerChange = (event) => {
    const {ratingBookInit, personId} = this.props;
    this.setState({ studentPersonId: event.target.value });
    ratingBookInit(personId, event.target.value)
  }

  toggleCheckbox = (field) => {
    const newState = Object.assign({}, this.state);
    newState[field] = !newState[field];
    this.setState(newState);
  }

  coursesValueRenderer = (selected, options) => {
      return `Learning Opportunities:  ${selected.length} of ${options.length}`;
  }

  facilitatorsValueRenderer = (selected, options) => {
      return `Facilitators:  ${selected.length} of ${options.length}`;
  }

  learnerOutcomesValueRenderer = (selected, options) => {
      return `Learner Outcomes:  ${selected.length} of ${options.length}`;
  }

  handleSelectedFacilitators = (selectedFacilitators) => {
      this.setState({ selectedFacilitators });
  }

  handleSelectedCourses = (selectedCourses) => {
      this.setState({ selectedCourses });
  }

  handleSelectedLearnerOutcomes = (selectedLearnerOutcomes) => {
      this.setState({ selectedLearnerOutcomes });
  }

  render() {
    const {personId, studentPersonId, ratingBook, courses, students, facilitators, learnerOutcomes, setRatingBook, fetchingRecord} = this.props;
    const {selectedLearnerOutcomes, selectedCourses, selectedFacilitators, proficient, inProgress, notStarted} = this.state;

    let headings = [{label: 'Proficient', tightText: true}, {label: 'In Progress', tightText: true}, {label: 'Not Started', tightText: true}, {label: 'Code', tightText: true}, {label: 'Learner Outcome', tightText: true}];
    let data = [];

    if (ratingBook && ratingBook.length > 0) {
        data = ratingBook.map(m => {
            return ([
              {id: m.learnerOutcomeId, value: <Checkbox id={m.studentPersonId} checked={m.proficient} onClick={() => setRatingBook(personId, m.studentPersonId, m.learnerOutcomeId, 'proficient')}/>},
              {id: m.learnerOutcomeId, value: <Checkbox id={m.studentPersonId} checked={m.inProgress} onClick={() => setRatingBook(personId, m.studentPersonId, m.learnerOutcomeId, 'inProgress')}/>},
              {id: m.learnerOutcomeId, value: <Checkbox id={m.studentPersonId} checked={m.notStarted} onClick={() => setRatingBook(personId, m.studentPersonId, m.learnerOutcomeId, 'notStarted')}/>},
              {id: m.learnerOutcomeId, value: m.externalId},
              {id: m.learnerOutcomeId, value: m.learnerOutcomeDesc},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {'Learner Outcome Feedback'}
            </div>
            <div>
                <SelectSingleDropDown
                    id={'studentPersonId'}
                    value={studentPersonId}
                    label={`Learner`}
                    options={students}
                    height={`medium`}
                    noBlank={true}
                    className={styles.singleDropDown}
                    onChange={this.handleLearnerChange}/>
            </div>
            <div className={styles.multiSelect}>
                <MultiSelect
                    options={facilitators || []}
                    onSelectedChanged={this.handleSelectedFacilitators}
                    valueRenderer={this.facilitatorsValueRenderer}
                    getJustCollapsed={() => {}}
                    selected={selectedFacilitators || []}/>
            </div>
            <div className={styles.multiSelect}>
                <MultiSelect
                    options={courses || []}
                    onSelectedChanged={this.handleSelectedCourses}
                    valueRenderer={this.coursesValueRenderer}
                    getJustCollapsed={() => {}}
                    selected={selectedCourses || []}/>
            </div>
            <div className={styles.multiSelect}>
                <MultiSelect
                    options={learnerOutcomes || []}
                    onSelectedChanged={this.handleSelectedLearnerOutcomes}
                    valueRenderer={this.learnerOutcomesValueRenderer}
                    getJustCollapsed={() => {}}
                    selected={selectedLearnerOutcomes || []}/>
            </div>
            <div className={styles.row}>
                <span className={styles.textRating}>Feedback Search</span>
                <Checkbox
                    id={`proficient`}
                    label={`Proficient`}
                    checked={proficient}
                    onClick={() => this.toggleCheckbox('proficient')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
                <Checkbox
                    id={`inProgress`}
                    label={`In progress`}
                    checked={inProgress}
                    onClick={(event) => this.toggleCheckbox('inProgress')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
                <Checkbox
                    id={`notStarted`}
                    label={`Not started`}
                    checked={notStarted}
                    onClick={(event) => this.toggleCheckbox('notStarted')}
                    labelClass={styles.labelCheckbox}
                    className={styles.checkbox} />
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
								isFetchingRecord={fetchingRecord.ratingBook}/>
            <hr />
            <OneFJefFooter />
      </div>
    );
  }
}
