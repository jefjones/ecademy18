import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './CourseTypesSettingsView.css';
const p = 'CourseTypesSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class CourseTypesSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_remove: false,
      courseTypeId: '',
      courseType: {
        name: '',
				code: '',
        sequence: props.courseTypes && props.courseTypes.length + 1,
				defaultGradingType: 'TEACHER'
      },
      errors: {
				name: '',
				code: '',
        sequence: '',
				defaultGradingType: '',
      }
    }
  }

	componentDidUpdate(prevProps) {
    	if (this.props.courseTypes !== prevProps.courseTypes) {
					this.setState({ courseType: {...this.state.courseType, sequence: this.props.courseTypes && this.props.courseTypes.length + 1 } });
			}
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let courseType = this.state.courseType;
	    let errors = Object.assign({}, this.state.errors);
	    courseType[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      courseType,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateCourseType, personId, courseTypes} = this.props;
      const {courseType, errors} = this.state;
      let hasError = false;

      if (!courseType.name) {
          hasError = true;
          this.setState({errors: { ...errors, name: <L p={p} t={`Name is required`}/> }});
      }

			// if (!courseType.description) {
      //     hasError = true;
      //     this.setState({errors: { ...errors, description: <L p={p} t={`Description is required`}/> }});
      // }

			if (!courseType.sequence) {
          hasError = true;
          this.setState({errors: { ...errors, sequence: <L p={p} t={`Sequence is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateCourseType(personId, courseType);
          this.setState({
              courseType: {
								name: '',
								code: '',
				        sequence: courseTypes && courseTypes.length + 1,
								defaultGradingType: 'TEACHER'
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

  handleRemoveItemOpen = (courseTypeId, usedIn) => {
			if (usedIn && usedIn.length > 0) {
					this.handleShowUsedInOpen(usedIn);
			} else {
					this.setState({isShowingModal_remove: true, courseTypeId })
			}
	}
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeCourseType, personId} = this.props;
      const {courseTypeId} = this.state;
      removeCourseType(personId, courseTypeId);
      this.handleRemoveItemClose();
  }

	handleEdit = (courseTypeId) => {
			const {courseTypes} = this.props;
			let courseType = courseTypes && courseTypes.length > 0 && courseTypes.filter(m => m.courseTypeId === courseTypeId)[0];
			if (courseType && courseType.name)
					this.setState({ courseType })
	}

  render() {
    const {courseTypes, sequences, fetchingRecord} = this.props;
    const {courseType, isShowingModal_remove, isShowingModal_usedIn, listUsedIn} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Name`}/>, tightText: true},
			{label: <L p={p} t={`Description`}/>, tightText: true},
			{label: <L p={p} t={`Sequence`}/>, tightText: true},
			{label: <L p={p} t={`Default Graded By`}/>, tightText: true},
			{label: <L p={p} t={`Used In`}/>, tightText: true}];

    let data = [];

    if (courseTypes && courseTypes.length > 0) {
        data = courseTypes.map(m => {
            return ([
							{value: <a onClick={() => this.handleEdit(m.courseTypeId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
              {value: <a onClick={() => this.handleRemoveItemOpen(m.courseTypeId, m.usedIn)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
							{value: m.name},
							{value: m.description},
							{value: m.sequence},
							{value: m.defaultGradingType},
              {value: m.usedIn && m.usedIn.length, clickFunction: () => this.handleShowUsedInOpen(m.usedIn)},
            ])
        });
    }

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Course Type Settings`}/>
            </div>
						<InputText
								id={`name`}
								name={`name`}
								size={"medium"}
								label={<L p={p} t={`Name`}/>}
								value={courseType.name || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={courseType.name} />
						{/*<InputText
								id={`description`}
								name={`description`}
								description={`description`}
								size={"long"}
								label={<L p={p} t={`Description`}/>}
								value={courseType.description || ''}
								onChange={this.handleChange}
								required={true}
								whenFilled={courseType.description}
								error={errors.description} />*/}
						<div>
								<SelectSingleDropDown
										id={'sequence'}
										label={<L p={p} t={`Sequence (for list display)`}/>}
										value={courseType.sequence || ''}
										noBlank={true}
										options={sequences}
										className={styles.dropdown}
										onChange={this.handleChange}/>
						</div>
						<div>
								<SelectSingleDropDown
										id={'defaultGradingType'}
										label={<L p={p} t={`Default grading by`}/>}
										value={courseType.defaultGradingType || ''}
										noBlank={true}
										options={[{id: 'TEACHER', label: 'By Teacher'}, {id: 'STUDENT', label: 'By Student'}]}
										className={styles.dropdown}
										onChange={this.handleChange}/>
						</div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/schoolSettings'}>Close</Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
            </div>
            <hr />
            <EditTable labelClass={styles.tableLabelClass} headings={headings}
                data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                sendToReport={this.handlePathLink} isFetchingRecord={fetchingRecord.courseTypesSettings}/>
            <hr />
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this discipline (content area)?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this discipline (content area)?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
						{isShowingModal_usedIn &&
                <MessageModal handleClose={this.handleShowUsedInClose} heading={<L p={p} t={`This Discipline is used in these Courses`}/>}
										explainJSX={<div><L p={p} t={`In order to delete this discipline, please reassign the following courses with a different discipline setting:`}/><br/><br/>{listUsedIn}</div>}
										onClick={this.handleShowUsedInClose}/>
            }
      </div>
    );
  }
}
