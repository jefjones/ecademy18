/* See https://github.com/balloob/react-sidebar - this page was cloned to create this local component*/
import { useEffect, useState } from 'react'
import * as styles from './SplitterPanelDockable.css'
import classes from 'classnames'
import tapOrClick from 'react-tap-or-click'
import Icon from '../Icon'
const p = 'component'
import L from '../../components/PageLanguage'

const CANCEL_DISTANCE_ON_SCROLL = 20

const defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
    width: 320,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-in-out, right .3s ease-in-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-in-out, visibility .3s ease-in-out',
    backgroundColor: 'rgba(0,0,0,.3)',
    width: 320,
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
}

function SplitterPanelDockable(props) {
  const [sidebarWidth, setSidebarWidth] = useState(props.defaultSidebarWidth)
  const [touchIdentifier, setTouchIdentifier] = useState(null)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [touchCurrentX, setTouchCurrentX] = useState(null)
  const [touchCurrentY, setTouchCurrentY] = useState(null)
  const [dragSupported, setDragSupported] = useState(false)
  const [newEditText, setNewEditText] = useState('')
  const [acceptedEditDetailId, setAcceptedEditDetailId] = useState(0)
  const [isAuthorAcceptedEdit, setIsAuthorAcceptedEdit] = useState(false)
  const [isShowingModal_single, setIsShowingModal_single] = useState(false)
  const [isShowingModal_all, setIsShowingModal_all] = useState(false)
  const [isShowingModal_config, setIsShowingModal_config] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(0)

  useEffect(() => {
    
        setDragSupported(typeof window === 'object' && 'ontouchstart' in window)
        saveSidebarWidth()
        checkMediaQuerySize()
        closeButton.addEventListener("click", handleClosed)
      
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        // filter out the updates when we're touching
        if (!isTouching()) {
          saveSidebarWidth()
        }
        checkMediaQuerySize()
      
  }, [])


  const sidebarStyle = {...defaultStyles.sidebar, ...props.styles.sidebar}
      const contentStyle = {...defaultStyles.content, ...props.styles.content}
      const overlayStyle = {...defaultStyles.overlay, ...props.styles.overlay}
      const useTouch = dragSupported && props.touch
      const isTouching = isTouching()
      const rootProps = {
        className: props.rootClassName,
        style: {...defaultStyles.root, ...props.styles.root},
        role: "navigation",
      }
      let dragHandle
  
      // sidebarStyle right/left
      if (props.pullRight) {
        sidebarStyle.right = 0
        sidebarStyle.transform = 'translateX(100%)'
        sidebarStyle.WebkitTransform = 'translateX(100%)'
        if (props.shadow) {
          sidebarStyle.boxShadow = '-2px 2px 4px rgba(0, 0, 0, 0.15)'
        }
      } else {
        sidebarStyle.left = 0
        sidebarStyle.transform = 'translateX(-100%)'
        sidebarStyle.WebkitTransform = 'translateX(-100%)'
        if (props.shadow) {
          sidebarStyle.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.15)'
        }
      }
  
      if (isTouching) {
        const percentage = touchSidebarWidth() / sidebarWidth
  
        // slide open to what we dragged
        if (props.pullRight) {
          sidebarStyle.transform = `translateX(${(1 - percentage) * 100}%)`
          sidebarStyle.WebkitTransform = `translateX(${(1 - percentage) * 100}%)`
        } else {
          sidebarStyle.transform = `translateX(-${(1 - percentage) * 100}%)`
          sidebarStyle.WebkitTransform = `translateX(-${(1 - percentage) * 100}%)`
        }
  
        // fade overlay to match distance of drag
        overlayStyle.opacity = percentage
        overlayStyle.visibility = 'visible'
      } else if (props.docked) {
        // show sidebar
        if (sidebarWidth !== 0) {
          sidebarStyle.transform = `translateX(0%)`
          sidebarStyle.WebkitTransform = `translateX(0%)`
        }
  
        // make space on the left/right side of the content for the sidebar
        if (props.pullRight) {
          contentStyle.right = `${sidebarWidth}px`
        } else {
          contentStyle.left = `${sidebarWidth}px`
        }
      } else if (props.open) {
        // slide open sidebar
        sidebarStyle.transform = `translateX(0%)`
        sidebarStyle.WebkitTransform = `translateX(0%)`
  
        // show overlay
        overlayStyle.opacity = 1
        overlayStyle.visibility = 'visible'
      }
  
      if (isTouching || !props.transitions) {
        sidebarStyle.transition = 'none'
        sidebarStyle.WebkitTransition = 'none'
        contentStyle.transition = 'none'
        overlayStyle.transition = 'none'
      }
  
      if (useTouch) {
        if (props.open) {
          rootProps.onTouchStart = onTouchStart
          rootProps.onTouchMove = onTouchMove
          rootProps.onTouchEnd = onTouchEnd
          rootProps.onTouchCancel = onTouchEnd
          rootProps.onScroll = onScroll
        } else {
          const dragHandleStyle = {...defaultStyles.dragHandle, ...props.styles.dragHandle}
          dragHandleStyle.width = props.touchHandleWidth
  
          // dragHandleStyle right/left
          if (props.pullRight) {
            dragHandleStyle.right = 0
          } else {
            dragHandleStyle.left = 0
          }
  
          dragHandle = (
            <div style={dragHandleStyle}
                 onTouchStart={onTouchStart} onTouchMove={onTouchMove}
                 onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd} />)
        }
      }
  
      //Constants and variables from EditsLeftSideOver
      const {newSections, leftSidePanelOpen, splitChapter, workSummary, deleteSectionByName} = props
  
      return (
        <div {...rootProps}>
          <div className={props.sidebarClassName} style={sidebarStyle} ref={saveSidebarRef}>
              <div className={styles.container}>
                  <div className={classes(styles.children, (leftSidePanelOpen && styles.opened))}>
                      <a className={styles.closeButton} ref={(ref) => (closeButton = ref)}>X</a>
                      <div className={styles.title}>
                          <L p={p} t={`List of New Sections`}/>
                      </div>
                      <div className={styles.rightMargin}>
                          <button className={classes(styles.editButton, (!newSections || newSections.length === 0) ? styles.disabled : '')} {...tapOrClick(splitChapter)}>
                              Submit
                          </button>
                      </div>
                      {(!newSections || newSections.length === 0) &&
                          <span className={styles.notChosen}>
                              <L p={p} t={`No new sections have been chosen, yet.`}/>
                          </span>
                      }
                      {newSections && newSections.length > 0 &&
                          <div>
                              <div className={styles.sections}>
                                  <L p={p} t={`(1 - current)  ${workSummary.chapterName_current}`}/>
                              </div>
                              {newSections.map((m, i) =>
                                  <div key={i} className={styles.sections}>
                                      {`(` + String(Number(i)+Number(2)) + `) ` + m.name}
                                      <a onClick={() => deleteSectionByName(m.name)} className={styles.deleteIcon}>
                                          <Icon pathName={`garbage_bin`} />
                                      </a>
                                  </div>
                              )}
                          </div>
                      }
                  </div>
              </div>
          </div>
          <div className={props.overlayClassName}
               style={overlayStyle}
               role="presentation"
               tabIndex="0"
               onClick={overlayClicked}
            />
          <div className={props.contentClassName} style={contentStyle}>
            {dragHandle}
            {props.children}
          </div>
        </div>
      )
}

export default SplitterPanelDockable
