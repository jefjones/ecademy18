import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import styles from './FinanceTransferAddView.css';
const p = 'FinanceTransferAddView';
import L from '../../components/PageLanguage';
import InputFile from '../../components/InputFile';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
import formatNumber from '../../utils/numberFormat';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import InputTextArea from '../../components/InputTextArea';
import Checkbox from '../../components/Checkbox';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';

class FinanceTransferAddView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					isShowingModal: false,
					fileUrl: '',
					isShowingModal_missingInfo: false,
					selectedStudents: [],
					selectedObservers: [],
					fromPersonId: props.fromPersonId,
					toPersonId: props.toPersonId,
					errors: {},
	    }
  }

	componentDidUpdate() {
			const {fromPersonId, toPersonId, financeAccountSummaries} = this.props;
			const {isInit} = this.state;
			if (!isInit && fromPersonId && financeAccountSummaries && financeAccountSummaries.length > 0) { //don't check for toPersonId since that one can be blank.
					this.handleChange(null, 'fromPersonId', fromPersonId)
					toPersonId && this.handleChange(null, 'toPersonId', toPersonId)
					this.setState({ isInit: true });
			}
	}

  processForm = () => {
      const {personId, addFinanceTransfer, getFinanceAccountSummaries} = this.props;
			const {fromPersonId, toPersonId, fromAccountType, toAccountType, amount, fromAmount, description, selectedFile} = this.state;
			let financeTransferId = this.state.financeTransferId;
			let errors = Object.assign({}, this.state.errors);
			let data = new FormData();
			data.append('file', selectedFile)
			let missingInfoMessage = [];

			if (!fromPersonId && fromPersonId !== guidEmpty) {
					errors.fromPersonId = <L p={p} t={`A From person is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From person`}/></div>
			}

			if (!toPersonId && toPersonId !== guidEmpty) {
					errors.toPersonId = <L p={p} t={`A To person is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To person`}/></div>
			}

			if (!fromAccountType) {
					errors.fromAccountType = <L p={p} t={`A From Account Type is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From Account Type`}/></div>
			}

			if (!toAccountType) {
					errors.toAccountType = <L p={p} t={`A From Account Type is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From Account Type`}/></div>
			}

			if (!amount) {
					errors.amount = <L p={p} t={`An amount is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Amount`}/></div>
			}

			if (amount > fromAmount) {
					errors.fromAmount = <L p={p} t={`The entry amount is more than the 'from' account chosen.`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Entry amount is too much`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
					this.setState ({errors});
			} else if (!selectedFile) {
					let financeTransfer = {
							financeTransferId,
							fromPersonId,
							toPersonId,
							fromAccountType,
							toAccountType,
							amount,
							description,
					}
					addFinanceTransfer(personId, financeTransfer);
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The transfer entry has been saved.`}/></div>)
					this.reset();
					getFinanceAccountSummaries(personId);
			} else {

					let url = `${apiHost}ebi/financeTransfer/fileUpload/${personId}/${financeTransferId || guidEmpty}`

					axios.post(url, data,
							{
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Access-Control-Allow-Credentials' : 'true',
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
									"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
									"Authorization": "Bearer " + localStorage.getItem("authToken"),
							}})
							.catch(function (error) {
								//Show error here.
							})
							.then(response => {
									if (!financeTransferId || financeTransferId === guidEmpty) {
											financeTransferId = response.data.financeTransferId;
									}
									let financeTransfer = {
											financeTransferId,
											fromPersonId,
											toPersonId,
											fromAccountType,
											toAccountType,
											amount,
											description,
									}
									addFinanceTransfer(personId, financeTransfer);
									this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The transfer entry has been saved.`}/></div>)
									this.reset();
									getFinanceAccountSummaries(personId);
							})
      }
  }

	reset = () => {
			this.setState({
					fileUrl: '',
					selectedStudents: [],
					financeTransferId: guidEmpty,
					fromPersonId: '',
					toPersonId: '',
					fromAccountType: '',
					toAccountType: '',
					amount: '',
					description: '',
					errors: {}
			})
	}

	handleChange = (event, incomingField, incomingValue) => {
			const {financeAccountSummaries} = this.props;
			let newState = Object.assign({}, this.state);
			let field = incomingField ? incomingField : event.target.name;
			let value = incomingValue ? incomingValue : event.target.value;
			newState[field] = value;
			if (field === 'fromPersonId') {
					let summary = financeAccountSummaries.filter(m => m.personId === value)[0];
					if (summary && summary.personId) {
							newState.fromLunchAmount = summary.lunchAccount;
							newState.fromCreditAmount = summary.creditAccount;
					}
			} else if (field === 'toPersonId') {
					let summary = financeAccountSummaries.filter(m => m.personId === value)[0];
					if (summary && summary.personId) {
							newState.toLunchAmount = summary.lunchAccount;
							newState.toCreditAmount = summary.creditAccount;
					}
			}

			this.setState(newState);
	}

	changeDate = (field, {target}) => {
			let newState = Object.assign({}, this.state);
			newState[field] = target.value;
			this.setState(newState);
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeFinanceTransfer, personId, financeTransferId} = this.props;
			removeFinanceTransfer(personId, financeTransferId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})
	handleInputFile = (file) => this.setState({ selectedFile: file });

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	resetClearTextValue = () => {
			this.setState({ clearStudent: false, clearGuardian: false, clearTeacher: false });
	}

	handleSelectedStudents = selectedStudents => this.setState({ selectedStudents });

	includeSiblings = (event) => {
			const {students} = this.props;
			const {selectedStudents} = this.state;
			let studentPersonId = selectedStudents && selectedStudents.length > 0 && selectedStudents[0].id;
			let student = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0];
			let primaryGuardianPersonId = student && student.primaryGuardianPersonId ? student.primaryGuardianPersonId : '';
			if (primaryGuardianPersonId) {
					let selectedStudents = students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === primaryGuardianPersonId);
					let noSiblingsFound = selectedStudents && selectedStudents.length === 1;
					this.setState({ selectedStudents, noSiblingsFound });
			}
	}

  render() {
    const {personId, financeAccountSummaries, myFrequentPlaces, setMyFrequentPlace} = this.props;
		const {errors, isShowingModal, fileUrl, fromPersonId, toPersonId, fromAccountType, toAccountType, amount, description, messageInfoIncomplete,
						isShowingModal_missingInfo, fromLunchAmount, fromCreditAmount, toLunchAmount, toCreditAmount} = this.state;

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Add New Transfer`}/>
						</div>
						<div className={styles.rowWrap}>
								<div className={styles.boldLabel}>FROM:</div>
								<div className={classes(styles.moreBottom, styles.littleTop)}>
										<SelectSingleDropDown
												id={`fromPersonId`}
												name={`fromPersonId`}
												label={<L p={p} t={`Student`}/>}
												value={fromPersonId || ''}
												options={financeAccountSummaries}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleChange}
												required={true}
												whenFilled={fromPersonId}
												errors={errors.fromPersonId}/>
								</div>
								{fromPersonId && fromPersonId !== guidEmpty &&
										<div className={styles.checkbox}>
												<Checkbox
														id={'fromLunchAccount'}
														label={<div className={styles.row}>
																			<div className={styles.label}><L p={p} t={`Lunch:`}/></div>
																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(fromLunchAmount, true, false, 2)}`}</div>
																	 </div>
														}
														labelClass={styles.checkboxLabel}
														checked={fromAccountType === 'LUNCH' || false}
														onClick={() => this.setState({ fromAccountType: 'LUNCH', amount: fromLunchAmount, fromAmount: fromLunchAmount })}
														className={styles.button}/>
										</div>
								}
								{fromPersonId && fromPersonId !== guidEmpty &&
										<div className={styles.checkbox}>
												<Checkbox
														id={'fromCreditAccount'}
														label={<div className={styles.row}>
																			<div className={styles.label}><L p={p} t={`Credit:`}/></div>
																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(fromCreditAmount, true, false, 2)}`}</div>
																	 </div>
														}
														labelClass={styles.checkboxLabel}
														checked={fromAccountType === 'CREDIT' || false}
														onClick={() => this.setState({ fromAccountType: 'CREDIT', amount: fromCreditAmount, fromAmount: fromCreditAmount })}
														className={styles.button}/>
										</div>
								}
						</div>
						<hr/>
						<div className={classes(styles.rowWrap, styles.sectionLeft)}>
								<div className={styles.boldLabel}>TO:</div>
								<div className={classes(styles.moreBottom, styles.littleTop)}>
										<SelectSingleDropDown
												id={`toPersonId`}
												name={`toPersonId`}
												label={<L p={p} t={`Student`}/>}
												value={toPersonId || ''}
												options={financeAccountSummaries}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleChange}
												required={true}
												whenFilled={toPersonId}
												errors={errors.toPersonId}/>
								</div>
								{toPersonId && toPersonId !== guidEmpty &&
										<div className={styles.checkbox}>
												<Checkbox
														id={'toLunchAccount'}
														label={<div className={styles.row}>
																			<div className={styles.label}><L p={p} t={`Lunch:`}/></div>
																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(toLunchAmount, true, false, 2)}`}</div>
																	 </div>
														}
														labelClass={styles.checkboxLabel}
														checked={toAccountType === 'LUNCH' || false}
														onClick={() => this.setState({ toAccountType: 'LUNCH' })}
														className={styles.button}/>
										</div>
								}
								{toPersonId && toPersonId !== guidEmpty &&
										<div className={styles.checkbox}>
												<Checkbox
														id={'toCreditAccount'}
														label={<div className={styles.row}>
																			<div className={styles.label}><L p={p} t={`Credit:`}/></div>
																			<div className={classes(styles.label, styles.bold)}>{`$${formatNumber(toCreditAmount, true, false, 2)}`}</div>
																	 </div>
														}
														labelClass={styles.checkboxLabel}
														checked={toAccountType === 'CREDIT' || false}
														onClick={() => this.setState({ toAccountType: 'CREDIT' })}
														className={styles.button}/>
										</div>
								}
						</div>
						<div className={styles.rowWrap}>
								<InputText
										label={<L p={p} t={`Amount`}/>}
										id={`amount`}
										name={`amount`}
										size={"short"}
										numberOnly={true}
										value={amount || ''}
										onChange={this.handleChange}/>
								<div className={styles.moreRight}>
										<InputTextArea
												label={<L p={p} t={`Description`}/>}
												name={'description'}
												value={description || ''}
												autoComplete={'dontdoit'}
												inputClassName={styles.moreRight}
												boldText={true}
												onChange={this.handleChange}/>
								</div>
								<div className={styles.moreSpace}>
										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={this.handleInputFile} isResize={true}/>
								</div>
						</div>
						<div className={classes(styles.muchLeft, styles.row)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.push('/financeTransferList')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
						</div>
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Transfer`}/>} path={'financeTransferAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinanceTransferAddView);
