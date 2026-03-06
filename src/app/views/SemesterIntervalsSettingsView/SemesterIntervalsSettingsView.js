import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './SemesterIntervalsSettingsView.css';
const p = 'SemesterIntervalsSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class SemesterIntervalsSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
			isShowingModal_missingInfo: false,
      intervalId: '',
      interval: {
        name: '',
				fromDay: '',
				fromMonth: '',
				toDay: '',
				toMonth: '',
        sequence: props.intervals && props.intervals.length + 1,
        companyId: props.companyConfig.companyId,
      },
      errors: {
				name: '',
        sequence: '',
      }
    }
  }

	componentDidUpdate(prevProps) {
    	if (this.props.intervals !== prevProps.intervals) {
					this.setState({ interval: {...this.state.interval, sequence: this.props.intervals && this.props.intervals.length + 1 } });
			}
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let interval = Object.assign({}, this.state.interval);
	    let errors = Object.assign({}, this.state.errors);
	    interval[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      interval,
		      errors
	    });
  }

	checkUniqueName = (name) => {
			const {intervals} = this.props;
			if (!name) return true;
			let isUnique = true;
			intervals && intervals.length > 0 && intervals.forEach(m => {
					if (m.label.trim() === name.trim()) isUnique = false;
			})
			return isUnique;
	}

  checkUniqueId = (intervalId) => {
			const {intervals} = this.props;
			if (!intervalId) return true;
			let isUnique = true;
			intervals && intervals.length > 0 && intervals.forEach(m => {
					if (m.id === intervalId) isUnique = false;
			})
			return isUnique;
	}

  processForm = (stayOrFinish) => {
      const {companyConfig, addOrUpdateInterval, personId, intervals} = this.props;
      const {interval} = this.state;
			let errors = Object.assign({}, this.state.errors);
      let hasError = false;
			let missingInfoMessage = [];

			let isNameUnique = this.checkUniqueName(interval.name, interval.intervalId);
      let isUniqueId = this.checkUniqueId(interval.intervalId)

			if (!isNameUnique && isUniqueId) {
				hasError = true;
				errors.name = <L p={p} t={`Name is not unique`}/>;
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Name is not unique`}/></div>
			}

			if (!interval.name) {
          hasError = true;
					errors.name = <L p={p} t={`Name is required`}/>;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Name`}/></div>
      }

			if (!interval.sequence) {
          hasError = true;
					errors.sequence = <L p={p} t={`Sequence is required`}/>;
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Sequence is required`}/></div>
      }

			if (!interval.fromDay) {
          hasError = true;
					errors.fromDate = <L p={p} t={`'From' day and month is required.`}/>;
      }

			if (!interval.fromMonth && interval.fromMonth !== 0) {
          hasError = true;
					errors.fromDate = <L p={p} t={`'From' day and month is required.`}/>;
      }
			if (!interval.fromDay || (!interval.fromMonth && interval.fromMonth !== 0))
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`'From' day and month`}/></div>

			if (!interval.toDay) {
          hasError = true;
					errors.toDate = <L p={p} t={`'To' day and month is required.`}/>;
      }

			if (!interval.toMonth && interval.toMonth !== 0) {
          hasError = true;
					errors.toDate = <L p={p} t={`'To' day and month is required.`}/>;
      }

			if (!interval.toDay || (!interval.toMonth && interval.toMonth !== 0))
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`'To' day and month`}/></div>

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.setState({ errors });
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
          addOrUpdateInterval(personId, interval);
          this.setState({
              interval: {
								name: '',
								fromDay: '',
								fromMonth: '',
								toDay: '',
								toMonth: '',
				        sequence: intervals && intervals.length + 1,
                companyId: companyConfig.companyId,
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleShowUsedInOpen = (usedIn) => {
			let listUsedIn = usedIn && usedIn.length > 0 && usedIn.join("<br/>");
			this.setState({isShowingModal_usedIn: true, listUsedIn });
	}
  handleShowUsedInClose = () => this.setState({isShowingModal_usedIn: false, listUsedIn: [] })

  handleRemoveItemOpen = (intervalId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, intervalId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeInterval, personId} = this.props;
      const {intervalId} = this.state;
      removeInterval(personId, intervalId);
      this.handleRemoveItemClose();
  }

	handleEdit = (intervalId) => {
			const {intervals} = this.props;
			let interval = intervals && intervals.length > 0 && intervals.filter(m => m.intervalId === intervalId)[0];
			if (interval && interval.name)
					this.setState({ interval })
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	changeDate = (field, event) => {
			let interval = Object.assign({}, this.state.interval);
			let errors = Object.assign({}, this.state.errors);
			interval[field] = event.target.value;
			errors[field] = '';

			this.setState({
					interval,
					errors
			});
	}

  render() {
		const {intervals, sequences, days, months, fetchingRecord} = this.props;
    const {interval, errors, isShowingModal_remove, isShowingModal_usedIn, listUsedIn, isShowingModal_missingInfo, messageInfoIncomplete} = this.state;

		//We are not going to disable after all.  Let the user change the range any time they want.  It affects the courses created from that point on
		//		as well as the attendance and calendar ranges.
		let isDisabled = false; //coursesScheduled && coursesScheduled.length > 0;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`From day`}/>, tightText: true},
			{label: <L p={p} t={`From month`}/>, tightText: true},
			{label: <L p={p} t={`To day`}/>, tightText: true},
			{label: <L p={p} t={`To month`}/>, tightText: true},
			{label: <L p={p} t={`Sequence`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true, reactHint: 'How many times this semester interval is used with a record'}];

    let data = [];

    if (intervals && intervals.length > 0) {
        data = intervals.map(m => {
            return ([
							{value: isDisabled ? '' : <a onClick={() => this.handleEdit(m.intervalId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: isDisabled ? '' : <a onClick={() => this.handleRemoveItemOpen(m.intervalId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.fromDay},
							{value: (m.fromMonth || m.fromMonth === 0) && months && months.length > 0 && months[m.fromMonth] && months[m.fromMonth].label},
							{value: m.toDay},
							{value: (m.toMonth || m.toMonth === 0) && months && months.length > 0 && months[m.toMonth] && months[m.toMonth].label},
							{value: m.sequence},
              {value: m.usedIn && m.usedIn.length, clickFunction: () => this.handleShowUsedInOpen(m.usedIn), reactHint: 'How many times this semester interval is used with a record'},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Semester or Quarter Interval Settings`}/>
            </div>
						{isDisabled &&
								<div className={globalStyles.instructionsBig}>
										<L p={p} t={`At least one course has been created so that these intervals cannot be changed.`}/>
								</div>
						}
						{isDisabled
								? ''
								: <InputText
											id={`name`}
											name={`name`}
											size={"medium"}
											label={<L p={p} t={`Name`}/>}
											value={interval.name || ''}
											onChange={this.handleChange}
											required={true}
											whenFilled={interval.name}
											error={errors.name} />
						}
						{isDisabled
								? ''
								: <div>
											<SelectSingleDropDown
													id={'sequence'}
													label={<L p={p} t={`Sequence (for list display)`}/>}
													value={interval.sequence || ''}
													noBlank={true}
													options={sequences}
													className={styles.dropdown}
													disabled={isDisabled}
													onChange={this.handleChange}/>
									</div>
						}
						<div className={styles.background}>
								<div className={styles.headerLabel}><L p={p} t={`General date range`}/></div>
								<div className={globalStyles.instructionsBigger}>
										<L p={p} t={`The attendance days will be displayed according to this date range. The calendar will show the schedule accordingly.`}/>
								</div>
								<div className={styles.row}>
										<div>
												<SelectSingleDropDown
														id={'fromDay'}
														label={<L p={p} t={`From day`}/>}
														value={interval.fromDay || ''}
														options={days}
														height={'medium'}
														className={styles.dropdown}
														required={true}
														whenFilled={interval.fromDay}
														onChange={this.handleChange}/>
										</div>
										<div className={styles.moreRight}>
												<SelectSingleDropDown
														id={'fromMonth'}
														label={<L p={p} t={`From month`}/>}
														value={interval.fromMonth === 0 ? 0 : interval.fromMonth ? interval.fromMonth : ''}
														options={months}
														firstValue={-1}
														height={'medium'}
														className={styles.dropdown}
														required={true}
														whenFilled={interval.fromMonth}
														onChange={this.handleChange}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={'toDay'}
														label={<L p={p} t={`To day`}/>}
														value={interval.toDay || ''}
														options={days}
														height={'medium'}
														className={styles.dropdown}
														required={true}
														whenFilled={interval.toDay}
														onChange={this.handleChange}/>
										</div>
										<div>
												<SelectSingleDropDown
														id={'toMonth'}
														label={<L p={p} t={`To month`}/>}
														value={interval.toMonth === 0 ? 0 : interval.toMonth ? interval.toMonth : ''}
														options={months}
														firstValue={-1}
														height={'medium'}
														className={styles.dropdown}
														required={true}
														whenFilled={interval.toMonth}
														onChange={this.handleChange}/>
										</div>
								</div>
								<div className={globalStyles.errorText}>{errors.fromDate} {errors.toDate}</div>
						</div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink} isFetchingRecord={fetchingRecord.intervalsSettings}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this interval?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this interval?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Discipline is used in these Courses`}/>}
										explainJSX={<L p={p} t={`In order to delete this discipline, please reassign the following courses with a different discipline setting:<br/><br/>`}/> + listUsedIn}
										onClick={this.handleShowUsedInClose}/>
            }
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJXS={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
      </div>
    );
  }
}
