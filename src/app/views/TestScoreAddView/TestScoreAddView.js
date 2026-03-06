import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './TestScoreAddView.css';
const p = 'TestScoreAddView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import TextDisplay from '../../components/TextDisplay';
import InputText from '../../components/InputText';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import DateTimePicker from '../../components/DateTimePicker';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class TestScoreAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			selectedStudent: '',
      testScore: {
				testingId: '',
				studentPersonId: '',
				testDate: '',
				testComponentScores: [],
				note: ''
      },
      errors: {
				testingId: '',
				studentPersonId: '',
				testDate: '',
				testComponentScores: [],
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let testScore = Object.assign({}, this.state.testScore);
	    let errors = Object.assign({}, this.state.errors);
	    testScore[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      testScore,
		      errors
	    });
  }

  processForm = () => {
      const {addOrUpdateTestScore, personId} = this.props;
      const {testScore} = this.state;
      let hasError = false;

			if (!testScore.studentPersonId) {
          hasError = true;
          this.setState({errors: { ...this.state.errors, studentPersonId: <L p={p} t={`Student is required`}/> }});
      }

			if (!testScore.testId) {
          hasError = true;
          this.setState({errors: { ...this.state.errors, testId: <L p={p} t={`Test is required`}/> }});
      }

			if (!testScore.testDate) {
          hasError = true;
          this.setState({errors: { ...this.state.errors, testDate: <L p={p} t={`Test date is required`}/> }});
      }

			// if (!testScore.testComponentId) {
      //     hasError = true;
      //     this.setState({errors: { ...errors, name: <L p={p} t={`Component is required`}/> }});
      // }

      if (!hasError) {
          addOrUpdateTestScore(personId, testScore);
          this.setState({
							testScore: {
								testingId: '',
								studentPersonId: '',
								testDate: '',
								testComponentScores: [],
								note: ''
				      },
							errors: {}
          });
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The test score has been saved`}/></div>);
      }
  }

	handleSelectedStudents = (selectedStudent) => this.setState({ selectedStudent, testScore: {...this.state.testScore, studentPersonId: selectedStudent.id}});

	changeTestDate = (field, event) => {
			const testScore = Object.assign({}, this.state.testScore);
			testScore[field] = event.target.value;
			this.setState({ testScore });
	}

	handleScoreChange = (testComponentId, event) => {
			const testScore = Object.assign({}, this.state.testScore);
			let testComponentScores = Object.assign([], testScore.testComponentScores);
			let option = { testComponentId, score: event.target.value };
			if (testComponentScores && testComponentScores.length > 0) {
					testComponentScores = testComponentScores.filter(m => m.testComponentId !== testComponentId);
					testComponentScores = testComponentScores.concat(option);
			} else {
				testComponentScores = [option]
			}
			testScore.testComponentScores = testComponentScores;
			this.setState({ testScore });
	}

  render() {
    const {personId, myFrequentPlaces, setMyFrequentPlace, testSettings={}, students} = this.props;
    const {testScore, errors, selectedStudent} = this.state;
		let tests = testSettings.tests;
		let test = testScore && testScore.testId && tests && tests.length > 0 && tests.filter(m => m.testId === testScore.testId)[0];
		let testComponents = test && test.testComponentsAssigned;
		let overallScore = 0;

    return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                <L p={p} t={`Add Test Score`}/>
            </div>
						<div>
								<InputDataList
										label={<L p={p} t={`Student`}/>}
										name={'student'}
										options={students}
										value={selectedStudent}
										height={`medium`}
										className={styles.moreSpace}
										onChange={this.handleSelectedStudents}
										required={true}
										whenFilled={selectedStudent && selectedStudent.id}
										error={errors.studentPersonId}/>
						</div>
						<div className={styles.row}>
								<div>
										<SelectSingleDropDown
												id={`testId`}
												name={`testId`}
												label={<L p={p} t={`Test`}/>}
												value={testScore.testId || ''}
												options={tests}
												height={'medium'}
												className={styles.moreBottomMargin}
												required={true}
												whenFilled={testScore.testId}
												onChange={this.handleChange}
												error={errors.testId}/>
								</div>
								{testScore.possibleScore && <TextDisplay label={<L p={p} t={`Possible score`}/>} text={testScore.possibleScore} className={styles.textPlacement}/>}
						</div>
						<div className={styles.moreTop}>
								<DateTimePicker id={`testDate`} value={testScore.testDate} label={<L p={p} t={`Test date`}/>} required={true} whenFilled={testScore.testDate}
										onChange={(event) => this.changeTestDate('testDate', event)} error={errors.testDate}/>
						</div>
						{testComponents && testComponents.length > 0 && testComponents.map((m, i) => {
								let score = testScore && testScore.testComponentScores && testScore.testComponentScores.length > 0 && testScore.testComponentScores.filter(t => t.testComponentId === m.testComponentId)[0];
								score = score && score.score ? score.score : '';
								overallScore = String(Number(score ? score : 0) + Number(overallScore));

								return (
										<InputText key={i}
												id={`possibleScore`}
												name={`possibleScore`}
												size={"super-short"}
												label={<L p={p} t={`${m.testComponentName} score`}/>}
												numberOnly={true}
												value={score || ''}
												onChange={(event) => this.handleScoreChange(m.testComponentId, event)}/>
								)
						})}
						{overallScore ? <TextDisplay label={<L p={p} t={`Total score`}/>} text={overallScore} className={styles.moreSpace}/> : ''}
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Test Score Add`}/>} path={'testScoreAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
            <OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(TestScoreAddView);
