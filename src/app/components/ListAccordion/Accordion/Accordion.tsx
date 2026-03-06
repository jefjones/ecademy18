import cx from 'classnames'
import { cloneElement, useEffect, useRef, useState } from 'react'
import styles from './styles.css'

import {
  arrayify,
  getChildrenActiveItems,
  getActiveItems,
  isSame
} from './utils'

function Accordion(props) {
  const {
    children,
    allowMultiple = false,
    className,
    style,
    rootTag: Root = 'div',
    noShowExpandAll,
    duration = 300,
    easing = 'ease',
    onChange,
    openNextAccordionItem,
  } = props

  const [activeItems, setActiveItems] = useState(() =>
    getActiveItems(children, allowMultiple)
  )

  // Replaces UNSAFE_componentWillReceiveProps: sync activeItems when children change
  const prevChildrenRef = useRef(children)
  useEffect(() => {
    const prevChildren = prevChildrenRef.current
    if (!isSame(getChildrenActiveItems(prevChildren), getChildrenActiveItems(children))) {
      setActiveItems(getActiveItems(children, allowMultiple))
    }
    prevChildrenRef.current = children
  }, [children, allowMultiple])

  const handleClick = (index) => {
    let newActiveItems = activeItems.slice(0)
    const position = newActiveItems.indexOf(index)

    if (position !== -1) {
      newActiveItems.splice(position, 1)
      const childCount = arrayify(children).filter(c => c).length
      if (openNextAccordionItem && index !== childCount - 1) {
        newActiveItems.push(index + 1)
      }
    } else if (allowMultiple) {
      newActiveItems.push(index)
    } else {
      newActiveItems = [index]
    }

    setActiveItems(newActiveItems)
    if (onChange) onChange({ activeItems: newActiveItems })
  }

  const handleSelectAll = () => {
    const newActiveItems = []
    arrayify(children).filter(c => c).forEach((_, index) => {
      newActiveItems.push(index)
    })
    setActiveItems(newActiveItems)
  }

  const handleClearAll = () => {
    setActiveItems([])
  }

  const renderedItems = (() => {
    if (!children) return null
    return arrayify(children)
      .filter(c => c)
      .map((item, index) => {
        const { props: { disabled, duration: itemDuration, easing: itemEasing } } = item
        const isExpanded = !disabled && activeItems.indexOf(index) !== -1
        return cloneElement(item, {
          duration: itemDuration || duration,
          easing: itemEasing || easing,
          expanded: isExpanded,
          key: index,
          index,
          onClick: () => handleClick(index),
        })
      })
  })()

  return (
    <Root>
      {!noShowExpandAll &&
        <div className={styles.selectOrClearAll}>
          <a onClick={handleSelectAll} className={styles.textLabel}> expand all </a> |
          <a onClick={handleClearAll} className={styles.textLabel}> collapse all </a>
        </div>
      }
      <div
        className={cx(styles.react_sanfona, className)}
        role="tablist"
        style={style}
      >
        {renderedItems}
      </div>
    </Root>
  )
}

export default Accordion

