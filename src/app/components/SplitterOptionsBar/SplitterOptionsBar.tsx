import { useState } from 'react'
import styles from './SplitterOptionsBar.css'
import classes from 'classnames'
import Icon from '../Icon'
import MessageModal from '../MessageModal'
import tapOrClick from 'react-tap-or-click'
const p = 'component'
import L from '../../components/PageLanguage'

function SplitterOptionsBar(props) {
  const [isShowingExplain, setIsShowingExplain] = useState(false)

  const {className, toggleLeftSidePanelOpen} = props
          
          let {pointer, totalCount} = props
          pointer = pointer ? pointer : 0
          totalCount = totalCount ? totalCount : 0
  
          return (
              <div className={classes(className, styles.container)}>
                  <div className={styles.row}>
                      <div className={styles.sectionView}>
                          <button className={styles.editButton} {...tapOrClick(toggleLeftSidePanelOpen)}>
                              <L p={p} t={`Confirm Section List`}/>
                          </button>
                      </div>
                      <div>
                          <a onClick={handleNextEdit}>
                              <Icon pathName={`arrow_down`} className={styles.imageLeft}/>
                          </a>
                      </div>
                      <span className={styles.column}>
                          <span className={styles.text}>sections</span>
                          <span className={styles.counts}>
                              <L p={p} t={`${pointer} of ${totalCount}`}/>
                          </span>
                      </span>
                      <div>
                          <a onClick={handlePrevEdit}>
                              <Icon pathName={`arrow_up`} className={styles.downArrow}/>
                          </a>
                      </div>
                      <div>
                          <a onClick={handleSplitExplainOpen}>
                              <Icon pathName={`info`} className={styles.image}/>
                          </a>
                      </div>
                  </div>
                  {isShowingExplain &&
                      <MessageModal handleClose={handleSplitExplainClose} heading={<L p={p} t={`How to split a section/chapter?`}/>}
                         explainJSX={[<L p={p} t={`1. Click on any text where you want the new section to begin. The text you chose will be included in that new section.`}/>,<br/>,<br/>,
                           <L p={p} t={`2. In the text box that appears, either accept the text as the section name or change it.`}/>,<br/>,<br/>,
                           <L p={p} t={`3. Choose OK`}/>,<br/>,<br/>,
                           <L p={p} t={`4. When you are ready to accept the section or sections you have indicated, click on the 'Confirm Section List' button to view the result.`}/>,<br/>,<br/>,
                           <L p={p} t={`5. If you are ready to accept, click on the 'Submit' button at the top of the section list.`}/>]} onClick={handleSplitExplainClose} />
                  }
              </div>
          )
}
export default SplitterOptionsBar
