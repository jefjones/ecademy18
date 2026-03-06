import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './LearnerOutcomeAddView.css';
const p = 'LearnerOutcomeAddView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import InputText from '../../components/InputText';
import TabPage from '../../components/TabPage';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import EditTable from '../../components/EditTable';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';

class LearnerOutcomeAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			isShowingModal_remove: false,
      isUserComplete: false,
      isBulkEntered: false,
			errorExternalId: '',
      errorLearningPathwayId: '',
			errorLearnerOutcomeTargetId: '',
      errorDescription: '',
      inviteMessage: '',
      duplicateEntries: [],
      isShowingNoBulkEntryMessage: false,
			learnerOutcomeTargetId_filter: '',
			learningPathwayId_filter: '',
      record: {
					learnerOutcomeId: '',
	        learningPathwayId: '',
					learnerOutcomeTargetId: '',
	        externalId: '',
	        description: '',
      },
      bulk: {
          delimiter: 'comma',
          firstField: 'learningPathway',
          secondField: 'learnerOutcomeId',
          thirdField: 'description',
      },
      contactMatches: [],
    };
  }

  componentDidMount() {
      this.setState({
          localTabsData: this.props.tabsData,
      });
  }


  returnToBulkEntry = () => {
      this.setState({ isBulkEntered: false });
  }

  goToBulkVerification = () => {
      const {bulk} = this.state;
      let newLearnerOutcomes = [];
      let lines = bulk && !!bulk.memberData && bulk.memberData.split('\n');
      let splitCharacter = bulk.delimiter === "comma" ? ',' : bulk.delimiter === "semicolon" ? ";" : bulk.delimiter === "hyphen" ? '-' : bulk.delimiter === "tab" ? '\t' : ',';

      if (!lines) {
          this.handleNoBulkEntryMessageOpen();
          return;
      }

      lines.forEach(line => {
          let checkBlank = line.replace(/<[^>]*>/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .trim();

          if (!!checkBlank) {
              let col = line.split(splitCharacter)
              let m = {};
              if (bulk.firstField) {
                  if (bulk.firstField === 'learningPathway') {
                  	  m.learningPathwayName = col[0].trim();
                  } else if (bulk.firstField === 'learnerOutcomeId') {
                  	  m.externalId = col[0].trim();
                  } else if (bulk.firstField === 'description') {
                  	  m.description = col[0].trim();
                  }
              }
              if (bulk.secondField) {
                if (bulk.secondField === 'learningPathway') {
                    m.learningPathway = col[1].trim();
                } else if (bulk.secondField === 'learnerOutcomeId') {
                    m.externalId = col[1].trim();
                } else if (bulk.secondField === 'description') {
                    m.description = col[1].trim();
                }
              }
              if (bulk.thirdField) {
                if (bulk.thirdField === 'learningPathway') {
                    m.learningPathway = col[2].trim();
                } else if (bulk.thirdField === 'learnerOutcomeId') {
                    m.externalId = col[2].trim();
                } else if (bulk.thirdField === 'description') {
                    m.description = col[2].trim();
                }
              }
              newLearnerOutcomes = newLearnerOutcomes ? newLearnerOutcomes.concat(m) : [m];
          }
      });

      newLearnerOutcomes = this.stripOutDuplicates(newLearnerOutcomes);
      newLearnerOutcomes = newLearnerOutcomes.reduce((acc, m) => {
          if(!!m.learningPathway || !!m.externalId || !!m.description) {
              acc = acc ? acc.concat(m) : [m];
          }
          return acc;
        }, []);
      this.setState({ isBulkEntered: true, newLearnerOutcomes });
  }

  stripOutDuplicates = (newLearnerOutcomes) => {
      // const {learnerOutcomes} = this.props;
      // let duplicateEntries = [];
      // let minusMembers = Object.assign([], newLearnerOutcomes);
			//
      // !!newLearnerOutcomes && newLearnerOutcomes.forEach((m, index) => {
      //     !!learnerOutcomes && learnerOutcomes.forEach(p => {
      //         if (m.learningPathway === p.learningPathway
      //                 || m.externalId === p.externalId
      //                 || m.description === p.description) {
      //             duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m];
      //             delete minusMembers[index];
      //          }
      //       });
      //       !!learnerOutcomes && learnerOutcomes.forEach(p => {
      //           if (m.learningPathway === p.learningPathway
      //                       || m.externalId === p.externalId
      //                       || m.description === p.description) {
      //               duplicateEntries = duplicateEntries ? duplicateEntries.concat(m) : [m];
      //               delete minusMembers[index];
      //           }
      //       });
      // });
			//
      // this.setState({ duplicateEntries });
      // return minusMembers;
  }

  handleFormChange = (chosenTab) => {
      this.setState({ localTabsData: { ...this.state.localTabsData, chosenTab }});
  }

  handleBulkEntry = (event) => {
      this.setState({bulk : { ...this.state.bulk, memberData: event.target.value} });
  }

  handleMessageChange = (event) => {
      this.setState({inviteMessage: event.target.value});
  }

  // findContactMatches = (emailAddress, phone) => {
  //     const {contacts} = this.props;
  //     if ((emailAddress && emailAddress.length > 4) || (phone && phone.length > 4)) {
  //         this.setState({ contactMatches: contacts && contacts.length > 0 && contacts.filter(m => (m.emailAddress && m.emailAddress.indexOf(emailAddress) > -1) || (m.phone && m.phone.indexOf(phone) > -1)) });
  //     }
  // }

  changeOutcome = ({target}) => {
	    this.setState({ record: {...this.state.record, [target.name]: target.value} });
	    this.showNextButton();
  }

	changeFilter = (event) => {
	    const field = event.target.name;
	    const newState = Object.assign({}, this.state);
	    newState[field] = event.target.value;
	    this.setState(newState);
  }

  changeBulk = ({target}) => {
     this.setState({ bulk: {...this.state.bulk, [target.name]: target.value} });
  }

  handleEnterKey = (event) => {
      event.key === "Enter" && this.processForm("STAY");
  }

  showNextButton = () => {
    const {record} = this.state;
    if (record.learnerOutcomeTargetId && record.learningPathwayId && record.externalId && record.description) {
        this.setState({isUserComplete: true});
    } else {
        this.setState({isUserComplete: false});
    }
  }

  processBulk = () => {
      const {addLearnerOutcome, personId} = this.props;
      const {newLearnerOutcomes} = this.state;
      addLearnerOutcome(personId, newLearnerOutcomes);
      browserHistory.push(`/firstNav`)
  }

  processForm = (stayOrFinish, event) => {
    const {addLearnerOutcome, updateLearnerOutcome, personId} = this.props;
    const {record} = this.state;
    // prevent default action. in this case, action is the form submission event
    event && event.preventDefault();
    let hasError = false;

    //It is possible that this is the "Finish" version of the processForm and the record might not be filled in.
    if (!record.learningPathwayId) {
        hasError = true;
        this.setState({errorLearningPathwayId: "Learning pathway is required" });
    }
		if (!record.learnerOutcomeTargetId) {
        hasError = true;
        this.setState({errorLearnerOutcomeTargetId: "Learner outcome grade target is required" });
    }
    if (!record.externalId) {
        hasError = true;
        this.setState({errorExternalId: "External id or code is required" });
    }
    if (!record.description) {
        hasError = true;
        this.setState({errorDescription: "Description is required" });
    }
    if (!hasError) {
        record.learnerOutcomeId ? updateLearnerOutcome(personId, record) : addLearnerOutcome(personId, [record]);
        this.setState({
            record: {
								learnerOutcomeId: '',
				        learningPathwayId: '',
								learnerOutcomeTargetId: '',
				        externalId: '',
				        description: '',
            },
        });
        if (stayOrFinish === "FINISH") {
            browserHistory.push(`/firstNav`)
        }
        //document.getElementById('learningPathway').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
    }
  }

  handleNoBulkEntryMessageOpen = () => this.setState({isShowingNoBulkEntryMessage: true})
  handleNoBulkEntryMessageClose = () => this.setState({isShowingNoBulkEntryMessage: false})

	handleRemoveClose = () => this.setState({isShowingModal_remove: false})
	handleRemoveOpen = (learnerOutcomeId) => this.setState({isShowingModal_remove: true, learnerOutcomeId })
	handleRemove = () => {
			const {removeLearnerOutcome, personId} = this.props;
			const {learnerOutcomeId} = this.state;
			removeLearnerOutcome(personId, learnerOutcomeId);
			this.handleRemoveClose();
	}

	handleEditSet = (learnerOutcomeId) => {
			const {learnerOutcomes} = this.props;
			let record = {};
			let learnerOutcome = learnerOutcomes && learnerOutcomes.filter(m => m.learnerOutcomeId === learnerOutcomeId)[0]
			if (learnerOutcome && learnerOutcome.learnerOutcomeId) {
					record = {
							learnerOutcomeId: learnerOutcome.learnerOutcomeId,
							learningPathwayId: learnerOutcome.learningPathwayId,
							learnerOutcomeTargetId: learnerOutcome.learnerOutcomeTargetId,
							externalId: learnerOutcome.externalId,
							description: learnerOutcome.description,
					}
			}
			this.setState({ record, isUserComplete: true });
			this.showNextButton();
	}

  render() {
    const {personId, learnerOutcomes, setContactCurrentSelected, bulkDelimiterOptions, fieldOptions, learningPathways, learnerOutcomeTargets} = this.props;
    const {contactMatches, isBulkEntered, record, bulk, errorExternalId, localTabsData, newLearnerOutcomes,
            isUserComplete, duplicateEntries, isShowingNoBulkEntryMessage, errorDescription, learnerOutcomeTargetId_filter, learningPathwayId_filter,
						isShowingModal_remove, errorLearningPathwayId, errorLearnerOutcomeTargetId} = this.state;

		let headings = [{}, {}, {label: 'Id', tightText: true}, {label: 'Pathway', tightText: true}, {label: 'Grade Target', tightText: true}, {label: 'Learner Outcome', tightText: true}];
    let data = [];

    learnerOutcomes && learnerOutcomes.length > 0 && learnerOutcomes.forEach(m => {
				var isIncluded = false;
				if (learningPathwayId_filter || Number(learnerOutcomeTargetId_filter)) {
						if (learningPathwayId_filter && Number(learnerOutcomeTargetId_filter)
									&& m.learningPathwayId === learningPathwayId_filter
									&& m.learnerOutcomeTargetId === Number(learnerOutcomeTargetId_filter)) {
								isIncluded = true;
						} else if (learningPathwayId_filter && m.learningPathwayId === learningPathwayId_filter) {
								isIncluded = true;
						} else if (Number(learnerOutcomeTargetId_filter) && m.learnerOutcomeTargetId === Number(learnerOutcomeTargetId_filter)) {
								isIncluded = true;
						}
				} else {
						isIncluded = true;
				}
				if (isIncluded) {
						let row = [
								{value: <a onClick={() => this.handleRemoveOpen(m.learnerOutcomeId)} className={styles.remove}>remove</a>},
								{value: <a onClick={() => this.handleEditSet(m.learnerOutcomeId)} className={styles.editLink}>edit</a>},
								{id: m.externalId, value: m.externalId},
								{id: m.learningPathwayId, value: m.learningPathwayName},
								{id: m.externalId, value: m.learnerOutcomeTargetName},
								{id: m.learnerOutcomeId, value: m.description, wrapCell: true},
						]
		        data = data ? data.concat([row]) : [[row]];
				}
		});

    if (data && data.length === 0) {
        data = [[{}, {}, {value: <i>No learner outcomes listed</i>, colSpan: true }]]
    }

    return (
        <section className={styles.container}>
            <div className={globalStyles.pageTitle}>
                Learner Outcome Add
            </div>
            <hr />
            <TabPage tabsData={localTabsData} onClick={this.handleFormChange} />
            {localTabsData && localTabsData.chosenTab === 'FieldEntry' &&
                <div>
                    <div className={styles.formLeft}>
                        <InputText
                            size={"short"}
														id={"externalId"}
                            name={"externalId"}
                            label={"Learner outcome id"}
                            value={record.externalId}
                            onEnterKey={this.handleEnterKey}
                            onChange={this.changeOutcome}
                            error={errorExternalId}/>
												<SelectSingleDropDown
		                        id={`learningPathwayId`}
		                        name={`learningPathway`}
		                        label={`Learning pathway`}
		                        value={record.learningPathwayId || ''}
		                        options={learningPathways}
		                        height={`medium`}
		                        onChange={this.changeOutcome}
		                        onEnterKey={this.handleEnterKey}
                            error={errorLearningPathwayId}/>
												<SelectSingleDropDown
		                        id={`learnerOutcomeTargetId`}
		                        name={`learnerOutcomeTargetId`}
		                        label={`Learner Outcome Targets`}
		                        value={record.learnerOutcomeTargetId || ''}
		                        options={learnerOutcomeTargets}
		                        height={`medium`}
		                        onChange={this.changeOutcome}
		                        onEnterKey={this.handleEnterKey}
                            error={errorLearnerOutcomeTargetId} />

												<div className={styles.moreTop}>
														<span className={styles.inputText}>{`Description`}</span><br/>
														<textarea rows={5} cols={45}
																id={`description`}
																name={`description`}
																value={record.description}
																onChange={(event) => this.changeOutcome(event)}
																className={styles.commentTextarea}>
														</textarea>
														<span className={styles.error}>{errorDescription}</span>
												</div>
                        <hr />
                        <hr />
                    </div>
                    <div className={classes(styles.rowRight)}>
												<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => this.processForm("STAY", event)} disabled={!isUserComplete}/>
                    </div>
										<hr />
										<SelectSingleDropDown
                        id={`learningPathwayId_filter`}
                        name={`learningPathwayId_filter`}
                        label={`Learning pathway (FILTER)`}
                        value={learningPathwayId_filter || ''}
                        options={learningPathways}
                        className={styles.selectList}
                        height={`medium`}
                        onChange={this.changeFilter}
                        onEnterKey={this.handleEnterKey}/>
										<SelectSingleDropDown
                        id={`learnerOutcomeTargetId_filter`}
                        name={`learnerOutcomeTargetId_filter`}
                        label={`Learner Outcome Targets (FILTER)`}
                        value={learnerOutcomeTargetId_filter || ''}
                        options={learnerOutcomeTargets}
                        className={styles.selectList}
                        height={`medium`}
                        onChange={this.changeFilter}
                        onEnterKey={this.handleEnterKey} />
										<div className={styles.moreTop}>
												<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
										</div>
                </div>
            }
            {localTabsData && localTabsData.chosenTab === 'BulkPaste' &&
                <div className={styles.formLeft}>
                    <div className={classes(styles.rowRight)}>
                        <button className={classes(styles.button, (isBulkEntered ? styles.opacityFull : styles.opacityLow))} onClick={this.returnToBulkEntry}>
                            {`<- Prev`}
                        </button>
                        <button className={classes(styles.button, (!!bulk.memberData ? styles.opacityFull : styles.opacityLow))}
                                onClick={isBulkEntered ? this.processBulk : this.goToBulkVerification}>
                            {isBulkEntered ? `Finish` : `Next ->`}
                        </button>
                    </div>
                    {!isBulkEntered &&
                        <div>
                            <SelectSingleDropDown
                                id={`delimiter`}
                                label={`How are the fields separated?`}
                                value={bulk.delimiter}
                                options={bulkDelimiterOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`firstField`}
                                label={`First field`}
                                value={bulk.firstField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`secondField`}
                                label={`Second field`}
                                value={bulk.secondField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <SelectSingleDropDown
                                id={`thirdField`}
                                label={`Third field`}
                                value={bulk.thirdField}
                                options={fieldOptions}
                                height={`medium`}
                                onChange={this.changeBulk} />
                            <span className={styles.labelBulk}>{`Paste in learner outcome data in bulk (one member per line)`}</span>
                            <textarea rows={25} cols={100} value={bulk.memberData} onChange={(event) => this.handleBulkEntry(event)}
                                className={styles.bulkBox}></textarea>
                        </div>
                    }
                    {isBulkEntered &&
                        <div>
                            {duplicateEntries &&
                                <div className={styles.column}>
                                    <div className={styles.warningText}>{`You have ${duplicateEntries.length} duplicate entries`}</div>
                                    {!duplicateEntries.length ? '' :
                                        <table className={styles.tableStyle}>
                                            <thead>
                                                <tr>
																										<td className={styles.hdr}>Code</td>
																										<td className={styles.hdr}>Pathway</td>
                                                    <td className={styles.hdr}>Target</td>
                                                    <td className={styles.hdr}>Description</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {duplicateEntries && duplicateEntries.length > 0 && duplicateEntries.map((m, i) =>
                                                <tr key={i}>
																										<td>
																												<span className={styles.txtRed}>{m.externalId}</span>
																										</td>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.learningPathwayName}</span>
                                                    </td>
																										<td>
                                                        <span className={styles.txtRed}>{m.learnerOutcomeTarget}</span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.txtRed}>{m.description}</span>
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            }
                            <div className={styles.headerText}>{`${newLearnerOutcomes.length} Learner Outcomes will be added`}</div>
                            <table className={styles.tableStyle}>
                                <thead>
                                    <tr>
																				<td className={styles.hdr}>Code</td>
																				<td className={styles.hdr}>Pathway</td>
																				<td className={styles.hdr}>Target</td>
																				<td className={styles.hdr}>Description</td>
                                    </tr>
                                </thead>
                                <tbody>
                                {newLearnerOutcomes && newLearnerOutcomes.length > 0 && newLearnerOutcomes.map((m, i) =>
                                    <tr key={i}>
																				<td>
																						<span className={styles.txtRed}>{m.learningPathwayName}</span>
																				</td>
																				<td>
																						<span className={styles.txtRed}>{m.learnerOutcomeTarget}</span>
																				</td>
                                        <td>
                                            <span className={styles.txt}>{m.externalId}</span>
                                        </td>
                                        <td>
                                            <span className={styles.txt}>{m.description}</span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            }
            {/*contactMatches && contactMatches.length > 0 &&
                <div>
                    <span className={styles.matches}>Found existing contacts: {contactMatches.length}</span><br/>
                    <Accordion allowMultiple={true}>
                        {contactMatches.map( (contactSummary, i) => {
                            return (
                                <AccordionItem contactSummary={contactSummary} expanded={false} key={i} className={styles.accordionTitle} onTitleClick={() => {}}
                                    showAssignWorkToEditor={false} onContactClick={setContactCurrentSelected} personId={personId}>
                                <ContactSummary key={i*100} summary={contactSummary} className={styles.contactSummary} showAccessIcon={true}
                                    userPersonId={contactSummary.personId} noShowTitle={true}/>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </div>
            */}
            <OneFJefFooter />
            {isShowingNoBulkEntryMessage &&
                <MessageModal handleClose={this.handleNoBulkEntryMessageClose} heading={<L p={p} t={`No entries found`}/>}
                   explainJSX={<L p={p} t={`It doesn't appear that there are any Learner Outcomes entered in the bulk entry box below.`}/>} isConfirmType={false}
                   onClick={this.handleNoBulkEntryMessageClose} />
            }
						{isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this Learner Outcome?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to remove this learning outcome?`}/>} isConfirmType={true}
                   onClick={this.handleRemove} />
            }
        </section>
    );
  }
}

export default LearnerOutcomeAddView;
