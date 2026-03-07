import { useEffect, useState } from 'react'
import * as styles from './WorkSummary.css'
import classes from 'classnames'
import DateMoment from '../DateMoment'
import WorkTools from '../../components/WorkTools'
import TextDisplay from '../../components/TextDisplay'
import DateTimePicker from '../../components/DateTimePicker'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import CommentTextareaModal from '../../components/CommentTextareaModal'
import Icon from '../../components/Icon'
import numberFormat from '../../utils/numberFormat'
const p = 'component'
import L from '../../components/PageLanguage'

function WorkSummary(props) {
  const [caretClassName, setCaretClassName] = useState(classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown))
  const [expanded, setExpanded] = useState(props.expanded ? true : false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [dueDate, setDueDate] = useState(baseDueDate)

  useEffect(() => {
    
        const {summary} = props
        let baseDueDate = summary.chapterDueDate
        if (baseDueDate && baseDueDate.indexOf('T') > -1) {
            baseDueDate = baseDueDate.substring(0, baseDueDate.indexOf('T'))
        }
        setDueDate(baseDueDate)
    
  }, [])

  const {summary, showTitle=true, setWorkCurrentSelected, personId, deleteWork, selectListClass, onChangeSequence, deleteChapter,
  		        isHeaderDisplay=false, hideCaret=false, updateChapterDueDate, showSequence, indexName, updateChapterComment, group,
  		        showDelete=false, chapterId, updatePersonConfig, personConfig, headerTitleOnly=false} = props; ///Chapter Id is only sent in from the workSections page where there is a list of chatpers, otherwise the chapterId sent with setWorkCurrentSelected is the current chapterId
  		
  
  		let chapterOptions = Object.assign([], summary.chapterOptions)
  		chapterOptions = chapterOptions && chapterOptions.length > 0 && chapterOptions.map(m => {
  		    m.label = m.label && m.label.length > 35 ? m.label.substring(0,35) + '...' : m.label
  		    return m
  		})
  
  		return !summary ? null : (
  		    <div className={styles.container}>
  						{headerTitleOnly &&
  								<div className={classes(styles.titleBold, (summary.isCurrentWork ? styles.titleCurrentWork : ''))} id={"title"}>
  										{summary.workName}
  								</div>
  						}
  		        <table className={styles.tableDisplay}>
  		          <tbody>
  		            {isHeaderDisplay && showTitle &&
  		                <tr>
  		                    <td colSpan={4} className={classes(summary.isCurrentWork ? styles.whiteBack : '')}>
  		                        <div className={hideCaret ? styles.rowLeft : styles.row}>
  		                            <div className={classes(styles.rowLeft, styles.linkStyle, styles.goldColor)} onClick={() => setWorkCurrentSelected(personId, summary.workId, chapterId ? chapterId : summary.chapterId_current, summary.languageId_current, `/editReview/${summary.workId}`)}>
  		                                {showTitle && summary.isCurrentWork
  		                                    ? <TextDisplay label={<L p={p} t={`Document (current)`}/>} text={summary.workName} />
  		                                    :  <div className={classes(styles.title, (summary.isCurrentWork ? styles.titleCurrentWork : ''))} id={"title"}>
  		                                          {summary.workName}
  		                                        </div>
  		                                }
  		                            </div>
  		                            {!hideCaret &&
  		                                <a onClick={handleToggle}>
  		                                    <div className={caretClassName}/>
  		                                </a>
  		                            }
  		                        </div>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`author`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.author}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {setWorkCurrentSelected &&
  		                <tr>
  		                    <td colSpan={4}>
  		                        <WorkTools personId={personId} workSummary={summary} group={group} showDelete={showDelete}
  		                            setWorkCurrentSelected={setWorkCurrentSelected} deleteWork={deleteWork} chapterId={chapterId}
  		                            isOwner={personId === summary.authorPersonId} className={styles.workTools}
  		                            hasMultSections={summary.sectionCount > 1} deleteChapter={deleteChapter}
  		                            updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) && summary.chapterOptions && summary.chapterOptions.length > 1 &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`sections/chapters`}/></span>
  		                    </td>
  		                    <td colSpan={3} className={styles.text}>
  		                        <div>
  		                            <SelectSingleDropDown
  		                                id={`chapters`}
  		                                indexName={indexName}
  		                                label={``}
  		                                value={summary.chapterId_current}
  		                                options={chapterOptions}
  		                                noBlank={true}
  		                                error={''}
  		                                height={`medium`}
  		                                selectClass={selectListClass}
  		                                onChange={onChangeSection} />
  		                        </div>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        {summary.groupName && <span className={styles.label}><L p={p} t={`group`}/></span>}
  		                    </td>
  		                    <td className={classes(styles.text, styles.bold)}>
  		                        {summary.groupName && <span className={styles.text}>{summary.groupName}</span>}
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`words`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{numberFormat(summary.wordCount)}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`sentences`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{numberFormat(summary.sentenceCount)}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) && !summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.dueDateLabel}><L p={p} t={`due date`}/></span>
  		                    </td>
  		                    <td colSpan={3} className={styles.dateRow}>
  		                        {summary.authorPersonId === personId && updateChapterDueDate &&
  		                            <DateTimePicker value={dueDate || ''} onChange={handleDueDateChange}/>
  		                        }
  		                        {(!updateChapterDueDate || summary.authorPersonId !== personId) &&
  		                            <DateMoment date={dueDate} format={`D MMM YYYY`} className={styles.text} />
  		                        }
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`editors`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.editorsCount}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`edits pending`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{numberFormat(summary.editsPending)}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`edits processed`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{numberFormat(summary.editsProcessed)}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td colSpan={2} className={styles.label}>
  		                        {showSequence && summary.sectionCount > 1 &&
  		                            <div className={styles.sequenceList}>
  		                                <span className={styles.label}><L p={p} t={`sequence`}/></span>
  		                                {summary.authorPersonId === personId && onChangeSequence &&
  		                                    <div>
  		                                        <SelectSingleDropDown
  		                                            id={`chapterSequence`}
  		                                            label={``}
  		                                            indexName={indexName}
  		                                            value={summary.chapterNbr}
  		                                            options={summary.sequenceOptions}
  		                                            noBlank={true}
  		                                            error={''}
  		                                            height={`mini`}
  		                                            selectClass={selectListClass}
  		                                            onChange={onChangeSequence} />
  		                                    </div>
  		                                }
  		                                {(summary.authorPersonId !== personId || !onChangeSequence) &&
  		                                    <span className={styles.text}>{summary.chapterNbr_current}</span>
  		                                }
  		                            </div>
  		                        }
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`native language`}/></span>
  		                    </td>
  		                    <td>
  		                        <span className={styles.text}>{summary.nativeLanguageName}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`translate languages`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.languagesCount}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.languageOptions && summary.languageOptions.length > 0 &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`document languages`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <div>
  		                            <SelectSingleDropDown
  		                                id={`translateLanguages`}
  		                                label={``}
  		                                value={summary.languageId_current}
  		                                options={summary.languageOptions}
  		                                noBlank={true}
  		                                error={''}
  		                                height={`medium`}
  		                                selectClass={selectListClass}
  		                                onChange={onChangeLanguage}/>
  		                        </div>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`status`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.workStatusName}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`edit intensity`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.editSeverityName}</span>
  		                    </td>
  		                    {summary.authorPersonId === personId &&
  		                        <td rowSpan={2} className={styles.pencil}>
  		                            <a onClick={() => {handleCollapse(); setWorkCurrentSelected(personId, summary.workId, chapterId ? chapterId : summary.chapterId_current, summary.languageId_current, `/addOrUpdateChapter/${summary.chapterId_current}`); }}>
  		                                <Icon pathName={`pencil`}/>
  		                            </a>
  		                        </td>
  		                    }
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td className={classes(styles.label, styles.verticalAlignTop)}>
  		                        <span className={styles.label}><L p={p} t={`comments`}/></span>
  		                    </td>
  		                    <td colSpan={3}>
  		                        <span className={classes(styles.text, styles.commentText)}>
  		                            {summary.authorComment && summary.authorComment.comment && summary.authorComment.comment.length > 100
  		                                ? summary.authorComment && summary.authorComment.comment.substring(0,100) + '...' + <span className={styles.readMore} onClick={handleCommentOpen}><L p={p} t={`more`}/></span>
  		                                : summary.authorComment && summary.authorComment.comment
  		                            }
  		                            {summary.editorComments && summary.editorComments.length > 0
  		                                && <span className={styles.readMore} onClick={handleCommentOpen}>
  		                                    <div>{`(+${summary.editorComments.length}`}</div>
  		                                    {summary.editorComments.length === 1 ? <div><div>{` `}</div><L p={p} t={`comment`}/><div>)</div></div> : <div><div>{` `}</div><L p={p} t={`comments`}/><div>)</div></div>}</span>
  		                            }
  		                            {!updateChapterComment &&
  		                                <span className={styles.readMore} onClick={handleCommentOpen}><L p={p} t={`Add comment`}/></span>
  		                            }
  		                        </span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td colSpan={4}>
  		                        <span className={styles.openCommunitylabel}><L p={p} t={`Open Community`}/></span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`native language`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.nativeLanguageName}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`edit native language`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.editNativeLanguage ? 'YES' : 'NO'}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`allow quantity of editors`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.openCommEditorsCount}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`translate languages`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <div>
  		                            <SelectSingleDropDown
  		                                id={`translateLanguages`}
  		                                label={``}
  		                                value={0}
  		                                options={summary.openCommTranslateLanguageOptions}
  		                                noBlank={true}
  		                                error={''}
  		                                height={`medium`}
  		                                selectClass={selectListClass}
  		                                onChange={() => {}}/>
  		                        </div>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`committed editors`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <span className={styles.text}>{summary.openCommCommittedCount}</span>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`genres`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <div>
  		                            <SelectSingleDropDown
  		                                id={`genres`}
  		                                label={``}
  		                                value={0}
  		                                options={summary.openCommGenreOptions}
  		                                noBlank={true}
  		                                error={''}
  		                                height={`medium`}
  		                                selectClass={selectListClass}
  		                                onChange={() => {}}/>
  		                        </div>
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.dueDateLabel}><L p={p} t={`due date`}/></span>
  		                    </td>
  		                    <td colSpan={3} className={styles.dateRow}>
  		                        <DateMoment date={summary.openCommDueDate} format={`D MMM YYYY`} className={styles.text} />
  		                    </td>
  		                </tr>
  		            }
  		            {!isHeaderDisplay && summary.openCommunityEntryId &&
  		                <tr>
  		                    <td className={styles.label}>
  		                        <span className={styles.label}><L p={p} t={`edit intensity`}/></span>
  		                    </td>
  		                    <td className={styles.text}>
  		                        <div>
  		                            <SelectSingleDropDown
  		                                id={`editSeverities`}
  		                                label={``}
  		                                value={summary.editSeverityId}
  		                                options={summary.openCommEditSeverityOptions}
  		                                noBlank={true}
  		                                error={''}
  		                                height={`medium`}
  		                                selectClass={selectListClass}
  		                                onChange={() => {}} />
  		                        </div>
  		                    </td>
  		                </tr>
  		            }
  		            {(!isHeaderDisplay || expanded) &&
  		                <tr>
  		                    <td colSpan={4} className={styles.lastLine}>
  		                        <hr />
  		                    </td>
  		                </tr>
  		            }
  		            </tbody>
  		            </table>
  		            {isShowingModal &&
  		                <CommentTextareaModal handleClose={handleCommentClose} heading={<L p={p} t={`Author and Editor Comments`}/>} explain={``} placeholder={<L p={p} t={`Comment?`}/>}
  		                    onClick={handleCommentSave} editorComments={summary.editorComments} authorComment={summary.authorComment}
  		                    personId={personId} onDelete={() => handleCommentDelete(props)}/>
  		            }
  		        </div>
  		    )
}
export default WorkSummary
