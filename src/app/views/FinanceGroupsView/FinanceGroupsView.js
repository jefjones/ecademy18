import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './FinanceGroupsView.css';
const p = 'FinanceGroupsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import InputDataList from '../../components/InputDataList';
import Checkbox from '../../components/Checkbox';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class FinanceGroupsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      financeGroupTableId: '',
      financeGroup: {
        name: '',
				description: '',
				ell: false,
				specialEd: false,
				_504: false
      },
      errors: {
				name: '',
				description: '',
				ell: false,
				specialEd: false,
				_504: false
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let financeGroup = Object.assign({}, this.state.financeGroup);
	    let errors = Object.assign({}, this.state.errors);
	    financeGroup[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      financeGroup,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateFinanceGroup, personId} = this.props;
      const {financeGroup, errors, selectedSchoolYears, selectedCoursesScheduled, selectedGradeLevels} = this.state;
      let hasError = false;

			if (!financeGroup.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			if (!selectedSchoolYears || selectedSchoolYears.length === 0) {
					hasError = true;
					errors.schoolYears = <L p={p} t={`At least one school year is required`}/>;
			}

			if (!financeGroup.ell && !financeGroup.specialEd && !financeGroup._504 && (!selectedGradeLevels || selectedGradeLevels.length === 0)
							&& (!selectedCoursesScheduled || selectedCoursesScheduled.length === 0)) {
					hasError = true;
					errors.groups = <L p={p} t={`One or more groups is required`}/>;
			}

      if (hasError) {
					this.setState({ errors });
			} else {
					financeGroup.schoolYears = selectedSchoolYears;
					financeGroup.coursesScheduled = selectedCoursesScheduled;
					financeGroup.gradeLevels = selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.reduce((acc, id) => acc && acc.length > 0 ? acc.concat({id}) : [{id}], []);
          addOrUpdateFinanceGroup(personId, financeGroup);
					this.reset();
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleShowUsedCountOpen = () => this.setState({isShowingModal_usedCount: true })
  handleShowUsedCountClose = () => this.setState({isShowingModal_usedCount: false })

  handleRemoveItemOpen = (financeGroupTableId, usedCount) => {
			if (usedCount > 0) {
					this.handleShowUsedCountOpen();
			} else {
					this.setState({isShowingModal_remove: true, financeGroupTableId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeFinanceGroup, personId} = this.props;
      const {financeGroupTableId} = this.state;
      removeFinanceGroup(personId, financeGroupTableId);
      this.handleRemoveItemClose();
  }

	handleEdit = (financeGroupTableId) => {
			const {financeGroups} = this.props;
			let financeGroup = financeGroups && financeGroups.length > 0 && financeGroups.filter(m => m.financeGroupTableId === financeGroupTableId)[0];
			let selectedSchoolYears = financeGroup.schoolYears;
			let selectedGradeLevels = financeGroup.gradeLevels && financeGroup.gradeLevels.length > 0 && financeGroup.gradeLevels.reduce((acc, m) => acc && acc.length ? acc.concat(m.id) : [m.id], []);
			let selectedCoursesScheduled = financeGroup.coursesScheduled;
			if (financeGroup && financeGroup.name) this.setState({ financeGroup, selectedSchoolYears, selectedGradeLevels, selectedCoursesScheduled })
	}

	chooseSchoolYears = (selectedSchoolYears) => this.setState({ selectedSchoolYears });
	chooseCoursesScheduled = (selectedCoursesScheduled) => this.setState({ selectedCoursesScheduled });

	toggleGradeLevel = (gradeLevelId) => {
			let selectedGradeLevels = Object.assign([], this.state.selectedGradeLevels);
			selectedGradeLevels = selectedGradeLevels && selectedGradeLevels.length > 0 && selectedGradeLevels.indexOf(gradeLevelId) > -1
					? selectedGradeLevels.filter(id => id !== gradeLevelId)
					: selectedGradeLevels && selectedGradeLevels.length > 0
							? selectedGradeLevels.concat(gradeLevelId)
							: [gradeLevelId];
			this.setState({ selectedGradeLevels });
	}

	toggleCheckbox = (field) => {
			let financeGroup = Object.assign({}, this.state.financeGroup);
			financeGroup[field] = !financeGroup[field]
			this.setState({ financeGroup });
	}

	reset = () => {
			this.setState({
					financeGroup: {
						name: '',
						description: '',
						ell: false,
						specialEd: false,
						_504: false,
						schoolYears: [],
						coursesScheduled: [],
						gradeLevels: [],
					},
					selectedSchoolYears: [],
					selectedCoursesScheduled: [],
					selectedGradeLevels: [],
			});
	}

  render() {
    const {financeGroups, fetchingRecord, schoolYears, coursesScheduled, gradeLevels} = this.props;
    const {financeGroup, errors, isShowingModal_remove, isShowingModal_usedCount, selectedSchoolYears, selectedCoursesScheduled, selectedGradeLevels} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`ELL`}/>, tightText: true},
			{label: <L p={p} t={`Special Ed`}/>, tightText: true},
			{label: <L p={p} t={`504`}/>, tightText: true},
			{label: <L p={p} t={`School year(s)`}/>, tightText: true},
			{label: <L p={p} t={`Grade level(s)`}/>, tightText: true},
			{label: <L p={p} t={`Course(s)`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}
		];

    let data = [];

    if (financeGroups && financeGroups.length > 0) {
        data = financeGroups.map(m => {
            return ([
							{value: m.name && <a onClick={() => this.handleEdit(m.financeGroupTableId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: m.name && <a onClick={() => this.handleRemoveItemOpen(m.financeGroupTableId, m.usedCount)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.ell ? 'ELL' : ''},
							{value: m.specialEd ? 'Special Ed' : ''},
							{value: m._504 ? '504' : ''},
							{value: m.schoolYears && m.schoolYears.length > 0 && m.schoolYears.reduce((acc, m) => acc += (acc && acc.length > 0 ? ', ' : '') + m.label, '')},
							{value: m.gradeLevels && m.gradeLevels.length > 0 && m.gradeLevels.reduce((acc, m) => acc += (acc && acc.length > 0 ? ', ' : '') + m.label, '')},
							{value: m.coursesScheduled && m.coursesScheduled.length > 0 && m.coursesScheduled.reduce((acc, m) => acc += (acc && acc.length > 0 ? '<br/> ' : '') + m.label, '')},
							{value: m.description},
              {value: m.usedCount},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Finance Groups`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={financeGroup.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={financeGroup.name}
								error={errors.name} />
						<InputText
								id={`description`}
								name={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={financeGroup.description || ''}
								onChange={this.handleChange} />
						<div className={styles.rowWrap}>
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
												required={true}
												whenFilled={selectedSchoolYears && selectedSchoolYears.length > 0}
												error={errors.schoolYears}/>
								</div>
								<div className={classes(styles.moreTop, globalStyles.instructionsBigger)}>
										<br/>
										<L p={p} t={`For which year or years this group is available for use`}/>
								</div>
						</div>
						<div className={styles.listPosition}>
								<InputDataList
										label={<L p={p} t={`Courses scheduled`}/>}
										name={'selectedCoursesScheduled'}
										options={coursesScheduled || [{id: '', value: ''}]}
										value={selectedCoursesScheduled}
										multiple={true}
										height={`medium`}
										className={styles.moreTop}
										onChange={this.chooseCoursesScheduled}
										error={errors.groups}/>
						</div>
						<br/>
						<span className={classes(styles.textRating, styles.moreTop)}><L p={p} t={`Grade Level`}/></span>
						<div className={styles.rowWrap}>
								{gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name.length <= 2).map((m, i) =>
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
						<br/>
						<span className={classes(styles.textRating, styles.moreTop)}>Student groups</span>
						<div className={styles.rowWrap}>
								<Checkbox
										id={'ell'}
										label={'ELL'}
										checked={financeGroup.ell || ''}
										onClick={() => this.toggleCheckbox('ell')}
										labelClass={styles.labelCheckbox}
										checkboxClass={styles.checkbox} />
								<Checkbox
										id={'specialEd'}
										label={<L p={p} t={`Special Ed`}/>}
										checked={financeGroup.specialEd || ''}
										onClick={() => this.toggleCheckbox('specialEd')}
										labelClass={styles.labelCheckbox}
										checkboxClass={styles.checkbox} />
								<Checkbox
										id={'_504'}
										label={<L p={p} t={`504`}/>}
										checked={financeGroup._504 || ''}
										onClick={() => this.toggleCheckbox('_504')}
										labelClass={styles.labelCheckbox}
										checkboxClass={styles.checkbox} />
						</div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
								<div className={classes(styles.cancelLink, styles.moreLeft)} onClick={this.reset}><L p={p} t={`Reset`}/></div>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.financeGroupSettings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this finance group?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this finance group?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedCount &&
                <MessageModal handleClose={this.handleShowUsedCountClose} heading={<L p={p} t={`This Finance Group is in Use`}/>}
										explainJSX={<L p={p} t={`A finance group cannot be deleted once it has been used`}/>}
										onClick={this.handleShowUsedCountClose}/>
            }
      </div>
    );
  }
}
