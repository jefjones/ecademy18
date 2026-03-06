import { Component } from 'react'
import styles from './ContextMenu.css'
import { ContextMenu, Item, Separator, ContextMenuProvider } from 'react-contexify'
import classes from 'classnames'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

function ContextMenu(props) {
  const {className="", edit, editOrCommentText, isAuthor } = props
          let acceptFunction = isAuthor ? () => {} :  () => {}
          let declineFunction = isAuthor ? () => {} :  () => {}
          //editOrCommentText - this can be the actual edit text, the comment text, or the type of edit that it is.
  
          return (
              <div className={classes(styles.container, className)}>
                  <ContextMenuProvider id="menu_id">
                      <div>Some Content ... </div>
                  </ContextMenuProvider>
                  <ContextMenu id='menu_id'>
                     <div>{editOrCommentText}</div>
                     <Separator />
                     <Item onClick={acceptFunction}>
                         <div className={classes(styles.row, styles.leftWidth)}>
                             <Icon pathName={`thumbs_up0`} premium={true} className={styles.image}/>
                             <div className={styles.checkmarkCount}>{edit && edit.agreeCount ? edit.agreeCount : 0}</div>
                         </div>
                         <div className={styles.text}>{isAuthor ? <L p={p} t={`Accept`}/> : <L p={p} t={`Agree`}/>}</div>
                     </Item>
                     <Item onClick={declineFunction}>
                         <div className={classes(styles.row, styles.leftWidth)}>
                             <Icon pathName={`thumbs_down0`} premium={true} className={styles.image}/>
                             <div className={styles.checkmarkCount}>{edit && edit.agreeCount ? edit.agreeCount : 0}</div>
                         </div>
                         <div className={styles.text}>{isAuthor ? <L p={p} t={`Decline`}/> : <L p={p} t={`Disagree`}/>}</div>
                     </Item>
                     <Item onClick={() => handleVote('TROLL')}>
                         <div className={classes(styles.row, styles.leftWidth)}>
                             <div className={styles.row}>
                                 <Icon pathName={`blocked`} fillColor={'red'} className={styles.imageBlocked}/>
                                 <Icon pathName={`user_minus0`} premium={true} className={styles.imageOverlay}/>
                             </div>
                             <div className={styles.blockCount}>{edit && edit.trollCount ? edit.trollCount : 0}</div>
                         </div>
                         <div className={styles.text}><L p={p} t={`Block obnoxious entry`}/></div>
                     </Item>
                  </ContextMenu>
              </div>
          )
}
export default ContextMenu
