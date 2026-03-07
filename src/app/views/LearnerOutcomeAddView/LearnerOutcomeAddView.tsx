import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './LearnerOutcomeAddView.css'
const p = 'LearnerOutcomeAddView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import InputText from '../../components/InputText'
import TabPage from '../../components/TabPage'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import EditTable from '../../components/EditTable'
import MessageModal from '../../components/MessageModal'
import OneFJefFooter from '../../components/OneFJefFooter'

function LearnerOutcomeAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isUserComplete, setIsUserComplete] = useState(false)
  const [isBulkEntered, setIsBulkEntered] = useState(false)
  const [errorExternalId, setErrorExternalId] = useState('')
  const [errorLearningPathwayId, setErrorLearningPathwayId] = useState('')
  const [errorLearnerOutcomeTargetId, setErrorLearnerOutcomeTargetId] = useState('')
  const [errorDescription, setErrorDescription] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [duplicateEntries, setDuplicateEntries] = useState([])
  const [isShowingNoBulkEntryMessage, setIsShowingNoBulkEntryMessage] = useState(false)
  const [learnerOutcomeTargetId_filter, setLearnerOutcomeTargetId_filter] = useState('')
  const [learningPathwayId_filter, setLearningPathwayId_filter] = useState('')
  const [record, setRecord] = useState({
					learnerOutcomeId: '',
	        learningPathwayId: '',
					learnerOutcomeTargetId: '',
	        externalId: '',
	        description: '',
      })
  const [learnerOutcomeId, setLearnerOutcomeId] = useState('')
  const [learningPathwayId, setLearningPathwayId] = useState('')
  const [learnerOutcomeTargetId, setLearnerOutcomeTargetId] = useState('')
  const [externalId, setExternalId] = useState('')
  const [description, setDescription] = useState('')
  const [bulk, setBulk] = useState({
          delimiter: 'comma',
          firstField: 'learningPathway',
          secondField: 'learnerOutcomeId',
          thirdField: 'description',
      })
  const [delimiter, setDelimiter] = useState('comma')
  const [firstField, setFirstField] = useState('learningPathway')
  const [secondField, setSecondField] = useState('learnerOutcomeId')
  const [thirdField, setThirdField] = useState('description')
  const [contactMatches, setContactMatches] = useState([])
  const [localTabsData, setLocalTabsData] = useState(undefined)
  const [chosenTab, setChosenTab] = useState(undefined)
  const [memberData, setMemberData] = useState(undefined)

  useEffect(() => {
    
          setLocalTabsData(props.tabsData)
      
  }, [])

  const returnToBulkEntry = () => {
    
          setIsBulkEntered(false)
      
  }

  const goToBulkVerification = () => {
    
          
          let newLearnerOutcomes = []
          let lines = bulk && !!bulk.memberData && bulk.memberData.split('\n')
          let splitCharacter = bulk.delimiter === "comma" ? ',' : bulk.delimiter === "semicolon" ? ";" : bulk.delimiter === "hyphen" ? '-' : bulk.delimiter === "tab" ? '\t' : ','
    
          if (!lines) {
              handleNoBulkEntryMessageOpen()
              return
          }
    
          lines.forEach(line => {
              let checkBlank = line.replace(/<[^>]*>/g, ' ')
                  .replace(/\s{2,}/g, ' ')
                  .replace(/&nbsp;/g, ' ')
                  .trim()
    
              if (!!checkBlank) {
                  let col = line.split(splitCharacter)
                  let m = {}
                  if (bulk.firstField) {
                      if (bulk.firstField === 'learningPathway') {
                      	  m.learningPathwayName = col[0].trim()
                      } else if (bulk.firstField === 'learnerOutcomeId') {
                      	  m.externalId = col[0].trim()
                      } else if (bulk.firstField === 'description') {
                      	  m.description = col[0].trim()
                      }
                  }
                  if (bulk.secondField) {
                    if (bulk.secondField === 'learningPathway') {
                        m.learningPathway = col[1].trim()
                    } else if (bulk.secondField === 'learnerOutcomeId') {
                        m.externalId = col[1].trim()
                    } else if (bulk.secondField === 'description') {
                        m.description = col[1].trim()
                    }
                  }
                  if (bulk.thirdField) {
                    if (bulk.thirdField === 'learningPathway') {
                        m.learningPathway = col[2].trim()
                    } else if (bulk.thirdField === 'learnerOutcomeId') {
                        m.externalId = col[2].trim()
                    } else if (bulk.thirdField === 'description') {
                        m.description = col[2].trim()
                    }
                  }
                  newLearnerOutcomes = newLearnerOutcomes ? newLearnerOutcomes.concat(m) : [m]
              }
          })
    
          newLearnerOutcomes = stripOutDuplicates(newLearnerOutcomes)
          newLearnerOutcomes = newLearnerOutcomes.reduce((acc, m) => {
              if(!!m.learningPathway || !!m.externalId || !!m.description) {
                  acc = acc ? acc.concat(m) : [m]
              }
              return acc
            }, [])
          setIsBulkEntered(true); setNewLearnerOutcomes(newLearnerOutcomes)
      
  }

  const stripOutDuplicates = (newLearnerOutcomes) => {
    
          // const {learnerOutcomes} = props;
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
          // setDuplicateEntries(duplicateEntries);
          // return minusMembers;
      
  }

  const handleFormChange = (chosenTab) => {
    
          setLocalTabsData({ ...localTabsData, chosenTab })
      
  }

  const handleBulkEntry = (event) => {
    
          setBulk({ ...bulk, memberData: event.target.value})
      
  }

  const handleMessageChange = (event) => {
    
          setInviteMessage(event.target.value)
      
  }

  const changeOutcome = ({target}) => {
    
    	    setRecord({...record, [target.name]: target.value})
    	    showNextButton()
      
  }

  const changeFilter = (event) => {
    
    	    const field = event.target.name
    	    const newState = Object.assign({}, state)
    	    newState[field] = event.target.value
    	    setState(newState)
      
  }

  const changeBulk = ({target}) => {
    
         setBulk({...bulk, [target.name]: target.value})
      
  }

  const handleEnterKey = (event) => {
    
          event.key === "Enter" && processForm("STAY")
      
  }

  const showNextButton = () => {
    
        
        if (record.learnerOutcomeTargetId && record.learningPathwayId && record.externalId && record.description) {
            setIsUserComplete(true)
        } else {
            setIsUserComplete(false)
        }
      
  }

  const processBulk = () => {
    
          const {addLearnerOutcome, personId} = props
          
          addLearnerOutcome(personId, newLearnerOutcomes)
          navigate(`/firstNav`)
      
  }

  const processForm = (stayOrFinish, event) => {
    
        const {addLearnerOutcome, updateLearnerOutcome, personId} = props
        
        // prevent default action. in this case, action is the form submission event
        event && event.preventDefault()
        let hasError = false
    
        //It is possible that this is the "Finish" version of the processForm and the record might not be filled in.
        if (!record.learningPathwayId) {
            hasError = true
            setErrorLearningPathwayId("Learning pathway is required")
        }
    		if (!record.learnerOutcomeTargetId) {
            hasError = true
            setErrorLearnerOutcomeTargetId("Learner outcome grade target is required")
        }
        if (!record.externalId) {
            hasError = true
            setErrorExternalId("External id or code is required")
        }
        if (!record.description) {
            hasError = true
            setErrorDescription("Description is required")
        }
        if (!hasError) {
            record.learnerOutcomeId ? updateLearnerOutcome(personId, record) : addLearnerOutcome(personId, [record])
            setRecord({
    								learnerOutcomeId: '',
    				        learningPathwayId: '',
    								learnerOutcomeTargetId: '',
    				        externalId: '',
    				        description: '',
                })
            if (stayOrFinish === "FINISH") {
                navigate(`/firstNav`)
            }
            //document.getElementById('learningPathway').focus(); //Don't put the focus on pages since on mobile that will bring up the keyboard and cover most of the page.
        }
      
  }

  const handleNoBulkEntryMessageOpen = () => {
    return setIsShowingNoBulkEntryMessage(true)
    

  }
  const handleNoBulkEntryMessageClose = () => {
    return setIsShowingNoBulkEntryMessage(false)
    

  }
  const handleRemoveClose = () => {
    return setIsShowingModal_remove(false)

  }
  const handleRemoveOpen = (learnerOutcomeId) => {
    return setIsShowingModal_remove(true); setLearnerOutcomeId(learnerOutcomeId)

  }
  const handleRemove = () => {
    
    			const {removeLearnerOutcome, personId} = props
    			
    			removeLearnerOutcome(personId, learnerOutcomeId)
    			handleRemoveClose()
    	
  }

  const handleEditSet = (learnerOutcomeId) => {
    
    			const {learnerOutcomes} = props
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
    			setRecord(record); setIsUserComplete(true)
    			showNextButton()
    	
  }

  const {personId, learnerOutcomes, setContactCurrentSelected, bulkDelimiterOptions, fieldOptions, learningPathways, learnerOutcomeTargets} = props
      
  
  		let headings = [{}, {}, {label: 'Id', tightText: true}, {label: 'Pathway', tightText: true}, {label: 'Grade Target', tightText: true}, {label: 'Learner Outcome', tightText: true}]
      let data = []
  
      learnerOutcomes && learnerOutcomes.length > 0 && learnerOutcomes.forEach(m => {
  				let isIncluded = false
  				if (learningPathwayId_filter || Number(learnerOutcomeTargetId_filter)) {
  						if (learningPathwayId_filter && Number(learnerOutcomeTargetId_filter)
  									&& m.learningPathwayId === learningPathwayId_filter
  									&& m.learnerOutcomeTargetId === Number(learnerOutcomeTargetId_filter)) {
  								isIncluded = true
  						} else if (learningPathwayId_filter && m.learningPathwayId === learningPathwayId_filter) {
  								isIncluded = true
  						} else if (Number(learnerOutcomeTargetId_filter) && m.learnerOutcomeTargetId === Number(learnerOutcomeTargetId_filter)) {
  								isIncluded = true
  						}
  				} else {
  						isIncluded = true
  				}
  				if (isIncluded) {
  						let row = [
  								{value: <a onClick={() => handleRemoveOpen(m.learnerOutcomeId)} className={styles.remove}>remove</a>},
  								{value: <a onClick={() => handleEditSet(m.learnerOutcomeId)} className={styles.editLink}>edit</a>},
  								{id: m.externalId, value: m.externalId},
  								{id: m.learningPathwayId, value: m.learningPathwayName},
  								{id: m.externalId, value: m.learnerOutcomeTargetName},
  								{id: m.learnerOutcomeId, value: m.description, wrapCell: true},
  						]
  		        data = data ? data.concat([row]) : [[row]]
  				}
  		})
  
      if (data && data.length === 0) {
          data = [[{}, {}, {value: <i>No learner outcomes listed</i>, colSpan: true }]]
      }
  
      return (
          <section className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  Learner Outcome Add
              </div>
              <hr />
              <TabPage tabsData={localTabsData} onClick={handleFormChange} />
              {localTabsData && localTabsData.chosenTab === 'FieldEntry' &&
                  <div>
                      <div className={styles.formLeft}>
                          <InputText
                              size={"short"}
  														id={"externalId"}
                              name={"externalId"}
                              label={"Learner outcome id"}
                              value={record.externalId}
                              onEnterKey={handleEnterKey}
                              onChange={changeOutcome}
                              error={errorExternalId}/>
  												<SelectSingleDropDown
  		                        id={`learningPathwayId`}
  		                        name={`learningPathway`}
  		                        label={`Learning pathway`}
  		                        value={record.learningPathwayId || ''}
  		                        options={learningPathways}
  		                        height={`medium`}
  		                        onChange={changeOutcome}
  		                        onEnterKey={handleEnterKey}
                              error={errorLearningPathwayId}/>
  												<SelectSingleDropDown
  		                        id={`learnerOutcomeTargetId`}
  		                        name={`learnerOutcomeTargetId`}
  		                        label={`Learner Outcome Targets`}
  		                        value={record.learnerOutcomeTargetId || ''}
  		                        options={learnerOutcomeTargets}
  		                        height={`medium`}
  		                        onChange={changeOutcome}
  		                        onEnterKey={handleEnterKey}
                              error={errorLearnerOutcomeTargetId} />
  
  												<div className={styles.moreTop}>
  														<span className={styles.inputText}>{`Description`}</span><br/>
  														<textarea rows={5} cols={45}
  																id={`description`}
  																name={`description`}
  																value={record.description}
  																onChange={(event) => changeOutcome(event)}
  																className={styles.commentTextarea}>
  														</textarea>
  														<span className={styles.error}>{errorDescription}</span>
  												</div>
                          <hr />
                          <hr />
                      </div>
                      <div className={classes(styles.rowRight)}>
  												<Link className={styles.cancelLink} to={'/firstNav'}>Close</Link>
  												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={(event) => processForm("STAY", event)} disabled={!isUserComplete}/>
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
                          onChange={changeFilter}
                          onEnterKey={handleEnterKey}/>
  										<SelectSingleDropDown
                          id={`learnerOutcomeTargetId_filter`}
                          name={`learnerOutcomeTargetId_filter`}
                          label={`Learner Outcome Targets (FILTER)`}
                          value={learnerOutcomeTargetId_filter || ''}
                          options={learnerOutcomeTargets}
                          className={styles.selectList}
                          height={`medium`}
                          onChange={changeFilter}
                          onEnterKey={handleEnterKey} />
  										<div className={styles.moreTop}>
  												<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
  										</div>
                  </div>
              }
              {localTabsData && localTabsData.chosenTab === 'BulkPaste' &&
                  <div className={styles.formLeft}>
                      <div className={classes(styles.rowRight)}>
                          <button className={classes(styles.button, (isBulkEntered ? styles.opacityFull : styles.opacityLow))} onClick={returnToBulkEntry}>
                              {`<- Prev`}
                          </button>
                          <button className={classes(styles.button, (!!bulk.memberData ? styles.opacityFull : styles.opacityLow))}
                                  onClick={isBulkEntered ? processBulk : goToBulkVerification}>
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
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`firstField`}
                                  label={`First field`}
                                  value={bulk.firstField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`secondField`}
                                  label={`Second field`}
                                  value={bulk.secondField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <SelectSingleDropDown
                                  id={`thirdField`}
                                  label={`Third field`}
                                  value={bulk.thirdField}
                                  options={fieldOptions}
                                  height={`medium`}
                                  onChange={changeBulk} />
                              <span className={styles.labelBulk}>{`Paste in learner outcome data in bulk (one member per line)`}</span>
                              <textarea rows={25} cols={100} value={bulk.memberData} onChange={(event) => handleBulkEntry(event)}
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
                  <MessageModal handleClose={handleNoBulkEntryMessageClose} heading={<L p={p} t={`No entries found`}/>}
                     explainJSX={<L p={p} t={`It doesn't appear that there are any Learner Outcomes entered in the bulk entry box below.`}/>} isConfirmType={false}
                     onClick={handleNoBulkEntryMessageClose} />
              }
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this Learner Outcome?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this learning outcome?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
          </section>
      )
}

export default LearnerOutcomeAddView
