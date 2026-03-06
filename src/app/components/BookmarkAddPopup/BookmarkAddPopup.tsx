import { useEffect, useState } from 'react'
import styles from './BookmarkAddPopup.css'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function BookmarkAddPopup(props) {
  const [bookmarkName, setBookmarkName] = useState('')
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    
            //nameTextBox.focus(); //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
            button.addEventListener("click", handleDisplay)
            saveButton.addEventListener("click", handleClosed)
            cancelButton.addEventListener("click", handleClosed)
        
  }, [])

  let {className, originalSentence, saveNewBookmark} = props
          
  
          const regex = "/<(.|\n)*?>/"
          originalSentence = originalSentence && originalSentence.replace(regex, "").replace(/<br>/g, "")
  
          return (
              <div className={classes(styles.container, className)}>
                  <div className={styles.button} ref={(ref) => (button = ref)}>
                      <Icon pathName={`plus`} className={styles.bookmarkAdd}/>
                  </div>
                  <div className={classes(styles.children, (opened && styles.opened))}>
                      <div className={styles.nameBox}>
                          <span className={styles.originalSentence}>{originalSentence && originalSentence.replace(regex, "").substring(0,135) + `...`}</span>
                          <textarea rows={5} cols={35} value={bookmarkName} onChange={handleChange} placeholder={<L p={p} t={`Name of new bookmark?`}/>}
                              ref={ref => (nameTextBox = ref)} autoFocus={true}></textarea>
                          <div className={styles.buttonRow}>
                              <a className={styles.cancelButton} ref={(ref) => (cancelButton = ref)}><L p={p} t={`Cancel`}/></a>
                              <button onClick={() => saveNewBookmark(bookmarkName)} className={styles.saveButton} ref={(ref) => (saveButton = ref)}><L p={p} t={`Save`}/></button>
                          </div>
                      </div>
                  </div>
              </div>
          )
}
export default BookmarkAddPopup
