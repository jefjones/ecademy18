import React, {Component} from 'react';
import styles from './LunchReducedApplyView.css';
const p = 'LunchReducedApplyView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import {formatNumber} from '../../utils/numberFormat';
import {guidEmpty} from '../../utils/guidValidate';
import EditTable from '../../components/EditTable';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import TextDisplay from '../../components/TextDisplay';
import DateMoment from '../../components/DateMoment';
import Checkbox from '../../components/Checkbox';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class LunchReducedApplyView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      student: {
  				firstName: '',
          middleName: '',
          lastName: '',
      },
      errors: {
          firstName: '',
          middleName: '',
          lastName: '',
      }
    }
  }

  handleMainChange = ({target}) => {
      const field = target.name;
      let mainRecord = Object.assign({}, this.state.mainRecord);
      let errors = Object.assign({}, this.state.errors);
      mainRecord[field] = target.value;
      errors[field] = '';
      this.setState({ mainRecord, errors });
  }

  toggleCheckboxMain = (field) => {
      let mainRecord = Object.assign({}, this.state.mainRecord);
      let errors = Object.assign({}, this.state.errors);
      mainRecord[field] = !mainRecord[field];
      errors[field] = '';
      this.setState({ mainRecord, errors });
  }

  handleChangeStudent = (event) => {
	    const field = event.target.name;
	    let student = Object.assign({}, this.state.student);
	    let errors = Object.assign({}, this.state.errors);
	    student[field] = event.target.value;
	    errors[field] = '';
      this.jsxAddOrUpdateStudent(student);
	    this.setState({ student, errors });
  }

  toggleCheckboxStudent = (field) => {
      let student = Object.assign({}, this.state.student);
      let errors = Object.assign({}, this.state.errors);
      student[field] = !student[field];
      errors[field] = '';
      this.jsxAddOrUpdateStudent(student);
      this.setState({ student, errors });
  }

  handleChangeAdult = (event) => {
	    const field = event.target.name;
	    let adult = Object.assign({}, this.state.adult);
	    let errors = Object.assign({}, this.state.errors);
	    adult[field] = event.target.value;
	    errors[field] = '';
      this.jsxAddOrUpdateAdult(adult);
	    this.setState({ adult, errors });
  }

	handleRemoveItemOpen = (lunchReducedApplyTableId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, lunchReducedApplyTableId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeLunchReducedApply, personId} = this.props;
      const {lunchReducedApplyTableId} = this.state;
      removeLunchReducedApply(personId, lunchReducedApplyTableId);
      this.handleRemoveItemClose();
  }

	handleEdit = (lunchReducedApplyTableId) => {
			const {lunchReducedApply} = this.props;
			let classPeriod = lunchReducedApply && lunchReducedApply.length > 0 && lunchReducedApply.filter(m => m.lunchReducedApplyTableId === lunchReducedApplyTableId)[0];
			if (classPeriod && classPeriod.periodNumber) {
					classPeriod.startTime = classPeriod.startTime.indexOf('T') > -1 ? classPeriod.startTime.substring(classPeriod.startTime.indexOf('T') + 1) : classPeriod.startTime;
					classPeriod.endTime = classPeriod.endTime.indexOf('T') > -1 ? classPeriod.endTime.substring(classPeriod.endTime.indexOf('T') + 1) : classPeriod.endTime;
					this.setState({ classPeriod })
			}
	}

  handleRemoveStudentOpen = (lunchReducedApplyStudentId) => this.setState({ isShowingModal_removeStudent: true, lunchReducedApplyStudentId})
  handleRemoveStudentClose = () => this.setState({ isShowingModal_removeStudent: false, lunchReducedApplyStudentId: ''})
  handleRemoveStudent = () => {
      const {personId, addOrUpdateLunchReducedApplyStudents, lunchReducedApply} = this.props;
      let students = Object.assign([], lunchReducedApply && lunchReducedApply.students);
      students = students && students.length > 0 && students.filter(m => m.lunchReducedApplyStudentId !== lunchReducedApply.lunchReducedApplyStudentId);
      addOrUpdateLunchReducedApplyStudents(personId, lunchReducedApply.lunchReducedApplyTableId, students);
      this.handleRemoveStudentClose();
  }

  handleRemoveAdultOpen = (lunchReducedApplyAdultId) => this.setState({ isShowingModal_removeAdult: true, lunchReducedApplyAdultId})
  handleRemoveAdultClose = () => this.setState({ isShowingModal_removeAdult: false, lunchReducedApplyAdultId: ''})
  handleRemoveAdult = () => {
      const {personId, addOrUpdateLunchReducedApplyAdults, lunchReducedApply} = this.props;
      let students = Object.assign([], lunchReducedApply && lunchReducedApply.students);
      students = students && students.length > 0 && students.filter(m => m.lunchReducedApplyAdultId !== lunchReducedApply.lunchReducedApplyAdultId);
      addOrUpdateLunchReducedApplyAdults(personId, lunchReducedApply.lunchReducedApplyTableId, students);
      this.handleRemoveAdultClose();
  }

  handleEditMainRecord = () => {
      const {lunchReducedApply} = this.props;
      this.setState({ mainRecord: lunchReducedApply, isEditMainMode: true });
  }

  chooseRecordStudent = (lunchReducedApplyStudentId) => this.setState({ lunchReducedApplyStudentId })
  chooseRecordAdult = (lunchReducedApplyAdultId) => this.setState({ lunchReducedApplyAdultId })

  processForm = () => {
      const {personId, addOrUpdateLunchReducedApplyTable} = this.props;
      const {mainRecord={}} = this.state;
      let missingInfoMessage = [];

      if (!mainRecord.streetAddress) {
          this.setState({ errors: { ...this.state.errors, streetAddress: <L p={p} t={`Street address`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Street address`}/></div>
      }
      if (!mainRecord.city) {
          this.setState({ errors: { ...this.state.errors, city: <L p={p} t={`City`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`City`}/></div>
      }
      if (!mainRecord.usStateId) {
          this.setState({ errors: { ...this.state.errors, usStateId: <L p={p} t={`US State`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`US State`}/></div>
      }
      if (!mainRecord.postalCode) {
          this.setState({ errors: { ...this.state.errors, postalCode: <L p={p} t={`Postal code`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Postal code`}/></div>
      }
      if (!mainRecord.phone) {
          this.setState({ errors: { ...this.state.errors, phone: <L p={p} t={`Phone`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Phone`}/></div>
      }
      if (!mainRecord.emailAddress) {
          this.setState({ errors: { ...this.state.errors, emailAddress: <L p={p} t={`Email address`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address`}/></div>
      }
      if (!mainRecord.totalChildIncome ) {
          this.setState({ errors: { ...this.state.errors, totalChildIncome: <L p={p} t={`Total child income`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Total child income`}/></div>
      }
      if (!mainRecord.totalChildIncomeFrequencyId) {
          this.setState({ errors: { ...this.state.errors, totalChildIncomeFrequencyId: <L p={p} t={`Child income frequency`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Child income frequency`}/></div>
      }
      if (!mainRecord.primaryWageEarnerSsn && !mainRecord.noSsn) {
          this.setState({ errors: { ...this.state.errors, primaryWageEarnerSsn: <L p={p} t={`Primary wage earner SSN`}/>}});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Primary wage earner SSN`}/></div>
      }

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
          addOrUpdateLunchReducedApplyTable(personId, mainRecord);
          this.setState({ errors: {}, isEditMainMode: false })
      }
  }

  handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

  jsxAddOrUpdateStudent = (incomingStudent) => {
      const {lunchReducedApply} = this.props;
      const {errors} = this.state;
      let student = incomingStudent ? incomingStudent : Object.assign({}, this.state.student);

      let explainJSX =
          <div>
              <InputText
                  label={<L p={p} t={`First name`}/>}
                  name={'firstName'}
                  value={student.firstName || ''}
                  maxLength={25}
                  size={'medium-short'}
                  onChange={this.handleChangeStudent}
                  required={true}
                  whenFilled={student.firstName}
                  error={errors.firstName}/>
              <InputText
                  label={<L p={p} t={`Middle name`}/>}
                  name={'middleName'}
                  value={student.middleName || ''}
                  maxLength={25}
                  size={'medium-short'}
                  onChange={this.handleChangeStudent}
                  required={true}
                  whenFilled={student.middleName}
                  error={errors.middleName}/>
              <InputText
                  label={<L p={p} t={`Last name`}/>}
                  name={'lastName'}
                  value={student.lastName || ''}
                  maxLength={25}
                  size={'medium-short'}
                  onChange={this.handleChangeStudent}
                  required={true}
                  whenFilled={student.lastName}
                  error={errors.lastName}/>
              <Checkbox
                  id={'isStudent'}
                  name={'isStudent'}
                  label={<L p={p} t={`Is student?`}/>}
                  checked={student.isStudent || false}
                  className={styles.checkbox}
                  onClick={(event) => this.toggleCheckboxStudent('isStudent', event)}/>
              <Checkbox
                  id={'fosterChild'}
                  name={'fosterChild'}
                  label={'Is foster child?'}
                  checked={student.fosterChild || false}
                  className={styles.checkbox}
                  onClick={(event) => this.toggleCheckboxStudent('fosterChild', event)}/>
              <Checkbox
                  id={'homelessRunawayMigrant'}
                  name={'homelessRunawayMigrant'}
                  label={<L p={p} t={`Is homeless, runaway, or migrant?`}/>}
                  checked={student.homelessRunawayMigrant || false}
                  className={styles.checkbox}
                  onClick={(event) => this.toggleCheckboxStudent('homelessRunawayMigrant', event)}/>
              <Checkbox
                  id={'hispanicOrLatino'}
                  name={'hispanicOrLatino'}
                  label={<L p={p} t={`Is Hispanic or Latino?`}/>}
                  checked={student.hispanicOrLatino || false}
                  className={styles.checkbox}
                  onClick={(event) => this.toggleCheckboxStudent('hispanicOrLatino', event)}/>
              <div>
                  <SelectSingleDropDown
                      label={<L p={p} t={`Race`}/>}
                      id={'raceId'}
                      value={student.raceId}
                      options={lunchReducedApply.races}
                      height={`medium`}
                      onChange={this.handleChangeStudent}
                      required={true}
                      whenFilled={student.raceId}
                      error={errors.raceId}/>
              </div>
          </div>

      this.setState({ explainJSX });
  }

  handleAddOrUpdateStudentOpen = (lunchReducedApplyStudentId) => {
      const {lunchReducedApply} = this.props;
      let student = lunchReducedApplyStudentId && lunchReducedApplyStudentId !== guidEmpty
          ? lunchReducedApply.students && lunchReducedApply.students.length > 0 && lunchReducedApply.students.filter(m => m.lunchReducedApplyStudentId === lunchReducedApplyStudentId)[0]
          : {}

      this.setState({
          student,
          isShowingModal_addOrUpdate: true,
          lunchReducedApplyStudentId,
          addOrUpdateFunction: this.handleAddOrUpdateStudent,
          closeFunction: this.handleAddOrUpdateStudentClose,
          addOrUpdateType: lunchReducedApplyStudentId ? 'Update a Student' : 'Add a New Student'
      });
      this.jsxAddOrUpdateStudent(student);
  }
  handleAddOrUpdateStudentClose = () => this.setState({ isShowingModal_addOrUpdate: false })
  handleAddOrUpdateStudent = () => {
      const {personId, addOrUpdateLunchReducedApplyStudents, lunchReducedApply} = this.props;
      const {student, lunchReducedApplyStudentId} = this.state;
      let students = Object.assign([], lunchReducedApply.students);
      students = students && students.length > 0 && students.filter(m => m.lunchReducedApplyStudentId !== lunchReducedApplyStudentId);
      students = students && students.length > 0 ? students.concat(student) : [student];
      addOrUpdateLunchReducedApplyStudents(personId, lunchReducedApply.lunchReducedApplyTableId, students)
      this.handleAddOrUpdateStudentClose();
  }

  jsxAddOrUpdateAdult = (incomingAdult) => {
      const {lunchReducedApply} = this.props;
      const {errors} = this.state;
      let adult = incomingAdult ? incomingAdult : Object.assign({}, this.state.adult);

      let explainJSX =
          <div>
              <InputText
                  label={<L p={p} t={`First name`}/>}
                  name={'firstName'}
                  value={adult.firstName || ''}
                  maxLength={25}
                  size={'medium-short'}
                  onChange={this.handleChangeAdult}
                  required={true}
                  whenFilled={adult.firstName}
                  error={errors.firstName}/>
              <InputText
                  label={<L p={p} t={`Last name`}/>}
                  name={'lastName'}
                  value={adult.lastName || ''}
                  maxLength={25}
                  size={'medium-short'}
                  onChange={this.handleChangeAdult}
                  required={true}
                  whenFilled={adult.lastName}
                  error={errors.lastName}/>
              <hr/>
              <InputText
                  label={<L p={p} t={`Earnings`}/>}
                  name={'earnings'}
                  value={adult.earnings || ''}
                  numberOnly={true}
                  maxLength={10}
                  size={'short'}
                  onChange={this.handleChangeAdult}/>
              <div>
                  <SelectSingleDropDown
                      label={<L p={p} t={`Earnings' frequency`}/>}
                      id={'earningsFrequencyId'}
                      value={adult.earningsFrequencyId}
                      options={lunchReducedApply.frequencies}
                      height={`medium`}
                      onChange={this.handleChangeAdult}
                      required={true}
                      whenFilled={adult.earningsFrequencyId}
                      error={errors.earningsFrequencyId}/>
              </div>
              <hr/>
              <InputText
                  label={<L p={p} t={`Public assist, child support, or alimony`}/>}
                  name={'PublicAssistChildSupportAlimony'}
                  value={adult.PublicAssistChildSupportAlimony || ''}
                  numberOnly={true}
                  maxLength={10}
                  size={'short'}
                  onChange={this.handleChangeAdult}/>
              <div>
                  <SelectSingleDropDown
                      label={<L p={p} t={`Frequency`}/>}
                      id={'publicAssistChildSupportAlimonyFrequencyId'}
                      value={adult.publicAssistChildSupportAlimonyFrequencyId}
                      options={lunchReducedApply.frequencies}
                      height={`medium`}
                      onChange={this.handleChangeAdult}
                      required={true}
                      whenFilled={adult.publicAssistChildSupportAlimonyFrequencyId}
                      error={errors.publicAssistChildSupportAlimonyFrequencyId}/>
              </div>
              <hr/>
              <InputText
                  label={<L p={p} t={`Pensions, retiremenr, or other`}/>}
                  name={'pensionsRetirementOther'}
                  value={adult.pensionsRetirementOther || ''}
                  numberOnly={true}
                  maxLength={10}
                  size={'short'}
                  onChange={this.handleChangeAdult}/>
              <div>
                  <SelectSingleDropDown
                      label={`Pensions, retiremenr, or other frequency`}
                      id={'pensionsRetirementOtherFrequencyId'}
                      value={adult.pensionsRetirementOtherFrequencyId}
                      options={lunchReducedApply.frequencies}
                      height={`medium`}
                      onChange={this.handleChangeAdult}
                      required={true}
                      whenFilled={adult.pensionsRetirementOtherFrequencyId}
                      error={errors.pensionsRetirementOtherFrequencyId}/>
              </div>
          </div>

      this.setState({ explainJSX });
  }

  handleAddOrUpdateAdultOpen = (lunchReducedApplyAdultId) => {
      const {lunchReducedApply} = this.props;
      let adult = lunchReducedApplyAdultId && lunchReducedApplyAdultId !== guidEmpty
          ? lunchReducedApply.adults && lunchReducedApply.adults.length > 0 && lunchReducedApply.adults.filter(m => m.lunchReducedApplyAdultId === lunchReducedApplyAdultId)[0]
          : {}

      this.setState({
          adult,
          isShowingModal_addOrUpdate: true,
          lunchReducedApplyAdultId,
          addOrUpdateFunction: this.handleAddOrUpdateAdult,
          closeFunction: this.handleAddOrUpdateAdultClose,
          addOrUpdateType: lunchReducedApplyAdultId ? <L p={p} t={`Update a Adult`}/> : <L p={p} t={`Add a New Adult`}/>
      });
      this.jsxAddOrUpdateAdult();
  }
  handleAddOrUpdateAdultClose = () => this.setState({ isShowingModal_addOrUpdate: false })
  handleAddOrUpdateAdult = () => {
      const {personId, addOrUpdateLunchReducedApplyAdults, lunchReducedApply} = this.props;
      const {adult, lunchReducedApplyAdultId} = this.state;
      let adults = Object.assign([], lunchReducedApply.adults);
      adults = adults && adults.length > 0 && adults.filter(m => m.lunchReducedApplyAdultId !== lunchReducedApplyAdultId);
      adults = adults && adults.length > 0 ? adults.concat(adult) : [adult];
      addOrUpdateLunchReducedApplyAdults(personId, lunchReducedApply.lunchReducedApplyTableId, adults)
      this.handleAddOrUpdateAdultClose();
  }


  render() {
    const {lunchReducedApply={}, fetchingRecord, uSStates} = this.props;
    const {isEditMainMode, mainRecord={}, errors, isShowingModal_removeAdult, isShowingModal_removeStudent, lunchReducedApplyStudentId, lunchReducedApplyAdultId,
            isShowingModal_missingInfo, messageInfoIncomplete, isShowingModal_addOrUpdate, addOrUpdateFunction, explainJSX, addOrUpdateType, closeFunction} = this.state;

    //Student table
    let headingsStudent = [{}, {},
        {label: <L p={p} t={`First name`}/>, tightText: true},
        {label: <L p={p} t={`Middle name`}/>, tightText: true},
        {label: <L p={p} t={`Last name`}/>, tightText: true},
        {label: <L p={p} t={`Student?`}/>, tightText: true},
        {label: <L p={p} t={`Foster child?`}/>, tightText: true},
        {label: <L p={p} t={`Homeles, runaway, or migrant`}/>, tightText: true},
        {label: <L p={p} t={`Hispanic or Latino`}/>, tightText: true},
        {label: <L p={p} t={`Race`}/>, tightText: true},
    ];

    let dataStudent = [];

    if (lunchReducedApply.students && lunchReducedApply.students.length > 0) {
        dataStudent = lunchReducedApply.students.map(m => {
            return ([
              {value: <a onClick={() => this.handleAddOrUpdateStudentOpen(m.lunchReducedApplyStudentId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
							{value: <a onClick={() => this.handleRemoveStudentOpen(m.lunchReducedApplyStudentId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
              {value: m.firstName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.middleName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.lastName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.isStudent ? 'Yes' : '', clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.fosterChild ? 'Yes' : '', clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.homelessRunawayMigrant ? 'Yes' : '', clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.hispanicOrLatino ? 'Yes' : '', clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
              {value: m.raceName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyStudentId), cellColor: m.lunchReducedApplyStudentId === lunchReducedApplyStudentId ? 'highlight' : '' },
            ])
        });
    }

    //Adult table
    let headingsAdult = [{}, {},
        {label: <L p={p} t={`First name`}/>, tightText: true},
        {label: <L p={p} t={`Last name`}/>, tightText: true},
        {label: <L p={p} t={`Earnings`}/>, tightText: true},
        {label: <L p={p} t={`Earnings frequency`}/>, tightText: true },
        {label: <L p={p} t={`Public assist, child support, or alimony`}/>, tightText: true },
        {label: <L p={p} t={`Public assist, child support, or alimony frequency`}/>, tightText: true },
        {label: <L p={p} t={`Pension, retiremenr, or other`}/>, tightText: true },
        {label: <L p={p} t={`Pension, retiremenr, or other frequency`}/>, tightText: true },
    ];

    let dataAdult = [];

    if (lunchReducedApply.adults && lunchReducedApply.adults.length > 0 ) {
        dataAdult =  lunchReducedApply.adults.map(m => {
            return ([
                {value: <a onClick={() => this.handleAddOrUpdateAdultOpen(m.lunchReducedApplyAdultId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
  							{value: <a onClick={() => this.handleRemoveAdultOpen(m.lunchReducedApplyAdultId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
                {value: m.firstName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: m.lastName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: formatNumber(m.earnings, true, false, 2), clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: m.earningsFrequencyName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: formatNumber(m.publicAssistChildSupportAlimony, true, false, 2), clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: m.publicAssistChildSupportAlimonyFrequencyName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: formatNumber(m.pensionsRetirementOther, true, false, 2), clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
                {value: m.pensionsRetirementOtherFrequencyName, clickFunction: () => this.chooseRecord(m.lunchReducedApplyAdultId), cellColor: m.lunchReducedApplyAdultId === lunchReducedApplyAdultId ? 'highlight' : '' },
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {'Reduced Lunch Application'}
            </div>
            {!isEditMainMode &&
                <div className={styles.rowWrap}>
                    <div onClick={this.handleEditMainRecord}>
                        <Icon pathName={'pencil0'} premium={true} className={styles.icon}/>
                    </div>
                    <TextDisplay label={<L p={p} t={`Applicant`}/>} text={lunchReducedApply.personName} />
                    <TextDisplay label={<L p={p} t={`Street address`}/>} text={lunchReducedApply.streetAddress} />
                    <TextDisplay label={<L p={p} t={`City`}/>} text={lunchReducedApply.city} />
                    <TextDisplay label={<L p={p} t={`US State`}/>} text={lunchReducedApply.usStateName} />
                    <TextDisplay label={<L p={p} t={`Postal code`}/>} text={lunchReducedApply.postalCode} />
                    <TextDisplay label={<L p={p} t={`Phone`}/>} text={lunchReducedApply.phone} />
                    <TextDisplay label={<L p={p} t={`Email address`}/>} text={lunchReducedApply.emailAddress} />
                    <TextDisplay label={<L p={p} t={`SNAP`}/>} text={lunchReducedApply.snap ? lunchReducedApply.snapCaseNumber : '--'} />
                    <TextDisplay label={<L p={p} t={`TNAF`}/>} text={lunchReducedApply.tanf ? lunchReducedApply.tanfCaseNumber : '--'} />
                    <TextDisplay label={<L p={p} t={`FDPIR`}/>} text={lunchReducedApply.fdpir ? lunchReducedApply.fdpirCaseNumber : '--'} />
                    <TextDisplay label={<L p={p} t={`Total child income`}/>} text={formatNumber(lunchReducedApply.totalChildIncome, true, false, 2)} />
                    <TextDisplay label={<L p={p} t={`Child income frequency`}/>} text={lunchReducedApply.totalChildIncomeFrequencyName} />
                    <TextDisplay label={<L p={p} t={`Primary wage earner SSN`}/>} text={lunchReducedApply.primaryWageEarnerSsn} />
                    {lunchReducedApply.noSsn && <TextDisplay label={<L p={p} t={`No SSN`}/>} text={<L p={p} t={`No social security number`}/>} />}
                    <TextDisplay label={<L p={p} t={`Confirm complete?`}/>} text={lunchReducedApply.confirmComplete ? <L p={p} t={`Yes`}/> : <L p={p} t={`No`}/>} />
                    <TextDisplay label={<L p={p} t={`Entry date`}/>} text={<DateMoment date={lunchReducedApply.entryDate} minusHours={6} />} />
                </div>
            }
            {isEditMainMode &&
                <div>
                    <TextDisplay label={'Applicant'} text={mainRecord.personName} />
                    <div className={styles.muchLeft}>
                        <InputText
                            label={<L p={p} t={`Street address`}/>}
                            name={'streetAddress'}
                            value={mainRecord.streetAddress || ''}
                            maxLength={75}
                            size={'medium'}
                            onChange={this.handleMainChange}
                            required={true}
                            whenFilled={mainRecord.streetAddress}
                            error={errors.streetAddress}/>
                        <InputText
                            label={<L p={p} t={`City`}/>}
                            name={'city'}
                            value={mainRecord.city || ''}
                            maxLength={75}
                            size={'medium'}
                            onChange={this.handleMainChange}
                            required={true}
                            whenFilled={mainRecord.city}
                            error={errors.city}/>
                        <div>
                            <SelectSingleDropDown
                                label={<L p={p} t={`US State`}/>}
                                id={'usStateId'}
                                value={mainRecord.usStateId}
                                options={uSStates}
                                height={`medium`}
                                onChange={this.handleMainChange}
            										required={true}
            										whenFilled={mainRecord.usStateId}
                                error={errors.usStateId}/>
                        </div>
                        <InputText
                            label={<L p={p} t={`Postal code`}/>}
                            name={'postalCode'}
                            value={mainRecord.postalCode || ''}
                            maxLength={75}
                            size={'medium'}
                            onChange={this.handleMainChange}
                            required={true}
                            whenFilled={mainRecord.postalCode}
                            error={errors.postalCode}/>
                        <InputText
                            label={<L p={p} t={`Phone`}/>}
                            name={'phone'}
                            value={mainRecord.phone || ''}
                            maxLength={75}
                            size={'medium'}
                            onChange={this.handleMainChange}
                            required={true}
                            whenFilled={mainRecord.phone}
                            error={errors.phone}/>
                        <InputText
                            label={<L p={p} t={`Email address`}/>}
                            name={'emailAddress'}
                            value={mainRecord.emailAddress || ''}
                            maxLength={75}
                            size={'medium'}
                            onChange={this.handleMainChange}
                            required={true}
                            whenFilled={mainRecord.emailAddress}
                            error={errors.emailAddress}/>
                    </div>
                    <div className={styles.muchLeft}>
                        <div className={styles.row}>
                            <Checkbox
                                id={'snap'}
                                name={'snap'}
                                label={<L p={p} t={`SNAP?`}/>}
                                checked={mainRecord.snap || false}
                                className={styles.checkbox}
                                onClick={(event) => this.toggleCheckboxMain('snap', event)}/>
                            {mainRecord.snap &&
                                <InputText
                                    name={'snapCaseNumber'}
                                    value={mainRecord.snapCaseNumber || ''}
                                    label={<L p={p} t={`SNAP case number`}/>}
                                    maxLength={25}
                                    size={'medium-short'}
                                    onChange={this.handleMainChange}/>
                            }
                        </div>
                        <div className={styles.row}>
                            <Checkbox
                                id={'tanf'}
                                name={'tanf'}
                                label={<L p={p} t={`TANF?`}/>}
                                checked={mainRecord.tanf || false}
                                className={styles.checkbox}
                                onClick={(event) => this.toggleCheckboxMain('tanf', event)}/>
                            {mainRecord.tanf &&
                                <InputText
                                    name={'tanfCaseNumber'}
                                    value={mainRecord.tanfCaseNumber || ''}
                                    label={<L p={p} t={`TANF case number`}/>}
                                    maxLength={25}
                                    size={'medium-short'}
                                    onChange={this.handleMainChange}/>
                            }
                        </div>
                        <div className={styles.row}>
                            <Checkbox
                                id={'fdpir'}
                                name={'fdpir'}
                                label={<L p={p} t={`FDPIR?`}/>}
                                checked={mainRecord.fdpir || false}
                                className={styles.checkbox}
                                onClick={(event) => this.toggleCheckboxMain('fdpir', event)}/>
                            {mainRecord.fdpir &&
                                <InputText
                                    name={'fdpirCaseNumber'}
                                    value={mainRecord.fdpirCaseNumber || ''}
                                    label={<L p={p} t={`FDPIR case number`}/>}
                                    maxLength={25}
                                    size={'medium-short'}
                                    onChange={this.handleMainChange}/>
                            }
                        </div>
                        <InputText
                            label={<L p={p} t={`Total child income`}/>}
                            name={'totalChildIncome'}
                            value={mainRecord.totalChildIncome || ''}
                            numberOnly={true}
                            maxLength={9}
                            size={'short'}
                            onChange={this.handleMainChange}/>

                        <div>
                            <SelectSingleDropDown
                                label={<L p={p} t={`Child income frequency`}/>}
                                id={'totalChildIncomeFrequencyId'}
                                value={mainRecord.totalChildIncomeFrequencyId}
                                options={lunchReducedApply.frequencies}
                                height={`medium`}
                                className={styles.singleDropDown}
                                onChange={this.handleMainChange}
            										required={true}
            										whenFilled={mainRecord.totalChildIncomeFrequencyId}
                                error={errors.totalChildIncomeFrequencyId}/>
                        </div>
                        <InputText
                            name={'primaryWageEarnerSsn'}
                            value={mainRecord.primaryWageEarnerSsn || ''}
                            label={<L p={p} t={`Primary wage earner SSN (last four only)`}/>}
                            maxLength={4}
                            size={'short'}
                            onChange={this.handleMainChange}/>
                        <Checkbox
                            label={<L p={p} t={`No social security number`}/>}
                            id={'noSsn'}
                            name={'noSsn'}
                            checked={mainRecord.noSsn || false}
                            className={styles.checkbox}
                            onClick={this.handleMainChange}/>
                        <Checkbox
                            label={<L p={p} t={`Confirm complete?`}/>}
                            id={'confirmComplete'}
                            name={'confirmComplete'}
                            checked={mainRecord.confirmComplete || false}
                            className={styles.checkbox}
                            onClick={this.handleMainChange}/>
                    </div>
                    <div className={styles.rowRight}>
        								<div className={globalStyles.cancelLink} onClick={() => this.setState({ isEditMainMode: false })}><L p={p} t={`Close`}/></div>
        								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                    </div>
                </div>
            }

            <div className={globalStyles.classification}><L p={p} t={`Students`}/></div>
            <div className={classes(styles.row, globalStyles.link)} onClick={() => this.handleAddOrUpdateStudentOpen()}>
                <Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
                <L p={p} t={`Add a new student`}/>
            </div>
            <EditTable labelClass={styles.tableLabelClass} headings={headingsStudent} isFetchingRecord={fetchingRecord.lunchReducedApply} data={dataStudent} />

            <div className={globalStyles.classification}><L p={p} t={`Adults`}/></div>
            <div className={classes(styles.row, globalStyles.link)} onClick={() => this.handleAddOrUpdateAdultOpen()}>
                <Icon pathName={'plus'} className={styles.iconSmall} fillColor={'green'}/>
                <L p={p} t={`Add a new adult`}/>
            </div>
            <EditTable labelClass={styles.tableLabelClass} headings={headingsAdult} isFetchingRecord={fetchingRecord.lunchReducedApply} data={dataAdult} />
            <hr />
            <OneFJefFooter />
            {isShowingModal_removeStudent &&
                <MessageModal handleClose={this.handleRemoveStudentClose} heading={<L p={p} t={`Remove this Student?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this student from the list?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveStudent} />
            }
            {isShowingModal_removeAdult &&
                <MessageModal handleClose={this.handleRemoveAdultClose} heading={<L p={p} t={`Remove this Adult?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this adult from the list?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveAdult} />
            }
            {isShowingModal_missingInfo &&
                <MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
                   explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
            }
            {isShowingModal_addOrUpdate &&
                <MessageModal handleClose={closeFunction} heading={addOrUpdateType} explainJSX={explainJSX} onClick={addOrUpdateFunction} isConfirmType={true}/>
            }
      </div>
    );
  }
}
