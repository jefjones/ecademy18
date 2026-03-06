import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './GradeScaleSettingsView.css';
const p = 'GradeScaleSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import RadioGroup from '../../components/RadioGroup';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';

export default class GradeScaleSettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_removeDetail: false,
			isShowingModal_removeTable: false,
			isShowingModal_newInstructions: false,
      gradeScaleDetailId: '',
      gradeScale: {
        letter: '',
				lowValue: '',
				highValue: '',
        scale40Value: '',
      },
      errors: {
				letter: '',
				lowValue: '',
				highValue: '',
        scale40Value: '',
      }
    }
  }

  handleChange = (event) => {
	    const field = event.target.name;
	    let gradeScale = this.state.gradeScale;
	    let errors = Object.assign({}, this.state.errors);
	    gradeScale[field] = event.target.value;
	    errors[field] = '';

	    this.setState({
		      gradeScale,
		      errors
	    });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateGradeScaleDetail, personId} = this.props;
      const {gradeScale, errors} = this.state;
      let hasError = false;

      if (!gradeScale.letter) {
          hasError = true;
          this.setState({errors: { ...errors, Letter: <L p={p} t={`A letter grade is required`}/> }});
      }

			if (!gradeScale.lowValue) {
          hasError = true;
          this.setState({errors: { ...errors, lowValue: <L p={p} t={`A low value is required`}/> }});
      }

			if (!gradeScale.highValue) {
          hasError = true;
          this.setState({errors: { ...errors, highValue: <L p={p} t={`A high value is required`}/> }});
      }

			if (!gradeScale.scale40Value) {
          hasError = true;
          this.setState({errors: { ...errors, scale40Value: <L p={p} t={`A scale 4.0 value is required`}/> }});
      }

      if (!hasError) {
          addOrUpdateGradeScaleDetail(personId, gradeScale);
					//Notice that we are goign to preserve the gradeScaleTableId in the gradeScale record below
          this.setState({
              gradeScale: {
									gradeScaleTableId: gradeScale.gradeScaleTableId,
									letter: '',
									lowValue: '',
									highValue: '',
					        scale40Value: '',
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
      }
  }

	handleNewGradeScaleMessageOpen = () => this.setState({isShowingModal_newInstructions: true })
  handleNewGradeScaleMessageClose = () => this.setState({isShowingModal_newInstructions: false })

  handleRemoveDetailOpen = (gradeScaleDetailId) => this.setState({isShowingModal_removeDetail: true, gradeScaleDetailId })
  handleRemoveDetailClose = () => this.setState({isShowingModal_removeDetail: false })
  handleRemoveDetail = () => {
      const {removeGradeScaleDetail, personId} = this.props;
      const {gradeScaleDetailId} = this.state;
      removeGradeScaleDetail(personId, gradeScaleDetailId);
      this.handleRemoveDetailClose();
  }

	handleRemoveTableOpen = (gradeScaleTableId, event) => {
			event.stopPropagation();
			event.preventDefault();
			this.setState({isShowingModal_removeTable: true, gradeScaleTableId })
	}
  handleRemoveTableClose = () => this.setState({isShowingModal_removeTable: false })
  handleRemoveTable = () => {
      const {removeGradeScaleTable, personId} = this.props;
      const {gradeScaleTableId} = this.state;
      removeGradeScaleTable(personId, gradeScaleTableId);
      this.handleRemoveTableClose();
  }

	handleEdit = (gradeScaleDetailId) => {
			const {gradeScales} = this.props;
			let gradeScale = gradeScales && gradeScales.length > 0 && gradeScales.filter(m => m.gradeScaleDetailId === gradeScaleDetailId)[0];
			if (gradeScale && gradeScale.letter)
					this.setState({ gradeScale })
	}

	handleGradeScaleChoice = (gradeScaleTableId) => {
			const {gradeScales} = this.props;
			let gradeScaleChosen = gradeScales && gradeScales.length > 0 && gradeScales.filter(m => m.gradeScaleTableId === gradeScaleTableId)[0];
			let gradeScaleNameChosen = gradeScaleChosen && gradeScaleChosen.gradeScaleName;
			this.setState({ gradeScaleTableId, gradeScaleNameChosen, gradeScale: { gradeScaleTableId } });
	}

	openAddNewGradeScale = () => this.setState({ newGradeScale: true })

	handleNewGradeScaleName = (event) => {
			this.setState({ newGradeScaleName: event.target.value })
	}

	createNewGradeLevel = () => {
			const {personId, addNewGradeScaleName, gradeScales} = this.props;
			let newGradeScaleName = this.state.newGradeScaleName;
			let isDuplicate = gradeScales && gradeScales.length > 0 && gradeScales.filter(m => m.gradeScaleName === newGradeScaleName)[0];
			newGradeScaleName = newGradeScaleName ? newGradeScaleName.replace(' ', '') : newGradeScaleName;
			if (isDuplicate) {
				this.setState({ errorGradeScaleName: 'Duplicate name. Please try again.' })
			} else if (!newGradeScaleName) {
					this.setState({ errorGradeScaleName: 'Please enter a grade scale name' })
			} else {
					addNewGradeScaleName(personId, newGradeScaleName);
					this.setState({ errorGradeScaleName: '', newGradeScaleName: '', newGradeScale: false });
					this.handleNewGradeScaleMessageOpen = () => this.setState({ isShowingModal_newInstructions: true })
			}
	}

	clearGradeScale = () => {
			this.setState({
					gradeScale: {
						gradeScaleDetailId: '',
						letter: '',
						lowValue: '',
						highValue: '',
						scale40Value: '',
					}
			});
	}

  render() {
    const {gradeScales, fetchingRecord} = this.props;
    const {gradeScale, errors, isShowingModal_removeDetail, gradeScaleTableId, newGradeScale, newGradeScaleName, errorGradeScaleName,
						isShowingModal_newInstructions, isShowingModal_removeTable, gradeScaleNameChosen} = this.state;

    let headings = [{}, {},
			{label: <L p={p} t={`Letter`}/>, tightText: true},
			{label: <L p={p} t={`High value`}/>, tightText: true},
			{label: <L p={p} t={`Low value`}/>, tightText: true},
			{label: <L p={p} t={`Scale 4.0 value`}/>, tightText: true}];

    let data = [];

    gradeScales && gradeScales.length > 0 && gradeScales.filter(m => m.gradeScaleTableId === gradeScaleTableId).forEach(m => {
				if (m.letter) {
						data.push([
								{value: <a onClick={() => this.handleEdit(m.gradeScaleDetailId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
			          {value: <a onClick={() => this.handleRemoveDetailOpen(m.gradeScaleDetailId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
								{value: m.letter},
								{value: m.highValue},
								{value: m.lowValue},
								{value: m.scale40Value},
		        ]);
				}
    });

    if (!(data && data.length > 0)) data = [[{value: ''}, {value: <i><L p={p} t={`No grade scales entered yet.`}/></i>, colSpan: 5 }]]

		let gradeScaleTables = gradeScales && gradeScales.length > 0 && gradeScales.reduce((acc, m) => {
				let alreadyEntered = false;
				acc && acc.length > 0 && acc.forEach(g => {
					if (m.gradeScaleTableId === g.id) alreadyEntered = true;
				})
				if (!alreadyEntered) {
						let option = {
								id: m.gradeScaleTableId,
								label: <div className={styles.row}>{m.gradeScaleName}<div onClick={(event) => this.handleRemoveTableOpen(m.gradeScaleTableId, event)} className={classes(globalStyles.link, styles.remove)}>{m.defaultFlag ? '' : <L p={p} t={`remove`}/>}</div></div>};
						acc = acc ? acc.concat(option) : [option];
				}
				return acc;
		}, []);

    return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                <L p={p} t={`Grade Scale Settings`}/>
            </div>
						<RadioGroup
								label={<L p={p} t={`Do you want to modify a grade scale, or add another one?`}/>}
								data={gradeScaleTables || []}
								name={`gradeScaleTables`}
								horizontal={false}
								className={styles.radio}
								initialValue={gradeScaleTableId}
								onClick={this.handleGradeScaleChoice}/>
						<div className={classes(styles.row, styles.moveLeftMuch)} onClick={this.openAddNewGradeScale}>
								<Icon pathName={'plus'} className={styles.iconPlus} fillColor={'green'}/>
								<div className={styles.textLink}><L p={p} t={`Add another grade scale`}/></div>
						</div>
						{newGradeScale &&
								<div className={styles.muchMoreLeft}>
										<div className={styles.row}>
												<InputText
														id={`newGradeScaleName`}
														name={`newGradeScaleName`}
														size={"medium"}
														label={<L p={p} t={`New grade scale name`}/>}
														value={newGradeScaleName || ''}
														onChange={this.handleNewGradeScaleName}
														required={true}
														whenFilled={newGradeScaleName}
														error={errorGradeScaleName} />
												<div className={styles.buttonSetting}>
														<ButtonWithIcon label={'Start'} icon={'checkmark_circle'} onClick={this.createNewGradeLevel}/>
												</div>
										</div>
								</div>
						}
						{gradeScaleTableId &&
								<div>
										<hr/>
										<div className={styles.labelHeader}>
												{gradeScaleNameChosen}
										</div>

										<div className={styles.rowWrap}>
												<InputText
														id={`letter`}
														name={`letter`}
														size={"super-short"}
														label={<L p={p} t={`Letter`}/>}
														value={gradeScale.letter || ''}
														onChange={this.handleChange}
														maxLength={10}
														required={true}
														whenFilled={gradeScale.letter}
														inputClassName={styles.moreLeft}
														error={errors.letter} />
												<InputText
														id={`highValue`}
														name={`highValue`}
														size={"super-short"}
														label={<L p={p} t={`High value`}/>}
														numberOnly={true}
														value={gradeScale.highValue || ''}
														onChange={this.handleChange}
														required={true}
														inputClassName={styles.moreLeft}
														whenFilled={gradeScale.highValue} />
												<InputText
														id={`lowValue`}
														name={`lowValue`}
														size={"super-short"}
														label={<L p={p} t={`Low value`}/>}
														numberOnly={true}
														value={gradeScale.lowValue || ''}
														onChange={this.handleChange}
														required={true}
														inputClassName={styles.moreLeft}
														whenFilled={gradeScale.lowValue} />
												<InputText
														id={`scale40Value`}
														name={`scale40Value`}
														size={"super-short"}
														label={<L p={p} t={`Scale 4.0 value`}/>}
														numberOnly={true}
														value={gradeScale.scale40Value || ''}
														onChange={this.handleChange}
														required={true}
														inputClassName={styles.moreLeft}
														whenFilled={gradeScale.scale40Value} />
										</div>
										<div className={styles.rowRight}>
												<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
												{gradeScale && gradeScale.gradeScaleDetailId &&
														<ButtonWithIcon label={<L p={p} t={`Clear`}/>} icon={'undo2'} onClick={this.clearGradeScale} changeRed={true}/>
												}
										</div>
				            <hr />
										<div className={styles.labelHeader}>
												{gradeScaleNameChosen}
										</div>
				            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.gradeScaleSettings}
				                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={this.handlePathLink}/>
								</div>
						}
            <hr />
            <OneFJefFooter />
            {isShowingModal_removeDetail &&
                <MessageModal handleClose={this.handleRemoveDetailClose} heading={<L p={p} t={`Remove this Grade Scale Entry?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this grade scale entry?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveDetail} />
            }
						{isShowingModal_removeTable &&
                <MessageModal handleClose={this.handleRemoveTableClose} heading={<L p={p} t={`Remove this Grade Scale Set?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this grade scale set and name?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveTable} />
            }
						{isShowingModal_newInstructions &&
                <MessageModal handleClose={this.handleNewGradeScaleMessageClose} heading={<L p={p} t={`New Grade Level`}/>}
                   explainJSX={<L p={p} t={`You can now choose the new grade level name from the list and define the grade scale`}/>}
                   onClick={this.handleNewGradeScaleMessageClose} />
            }
      </div>
    );
  }
}
