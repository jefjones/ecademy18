import React, {Component} from 'react';
import {browserHistory,Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './LockerAssignmentsView.css';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import Icon from '../../components/Icon';
import classes from 'classnames';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import InputDataList from '../../components/InputDataList';
import EditTable from '../../components/EditTable';
import ExcelLockerAssignment from '../../components/ExcelLockerAssignment';
import {guidEmpty} from '../../utils/guidValidate.js';

export default class LockerAssignmentsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			selectedStudents: [],
			selectedLockers: [],
			selectedPadlocks: [],
    }
  }

	componentDidUpdate() {
			const {students, studentChosenSession} = this.props;
			if ((!this.state.studentPersonId || this.state.studentPersonId === guidEmpty)
							&& studentChosenSession && studentChosenSession !== guidEmpty
							&& students && students.length > 0) {
					let student = students.filter(m => m.id === studentChosenSession)[0]
					this.setState({ selectedStudents: [student], studentPersonId: studentChosenSession });
			}
	}

	handleChange = (event) => {
			let locker = this.state.locker;
			locker[event.target.name] = event.target.value;
			this.setState({locker: locker})
	}

	handleRemoveOpen = (lockerStudentAssignId) => this.setState({isShowingModal_remove: true, lockerStudentAssignId })
	handleRemoveClose = () => this.setState({isShowingModal_remove: false, lockerStudentAssignId: ''})
  handleRemove = () => {
			const {personId, removeLockerStudentAssign} = this.props;
			const {lockerStudentAssignId} = this.state;
			removeLockerStudentAssign(personId, lockerStudentAssignId)
      this.handleRemoveClose();
	}

	handleSelectedStudents = selectedStudents => {
			const {setStudentChosenSession} = this.props;
			this.setState({ selectedStudents });
			selectedStudents && selectedStudents.length === 1 ? setStudentChosenSession(selectedStudents[0].id) : setStudentChosenSession('');;
	}
	handleSelectedLockers = selectedLockers => this.setState({ selectedLockers });
	handleSelectedPadlocks = selectedPadlocks => this.setState({ selectedPadlocks });

	changeItem = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState.note =  target.value;
			this.setState( newState );
	}

  render() {
		const {personId, myFrequentPlaces, setMyFrequentPlace, students, lockers, padlocks, lockerStudentAssigns, companyConfig={}} = this.props;
		const {isShowingModal_remove, selectedStudents, selectedLockers, selectedPadlocks} = this.state;

		let headings = [{},
				{label: <L p={p} t={`Student`}/>, tightText: true},
				{label: <L p={p} t={`Locker`}/>, tightText: true},
				{label: <L p={p} t={`Position`}/>, tightText: true},
				{label: <L p={p} t={`Locker note`}/>, tightText: true},
				{label: <L p={p} t={`Padlock`}/>, tightText: true},
				{label: <L p={p} t={`Padlock note`}/>, tightText: true},
				{label: <L p={p} t={`Assign note`}/>, tightText: true},
		];

		let localAssign = lockerStudentAssigns;

		if (localAssign && localAssign.length > 0 && ((selectedStudents && selectedStudents.length > 0) || (selectedLockers && selectedLockers.length > 0) || (selectedPadlocks && selectedPadlocks.length > 0))) {
				if (selectedStudents && selectedStudents.length > 0) localAssign = localAssign.filter(m => {
						let found = false;
						selectedStudents.forEach(s => {
								if (s.id === m.personId) found = true;
						})
						return found;
				})
				if (selectedLockers && selectedLockers.length > 0) localAssign = localAssign.filter(m => {
						let found = false;
						selectedLockers.forEach(s => {
								if (s.id === m.lockerId) found = true;
						})
						return found;
				})
				if (selectedPadlocks && selectedPadlocks.length > 0) localAssign = localAssign.filter(m => {
						let found = false;
						selectedPadlocks.forEach(s => {
								if (s.id === m.paddlelockId) found = true;
						})
						return found;
				})
		}

		let data = localAssign && localAssign.length > 0 && localAssign.map(m => {
				return [
						{value: <a onClick={() => this.handleRemoveOpen(m.lockerStudentAssignId)} className={styles.remove}>
												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: companyConfig.studentNameFirst === 'FIRSTNAME' ? m.fname + ' ' + m.lname : m.lname + ', ' + m.fname},
						{value: m.lockerName},
						{value: m.positionLevel},
						{value: m.lockerNote},
						{value: m.serialNumber},
						{value: m.paddlelockNote},
						{value: m.lockerStudentAssignNote},
				]
		});

		if (!data || data.length === 0) {
				data = [[{value: ''}, {value: <i>No records found.</i> }]]
		}

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Locker Assignments`}/>
						</div>
            <div className={styles.rowWrap}>
                <div>
                    <div>
												<div>
														<InputDataList
																label={<L p={p} t={`Student search`}/>}
																name={'students'}
																options={students}
																value={selectedStudents}
																multiple={true}
																height={`medium`}
																className={styles.moreSpace}
																onChange={this.handleSelectedStudents}/>
												</div>
												<div>
														<InputDataList
																label={<L p={p} t={`Locker search`}/>}
																name={'lockers'}
																options={lockers}
																value={selectedLockers}
																multiple={true}
																height={`medium`}
																className={styles.moreSpace}
																onChange={this.handleSelectedLockers}/>
												</div>
												<div>
														<InputDataList
																label={<L p={p} t={`Paddlelock search`}/>}
																name={'padlocks'}
																options={padlocks}
																value={selectedPadlocks}
																multiple={true}
																height={`medium`}
																className={styles.moreSpace}
																onChange={this.handleSelectedPadlocks}/>
												</div>
                    </div>
	              </div>
	              <div className={styles.positionIconLink}>
	                  <Link to={'/assignLocker'} className={classes(styles.row, globalStyles.link, styles.moreTop)}>
	                      <Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
	                      <L p={p} t={`Add another assignment`}/>
	                  </Link>
										<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
				                <ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={() => browserHistory.push('/firstNav')}/>
				            </div>
	              </div>
	          </div>
						<hr/>
						<EditTable data={data} headings={headings} />
						<ExcelLockerAssignment lockerStudentAssigns={lockerStudentAssigns} companyConfig={companyConfig}/>
						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Locker Assignments`}/>} path={'lockerAssignments'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
						<OneFJefFooter />
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this record?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this record?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
      	</div>
    );
  }
}
