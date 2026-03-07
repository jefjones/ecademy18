import cx from 'classnames'
import 'react'
import * as styles from './styles.css'

const AccordionItemBody = props => {
  const {
    children,
    className,
    duration,
    easing,
    maxHeight,
    overflow,
    rootTag: Root,
    uuid
  } = props

  const style = {
    maxHeight,
    overflow,
    transition: `max-height ${duration}ms ${easing}`
  }

  return (
    <Root
      aria-labelledby={`react-safona-item-title-${uuid}`}
      className={cx(styles.react_sanfona_item_body, className)}
      id={`react-safona-item-body-${uuid}`}
      style={style}
    >
      <div className={styles.react_sanfona_item_body_wrapper}>
        {children}
      </div>
    </Root>
  )
}

export default AccordionItemBody

AccordionItemBody.defaultProps = {
  rootTag: 'div'
}

