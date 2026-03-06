import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './ClassPeriodsSettingsView.css';
const p = 'ClassPeriodsSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import TimeDisplay from '../../components/TimeDisplay';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import Required from '../../components/Required';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class ClassPeriodsSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      classPeriodId: '',
      classPeriod: {
				classPeriodId: 0,
        periodNumber: '',
        startTime: '',
        endTime: '',
      },
      errors: {
        periodNumber: '',
        startTime: '',
        endTime: ''
      }
    }
  }

  componentDidMount() {
    //document.getElementById('periodNumber').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
  }

  changePeriod = (event) => {
	    const field = event.target.name;
	    let classPeriod = Object.assign({}, this.state.classPeriod);
	    let errors = Object.assign({}, this.state.errors);
	    classPeriod[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      classPeriod,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateClassPeriod, personId} = this.props;
      const {classPeriod} = this.state;
      let hasError = false;
			let errors = Object.assign({}, this.state.errors);

      if (!classPeriod.periodNumber) {
          hasError = true;
          errors.periodNumber = <L p={p} t={`Period number is required`}/>;
      }
      if (!classPeriod.startTime) {
          hasError = true;
          errors.startTime = <L p={p} t={`Start time is required`}/>;
      }
      if (!classPeriod.endTime) {
          hasError = true;
          errors.endTime = <L p={p} t={`End time is required`}/>;
      }

      if (hasError) {
					this.setState({ errors });
			} else {
          addOrUpdateClassPeriod(personId, classPeriod);
          this.setState({
              classPeriod: {
									classPeriodId: 0,
                  periodNumber: '',
                  startTime: '',
                  endTime: '',
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleShowUsedInOpen = (usedIn) => {
      let listUsedIn = [];
      listUsedIn[listUsedIn.length] = <L p={p} t={`In order to delete this class period, please reassign the following courses with a different class period setting:`}/>
      listUsedIn[listUsedIn.length] = <br/>
      listUsedIn[listUsedIn.length] = <br/>

			usedIn && usedIn.length > 0 && usedIn.forEach(m => {
          listUsedIn[listUsedIn.length] = m;
          listUsedIn[listUsedIn.length] = <br/>;
      });
			this.setState({isShowingModal_usedIn: true, listUsedIn });
	}
  handleShowUsedInClose = () => this.setState({isShowingModal_usedIn: false, listUsedIn: [] })

	handleRemoveItemOpen = (classPeriodId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, classPeriodId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeClassPeriod, personId} = this.props;
      const {classPeriodId} = this.state;
      removeClassPeriod(personId, classPeriodId);
      this.handleRemoveItemClose();
  }

	handleEdit = (classPeriodId) => {
			const {classPeriods} = this.props;
			let classPeriod = classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodId === classPeriodId)[0];
			if (classPeriod && classPeriod.periodNumber) {
					classPeriod.startTime = classPeriod.startTime.indexOf('T') > -1 ? classPeriod.startTime.substring(classPeriod.startTime.indexOf('T') + 1) : classPeriod.startTime;
					classPeriod.endTime = classPeriod.endTime.indexOf('T') > -1 ? classPeriod.endTime.substring(classPeriod.endTime.indexOf('T') + 1) : classPeriod.endTime;
					this.setState({ classPeriod })
			}
	}

  render() {
    const {classPeriods, periodsList, fetchingRecord} = this.props;
    const {classPeriod, errors, isShowingModal_remove, isShowingModal_usedIn, listUsedIn} = this.state;

    let headings = [{}, {},
				{label: <L p={p} t={`Period`}/>, tightText: true},
				{label: <L p={p} t={`Start Time`}/>, tightText: true},
				{label: <L p={p} t={`End Time`}/>, tightText: true},
				{label: <L p={p} t={`Used `}/>, tightText: true}];

    let data = [];

    if (classPeriods && classPeriods.length > 0) {
        data = classPeriods.map((m, i) => {
            return ([
							{value: <a key={i} onClick={() => this.handleEdit(m.classPeriodId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {id: m.classPeriodId, value: <a key={i} onClick={() => this.handleRemoveItemOpen(m.classPeriodId, m.usedIn)} className={styles.remove}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
              {id: m.classPeriodId, value: m.periodNumber + ' ' + (m.descriptor || '')},
              {id: m.classPeriodId, value: <TimeDisplay key={i} time={m.startTime} className={styles.cellSpacing}/>},
              {id: m.classPeriodId, value: <TimeDisplay key={i} time={m.endTime} className={styles.cellSpacing}/>},
							{value: m.usedIn && m.usedIn.length, clickFunction: () => this.handleShowUsedInOpen(m.usedIn)},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Class Period Settings`}/>
            </div>
            <div>
                <SelectSingleDropDown
                    id={'periodNumber'}
                    value={classPeriod.periodNumber}
                    label={<L p={p} t={`Period`}/>}
                    options={periodsList}
                    height={`medium`}
                    className={styles.singleDropDown}
                    onChange={this.changePeriod}
										required={true}
										whenFilled={classPeriod.periodNumber}
                    error={errors.periodNumber}/>
            </div>
						<div className={classes(styles.row, styles.littleLeft, styles.littleTop)}>
								<InputText
										name={'descriptor'}
										value={classPeriod.descriptor || ''}
										label={<L p={p} t={`Descriptor (optional)`}/>}
										maxLength={25}
										size={'medium-short'}
										onChange={this.changePeriod}/>
								<div className={classes(styles.muchTop, globalStyles.instructions)}><L p={p} t={`To indicate the difference if using the same period number.`}/></div>
						</div>
            <div className={styles.dateColumn}>
								<div className={styles.row}>
		                <span className={styles.label}><L p={p} t={`Start time`}/></span>
										<Required setIf={true} setWhen={classPeriod.startTime}/>
								</div>
                <input type="time" name={'startTime'} onChange={this.changePeriod} value={classPeriod.startTime || ''} className={styles.timePicker}/>
            </div>
						<div className={classes(styles.errorPosition, globalStyles.errorText)}>{errors.startTime}</div>
            <div className={styles.dateColumn}>
								<div className={styles.row}>
		                <span className={styles.label}><L p={p} t={`End time`}/></span>
										<Required setIf={true} setWhen={classPeriod.endTime}/>
								</div>
                <input type="time" name={'endTime'} onChange={this.changePeriod} value={classPeriod.endTime || ''} className={styles.timePicker}/>
            </div>
						<div className={classes(styles.errorPosition, globalStyles.errorText)}>{errors.endTime}</div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.classPeriodsSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this class period?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this class period?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Class Period is used in these Courses`}/>}
										explainJSX={listUsedIn}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
