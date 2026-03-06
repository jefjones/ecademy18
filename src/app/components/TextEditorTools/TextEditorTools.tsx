import { useState } from 'react'
import styles from './TextEditorTools.css'
import MessageModal from '../MessageModal'
import Checkbox from '../Checkbox'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function TextEditorTools(props) {
  const [isShowingModal_sentence, setIsShowingModal_sentence] = useState(false)
  const [isShowingModal_active, setIsShowingModal_active] = useState(false)
  const [isShowingModal_deleteEdit, setIsShowingModal_deleteEdit] = useState(false)
  const [isShowingLegend, setIsShowingLegend] = useState(false)

  const {isDraftView, tabsData, draftComparison, editorTabChosen,personId, setAcceptedEdit, workId, editReview, authorPersonId, editChosen,
                  editDetails, workSummary, className, handleEditOwner, standardHrefId, toggleShowEditorTabDiff} = props
          
  
          // let isSentenceEditable = false;
          // if (sentenceChosen) {
          //     if (isDraftView) {
          //         isSentenceEditable = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false;
          //     } else {
          //         isSentenceEditable = true;
          //     }
          // }
          let isDraftCurrentTab = true
          if (isDraftView) {
              isDraftCurrentTab = tabsData && draftComparison && draftComparison[editorTabChosen] && draftComparison[editorTabChosen].isCurrent ? true : false
          }
  
          let acceptFunction = authorPersonId === personId
              ? () => setAcceptedEdit(personId, workId, workSummary, editReview.editCounts.editDetailId, authorPersonId === personId)
              : () => handleVote('AGREE')
  
          let deleteOrVoteFunction = authorPersonId === personId
              ? () => handleDeleteEdit()
              : () => handleVote('DISAGREE')
  
          let editText_editDetail = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === standardHrefId(editChosen))[0]
  
          let editDetailId = editChosen && editChosen.indexOf('^^!') > -1
              ? editChosen.substring(editChosen.indexOf('^^!')+3)
              : ''
  
          let edit = editDetailId
              ? editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
              : editText_editDetail
  
          let hasEditDetailMine = edit && edit.personId === personId
          let hasEditDetailOthers = edit && edit.personId !== personId
          let hasEditDetailOtherTab = edit && edit.personId !== editReview.editorTabChosen
          return (
              <div className={classes(styles.container, className)}>
                  <div className={classes(styles.row, styles.iconSpaceLeft)} data-rh={authorPersonId === personId ? 'Accept this and delete the others' : 'Agree and use this edit'}>
                      <a onClick={hasEditDetailOthers ? acceptFunction : handleActiveOpen}>
                          <Icon pathName={`thumbs_up0`} premium={true} className={classes(styles.image, styles.moreLeft, hasEditDetailOthers ? '' : styles.disabled)}/>
                      </a>
                      <div className={styles.checkmarkCount}>{edit && edit.agreeCount ? edit.agreeCount : 0}</div>
                  </div>
                  <div className={styles.row} data-rh={authorPersonId === personId ? 'Decline this edit' : 'Disagree with this edit'}>
                      <a onClick={hasEditDetailOthers || authorPersonId === personId ? deleteOrVoteFunction : handleActiveOpen}>
                          <Icon pathName={`thumbs_down0`} premium={true} className={classes(styles.image, styles.moreTopMargin, hasEditDetailOthers ? '' : styles.disabled)}/>
                      </a>
                      <div className={styles.crossCount}>{edit && edit.disagreeCount ? edit.disagreeCount : 0}</div>
                  </div>
                  <div className={styles.row} data-rh={`Mark this as an obnoxious entry`}>
                      <a onClick={hasEditDetailOthers ? () => handleVote('TROLL') : handleActiveOpen}  className={classes(styles.row, styles.moreLeft)}>
                          <Icon pathName={`blocked`} fillColor={'red'} className={classes(styles.imageBlocked, hasEditDetailOthers ? '' : styles.disabled)}/>
                          <Icon pathName={`user_minus0`} premium={true} className={classes(styles.imageOverlay, hasEditDetailOthers ? '' : styles.disabled)}/>
                      </a>
                      <div className={styles.blockCount}>{edit && edit.trollCount ? edit.trollCount : 0}</div>
                  </div>
                  <div data-rh={`View the editor's full version`}>
                      <a onClick={hasEditDetailOtherTab ? () => handleEditOwner() : () => {}} className={classes(styles.row, hasEditDetailOtherTab ? '' : styles.disabled)}>
                          <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                          <Icon pathName={`magnifier`} premium={true} className={styles.imageMagnifier}/>
                      </a>
                  </div>
                  <a onClick={hasEditDetailMine ? handleDeleteEditOpen : handleActiveOpen} data-rh={`Undo your edit`}>
                      <Icon pathName={`undo2`} premium={true} className={classes(styles.lessLeft, hasEditDetailMine ? '' : styles.disabled)}/>
                  </a>
  								<div>
  										<div onClick={() => toggleShowEditorTabDiff()} className={styles.upperLabel}><L p={p} t={`Show changes`}/></div>
  										<Checkbox
  												id={`editDifferenceView`}
  												label={``}
  												checked={editReview.showEditorTabDiff}
  												checkboxClass={styles.checkbox}
  												onClick={() => toggleShowEditorTabDiff()}/>
  								</div>
                  {isShowingModal_sentence &&
                     <MessageModal handleClose={handleSentenceClose} heading={<L p={p} t={`Choose a sentence`}/>}
                         explainJSX={<L p={p} t={`You must first choose a sentence before choosing this option.`}/>}
                         onClick={handleSentenceClose}/>
                   }
                   {isShowingModal_deleteEdit &&
                      <MessageModal handleClose={handleDeleteEditClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                         explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                         onClick={handleDeleteEdit} />
                   }
                   {isShowingModal_active &&
                      <MessageModal handleClose={handleActiveClose} heading={<L p={p} t={`This Feature is not Active`}/>}
                         explainJSX={<L p={p} t={`This option is not active.  If you are reacting to a moved sentence, you must be on the editor's tab who made the suggestion.  Or if you are on your own edit, you cannot accept or vote on your own edits.  But you can delete it.`}/>}
                         isConfirmType={false} onClick={handleActiveClose} />
                   }
                   {isShowingLegend &&
                       <MessageModal handleClose={handleToolLegendClose} heading={<L p={p} t={`Tool Options`}/>} showToolLegend={true}
                           onClick={handleToolLegendClose}/>
                   }
              </div>
          )
}


// <div className={styles.row}>
//     <a onClick={this.handleToolLegendOpen}>
//         <Icon pathName={`info`} className={classes(styles.image, styles.moreLeft)}/>
//     </a>
// </div>
export default TextEditorTools
