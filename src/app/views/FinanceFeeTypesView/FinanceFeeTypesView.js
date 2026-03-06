import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinanceFeeTypesView.css';
const p = 'FinanceFeeTypesView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import InputDataList from '../../components/InputDataList';
import TextDisplay from '../../components/TextDisplay';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import RadioGroup from '../../components/RadioGroup';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinanceFeeTypesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financeFeeTypeId: '',
      financeFeeType: {
        name: '',
				description: '',
				refundType: '',
				schoolYears: '',
				financeGlcodeId: '',
				financeLowIncomeWaiverId: '',
      },
      errors: {
				name: '',
				description: '',
				schoolYears: '',
				refundType: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let financeFeeType = Object.assign({}, this.state.financeFeeType);
	    let errors = Object.assign({}, this.state.errors);
	    financeFeeType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      financeFeeType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinanceFeeType, personId} = this.props;
      const {financeFeeType, selectedSchoolYears} = this.state;
      let hasError = false;
			let errors = {};

      if (!financeFeeType.name) {
          hasError = true;
					errors.name = <L p={p} t={`Name is required`}/>;
      }

			if (!selectedSchoolYears || selectedSchoolYears.length ===0) {
					hasError = true;
					errors.schoolYears = <L p={p} t={`At least one school year is required`}/>;
			}

			if (!financeFeeType.refundType) {
					hasError = true;
					errors.refundType = <L p={p} t={`Refund type is required`}/>;
			}

      if (hasError) {
					this.setState({ errors });
			} else {
					financeFeeType.schoolYears = selectedSchoolYears;
          addOrUpdateFinanceFeeType(personId, financeFeeType);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financeFeeTypeId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financeFeeTypeId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinanceFeeType, personId} = this.props;
      const {financeFeeTypeId} = this.state;
      removeFinanceFeeType(personId, financeFeeTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financeFeeTypeId) => {
			const {financeFeeTypes} = this.props;
			let financeFeeType = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.financeFeeTypeId === financeFeeTypeId)[0];
			let selectedSchoolYears = financeFeeType.schoolYears;// && financeFeeType.schoolYears.length > 0 && financeFeeType.schoolYears.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
			if (financeFeeType && financeFeeType.name) this.setState({ financeFeeType, selectedSchoolYears })
	}

	chooseSchoolYears = (selectedSchoolYears) => this.setState({ selectedSchoolYears });

	handleRadioChoice = (value) => {
			let financeFeeType = Object.assign({}, this.state.financeFeeType);
			financeFeeType['refundType'] = value;
			this.setState({ financeFeeType });
  }

	reset = () => {
			this.setState({
					financeFeeType: {
						name: '',
						description: '',
						refundType: '',
						schoolYears: '',
						financeGlcodeId: '',
						financeLowIncomeWaiverId: '',
					},
					selectedSchoolYears: '',
			});
	}

  render() {
    const {financeFeeTypes, fetchingRecord, schoolYears, financeGLCodes, financeLowIncomeWaivers, refundOptions} = this.props;
    const {financeFeeType, errors, isShowingModal_remove, isShowingModal_usedCount, selectedSchoolYears} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Refund type`}/>, tightText: true},
			{label: <L p={p} t={`GL code`}/>, tightText: true},
			{label: <L p={p} t={`Low income waiver`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true},
      {label: <L p={p} t={`School years`}/>, tightText: true},
		];

    let data = [];

    if (financeFeeTypes && financeFeeTypes.length > 0) {
        data = financeFeeTypes.map(m => {
						let refundType = refundOptions && refundOptions.length > 0 && refundOptions.filter(r => r.id === m.refundType)[0];
						let refundTypeName = (refundType && refundType.label) ? refundType.label : '';
						let financeGLCode = financeGLCodes && financeGLCodes.length > 0 && financeGLCodes.filter(r => r.id === m.financeGlcodeId)[0];
						let financeGLCodeName  = (financeGLCode && financeGLCode.label) ? financeGLCode.label : '';
						let financeLowIncomeWaiver = financeGLCodes && financeGLCodes.length > 0 && financeGLCodes.filter(r => r.id === m.financeGlcodeId)[0];
						let financeLowIncomeWaiverName  = (financeLowIncomeWaiver && financeLowIncomeWaiver.label) ? financeLowIncomeWaiver.label : '';

            return ([
							{value: m.name && !m.isLunch && !m.isCredit && !m.isCourse && <a onClick={() => this.handleEdit(m.financeFeeTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.name && !m.isLunch && !m.isCredit && !m.isCourse && <a onClick={() => this.handleRemoveItemOpen(m.financeFeeTypeId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.description},
							{value: refundTypeName },
							{value: financeGLCodeName },
							{value: financeLowIncomeWaiverName },
              {value: m.usedCount},
              {value: m.schoolYears && m.schoolYears.length > 0 && m.schoolYears.reduce((acc, m) => acc += (acc && acc.length > 0 && ', ') + m.name, '')},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance Fee Type`}/>
            </div>
						{(financeFeeType.isLunch || financeFeeType.isCredit || financeFeeType.isCourse)
								? <TextDisplay label={<L p={p} t={`Name`}/>} text={financeFeeType.name} className={styles.noLeftMargin}/>
								: <InputText
											id={`name`}
											name={`name`}
											size={"medium-short"}
											label={<L p={p} t={`Name`}/>}
											value={financeFeeType.name || ''}
											onChange={this.handleChange}
											required={true}
											whenFilled={financeFeeType.name}
											error={errors.name} />
						}
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={financeFeeType.description || ''}
								onChange={this.handleChange} />
						<div className={styles.row}>
								<div className={styles.listPosition}>
										<InputDataList
												label={<L p={p} t={`School year(s)`}/>}
												name={'selectedSchoolYears'}
												options={schoolYears || [{id: '', value: ''}]}
												value={selectedSchoolYears}
												multiple={true}
												height={`medium`}
												className={styles.moreTop}
												onChange={this.chooseSchoolYears}
												disabled={(financeFeeType.isLunch || financeFeeType.isCredit || financeFeeType.isCourse)}
												required={true}
												whenFilled={selectedSchoolYears && selectedSchoolYears.length > 0}
												error={errors.schoolYears}/>
								</div>
								<div className={classes(styles.moreTop, globalStyles.instructionsBigger)}>
										<br/>
										<L p={p} t={`For which year or years this fee is available for use`}/>
								</div>
						</div>
						<div className={styles.moreTop}>
								<RadioGroup
										label={<L p={p} t={`Refund option`}/>}
										data={refundOptions}
										name={`refundType`}
										horizontal={false}
										className={styles.radio}
										initialValue={financeFeeType.refundType}
										onClick={this.handleRadioChoice}
										required={true}
										whenFilled={financeFeeType.refundType}
										error={errors.refundType}/>
						</div>
						<hr/>
						<div className={styles.row}>
								<div>
										<div>
													<SelectSingleDropDown
															id={`financeGlcodeId`}
															name={`financeGlcodeId`}
															label={<L p={p} t={`GL code`}/>}
															value={financeFeeType.financeGlcodeId || ''}
															options={financeGLCodes}
															className={styles.moreBottomMargin}
															height={`medium`}
															onChange={this.handleChange}/>
											</div>
											<div>
													<SelectSingleDropDown
															id={`financeLowIncomeWaiverId`}
															name={`financeLowIncomeWaiverId`}
															label={<L p={p} t={`Low income waiver`}/>}
															value={financeFeeType.financeLowIncomeWaiverId || ''}
															options={financeLowIncomeWaivers}
															className={styles.moreBottomMargin}
															height={`medium`}
															onChange={this.handleChange}/>
											</div>
								</div>
								<div className={classes(styles.moreTop, globalStyles.instructionsBigger, styles.maxWidth)}>
										<L p={p} t={`If the GL Code or low income waivers are always the same for this fee, you can choose them here.`}/>
										<L p={p} t={`Otherwise, you can leave them blank and let the user choose them when entering the billing for this fee type.`}/>
								</div>
						</div>
						<hr/>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeFeeTypeSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance fee type?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance fee type?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance Fee Type is in Use`}/>}
										explainJSX={<L p={p} t={`A finance fee type cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
