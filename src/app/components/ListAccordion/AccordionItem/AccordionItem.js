import cx from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import styles from './styles.css';
import AccordionItemBody from '../AccordionItemBody';
import AccordionItemTitle from '../AccordionItemTitle';

export default class AccordionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxHeight: props.expanded ? 'none' : 0,
      overflow: props.expanded ? 'visible' : 'hidden',
      caretClassName: cx((props.isOpenCommunity ? styles.white_caret : styles.jef_caret), (props.expanded ? styles.jefCaretUp : styles.jefCaretDown)),
    };
  }

  componentWillMount() {
    this.uuid = this.props.uuid || uuid.v4();
  }

  componentDidMount() {
    this.setMaxHeight(false);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentDidUpdate(prevProps) {
    const { children, disabled, expanded } = this.props;

    if (prevProps.expanded !== expanded) {
      if (disabled) return;

      if (expanded) {
        this.handleExpand();
      } else {
        this.handleCollapse();
      }
    } else if (prevProps.children !== children) {
      this.setMaxHeight(false);
    }
  }

  handleExpand() {
    const { index, onExpand, slug, isOpenCommunity } = this.props;

    this.setMaxHeight(false);
    this.setState({ caretClassName: cx((isOpenCommunity ? styles.white_caret : styles.jef_caret), styles.jefCaretUp) });

    if (onExpand) {
      slug ? onExpand(slug, index) : onExpand(index);
    }
  }

  handleCollapse() {
    const { index, onClose, slug, isOpenCommunity } = this.props;

    this.setMaxHeight(true);
    this.setState({ caretClassName: cx((isOpenCommunity ? styles.white_caret : styles.jef_caret), styles.jefCaretDown) });

    if (onClose) {
      slug ? onClose(slug, index) : onClose(index);
    }
  }

  setMaxHeight(collapse) {
    const { duration, expanded } = this.props;

    clearTimeout(this.timeout);

    const bodyNode = ReactDOM.findDOMNode(this.refs.body);
    const images = bodyNode.querySelectorAll('img');

    if (images.length > 0) {
      return this.preloadImages(bodyNode, images);
    }

    this.setState({
      maxHeight: expanded || collapse ? bodyNode.scrollHeight + 'px' : 0,
      overflow: 'hidden'
    });

    if (expanded) {
      this.timeout = setTimeout(() => {
        this.setState({
          maxHeight: 'none',
          overflow: 'visible'
        });
      }, duration);
    } else {
      this.timeout = setTimeout(() => {
        this.setState({
          maxHeight: 0,
        });
      }, 0);
    }
  }

  // Wait for images to load before calculating maxHeight
  preloadImages(node, images = []) {
    const { expanded } = this.props;

    let imagesLoaded = 0;

    const imgLoaded = () => {
      imagesLoaded++;

      if (imagesLoaded === images.length) {
        this.setState({
          maxHeight: expanded ? node.scrollHeight + 'px' : 0,
          overflow: 'hidden'
        });
      }
    };

    for (let i = 0; i < images.length; i += 1) {
      let img = new Image();
      img.src = images[i].src;
      img.onload = img.onerror = imgLoaded;
    }
  }

  getProps() {
    const {
      className,
      disabled,
      disabledClassName,
      expanded,
      expandedClassName,
      style
    } = this.props;

    const props = {
      [`aria-${expanded ? 'expanded' : 'hidden'}`]: true,
      className: cx(
        styles.react_sanfona_item,
        className,
        {
          'react-sanfona-item-expanded': expanded && !disabled,
          'react-sanfona-item-disabled': disabled
        },
        expandedClassName && {
          [expandedClassName]: expanded
        },
        disabledClassName && {
          [disabledClassName]: disabled
        }
      ),
      role: 'tabpanel',
      style
    };

    return props;
  }

  render() {
    const {
      isImplemented,
      bodyClassName,
      contactSummary,
      workSummary,
      showDelete,
      setWorkCurrentSelected,
      deleteWork,
      deleteChapter,
      bodyTag,
      children,
      disabled,
      duration,
      easing,
      onClick,
      rootTag: Root,
      title,
			icon,
			iconBigger,
      isCurrentTitle,
      onTitleClick,
      onContactClick,
      titleClassName,
      titleTag,
      isNewInvite,
      editorAssign,
      workId,
      personId,
      owner_personId,
      editorPersonId,
      languageId,
      chapterOptions,
      languageOptions,
      setEditorAssign,
      chaptersChosen,
      languagesChosen,
      indexKey,
      filterScratch,
      savedFilterIdCurrent,
      filterOptions,
      updateSavedSearch,
      deleteSavedSearch,
      chooseSavedSearch,
      clearFilters,
      updateFilterByField,
      updateFilterDefaultFlag,
      modifyOpenCommunity,
      removeOpenCommunity,
      undiscontinueOpenCommunity,
      commitOpenCommunityEntry,
      uncommitOpenCommunityEntry,
      openCommLanguageOptions,
      openCommChapterOptions,
      openCommunityEntry,
      showCommitted,
      showNotifyMe,
      isOpenCommunity,
      count,
      updatePersonConfig,
      personConfig,
    } = this.props;

    let {caretClassName} = this.state;

    const { maxHeight, overflow } = this.state;

    return (
      <Root {...this.getProps()} ref="item">
        <AccordionItemTitle
          isImplemented={isImplemented}
          className={titleClassName}
          contactSummary={contactSummary}
          onContactClick={onContactClick}
          workSummary={workSummary}
          showDelete={showDelete}
          setWorkCurrentSelected={setWorkCurrentSelected}
          deleteWork={deleteWork}
          deleteChapter={deleteChapter}
          caretClassName={caretClassName}
          onClick={disabled ? null : onClick}
          rootTag={titleTag}
					title={title}
					icon={icon}
          iconBigger={iconBigger}
          isCurrentTitle={isCurrentTitle}
          onTitleClick={onTitleClick === 'SameAsOnClick' ? onClick : onTitleClick}
          uuid={this.uuid}
          isNewInvite={isNewInvite}
          editorAssign={editorAssign}
          workId={workId}
          personId={personId}
          owner_personId={owner_personId}
          editorPersonId={editorPersonId}
          languageId={languageId}
          chapterOptions={chapterOptions}
          languageOptions={languageOptions}
          setEditorAssign={setEditorAssign}
          chaptersChosen={chaptersChosen}
          languagesChosen={languagesChosen}
          filterScratch={filterScratch}
          savedFilterIdCurrent={savedFilterIdCurrent}
          filterOptions={filterOptions}
          updateSavedSearch={updateSavedSearch}
          deleteSavedSearch={deleteSavedSearch}
          chooseSavedSearch={chooseSavedSearch}
          clearFilters={clearFilters}
          updateFilterByField={updateFilterByField}
          updateFilterDefaultFlag={updateFilterDefaultFlag}
          modifyOpenCommunity={modifyOpenCommunity}
          removeOpenCommunity={removeOpenCommunity}
          undiscontinueOpenCommunity={undiscontinueOpenCommunity}
          commitOpenCommunityEntry={commitOpenCommunityEntry}
          uncommitOpenCommunityEntry={uncommitOpenCommunityEntry}
          openCommLanguageOptions={openCommLanguageOptions}
          openCommChapterOptions={openCommChapterOptions}
          openCommunityEntry={openCommunityEntry}
          showCommitted={showCommitted}
          showNotifyMe={showNotifyMe}
          isOpenCommunity={isOpenCommunity}
          count={count}
          updatePersonConfig={updatePersonConfig}
          personConfig={personConfig}/>
      <hr className={styles.line}/>

        <AccordionItemBody
          key={indexKey*100}
          className={bodyClassName}
          duration={duration}
          easing={easing}
          maxHeight={maxHeight}
          overflow={overflow}
          ref="body"
          rootTag={bodyTag}
          uuid={this.uuid}
        >
          {children}
        </AccordionItemBody>
      </Root>
    );
  }
}

AccordionItem.defaultProps = {
  rootTag: 'div',
  titleTag: 'h3',
  bodyTag: 'div'
};

AccordionItem.propTypes = {
  bodyClassName: PropTypes.string,
  bodyTag: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledClassName: PropTypes.string,
  duration: PropTypes.number,
  easing: PropTypes.string,
  expanded: PropTypes.bool,
  expandedClassName: PropTypes.string,
  index: PropTypes.number,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onExpand: PropTypes.func,
  rootTag: PropTypes.string,
  slug: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  //onTitleClick: PropTypes.func,  //If I want the titleClick to act like the onClick of the caret on the right, I sent in the text 'SameAsOnClick', which is a string so that it gives an error that a function was required.
  titleClassName: PropTypes.string,
  titleTag: PropTypes.string,
  uuid: PropTypes.string
};
