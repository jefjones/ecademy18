import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './MentorNotAssignedView.css';
const p = 'MentorNotAssignedView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import MessageModal from '../../components/MessageModal';
import EditTable from '../../components/EditTable';
import Checkbox from '../../components/Checkbox';
import DateMoment from '../../components/DateMoment';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';

class MentorNotAssignedView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingModal: false,
            learnersChosen: [],
            learningCoach: '',
            errorLearningCoach: '',
            errorLearnersChosen: '',
        };
    }

    handleMessageClose = () => {
        this.setState({isShowingModal: false});
    }

    handleMessageOpen = () => {
        this.setState({isShowingModal: true});
    }

    handleMentorChange = (event) => {
        this.setState({ learningCoach: event.target.value });
    }

    processForm = (event) => {
      const {addLearnersMentorsAssign, personId, companyConfig={}} = this.props;
      const {learnersChosen, learningCoach} = this.state;
      // prevent default action. in this case, action is the form submission event
      event && event.preventDefault();
      let hasError = false;

      if (!learnersChosen || learnersChosen.length === 0) {
          hasError = true;
          this.setState({errorLearnersChosen: companyConfig.isMcl ? "At least one learner is required" : "At least one student is required" });
      }
      if (!learningCoach) {
          hasError = true;
          this.setState({errorLearningCoach: "Please choose a learning coach" });
      }
      if (!hasError) {
          addLearnersMentorsAssign(personId, learnersChosen, learningCoach);
          this.setState({
              isShowingModal: false,
              learnersChosen: [],
              learningCoach: '',
              errorLearningCoach: '',
              errorLearnersChosen: '',
          });
      }
    }

    isChecked = (studentPersonId) => {
        const {learnersChosen} = this.state;
        let learner = learnersChosen && learnersChosen.length > 0 && learnersChosen.filter(m => m === studentPersonId)[0];
        return !learnersChosen || learnersChosen.length === 0 ? false : !!learner ? true : false;
    }

    toggleCheckbox = (id) => {
        let learnersChosen = [...this.state.learnersChosen];
        learnersChosen = learnersChosen && learnersChosen.length > 0 ? learnersChosen.concat(id) : [id];
        this.setState({ learnersChosen });
    }

    render() {
        const {learnersNot, mentors, companyConfig={}} = this.props;
        const {learnersChosen, isShowingModal, learningCoach, errorLearningCoach, errorLearnersChosen} = this.state;

        let headings = [{}, {id:'', label: companyConfig.isMcl ? 'Learner' : 'Student'}, {id:'', label: 'Birth Date'}];
        let data = [];
        if (!learnersNot || learnersNot.length === 0) {
            data = [[{value: <span><i>No learners without a learning coach</i></span>, colSpan: 4}]];
        } else {
            data = learnersNot && learnersNot.length > 0 && learnersNot.map(m => ([
                {
                    id: m.personId,
                    value: <Checkbox id={m.personId} label={``} checked={!!learnersChosen && learnersChosen.includes(m.personId)}
                              onClick={() => this.toggleCheckbox(m.personId)} labelClass={styles.labelCheckbox} className={styles.checkbox} />
                },
                {
                    id: m.personId,
                    value: m.lastName + ', ' + m.firstName,
                },
                {
                    id: m.personId,
                    value: <DateMoment date={m.birthDate} format={'D MMM YYYY '} />,
                },
            ]));
        }

        return (
            <section className={styles.container}>
                <div className={styles.marginLeft}>
                    <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                        {companyConfig.isMcl ? `Learners Not Assigned to a Learning Coach` : `Students Not Assigned to a Learning Coach`}
                    </div>
                    <div className={styles.tableView}>
                        <EditTable headings={headings} data={data} className={styles.table} />
                    </div>
                    <span className={styles.error}>{errorLearnersChosen}</span>
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
                    <OneFJefFooter />
                    {isShowingModal &&
                        <MessageModal handleClose={this.handleMessageClose} heading={<L p={p} t={`Please notice the errors on the page`}/>}
                           explainJSX={<L p={p} t={`Make sure that you have chosen at least one student and a learning coach`}/>}
                           onClick={this.handleMessageClose} />
                    }
                </div>
            </section>
        );
    }
}

export default MentorNotAssignedView;
