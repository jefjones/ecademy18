import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './LockerSettingView.css';
import InputText from '../../components/InputText';
import InputTextArea from '../../components/InputTextArea';
import OneFJefFooter from '../../components/OneFJefFooter';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import classes from 'classnames';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import EditTable from '../../components/EditTable';

export default class LockerSettingView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			isShowingModal_remove: false,
			locker: {
				lockerId:'',
				name: '',
				level: '',
				combination: '',
				note:'',
			},
			errors: {
				name:'',
			}
    }
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateLocker, personId} = this.props;
			const {locker={}} = this.state;
			let errors = Object.assign({}, this.state.errors);
      let hasError = false;

			if (!locker.name) {
					hasError = true;
					errors.name = <L p={p} t={`Locker Number is required`}/>
					this.setState ({errors: errors})
			}

      if (!hasError) {
          addOrUpdateLocker(personId, locker)
          this.setState({ locker: {
									lockerId:'',
									name: '',
									level: '',
									combination: '',
									note:'',
							}
					})
      }
  }

		handleChange = (event) => {
			let locker = this.state.locker;
			locker[event.target.name] = event.target.value;
			this.setState({locker: locker})
		}

    getrecord = (record) => {
      this.setState({locker: Object.assign({}, record)})
    }

		handleRemoveOpen = (lockerId) => this.setState({isShowingModal_remove: true, lockerId })
		handleRemoveClose = () => this.setState({isShowingModal_remove: false, lockerId: ''})
    handleRemove = () => {
				const {personId, removeLocker} = this.props;
				const {lockerId} = this.state;
				removeLocker(personId, lockerId)
        this.handleRemoveClose();
  	}

  render() {
		const {levels, lockers=[], fetchingRecord} = this.props;
		const {locker={}, errors, isShowingModal_remove} = this.state;

		let headings = [{},{},
				{label: <L p={p} t={`Locker #`}/>, tightText: true},
				{label: <L p={p} t={`Position`}/>, tightText: true},
				{label: <L p={p} t={`Combination`}/>, tightText: true},
				{label: <L p={p} t={`Note`}/>, tightText: true},
		];
		let data = lockers && lockers.length > 0 && lockers.map(locker => {
				return [
						{value: <div onClick={() => this.getrecord(locker)}>
												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
										</div>
						},
						{value: <a onClick={() => this.handleRemoveOpen(locker.lockerId)} className={styles.remove}>
												<Icon pathName={'trash2'} premium={true} className={styles.icon}/>
										</a>
						},
						{value: locker.name},
						{value: locker.level},
						{value: locker.combination},
						{value: locker.note},

				]
		});

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								Lockers
						</div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Locker Number`}/>}
								value={locker.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={locker.name}
								error={errors.name} />
						<div>
								<SelectSingleDropDown
										id={`level`}
										name={`level`}
										label={<L p={p} t={`Position Level`}/>}
										value={locker.level || ''}
										options={levels}
										className={styles.moreBottomMargin}
										height={`medium`}
										onChange={this.handleChange}/>
						</div>
						<InputText
								id={`combination`}
								name={`combination`}
								size={"medium"}
								label={<L p={p} t={`Fixed Combination (optional)`}/>}
								value={locker.combination || ''}
								onChange={this.handleChange} />
						<InputTextArea
								label={<L p={p} t={`Note (optional)`}/>}
								name={'note'}
								value={locker.note}
								onChange={this.handleChange} />
						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                <a className={styles.cancelLink} onClick={() => browserHistory.push('/schoolSettings')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
						<hr/>
						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.lockerSettings}/>
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
