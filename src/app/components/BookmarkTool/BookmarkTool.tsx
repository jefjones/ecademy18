import { useState } from 'react'
import styles from './BookmarkTool.css'
import SelectSingleDropDown from '../SelectSingleDropDown/SelectSingleDropDown'
import classes from 'classnames'
import TextareaModal from '../TextareaModal'
import MessageModal from '../MessageModal'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function BookmarkTools(props) {
  const [bookmarkName, setBookmarkName] = useState('')
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(false)
  const [isShowingModal_bookmark, setIsShowingModal_bookmark] = useState(false)
  const [isShowingModal_sentence, setIsShowingModal_sentence] = useState(false)

  const {className="", bookmarkChosen, bookmarkOptions, jumpToBookmark, setBookmark, deleteBookmark, setEditOptionTools,
                  originalSentence} = props
          
          let {pointer, totalCount} = props
          pointer = pointer ? pointer : 0
          totalCount = totalCount ? totalCount : 0
  
          return (
              <div className={classes(styles.container, className)}>
                  <div className={styles.inputRow}>
                      <a className={styles.closeButton} onClick={setEditOptionTools}>
                          <Icon pathName={`left_arrow`} />
                      </a>
                      <div className={styles.marginRight}>
                          <SelectSingleDropDown
                              value={bookmarkChosen}
                              options={bookmarkOptions || []}
                              height={`medium`}
                              className={styles.singleDropDown}
                              onChange={setBookmark} />
                      </div>
                      <a onClick={bookmarkChosen ? deleteBookmark : handleBookmarkMessageOpen}>
                          <Icon pathName={`garbage_bin`} className={classes(styles.image, (bookmarkChosen ? '' : styles.grayedOut))}/>
                      </a>
                      <a onClick={originalSentence ? handleCommentOpen : handleSentenceMessageOpen}>
                          <Icon pathName={`plus`} className={classes(styles.image, (originalSentence ? '' : styles.grayedOut))} />
                      </a>
                      {isShowingModal_comment &&
                          <TextareaModal key={'all'} handleClose={handleCommentClose} heading={``} explain={``}
                             onClick={handleSave} currentSentenceText={originalSentence} placeholder={<L p={p} t={`Bookmark name?`}/>}/>
                      }
                      {isShowingModal_bookmark &&
                         <MessageModal handleClose={handleBookmarkMessageClose} heading={<L p={p} t={`Choose a bookmark`}/>}
                             explainJSX={<L p={p} t={`You must first choose a bookmark before you can delete a bookmark.`}/>}
                             onClick={handleBookmarkMessageClose}/>
                      }
                      {isShowingModal_sentence &&
                         <MessageModal handleClose={handleSentenceMessageClose} heading={<L p={p} t={`Choose a sentence`}/>}
                             explainJSX={<L p={p} t={`You must first choose a sentence before adding a bookmark.`}/>}
                             onClick={handleSentenceMessageClose}/>
                      }
                      <a onClick={() => jumpToBookmark('NEXT')}>
                          <Icon pathName={`arrow_down`} className={styles.downArrow} />
                      </a>
                      <span className={styles.counts}>
                          {<L p={p} t={`${pointer} of ${totalCount}`}/>}
                      </span>
                      <a onClick={() => jumpToBookmark('PREV')}>
                          <Icon pathName={`arrow_up`} className={styles.upArrow} />
                      </a>
                  </div>
              </div>
          )
}
export default BookmarkTools
