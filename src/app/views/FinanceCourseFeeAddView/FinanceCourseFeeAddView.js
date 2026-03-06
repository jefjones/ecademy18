import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './FinanceCourseFeeAddView.css';
const p = 'FinanceCourseFeeAddView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {formatNumber} from '../../utils/numberFormat';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputText from '../../components/InputText';
import InputTextArea from '../../components/InputTextArea';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import ImageViewerModal from '../../components/ImageViewerModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import DateTimePicker from '../../components/DateTimePicker';
import DateMoment from '../../components/DateMoment';
import RadioGroup from '../../components/RadioGroup';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import TableVirtualFast from '../../components/TableVirtualFast';
import Paper from '@material-ui/core/Paper';
import Loading from '../../components/Loading';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';

class FinanceCourseFeeAddView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
					isShowingModal_delete: false,
					isShowingModal: false,
					isShowingModal_missingInfo: false,
					selectedCourses: [],
					selectedObservers: [],
					financeCourseFee: {
					},
					errors: {},
	    }
  }

  processForm = () => {
      const {personId, addOrUpdateFinanceCourseFee} = this.props;
			const {financeCourseFee, selectedCourseEntryIds} = this.state;
			let errors = Object.assign({}, this.state.errors);
			let data = new FormData();
			data.append('file', this.state.selectedFile)
			let missingInfoMessage = [];

			if (!(selectedCourseEntryIds && selectedCourseEntryIds.length > 0)) {
					errors.billedPersonId = <L p={p} t={`At least one course is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one course`}/></div>
			}

			if (!financeCourseFee.financeFeeTypeId) {
					errors.financeFeeTypeId = <L p={p} t={`Fee type is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Billing type`}/></div>
			}

			if (!financeCourseFee || !financeCourseFee.amount) {
					errors.amount = <L p={p} t={`Amount is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Amount`}/></div>
			}

			if (!financeCourseFee || !financeCourseFee.refundType) {
					errors.refundType = <L p={p} t={`Refund Option is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Refund Option`}/></div>
			}

			if (!financeCourseFee || !financeCourseFee.mandatoryOrOptional) {
					errors.mandatoryOrOptional = <L p={p} t={`Mandatory or Optional is required`}/>
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Mandatory or Optional`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
					this.setState ({errors});
			} else {
					financeCourseFee.courseEntryIds = selectedCourseEntryIds;
					addOrUpdateFinanceCourseFee(personId, financeCourseFee);
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The course fee has been saved.`}/></div>)
					this.reset();
      }
  }

	reset = () => {
			this.setState({
					fileUrl: '',
					selectedCourseEntryIds: [],
					financeCourseFee: {
							financeCourseFeeId: '',
							financeFeeTypeId: '',
							financeGlcodeId: '',
							refundType: '',
							financeWaiverScheduleId: '',
							financeLowIncomeWaiverId: '',
							amount: '',
							description: '',
							mandatoryOrOptional: '',
					},
					errors: {}
			})
	}

	handleCourseFee = ({target}) => {
			const {financeFeeTypes} = this.props;
			let financeCourseFee = Object.assign({}, this.state.financeCourseFee);
			financeCourseFee[target.name] = target.value;
			if (target.name === 'financeFeeTypeId') {
					let financeFeeType = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.financeFeeTypeId === target.value)[0];
					if (financeFeeType && financeFeeType.financeFeeTypeId) {
							if (financeFeeType && financeFeeType.financeGlcodeId !== guidEmpty) financeCourseFee.financeGlcodeId = financeFeeType.financeGlcodeId;
							if (financeFeeType.financeLowIncomeWaiverId && financeFeeType.financeLowIncomeWaiverId !== guidEmpty) financeCourseFee.financeLowIncomeWaiverId = financeFeeType.financeLowIncomeWaiverId;
							if (financeFeeType.refundType) financeCourseFee.refundType = financeFeeType.refundType;
					}
			}
			this.setState({ financeCourseFee });
	}

	changeDate = (field, {target}) => {
			let financeCourseFee = Object.assign({}, this.state.financeCourseFee);
			financeCourseFee[field] = target.value;
			this.setState({financeCourseFee});
	}

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleSelectedCourses = selectedCourses => this.setState({ selectedCourses });


	handleMandatory = (value) => {
      let financeCourseFee = Object.assign({}, this.state.financeCourseFee);
      financeCourseFee['mandatoryOrOptional'] = value;
      this.setState({ financeCourseFee });
  }

	handleRadioChoice = (value) => {
			let financeCourseFee = Object.assign({}, this.state.financeCourseFee);
			financeCourseFee['refundType'] = value;
			this.setState({ financeCourseFee });
	}

	handleViewOption = (viewOption) => this.setState({ viewOption });
	resetFilters = () => this.setState({ partialNameText: '', selectedCourses: [], selectedGradeLevels: [], slectedGradeLevels: [] });
	chooseRecord = (chosenIndex) => this.setState({ chosenIndex });

	getSelectedCourseEntry = (courseEntryId) => {
			const {selectedCourseEntryIds} = this.state;
			return (selectedCourseEntryIds && selectedCourseEntryIds.length > 0 && selectedCourseEntryIds.indexOf(courseEntryId) > -1) || ''
	}

	handleTextSearch = ({target}) => this.setState({ partialNameText: target.value })

	toggleGradeLevel = (gradeLevelId) => {
			let selectedGradeLevels = Object.assign([], this.state.selectedGradeLevels);
			selectedGradeLevels = selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(gradeLevelId) > -1
					? selectedGradeLevels.filter(id => id !== gradeLevelId)
					: selectedGradeLevels && selectedGradeLevels.length > 0
							? selectedGradeLevels.concat(gradeLevelId)
							: [gradeLevelId];
			this.setState({ selectedGradeLevels });
	}

	toggleCourseEntry = (courseEntryId) => {
			let selectedCourseEntryIds = Object.assign([], this.state.selectedCourseEntryIds);
			selectedCourseEntryIds = selectedCourseEntryIds && selectedCourseEntryIds.length > 0 && selectedCourseEntryIds.indexOf(courseEntryId) > -1
					? selectedCourseEntryIds.filter(id => id !== courseEntryId)
					: selectedCourseEntryIds && selectedCourseEntryIds.length > 0
							? selectedCourseEntryIds.concat(courseEntryId)
							: [courseEntryId];
			this.setState({ selectedCourseEntryIds });
	}

	handleDescriptionOpen = (courseName, description) => this.setState({ isShowingModal_description: true, courseName, description });
	handleDescriptionClose = () => this.setState({ isShowingModal_description: false, courseName: '', description: '' });

	handleRemoveItemOpen = (fianceCourseFeeId) => this.setState({isShowingModal_remove: true, fianceCourseFeeId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false, fianceCourseFeeId: null })
  handleRemoveItem = () => {
      const {personId, removeFinanceCourseFee} = this.props;
      const {fianceCourseFeeId} = this.state;
			removeFinanceCourseFee(personId, fianceCourseFeeId);
      this.handleRemoveItemClose();
  }

  render() {
    const {personId, financeCourseFees, financeFeeTypes, baseCourses, myFrequentPlaces, setMyFrequentPlace, refundOptions, financeGLCodes, personConfig,
						financeLowIncomeWaivers, fetchingRecord} = this.props;
		const {financeCourseFee, errors, isShowingModal_delete, isShowingModal, fileUrl, messageInfoIncomplete, isShowingModal_missingInfo,
						selectedCourses, financeFeeTypeId, partialNameText, selectedGradeLevels, viewOption, chosenIndex, isShowingModal_description,
						courseName, description, isShowingModal_remove} = this.state;

		let filteredCourseFees = financeCourseFees;

		if (partialNameText) {
				let cutBackTextFilter = partialNameText.toLowerCase();
				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => (m.description && m.description.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.courseName && m.courseName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.financeFeeTypeName && m.financeFeeTypeName.toLowerCase().indexOf(cutBackTextFilter) > -1) || (m.amount && String(m.amount).indexOf(cutBackTextFilter) > -1));
		}

		if (selectedCourses && selectedCourses.length > 0) {
				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => {
						let found = false;
						selectedCourses.forEach(s => { if (s.id === m.courseEntryId) found = true })
						return found;
				});
		}

		if (selectedGradeLevels && selectedGradeLevels.length > 0) {
				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => {
						let found = false;
						selectedGradeLevels.forEach(gradeLevelId => {
								m.gradeLevels && m.gradeLevels.length > 0 && m.gradeLevels.forEach(g => {
										if (g.gradeLevelId === gradeLevelId) found = true;
								})
						})
						return found;
				});
		}

		if (viewOption === 'WithFees') {
				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => m.amount);
		} else if (viewOption === 'WithoutFees') {
				filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.filter(m => !m.amount);
		}

		filteredCourseFees = filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees.map((m, i) => {
				m.icons = <div className={classes(globalStyles.cellText, styles.moreTop, styles.row)}>
											<Checkbox
													id={`courseFee${m.courseEntryId}`}
													name={`courseFee${m.courseEntryId}`}
													label={''}
													checked={this.getSelectedCourseEntry(m.courseEntryId)}
													onClick={() => this.toggleCourseEntry(m.courseEntryId)}/>
											{m.amount
													? <a onClick={() => this.handleRemoveItemOpen(m.financeCourseFeeId)} className={styles.remove}>
																<Icon pathName={'trash2'} premium={true} className={styles.icon} fillColor={'maroon'}/>
														</a>
													: ''
											}
									</div>;
				m.feeType = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
										{m.financeFeeTypeName}
								 </div>;
			 m.feeAmount = m.amount
                        ? <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
    												{`$${formatNumber(m.amount, true, false, 2)}`}
    										  </div>
                        : '';
		 	 m.name = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
										{m.courseName}
								 </div>;
			 m.glcodeName = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
													{m.financeGlcodeName}
											</div>;
			 m.refund = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
											{m.refundType === 'NotRefundable' ? 'Not Refundable' : m.refundType === '100Refundable' ? '100% refundable' : 'Refund schedule'}
									</div>;
			 m.lowIncomeWaiverName = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
															{m.financeLowIncomeWaiverName}
													 </div>;
			 m.mandatory = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
															{m.mandatoryOrOptional}
													 </div>;
			 m.due = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
															<DateMoment date={m.dueDate}/>
													 </div>;
				m.desc = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => {this.handleDescriptionOpen(m.courseName, m.description); this.chooseRecord(i);}}>
											{m.description && m.description.length > 50 ? m.description.substring(0,50) + '...' : m.description}
									</div>;
				m.entry = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
											<DateMoment date={m.entryDate}/>
									</div>;
				m.entryPerson = <div className={classes(globalStyles.cellText, (i === chosenIndex ? globalStyles.highlight : ''))} onClick={() => this.chooseRecord(i)}>
														{m.entryPersonName}
												</div>;

				return m;
		});

		let columns = [
			{
				width: 60,
				label: '',
				dataKey: 'icons',
			},
			{
				width: 120,
				label: <L p={p} t={`Fee`}/>,
				dataKey: 'feeType',
			},
			{
				width: 60,
				label: <L p={p} t={`Amount`}/>,
				dataKey: 'feeAmount',
			},
			{
				width: 160,
				label: <L p={p} t={`Name`}/>,
				dataKey: 'name',
			},
			{
				width: 100,
				label: <L p={p} t={`GL code`}/>,
				dataKey: 'glcodeName',
			},
			{
				width: 120,
				label: <L p={p} t={`Refund type`}/>,
				dataKey: 'refund',
			},
			{
				width: 120,
				label: <L p={p} t={`Income waiver`}/>,
				dataKey: 'lowIncomeWaiverName',
			},
			{
				width: 80,
				label: <L p={p} t={`Mandatory?`}/>,
				dataKey: 'mandatory',
			},
			{
				width: 100,
				label: <L p={p} t={`Due date`}/>,
				dataKey: 'due',
			},
			{
				width: 320,
				label: <L p={p} t={`Description`}/>,
				dataKey: 'desc',
			},
			{
				width: 100,
				label: <L p={p} t={`Entry date`}/>,
				dataKey: 'entry',
			},
			{
				width: 120,
				label: <L p={p} t={`Entered by`}/>,
				dataKey: 'entryPerson',
			}
	];

    return (
        <div className={styles.container}>
						<div className={globalStyles.pageTitle}>
								<L p={p} t={`Add New Course Fee`}/>
						</div>
						<div>
								<div className={styles.rowWrap}>
										<div>
												<div className={globalStyles.filterLabel}><L p={p} t={`FILTERS:`}/></div>
												<div onClick={this.resetFilters} className={globalStyles.clearLink}><L p={p} t={`clear`}/></div>
										</div>
										<div className={styles.littleLeft}>
												<InputText
														id={"partialNameText"}
														name={"partialNameText"}
														size={"medium"}
														label={<L p={p} t={`Text search`}/>}
														value={partialNameText || ''}
														onChange={this.handleTextSearch}/>
										</div>
										<div>
												<InputDataList
														label={<L p={p} t={`Course(s)`}/>}
														name={'courses'}
														options={baseCourses}
														value={selectedCourses}
														multiple={true}
														height={`medium`}
														className={styles.moreSpace}
														onChange={this.handleSelectedCourses}
														error={errors.baseCoursesOrGroup}/>
										</div>
										<div className={classes(styles.muchTop, styles.moreLeft)}>
												<div className={styles.label}><L p={p} t={`Grade levels`}/></div>
												<div className={styles.rowWrap}>
														{personConfig.gradeLevels && personConfig.gradeLevels.length > 0 && personConfig.gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
																<Checkbox
																		key={i}
																		id={m.gradeLevelId}
																		label={m.name}
																		checked={(selectedGradeLevels && selectedGradeLevels.length > 0 && (selectedGradeLevels.indexOf(m.gradeLevelId) > -1 || selectedGradeLevels.indexOf(String(m.gradeLevelId)) > -1)) || ''}
																		onClick={() => this.toggleGradeLevel(m.gradeLevelId)}
																		labelClass={styles.labelCheckbox}
																		checkboxClass={styles.checkbox} />
														)}
												</div>
										</div>
								</div>
								<div className={styles.moreTop}>
										<RadioGroup
												label={'View options'}
												data={[{label: <L p={p} t={`All`}/>, id: 'All'}, {label: <L p={p} t={`With fees`}/>, id: 'WithFees'}, {label: <L p={p} t={`Without fees`}/>, id: 'WithoutFees'}]}
												name={`viewOption`}
												horizontal={true}
												className={styles.radio}
												initialValue={viewOption || 'All'}
												onClick={this.handleViewOption}/>
								</div>
						</div>
						<hr/>
						<div className={styles.rowWrap}>
								<div className={styles.moreBottom}>
										<SelectSingleDropDown
												id={`financeFeeTypeId`}
												name={`financeFeeTypeId`}
												label={<L p={p} t={`Fee type`}/>}
												value={financeFeeTypeId || financeCourseFee.financeFeeTypeId || ''}
												options={financeFeeTypes}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleCourseFee}
												required={true}
												whenFilled={financeCourseFee.financeFeeTypeId}
												errors={errors.financeFeeTypeId}/>
								</div>
								<InputText
										id={`amount`}
										name={`amount`}
										size={"short"}
										numberOnly={true}
										label={<L p={p} t={`Amount`}/>}
										value={financeCourseFee.amount || ''}
										onChange={this.handleCourseFee}
										required={true}
										whenFilled={financeCourseFee.amount}
										error={errors.amount}/>
								<div className={classes(styles.moreTop, styles.moreRight)}>
										<DateTimePicker label={<L p={p} t={`Due date (optional)`}/>} id={`dueDate`} value={financeCourseFee.dueDate} onChange={this.handleCourseFee}/>
								</div>
								<div className={styles.moreRight}>
										<InputTextArea
												label={<L p={p} t={`Description`}/>}
												name={'description'}
												value={financeCourseFee.description || ''}
												autoComplete={'dontdoit'}
												inputClassName={styles.moreRight}
												boldText={true}
												onChange={this.handleCourseFee}/>
								</div>
						</div>
						<div className={styles.rowWrap}>
								<div className={styles.moreTop}>
										<RadioGroup
												label={<L p={p} t={`Refund option`}/>}
												data={refundOptions}
												name={`refundType`}
												horizontal={false}
												className={styles.radio}
												initialValue={financeCourseFee.refundType}
												onClick={this.handleRadioChoice}
												required={true}
												whenFilled={financeCourseFee.refundType}
												error={errors.refundType}/>
								</div>
								<div>
										<SelectSingleDropDown
												id={`financeGlcodeId`}
												name={`financeGlcodeId`}
												label={<L p={p} t={`GL code`}/>}
												value={financeCourseFee.financeGlcodeId || ''}
												options={financeGLCodes}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleCourseFee}/>
								</div>
								<div>
										<SelectSingleDropDown
												id={`financeLowIncomeWaiverId`}
												name={`financeLowIncomeWaiverId`}
												label={<L p={p} t={`Low income waiver`}/>}
												value={financeCourseFee.financeLowIncomeWaiverId || ''}
												options={financeLowIncomeWaivers}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.handleCourseFee}/>
								</div>
								<div className={styles.moreTop}>
										<RadioGroup
											label={<L p={p} t={`Is this fee mandatory?`}/>}
											data={[{ label: <L p={p} t={`Mandatory`}/>, id: 'Mandatory' }, { label: <L p={p} t={`Optional`}/>, id: 'Optional' }, ]}
											name={`answerTrueFalse`}
											horizontal={true}
											className={styles.radio}
											initialValue={financeCourseFee.mandatoryOrOptional}
											required={true}
											whenFilled={financeCourseFee.mandatoryOrOptional}
											onClick={this.handleMandatory}
											error={errors.mandatoryOrOptional}/>
								</div>
						</div>
						<div className={classes(styles.muchLeft, styles.row)}>
								<a className={styles.cancelLink} onClick={() => browserHistory.push('/financeCourseFeeList')}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
						</div>
						<div className={styles.widthStop}>
								<Loading isLoading={fetchingRecord.financeCourseFees} />
								<Paper style={{ height: 400, width: '1500px', marginTop: '8px' }}>
										<TableVirtualFast rowCount={(filteredCourseFees && filteredCourseFees.length) || 0}
												rowGetter={({ index }) => (filteredCourseFees && filteredCourseFees.length > 0 && filteredCourseFees[index]) || ''}
												columns={columns} />
								</Paper>
						</div>
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this billing record?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this billing record?`}/>} isConfirmType={true}
									 onClick={this.handleDelete} />
						}
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
						{isShowingModal_description &&
								<MessageModal handleClose={this.handleDescriptionClose} heading={courseName} explain={description} onClick={this.handleDescriptionClose} />
						}
						{isShowingModal_remove &&
								<MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this course fee entry?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this course fee?`}/>} isConfirmType={true}
									 onClick={this.handleRemoveItem} />
						}
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Add New Billing`}/>} path={'financeCourseFeeAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(FinanceCourseFeeAddView);
