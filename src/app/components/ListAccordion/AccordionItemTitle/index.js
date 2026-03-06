import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.css';
import TextDisplay from '../../TextDisplay';
import Icon from '../../Icon';
import classes from 'classnames';

export default function AccordionItemTitle({
  isImplemented,
  className,
  contactSummary,
  workSummary,
  showDelete,
  setWorkCurrentSelected,
  deleteWork,
  deleteChapter,
  caretClassName,
  uuid,
  onClick,
  onTitleClick,
  onContactClick,
  rootTag: Root,
  title,
	icon,
	iconBigger,
  isCurrentTitle,
  link,
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
  savedFilterIdCurrent, //These filter-related fields are generic for either the workFilter or contactFilter
  filterScratch, //This scratch record is either the initial record with defaults set or the savedSearch that was set as the default to be called up originally.
                //  And then it becomes the scratch record if it is changed so that it is ready to update a currently selected saved search record with the new settings.
  filterOptions,
  updateSavedSearch,
  deleteSavedSearch,
  chooseSavedSearch,
  clearFilters,
  updateFilterByField,
  updateFilterDefaultFlag,
  modifyOpenCommunity,
  removeOpenCommunity,
  commitOpenCommunityEntry,
  uncommitOpenCommunityEntry,
  openCommLanguageOptions,
  openCommChapterOptions,
  nativeLanguageName,
  openCommunityEntry,
  showCommitted,
  showNotifyMe,
  isOpenCommunity,
  count,
  updatePersonConfig,
  personConfig,
}) {
  const style = {
    cursor: 'pointer',
    margin: 0
  };

  if (typeof title === 'object') {
    return React.cloneElement(title, {
      onClick,
      onTitleClick,
      id: `react-safona-item-title-${uuid}`,
      'aria-controls': `react-sanfona-item-body-${uuid}`
    });
  }

  //In the case of the Filter (either the workFilter or the contactFilter)
  //1. When the defaultFlag is chosen in the header (which is only available when a saved search is chosen),
  //    the filter record holds the chosen filterId for the saved search.  So when the defaultFlag checkbox is chosen and the field is updateChapterDueDate
  //    to the scratch filter record, the user doesn't have to click on the update (recycle icon) action to save it.  It will save automatically
  //    in the savedSearch record.  (And the other savedSearchs will be cleared of the defaultFlag in case it was previously chosen in one of them).
  //2. The default record is brought up so that the saved search drop down is filled in with the saved search name and the criteria is filled
  //    in according to that default saved search.
  return (
    <Root aria-controls={`react-sanfona-item-body-${uuid}`}
            className={classes(className, styles.noPointerCursor, styles.containerLeft)} id={`react-safona-item-title-${uuid}`} style={style}>
        <div className={classes(styles.react_sanfona_item_row, styles.marginLessLeft, (isOpenCommunity ? styles.openCommunityBackground : ''))}>
						{filterScratch && <span className={styles.label}>Search criteria</span>}
            {!contactSummary && !filterScratch && !removeOpenCommunity && !commitOpenCommunityEntry && !showCommitted && !isOpenCommunity &&
                <div>
                      <a onClick={onTitleClick === 'ONCLICK' ? onClick : onTitleClick ? onTitleClick : () => {}} className={cx(styles.row, styles.title, className, (workSummary && workSummary.isCurrentWork ? styles.currentTitle : '', isImplemented ? styles.boldBlue : ''))}>
													{icon && <Icon pathName={icon} premium={true} className={iconBigger ? styles.iconBigger : styles.iconBig}/>}
                          {isCurrentTitle
                              ? <TextDisplay label={`Assignment (current)`} text={title} />
                              : title
                          }
                          {count && <span className={styles.editCountFirstNav}>{count ? count : ''}</span>}
                      </a>
                 </div>
            }
            {isOpenCommunity &&
                <a onClick={onTitleClick === 'ONCLICK' ? onClick : onTitleClick ? onTitleClick : () => {}} className={cx(styles.openCommunityTitle, className, isImplemented ? styles.boldBlue : '')}>
                    {isCurrentTitle
                        ? <TextDisplay label={`Document (current)`} text={title} />
                        : title
                    }
                    <span className={styles.editCount}>{count}</span>
                </a>
            }
            <a onClick={onClick} className={styles.clickableArea}>
                <div className={caretClassName}/>
            </a>
        </div>
    </Root>
  );
}

AccordionItemTitle.defaultProps = {
  rootTag: 'h3'
};

AccordionItemTitle.propTypes = {
  className: PropTypes.string,
  caretClassName: PropTypes.string,
  onClick: PropTypes.func,
  //onTitleClick: PropTypes.func,  //We send in a switch "ONCLICK" if we want the on title click to have the same affect as clicking on the caret.
  rootTag: PropTypes.string,
  link: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  uuid: PropTypes.string
};
