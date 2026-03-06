import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './AssignLockerView.css';
import InputTextArea from '../../components/InputTextArea';
import OneFJefFooter from '../../components/OneFJefFooter';
import Icon from '../../components/Icon';
import classes from 'classnames';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import InputDataList from '../../components/InputDataList';
import EditTable from '../../components/EditTable';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import { withAlert } from 'react-alert';

class AssignLockerView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					selectedStudents: [],
					selectedLockers: [],
					selectedPadlocks: [],
					errors: {
							students: '',
							lockers: '',
					}
	    }
  }

  processForm = (stayOrFinish) => {
			const {personId, setLockerStudentAssign} = this.props;
			const { selectedStudents, selectedLockers, selectedPadlocks, note} = this.state;
			let errors = Object.assign({}, this.state.errors);
      let hasError = false;

			if (!(selectedStudents && selectedStudents.length > 0)) {
					hasError = true;
					errors.students = <L p={p} t={`Student is required`}/>
					this.setState ({errors: errors})
			}

			if (!(selectedLockers && selectedLockers.length > 0)) {
					hasError = true;
					errors.lockers = <L p={p} t={`Locker is required`}/>
					this.setState ({errors: errors})
			}

      if (!hasError) {
					setLockerStudentAssign(personId, {
							students: selectedStudents,
							lockers: selectedLockers,
							paddlelocks: selectedPadlocks,
							note,
					});

					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The assigment was saved`}/></div>);

					this.setState({
							selectedStudents: [],
							selectedLockers: [],
							selectedPadlocks: [],
							note: '',
							errors: {
									students: '',
									lockers: '',
							}
			    })
					browserHistory.push('/lockerAssignments');
      }
  }

	handleChange = (event) => {
			let newState = Object.assign({}, this.state);
			newState.note = event.target.value;
			this.setState(newState);
	}

	handleSelectedStudents = selectedStudents => this.setState({ selectedStudents });
	handleSelectedLockers = selectedLockers => this.setState({ selectedLockers });
	handleSelectedPaddlelocks = selectedPadlocks => this.setState({ selectedPadlocks });

  render() {
		const {personId , myFrequentPlaces, setMyFrequentPlace, students, lockers, padlocks, lockerStudentAssigns, companyConfig={}, fetchingRecord} = this.props;
		const {selectedStudents, selectedLockers, selectedPadlocks, note, errors={}} = this.state;

		let headings = [{},{},
				{label: <L p={p} t={`Student`}/>, tightText: true},
				{label: <L p={p} t={`Locker`}/>, tightText: true},
				{label: <L p={p} t={`Padlock`}/>, tightText: true},
				{label: <L p={p} t={`Note`}/>, tightText: true},
		];

		let accumulateMatches = [];

		if (lockerStudentAssigns && lockerStudentAssigns.length > 0 && ((selectedStudents && selectedStudents.length > 0) || (selectedLockers && selectedLockers.length > 0) || (selectedPadlocks && selectedPadlocks.length > 0))) {
				if (selectedStudents && selectedStudents.length > 0) accumulateMatches = accumulateMatches.concat(lockerStudentAssigns.filter(m => {
						let found = false;
						selectedStudents.forEach(s => {
								if (s.id === m.personId) found = true;
						})
						return found;
				}))
				if (selectedLockers && selectedLockers.length > 0) accumulateMatches = accumulateMatches.concat(lockerStudentAssigns.filter(m => {
						let found = false;
						selectedLockers.forEach(s => {
								if (s.id === m.lockerId) found = true;
						})
						return found;
				}))
				if (selectedPadlocks && selectedPadlocks.length > 0) accumulateMatches = accumulateMatches.concat(lockerStudentAssigns.filter(m => {
						let found = false;
						selectedPadlocks.forEach(s => {
								if (s.id === m.paddlelockId) found = true;
						})
						return found;
				}))
		}

		let uniqueMatches = accumulateMatches && accumulateMatches.length > 0 && accumulateMatches.reduce((acc, m) => {
				let isMatch = false;
				acc.forEach(a => {
						if (a.fname === m.fname && a.lname === m.lname && a.lockerName === m.lockerName && a.serialNumber === m.serialNumber) {
								isMatch = true;
						}
				})
				if (!isMatch) acc = acc ? acc.concat(m) : [m];
				return acc;
		},[])

		let data = uniqueMatches && uniqueMatches.length > 0 && uniqueMatches.map(m => {
				return [
						{value: <Link to={`assignLocker/${m.lockerStudentAssignId}`}>
												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
										</Link>
						},
						{value: <a onClick={() => this.handleRemoveOpen(m.lockerStudentAssignId)} className={styles.remove}>
												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: companyConfig.studentNameFirst === 'FIRSTNAME' ? m.fname + ' ' + m.lname : m.lname + ', ' + m.fname},
						{value: m.lockerName},
						{value: m.serialNumber},
						{value: (m.lockerNote ? <L p={p} t={`Locker: ${m.lockerNote}`}/> : '') + (m.paddlelockNote ? <L p={p} t={`Padlock: ${m.paddlelockNote}`}/> : '')},

				]
		});

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								Add Locker Assignment
						</div>
						<div className={globalStyles.instructionsBigger}>
								<L p={p} t={`You can assign more than one locker to a student and more than one student to a locker.`}/>
						</div>
            <div className={styles.rowWrap}>
								<div>
										<InputDataList
												label={<L p={p} t={`Student(s)`}/>}
												name={'students'}
												options={students}
												value={selectedStudents}
												multiple={true}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedStudents}
												required={true}
												whenFilled={selectedStudents && selectedStudents.length > 0}
												error={errors.students}/>
								</div>
								<div>
										<InputDataList
												label={<L p={p} t={`Locker(s)`}/>}
												name={<L p={p} t={`lockers`}/>}
												options={lockers}
												value={selectedLockers}
												multiple={true}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedLockers}
												required={true}
												whenFilled={selectedLockers && selectedLockers.length > 0}
												error={errors.lockers}/>
								</div>
								<div className={styles.moreTop}>
										<InputDataList
												label={<L p={p} t={`Padlock(s) (optional)`}/>}
												name={'padlocks'}
												options={padlocks}
												value={selectedPadlocks}
												multiple={true}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedPaddlelocks}/>
								</div>
            </div>
						<InputTextArea
								label={<L p={p} t={`Note (optional)`}/>}
								name={'note'}
								value={note || ''}
								autoComplete={'dontdoit'}
								onChange={this.handleChange}/>
						<hr/>
						{data && data.length > 0 && ((selectedStudents && selectedStudents.length > 0) || (selectedLockers && selectedLockers.length > 0) || (selectedPadlocks && selectedPadlocks.length > 0)) &&
								<div>
										<div className={styles.warningLabel}><L p={p} t={`There is an existing similar assignment`}/></div>
										<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.assignLocker}/>
								</div>
						}
						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.push('/lockerAssignments')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
						</div>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Assign Locker`}/>} path={'assignLocker'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
					<OneFJefFooter />
      	</div>
    );
  }
}

export default withAlert(AssignLockerView);
