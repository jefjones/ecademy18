import cx from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import {
  arrayify,
  getChildrenActiveItems,
  getActiveItems,
  isSame
} from './utils';

export default class Accordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItems: getActiveItems(props.children, props.allowMultiple)
    };

    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
  }

  componentWillReceiveProps({ children, allowMultiple }) {
    if (
      !isSame(
        getChildrenActiveItems(this.props.children),
        getChildrenActiveItems(children)
      )
    ) {
      this.setState({
        activeItems: getActiveItems(children, allowMultiple)
      });
    }
  }

  handleClick(index) {
    const {
      allowMultiple,
      children,
      onChange,
      openNextAccordionItem
    } = this.props;

    // clone active items state array
    let activeItems = this.state.activeItems.slice(0);

    const position = activeItems.indexOf(index);

    if (position !== -1) {
      activeItems.splice(position, 1);

      if (openNextAccordionItem && index !== children.length - 1) {
        activeItems.push(index + 1);
      }
    } else if (allowMultiple) {
      activeItems.push(index);
    } else {
      activeItems = [index];
    }

    const newState = {
      activeItems
    };

    this.setState(newState);

    if (onChange) {
      onChange(newState);
    }
  }

  handleSelectAll() {
    const children = this.props.children;
    const newActiveItems = [];

    arrayify(children).filter((c) => c).forEach((children, index) => {
      newActiveItems.push(index);
    });
    this.setState({ activeItems: newActiveItems });
  }

  handleClearAll() {
      this.setState({ activeItems: [] });
  }

  renderItems() {
    let { children, duration, easing } = this.props;

    if (!children) {
      return null;
    }

    const { activeItems } = this.state;

    return arrayify(children)
      .filter(c => c)
      .map((item, index) => {
        const {
          props: { disabled, duration: itemDuration, easing: itemEasing }
        } = item;

        const isExpanded = !disabled && activeItems.indexOf(index) !== -1;

        return React.cloneElement(item, {
          duration: itemDuration || duration,
          easing: itemEasing || easing,
          expanded: isExpanded,
          key: index,
          index,
          onClick: this.handleClick.bind(this, index),
          ref: `item-${index}`
        });
      });
  }

  render() {
    const { className, style, rootTag: Root, noShowExpandAll } = this.props;

    return (
        <Root>
            {!noShowExpandAll &&
                <div className={styles.selectOrClearAll}>
                    <a onClick={this.handleSelectAll} className={styles.textLabel}> expand all </a> |
                    <a onClick={this.handleClearAll} className={styles.textLabel}> collapse all </a>
                </div>
            }
            <div
                className={cx(styles.react_sanfona, className)}
                role="tablist"
                style={style}
              >
                {this.renderItems()}
            </div>
        </Root>
    );
  }
}

Accordion.defaultProps = {
  activeItems: [0],
  allowMultiple: false,
  duration: 300,
  easing: 'ease',
  rootTag: 'div'
};

Accordion.propTypes = {
  allowMultiple: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  duration: PropTypes.number,
  easing: PropTypes.string,
  onChange: PropTypes.func,
  openNextAccordionItem: PropTypes.bool,
  style: PropTypes.object,
  rootTag: PropTypes.string
};
