import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinanceWaiverSchedulesView.css';
const p = 'FinanceWaiverSchedulesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinanceWaiverSchedulesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financeWaiverScheduleId: '',
      financeWaiverSchedule: {
				dateMonth: '',
        dateDay: '',
				percentWaived: '',
      },
      errors: {
				dateMonth: '',
        dateDay: '',
				percentWaived: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let financeWaiverSchedule = Object.assign({}, this.state.financeWaiverSchedule);
	    let errors = Object.assign({}, this.state.errors);
	    financeWaiverSchedule[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ financeWaiverSchedule, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinanceWaiverSchedule, personId} = this.props;
      const {financeWaiverSchedule, errors} = this.state;
      let hasError = false;

      if (!financeWaiverSchedule.dateMonth) {
          hasError = true;
          this.setState({errors: { ...errors, dateDayMonth: <L p={p} t={`Date Month is required`}/> }});
      }

			if (!financeWaiverSchedule.dateDay) {
          hasError = true;
          this.setState({errors: { ...errors, dateDayMonth: <L p={p} t={`Date Day is required`}/> }});
      }

			if (!financeWaiverSchedule.percentWaived) {
          hasError = true;
          this.setState({errors: { ...errors, percentWaived: <L p={p} t={`Percent Waived is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateFinanceWaiverSchedule(personId, financeWaiverSchedule);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	reset = () => {
			this.setState({
					financeWaiverSchedule: {
						dateMonth: '',
						dateDay: '',
						percentWaived: '',
					},
			});
	}

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financeWaiverScheduleId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financeWaiverScheduleId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinanceWaiverSchedule, personId} = this.props;
      const {financeWaiverScheduleId} = this.state;
      removeFinanceWaiverSchedule(personId, financeWaiverScheduleId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financeWaiverScheduleId) => {
			const {financeWaiverSchedules} = this.props;
			let financeWaiverSchedule = financeWaiverSchedules && financeWaiverSchedules.length > 0 && financeWaiverSchedules.filter(m => m.financeWaiverScheduleId === financeWaiverScheduleId)[0];
			if (financeWaiverSchedule && financeWaiverSchedule.dateMonth) this.setState({ financeWaiverSchedule })
	}

  render() {
    const {financeWaiverSchedules, fetchingRecord, days, months} = this.props;
    const {financeWaiverSchedule, errors, isShowingModal_remove, isShowingModal_usedCount} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Date month`}/>, tightText: true},
			{label: <L p={p} t={`Date day`}/>, tightText: true},
			{label: <L p={p} t={`% Waived`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (financeWaiverSchedules && financeWaiverSchedules.length > 0) {
        data = financeWaiverSchedules.map(m => {
            return ([
							{value: m.dateMonth && <a onClick={() => this.handleEdit(m.financeWaiverScheduleId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.dateMonth && <a onClick={() => this.handleRemoveItemOpen(m.financeWaiverScheduleId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: (m.dateMonth || m.dateMonth === 0) && months && months.length > 0 && months[m.dateMonth].label},
							{value: m.dateDay},
							{value: m.percentWaived === 0 ? '0' : m.percentWaived },
              {value: m.usedCount},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance Waiver Schedules`}/>
            </div>
						<div className={styles.row}>
								<div>
										<SelectSingleDropDown
												id={'dateDay'}
												label={<L p={p} t={`Date day`}/>}
												value={financeWaiverSchedule.dateDay || ''}
												options={days}
												height={'medium'}
												className={styles.dropdown}
												required={true}
												whenFilled={financeWaiverSchedule.dateDay}
												onChange={this.handleChange}/>
								</div>
								<div className={styles.moreRight}>
										<SelectSingleDropDown
												id={'dateMonth'}
												label={<L p={p} t={`Date month`}/>}
												value={financeWaiverSchedule.dateMonth === 0 ? 0 : financeWaiverSchedule.dateMonth ? financeWaiverSchedule.dateMonth : ''}
												options={months}
												firstValue={-1}
												height={'medium'}
												className={styles.dropdown}
												required={true}
												whenFilled={financeWaiverSchedule.dateMonth}
												onChange={this.handleChange}/>
								</div>
								<div className={globalStyles.errorText}>{errors.dateDayMonth}</div>
						</div>
						<InputText
								id={`percentWaived`}
								name={`percentWaived`}
								size={"super-short"}
								numberOnly={true}
								maxNumber={100}
								label={<L p={p} t={`% Waived`}/>}
								value={financeWaiverSchedule.percentWaived || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeWaiverSchedule.percentWaived}
								error={errors.percentWaived} />
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeWaiverScheduleSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance waiver schedule?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance waiver schedule?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance Waiver Schedule is in Use`}/>}
										explainJSX={<L p={p} t={`A finance waiver schedule cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
