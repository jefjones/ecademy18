import 'react'
import styles from './TabPage.css'
import classes from 'classnames'
import SelectSingleDropDown from '../SelectSingleDropDown'

const TabPage = props => {
    const {tabsData, showZeroCount, className, onClick, navClose, navText, showListAfterQuantity} = props

    //If the showListAfterQuantity is greater than the tabsData count plus 1, then show the author in a tab and the rest in a single select list.
  return (
      <div className={styles.container}>
        {tabsData && (!showListAfterQuantity || showListAfterQuantity > tabsData.tabs.length) &&
          <div className={classes(styles.tabs, styles.row, className)}>
              {tabsData && tabsData.tabs && tabsData.tabs.map((tab, i) => (
                  <div key={i} className={styles.columns}>
                      {tab.isAuthor ? <span className={styles.aboveTab}>AUTHOR</span> : <span className={styles.aboveTab}>&nbsp;</span>}
                      <a onClick={() => onClick(tab.id)}
                            className={classes(styles.row, styles.tabLink, (tab.id == tabsData.chosenTab ? styles.chosen : '')) //eslint-disable-line
                            }>
                          {tab.editorColor && <div className={styles.colorBox} style={{backgroundColor: tab.editorColor}} />}
                          {tab.label}
                          {(showZeroCount || tab.count) &&
                              <span className={styles.editCount}>
                                {tab.count
                                    ? tab.count
                                        ? tab.count
                                        : (showZeroCount ? 0 : '')
                                    : showZeroCount
                                        ? 0
                                        : ''
                                }
                                </span>
                           }
                      </a>
                  </div>
              ))}
              {navClose && <span className={styles.closeText} onClick={navClose}>{navText}</span>}
          </div>
        }
        {tabsData && showListAfterQuantity && showListAfterQuantity <= tabsData.tabs.length &&
          <div className={classes(styles.authorTabAndList, className)}>
              <a className={classes(styles.tabLink, (tabsData.tabs[0].id == tabsData.chosenTab ? styles.chosen : '')) //eslint-disable-line
                    } onClick={() => onClick(tabsData.tabs[0].id)}>
                  {tabsData.tabs[0].label}
                  <span className={styles.editCount}>
                    {tabsData.tabs[0].count}
                  </span>
              </a>
              <div>
                  <SelectSingleDropDown
                      value={tabsData.chosenTab}
                      options={tabsData.tabs.filter(m => m.id !== tabsData.tabs[0].id).map(m => { m.label = m.label + ' [' + m.count + ']'; return m;})}
                      height={`medium`}
                      className={styles.singleDropDown}
                      onChange={(event) => onClick(event.target.value)} />
              </div>
              {navClose && <span className={styles.closeText} onClick={navClose}>{navText}</span>}
          </div>
        }
      </div>
  )
}

export default TabPage
