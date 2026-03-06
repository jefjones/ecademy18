import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './PaddleLockSettingView.css';
import InputText from '../../components/InputText';
import OneFJefFooter from '../../components/OneFJefFooter';
import Icon from '../../components/Icon';
import classes from 'classnames';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import EditTable from '../../components/EditTable';

export default class PaddleLockSettingView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_remove: false,
					paddlelock: {
						paddlelockId:'',
						serialNumber: '',
						combination: '',
					},
					errors: {
						serialNumber:'',
					}
    	}
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdatePaddlelock, personId} = this.props;
			const {paddlelock={}} = this.state;
			let errors = Object.assign({}, this.state.errors);
      let hasError = false;

			if (!paddlelock.serialNumber) {
					hasError = true;
					errors.serialNumber = <L p={p} t={`Serial Number is required`}/>
					this.setState ({errors: errors})
			}

      if (!hasError) {
        addOrUpdatePaddlelock(personId, paddlelock)
        this.setState({ paddlelock: {} })
      }
  }

		handleChange = (event) => {
			let paddlelock = this.state.paddlelock;
			paddlelock[event.target.name] = event.target.value;
			this.setState({paddlelock})
		}

    getRecord = (record) => {
      	this.setState({paddlelock: Object.assign({}, record)})
    }

		handleRemoveOpen = (paddlelockId) => this.setState({isShowingModal_remove: true, paddlelockId })
		handleRemoveClose = () => this.setState({isShowingModal_remove: false, paddlelockId: ''})
    handleRemove = () => {
				const {personId, removePaddlelock} = this.props;
				const {paddlelockId} = this.state;
				removePaddlelock(personId, paddlelockId)
        this.handleRemoveClose();
  	}


  render() {
    const {paddlelocks=[], fetchingRecord} = this.props;
		const {paddlelock={}, errors, isShowingModal_remove} = this.state;

		let headings = [{},{},
				{label: <L p={p} t={`Serial #`}/>, tightText: true},
				{label: <L p={p} t={`Combination`}/>, tightText: true},
		];
		let data = paddlelocks && paddlelocks.length > 0 && paddlelocks.map(m => {
				return [
						{value: <div onClick={() => this.getRecord(m)}>
												<Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
										</div>
						},
            {value: <a onClick={() => this.handleRemoveOpen(m.paddlelockId)} className={styles.remove}>
                        <Icon pathName={'trash2'} premium={true} className={styles.icon}/>
                    </a>
						},
						{value: m.serialNumber},
						{value: m.combination},

				]
		});

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Padlocks`}/>
						</div>
						<InputText
								id={`serialNumber`}
								name={`serialNumber`}
                maxLength={15}
								size={"medium"}
								label={<L p={p} t={`Serial Number`}/>}
								value={paddlelock.serialNumber || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={paddlelock.serialNumber}
								error={errors.serialNumber} />
						<InputText
								id={`combination`}
								name={`combination`}
                maxLength={15}
								size={"medium"}
								label={<L p={p} t={`Combination`}/>}
								value={paddlelock.combination || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={paddlelock.name}
								error={errors.name} />
						<div className={classes(styles.dialogButtons, styles.row, styles.muchLeft)}>
                <a className={styles.cancelLink} onClick={() => browserHistory.push('/schoolSettings')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'}
										onClick={this.processForm}/>
            </div>
						<hr/>
						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.paddlelockSettings}/>
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
