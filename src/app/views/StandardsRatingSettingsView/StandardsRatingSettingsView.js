import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './StandardsRatingSettingsView.css';
const p = 'StandardsRatingSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import EditTable from '../../components/EditTable';
import InputText from '../../components/InputText';
import RadioGroup from '../../components/RadioGroup';
import Icon from '../../components/Icon';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import ColorPickerModal from '../../components/ColorPickerModal';
import StandardsRatingColor from '../../components/StandardsRatingColor';
import OneFJefFooter from '../../components/OneFJefFooter';
import Checkbox from '../../components/Checkbox';
import classes from 'classnames';
import {doSort} from '../../utils/sort.js';
import {guidEmpty} from '../../utils/guidValidate.js';

export default class StandardsRatingSettingsView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
		      isShowingModal_removeDetail: false,
					isShowingModal_removeTable: false,
					isShowingModal_newInstructions: false,
		      standardsRatingDetailId: '',
		      standardsRating: {},
		      errors: {}
	    }
  }

	componentDidUpdate() {
			const {standardsRatingTables} = this.props;
			const {isInit, standardsRatingTableId} = this.state;
			if (!isInit && standardsRatingTables && standardsRatingTables.length === 1 && !standardsRatingTableId && standardsRatingTableId !== guidEmpty) {
					this.setState({
							standardsRating: { standardsRatingTableId: standardsRatingTables[0].id },
							isInit: true,
              standardsRatingTableId: standardsRatingTables[0].id,
							isLevelOnly: standardsRatingTables[0].isLevelOnly,
					});
			}
	}

  handleChange = (event) => {
	    const field = event.target.name;
	    let standardsRating = Object.assign({}, this.state.standardsRating);
	    let errors = Object.assign({}, this.state.errors);
	    standardsRating[field] = event.target.value;
	    errors[field] = '';
	    this.setState({ standardsRating, errors });
  }

  processForm = (stayOrFinish) => {
      const {addOrUpdateStandardsRatingDetail, personId} = this.props;
      const {standardsRating, isLevelOnly, errors} = this.state;
			let missingInfoMessage = [];

			if (!standardsRating.name) {
          this.setState({errors: { ...errors, name: <L p={p} t={`A name is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Name`}/></div>
			}

      if (isLevelOnly && !standardsRating.levelAbbrev) {
          this.setState({errors: { ...errors, levelAbbrev: <L p={p} t={`An abbreviation is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Abbreviation`}/></div>
			}

      if (!isLevelOnly && !standardsRating.score) {
          this.setState({errors: { ...errors, score: <L p={p} t={`A rating score is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Score`}/></div>
			}

			if (!isLevelOnly && !standardsRating.fromPercent) {
          this.setState({errors: { ...errors, fromPercent: <L p={p} t={`A 'From Percent' is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From Percent`}/></div>
      }

			if (!isLevelOnly && !standardsRating.toPercent) {
          this.setState({errors: { ...errors, toPercent: <L p={p} t={`A 'To Percent' is required`}/> }});
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To Percent`}/></div>
      }

      if (!(missingInfoMessage && missingInfoMessage.length > 0)) {
          addOrUpdateStandardsRatingDetail(personId, standardsRating);
					//Notice that we are going to preserve the standardsRatingTableId in the standardsRating record below
          this.setState({
              standardsRating: {
									standardsRatingTableId: standardsRating.standardsRatingTableId,
                  name: '',
                  levelAbbrev: '',
                  score: '',
                  fromPercent: '',
                  toPercent: '',
									letter: '',
									lowValue: '',
									highValue: '',
					        scale40Value: '',
              },
          });
					if (stayOrFinish === "FINISH") {
		          browserHistory.push(`/schoolSettings`)
		      }
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
  }

	handleNewStandardsRatingMessageOpen = () => this.setState({isShowingModal_newInstructions: true })
  handleNewStandardsRatingMessageClose = () => this.setState({isShowingModal_newInstructions: false })

  handleRemoveDetailOpen = (standardsRatingDetailId) => this.setState({isShowingModal_removeDetail: true, standardsRatingDetailId })
  handleRemoveDetailClose = () => this.setState({isShowingModal_removeDetail: false })
  handleRemoveDetail = () => {
      const {removeStandardsRatingDetail, personId} = this.props;
      const {standardsRatingDetailId} = this.state;
      removeStandardsRatingDetail(personId, standardsRatingDetailId);
      this.handleRemoveDetailClose();
			this.setState({ newStandardsRating: false });
  }

	handleRemoveTableOpen = (standardsRatingTableId, event) => this.setState({isShowingModal_removeTable: true, standardsRatingTableId })
  handleRemoveTableClose = () => this.setState({isShowingModal_removeTable: false })
  handleRemoveTable = () => {
      const {removeStandardsRatingTable, personId} = this.props;
      const {standardsRatingTableId} = this.state;
      removeStandardsRatingTable(personId, standardsRatingTableId);
      this.handleRemoveTableClose();
			this.setState({ standardsRatingTableId: '' });
  }

	handleEditDetail = (standardsRatingDetailId) => {
			const {standardsRatings} = this.props;
			let standardsRating = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingDetailId === standardsRatingDetailId)[0];
			if (standardsRating && standardsRating.name)
					this.setState({ standardsRating })
	}

	handleEditTable = (standardsRatingTableId, event) => {
			const {standardsRatings} = this.props;
			let standardsRating = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId)[0];
			if (standardsRating && standardsRating.standardsRatingName) {
					let scaleGradeLevels = doSort(standardsRating.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true });
					let fromGradeLevelId = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[0].gradeLevelId;
          let toGradeLevelId = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[scaleGradeLevels.length-1*1].gradeLevelId;

					this.setState({
							newStandardsRatingName: standardsRating.standardsRatingName,
							fromGradeLevelId,
							toGradeLevelId,
              isLevelOnly: standardsRating.isLevelOnly,
							standardsRatingTableId: standardsRating.standardsRatingTableId,
							newStandardsRating: true
					})
			}
	}

	handleStandardsRatingChoice = (standardsRatingTableId) => {
			const {standardsRatings} = this.props;
			let standardsRatingChosen = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId)[0];
			if (standardsRatingChosen && standardsRatingChosen.standardsRatingName) {
					let scaleGradeLevels = doSort(standardsRatingChosen.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true });
					let fromGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[0].name;
          let toGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[scaleGradeLevels.length-1*1].name;
					let standardsRatingNameChosen = `${standardsRatingChosen.standardsRatingName} (${fromGradeLevelName} - ${toGradeLevelName})`;
          let isLevelOnly = standardsRatingChosen.isLevelOnly;
					this.setState({ standardsRatingTableId, standardsRatingNameChosen, isLevelOnly, standardsRating: { standardsRatingTableId } });
			}
	}

	openAddNewStandardsRating = () => this.setState({ newStandardsRating: true, standardsRatingTableId: '', standardsRatingDetailId: '' })

	handleNewStandardsRatingChange = (event) => {
			let newState = Object.assign({}, this.state);
			let field = event.target.name;
			newState[field] = event.target.value;
			this.setState(newState)
	}

	addOrUpdateNewStandardsRatingScale = () => {
			const {personId, addOrUpdateStandardsRatingTable, standardsRatings} = this.props;
			const {fromGradeLevelId, toGradeLevelId, standardsRatingTableId, newStandardsRatingName, isLevelOnly} = this.state;
			let newState = Object.assign({}, this.state);
			let localStandardsRatingName = newState.localStandardsRatingName;
			let isDuplicate = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingName === localStandardsRatingName && m.standardsRatingTableId !== standardsRatingTableId)[0];
			localStandardsRatingName = newStandardsRatingName ? newStandardsRatingName.replace(' ', '') : newStandardsRatingName;
			let missingInfoMessage = [];

			if (!fromGradeLevelId) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`From grade level`}/></div>
			}

			if (!toGradeLevelId) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`To grade level`}/></div>
			}

			if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else if (isDuplicate) {
					this.setState({ errorStandardsRatingName: <L p={p} t={`Duplicate name. Please try again.`}/> })
			} else if (!newStandardsRatingName) {
					this.setState({ errorStandardsRatingName: <L p={p} t={`Please enter a standards rating scale name`}/> })
			} else {
					addOrUpdateStandardsRatingTable(personId, newStandardsRatingName, fromGradeLevelId, toGradeLevelId, standardsRatingTableId, isLevelOnly);
          //Don't clear the IsLevelOnly so that it can be used to show the right controls on the detail section.
					this.setState({ errorStandardsRatingName: '', newStandardsRatingName: '', newStandardsRating: false, fromGradeLevelId: '', toGradeLevelId: '' });
					this.handleNewStandardsRatingMessageOpen = () => this.setState({ isShowingModal_newInstructions: true })
			}
	}

	clearStandardsRating = () => this.setState({ standardsRating: { standardsRatingDetailId: '', } })

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})


	handleColorPickerOpen = (standardsRatingDetailId) => this.setState({isShowingModal_colorPicker: true, standardsRatingDetailId })
	handleColorPickerClose = () => this.setState({isShowingModal_colorPicker: false, standardsRatingDetailId: ''})
	handleColorPicker = (color) => {
			const {personId, setStandardsRatingColor} = this.props;
			const {standardsRatingDetailId} = this.state;
			setStandardsRatingColor(personId, standardsRatingDetailId, color);
			this.handleColorPickerClose();
	}

  toggleCheckbox = () => {
      let newState = Object.assign({}, this.state);
      newState['isLevelOnly'] = !newState['isLevelOnly'];
      this.setState(newState)
  }

  handleIsLevelOnlyOpen = () => this.setState({isShowingModal_isLevelOnly: true })
	handleIsLevelOnlyClose = () => this.setState({isShowingModal_isLevelOnly: false })

  render() {
    const {standardsRatings, standardsRatingTables, fetchingRecord, gradeLevels} = this.props;
    const {standardsRating, isShowingModal_removeDetail, standardsRatingTableId, newStandardsRating, newStandardsRatingName, isShowingModal_isLevelOnly,
						errorStandardsRatingName, isShowingModal_newInstructions, isShowingModal_removeTable, standardsRatingNameChosen, isLevelOnly,
						isShowingModal_missingInfo, messageInfoIncomplete, isShowingModal_colorPicker, fromGradeLevelId, toGradeLevelId} = this.state;

    let headings = [{}, {},
				{label: <L p={p} t={`Name`}/>, tightText: true},
				{label: isLevelOnly ? <L p={p} t={`Abbreviation`}/> : <L p={p} t={`Score`}/>, tightText: true},
				{label: isLevelOnly ? '' : <L p={p} t={`From %`}/>, tightText: true},
				{label: isLevelOnly ? '' : <L p={p} t={`To %`}/>, tightText: true},
				{label: <L p={p} t={`Color`}/>, tightText: true},
				{label: <L p={p} t={`Description`}/>, tightText: true}
		];

    let data = [];

    data = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId).reduce((acc, m) => {
				if (m.name) {
						let row = [
								{value: <a onClick={() => this.handleEditDetail(m.standardsRatingDetailId)}><Icon pathName={'pencil0'} premium={true} className={styles.icon}/></a>},
								{value: <a onClick={() => this.handleRemoveDetailOpen(m.standardsRatingDetailId)}><Icon pathName={'trash2'} premium={true} className={styles.icon}/></a>},
								{value: m.name},
								{value: isLevelOnly ? m.levelAbbrev : m.score === 0 ? '0' : m.score},
								{value: isLevelOnly ? '' : m.fromPercent === 0 ? '0' : m.fromPercent},
								{value: isLevelOnly ? '' : m.toPercent === 0 ? '0' : m.toPercent},
								{value: <div onClick={() => this.handleColorPickerOpen(m.standardsRatingDetailId)} className={styles.link} data-rh={m.name}>
														<StandardsRatingColor label={isLevelOnly ? m.levelAbbrev : m.score} color={m.color} name={m.name} code={m.code} description={m.description}/>
												</div>
								},
								{value: m.description},
				    ];
						acc = acc && acc.length > 0 ? acc.concat([row]) : [row];
				}
				return acc;
		},[]);

    if (!(data && data.length > 0)) data = [[{value: ''}, {value: <i><L p={p} t={`No standards ratings entered yet.`}/></i>, colSpan: 5 }]]

		let localStandardsRatingTables = standardsRatingTables && standardsRatingTables.length > 0 && standardsRatingTables.reduce((acc, m) => {
				if (m.label) {
						let option = {
								id: m.id,
								label: <div className={styles.row}>
													{m.label}
													<div onClick={(event) => this.handleEditTable(m.id, event)} className={classes(globalStyles.link, styles.moreLeft, styles.moreRight)}>
															<L p={p} t={`edit`}/>
													</div>
													<div onClick={(event) => this.handleRemoveTableOpen(m.id, event)} className={classes(globalStyles.link, styles.remove)}>
															<L p={p} t={`remove`}/>
													</div>
											</div>
							}
							acc = acc && acc.length > 0 ? acc.concat(option) : [option];
				}
				return acc;
		}, []);

    return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                <L p={p} t={`Standards Rating Settings`}/>
            </div>
						<RadioGroup
								label={''}
								name={`standardsRatingTableId`}
								data={localStandardsRatingTables || []}
								horizontal={false}
								className={styles.radio}
								initialValue={standardsRatingTableId || ''}
								onClick={this.handleStandardsRatingChoice}/>
						<div className={classes(styles.row, styles.moveLeftMuch)} onClick={this.openAddNewStandardsRating}>
								<Icon pathName={'plus'} className={styles.iconPlus} fillColor={'green'}/>
								<div className={styles.textLink}><L p={p} t={`Add a standards rating scale`}/></div>
						</div>
						{newStandardsRating &&
								<div className={styles.muchMoreLeft}>
										<div className={styles.rowWrap}>
												<div className={styles.moreTop}>
														<InputText
																id={`newStandardsRatingName`}
																name={`newStandardsRatingName`}
																size={"medium"}
																label={standardsRatingTableId ? <L p={p} t={`Update standards rating scale name`}/> : <L p={p} t={`New standards rating scale name`}/>}
																value={newStandardsRatingName || ''}
																onChange={this.handleNewStandardsRatingChange}
																required={true}
																whenFilled={newStandardsRatingName}
																error={errorStandardsRatingName} />
												</div>
												<div>
														<div className={classes(styles.moreLeft, styles.headLabel)}><L p={p} t={`Grade level range`}/></div>
														<div className={classes(styles.moreLeft, styles.row, styles.notop)}>
																<div className={styles.positionTop}>
																		<SelectSingleDropDown
																				id={'fromGradeLevelId'}
																				label={<L p={p} t={`From`}/>}
																				value={fromGradeLevelId || ''}
																				onChange={this.handleNewStandardsRatingChange}
																				options={gradeLevels}
																				height={'medium'}
																				required={true}
																				whenFilled={fromGradeLevelId}/>
																</div>
																<div className={styles.positionTop}>
																		<SelectSingleDropDown
																				id={'toGradeLevelId'}
																				label={<L p={p} t={`To`}/>}
																				value={toGradeLevelId || ''}
																				onChange={this.handleNewStandardsRatingChange}
																				options={gradeLevels}
																				height={'medium'}
																				required={true}
																				whenFilled={toGradeLevelId}/>
																</div>
														</div>
												</div>
                        <div className={classes(styles.row, styles.checkbox)}>
                            <Checkbox
                                id={'isLevelOnly'}
                                label={<L p={p} t={`Is level only`}/>}
                                labelClass={styles.checkboxLabel}
                                checked={isLevelOnly || false}
                                onClick={this.toggleCheckbox}
                                className={styles.button}/>
                            <a onClick={this.handleIsLevelOnlyOpen}><Icon pathName={'info'} premium={false} className={styles.icon}/></a>
                        </div>
												<div className={styles.buttonSetting}>
														<ButtonWithIcon label={standardsRatingTableId ? <L p={p} t={`Update`}/> : <L p={p} t={`Start`}/>} icon={'checkmark_circle'} onClick={this.addOrUpdateNewStandardsRatingScale}/>
												</div>
										</div>
										<hr/>
								</div>
						}
						{standardsRatingTableId &&
								<div>
										<hr/>
										<div className={styles.headLabel}>
												{standardsRatingNameChosen}
										</div>
										<div className={globalStyles.instructionsBigger}>
												<L p={p} t={`After entering a rating level, a blank circle will show in the table further below.  Click on the circle to choose a color.`}/>
										</div>
                    {isLevelOnly &&
                        <div className={globalStyles.instructionsBigger}>
    												<L p={p} t={`The is set as a "level only" standard grading.  You only need to enter in a name and its abbreviation.  The abbreviation shows up inside the circle.`}/>
    										</div>
                    }
										<div className={styles.rowWrap}>
												<InputText
														id={`name`}
														name={`name`}
														size={"medium-short"}
														label={<L p={p} t={`Name`}/>}
														value={standardsRating.name || ''}
														onChange={this.handleChange}
														required={true}
														whenFilled={standardsRating.name}
														inputClassName={classes(styles.moreLeft, styles.moreTop)} />
                        {isLevelOnly &&
                          <InputText
                              label={<L p={p} t={`Abbreviation`}/>}
                              id={`levelAbbrev`}
                              name={`levelAbbrev`}
                              size={"super-short"}
                              maxLength={2}
                              value={standardsRating.levelAbbrev || ''}
                              onChange={this.handleChange}
                              required={true}
                              whenFilled={standardsRating.levelAbbrev}
                              inputClassName={styles.moreLeft}/>
                        }
                        {!isLevelOnly &&
                            <div className={styles.rowWrap}>
        												<InputText
        														id={`score`}
        														name={`score`}
        														size={"super-short"}
        														label={<L p={p} t={`Score`}/>}
        														value={standardsRating.score || ''}
        														onChange={this.handleChange}
        														maxLength={5}
        														required={true}
        														whenFilled={standardsRating.score}
        														inputClassName={styles.moreLeft}/>
        												<InputText
        														id={`fromPercent`}
        														name={`fromPercent`}
        														size={"super-short"}
        														label={<L p={p} t={`From %`}/>}
        														numberOnly={true}
        														value={standardsRating.fromPercent || ''}
        														onChange={this.handleChange}
        														required={true}
        														inputClassName={styles.moreLeft}
        														whenFilled={standardsRating.fromPercent} />
        												<InputText
        														id={`toPercent`}
        														name={`toPercent`}
        														size={"super-short"}
        														label={<L p={p} t={`To %`}/>}
        														numberOnly={true}
        														value={standardsRating.toPercent || ''}
        														onChange={this.handleChange}
        														inputClassName={styles.moreLeft}
        														required={true}
        														whenFilled={standardsRating.toPercent} />
                            </div>
                        }
                    </div>
                    <div>
                        <InputText
                            label={<L p={p} t={`Description (optional)`}/>}
                            id={`description`}
                            name={`description`}
                            size={"long"}
                            maxlength={1000}
                            value={standardsRating.description || ''}
                            onChange={this.handleChange}
                            inputClassName={styles.moreLeft}/>
                    </div>
                    <div className={styles.rowWrap}>
						            <div className={styles.rowRight}>
														<Link className={styles.cancelLink} to={'/schoolSettings'}><L p={p} t={`Close`}/></Link>
														<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)}/>
														{standardsRating && standardsRating.standardsRatingDetailId &&
						                		<ButtonWithIcon label={<L p={p} t={`Clear`}/>} icon={'undo2'} onClick={this.clearStandardsRating} changeRed={true}/>
														}
						            </div>
										</div>
				            <hr />
										<div className={styles.headLabel}>
												{standardsRatingNameChosen}
										</div>
				            <EditTable labelClass={styles.tableLabelClass} headings={headings} isFetchingRecord={fetchingRecord.standardsRatingSettings}
				                data={data} noCount={true} firstColumnClass={styles.firstColumnClass} sendToReport={this.handlePathLink}/>
								</div>
						}
            <hr />
            <OneFJefFooter />
            {isShowingModal_removeDetail &&
                <MessageModal handleClose={this.handleRemoveDetailClose} heading={<L p={p} t={`Remove this Standards Rating Scale Entry?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this standards rating scale entry?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveDetail} />
            }
						{isShowingModal_removeTable &&
                <MessageModal handleClose={this.handleRemoveTableClose} heading={<L p={p} t={`Remove this Standards Rating Scale Set?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this standards rating scale set and name?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveTable} />
            }
						{isShowingModal_newInstructions &&
                <MessageModal handleClose={this.handleNewStandardsRatingMessageClose} heading={<L p={p} t={`New Standards Rating Level`}/>}
                   explainJSX={<L p={p} t={`You can now choose the new standards rating level name from the list and define the standards rating scale`}/>}
                   onClick={this.handleNewStandardsRatingMessageClose} />
            }
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
            {isShowingModal_isLevelOnly &&
								<MessageModal handleClose={this.handleIsLevelOnlyClose} heading={<L p={p} t={`Is Level Only`}/>}  onClick={this.handleIsLevelOnlyClose}
									 explainJSX={<L p={p} t={`There are two types of standards-based grading.<br/><br/>By marking this checkbox, you are choosing not to assign a specific standard to an assignment or it's quiz questions.  The teacher simply clicks on the grading circle in the gradebook to toggle it to the next level up.<br/><br/>By NOT marking this box, you are choosing a hybrid dsplay of a traditioal letter grade and the standard grading.  In this case, the grade is based on a percentage of correct answers related to a specifically chosen standard from the standards' list.`}/>} />
						}
						{isShowingModal_colorPicker &&
								<ColorPickerModal handleClose={this.handleColorPickerClose} onClick={this.handleColorPicker} />
						}
      </div>
    );
  }
}
