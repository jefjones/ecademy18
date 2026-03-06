import { useEffect, useState } from 'react'
import styles from './ContextEditReview.css'
import MessageModal from '../MessageModal'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function ContextEditReview(props) {
  const [isShowingModal_deleteEdit, setIsShowingModal_deleteEdit] = useState(false)

  useEffect(() => {
    
            document.body.addEventListener('click', props.hideContextEditReviewMenu)
        
  }, [])

  const {className="", editDetails, isAuthor, setAcceptedEdit, personId, workId, workSummary, editReview, editChosen, standardHrefId } = props
          
  
          let acceptFunction = isAuthor
              ? () => setAcceptedEdit(personId, workId, workSummary, editReview.editCounts.editDetailId, isAuthor)
              : () => handleVote('AGREE')
  
          let deleteOrVoteFunction = isAuthor
              ? () => handleDeleteEdit()
              : () => handleVote('DISAGREE')
  
          let editText_editDetail = editDetails && editDetails.length > 0 && editDetails.filter(m => m.editTypeName === 'edit' && m.hrefId === standardHrefId(editChosen))[0]
  
          let editDetailId = editChosen && editChosen.indexOf('^^!') > -1
              ? editChosen.substring(editChosen.indexOf('^^!') + 3)
              : ''
  
          let edit = editDetailId
              ? editDetails && editDetails.length > 0 && editDetails.filter(m => m.editDetailId === editDetailId)[0]
              : editText_editDetail
  
          //editOrCommentText - this can be the actual edit text, the comment text, or the type of edit that it is.
  
          return (
              <div className={classes(styles.container, styles.row, className)}>
                  {edit && edit.personId !== personId &&
                      <div className={styles.multipleContainer}>
                          <div className={styles.row} data-rh={isAuthor ? <L p={p} t={`Accept this and delete the others`}/> : <L p={p} t={`Agree and use this edit`}/>}>
                              <a onClick={acceptFunction}>
                                  <Icon pathName={`thumbs_up0`} premium={true} className={classes(styles.image)}/>
                              </a>
                              <div className={styles.checkmarkCount}>{edit && edit.agreeCount ? edit.agreeCount : 0}</div>
                          </div>
                          <div className={classes(styles.row, styles.middleIcon)} data-rh={isAuthor ? <L p={p} t={`Decline this edit`}/> : <L p={p} t={`Disagree with this edit`}/>}>
                              <a onClick={deleteOrVoteFunction}>
                                  <Icon pathName={`thumbs_down0`} premium={true} className={classes(styles.image, styles.moreTopMargin)}/>
                              </a>
                              <div className={styles.crossCount}>{edit && edit.disagreeCount ? edit.disagreeCount : 0}</div>
                          </div>
                          <div className={classes(styles.row, styles.moreRight)} data-rh={`Mark this as an obnoxious entry`}>
                              <a onClick={() => handleVote('TROLL')}  className={classes(styles.row, styles.moreLeft)}>
                                  <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                  <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                              </a>
                              <div className={styles.blockCount}>{edit && edit.trollCount ? edit.trollCount : 0}</div>
                          </div>
                      </div>
                  }
                  {edit && edit.personId === personId &&
                      <a onClick={handleDeleteEditOpen} className={styles.undo}>
                          <Icon pathName={`undo2`} premium={true} className={styles.lessLeft}/>
                      </a>
                  }
                  {isShowingModal_deleteEdit &&
                      <MessageModal handleClose={handleDeleteEditClose} heading={<L p={p} t={`Undo this Edit?`}/>}
                         explainJSX={<L p={p} t={`Are you sure you want to undo this edit?`}/>} isConfirmType={true}
                         onClick={handleDeleteEdit} />
                  }
              </div>
          )
}
export default ContextEditReview
