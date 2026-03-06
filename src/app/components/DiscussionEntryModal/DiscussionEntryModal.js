import React, {Component} from 'react';
import styles from './DiscussionEntryModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import TextDisplay from '../TextDisplay';
import InputText from '../InputText';
import Icon from '../Icon';
import DateMoment from '../../components/DateMoment';
import ButtonWithIcon from '../../components/ButtonWithIcon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class DiscussionEntryModal extends Component {
  constructor(props) {
      super(props);

      this.state = {
          file: {},
          isSubmitted: false,
          isFileChosen: false,
          openFileAttach: false,
          entry: props.discussionEntry,
          errors: {
						discussionEntryId: '',
            subject: '',
            comment: '',
          }
      }
  }

  toggleFileAttach = () => this.setState({ openFileAttach: !this.state.openFileAttach });

  changeItem = ({target}) => {
      this.setState({ entry: {...this.state.entry, [target.name]: target.value} });
  }

  processForm = () => {
      const {handleSubmit, handleClose, isReply}  = this.props;
      const {entry} = this.state;
      let hasError = false;
      if (!isReply && !entry.subject) {
          hasError = true;
          this.setState({ errors: { ...this.state.errors, subject: <L p={p} t={`A subject is required`}/>}});
      }
			if (!entry.comment) {
          hasError = true;
          this.setState({ errors: { ...this.state.errors, comment: <L p={p} t={`A comment is required`}/>}});
      }
      if (!hasError) {
					//entry.replyToDiscussionEntryId = entry.replyToDiscussionEntryId ? entry.replyToDiscussionEntryId : discussionEntryId;
          handleSubmit(entry);
          handleClose();
      }
  }

  render() {
      const {handleClose, isReply, className, courseName, discussionEntry } = this.props;
      const {errors, openFileAttach, entry } = this.state;

      return (
          <div className={classes(styles.container, className)}>
              <ModalContainer onClose={handleClose}>
                  <ModalDialog onClose={handleClose}>
                      <div className={styles.center}>
                          <div className={styles.heading}>
															{discussionEntry && discussionEntry.discussionEntryId ? <L p={p} t={`Reply to Entry`}/> : <L p={p} t={`Add or Edit Entry`}/>}
													</div>
                          <div className={styles.moreTop}>
                              <TextDisplay label={<L p={p} t={`Course`}/>} text={courseName} />
                          </div>
                      </div>
											{discussionEntry && discussionEntry.discussionEntryId &&
													<div>
															<div className={styles.rowWrap}>
																	<TextDisplay label={<L p={p} t={`Entered by`}/>} text={discussionEntry.entryPersonFirstName + ' ' + discussionEntry.entryPersonLastName} textClassName={styles.lighter}/>
																	<TextDisplay label={<L p={p} t={`Entered on`}/>} text={<div className={styles.row}><DateMoment date={discussionEntry.entryDate} format={'D MMM  h:mm a'} minusHours={6}/></div>} textClassName={styles.lighter}/>
															</div>
															<div className={styles.comment}>{discussionEntry.comment}</div>
													</div>
											}
                      <ul className={styles.unorderedList}>
                          {!isReply &&
															<li>
		                              <InputText
		                                  id={`subject`}
		                                  name={`subject`}
		                                  size={"medium-long"}
		                                  label={<L p={p} t={`Subject`}/>}
		                                  value={entry.subject || ''}
		                                  onChange={this.changeItem}
		                                  error={errors.subject}/>
		                          </li>
													}
													<li>
															<span className={styles.inputText}>{<L p={p} t={`Comment`}/>}</span><br/>
															<textarea rows={5} cols={45}
																			id={`comment`}
																			name={`comment`}
																			defaultValue={entry.comment}
																			onChange={this.changeItem}
																			className={styles.commentTextarea}>
															</textarea><br />
															<span className={styles.error}>{errors.comment}</span>
													</li>
                          <li>
                              <div className={styles.row}>
                                  <a onClick={this.toggleFileAttach} className={classes(styles.fileAttach, styles.row)}>
                                      <Icon pathName={'upload'} premium={true} className={styles.icon}/>
                                      <span className={styles.labelUpload}><L p={p} t={`Upload a file?`}/></span>
                                  </a>
                                  <a onClick={this.toggleFileAttach} className={classes(styles.fileAttach, styles.row)}>
                                      <Icon pathName={'link2'} premium={true} className={styles.icon}/>
                                      <span className={styles.labelUpload}><L p={p} t={`Add a website link?`}/></span>
                                  </a>
                              </div>
                          </li>
                          {(openFileAttach) &&
                            <li>
                                <div className={styles.explanation}>
                                    <L p={p} t={`After you submit this record, you will be returned to the class discussion.  In every entry that belongs to you, there are an 'add file' and 'add link' option in order to upload one or more files or to enter one or more links per entry.`}/>
                                </div>
                            </li>
                          }
                          <li>
                              <div className={classes(styles.dialogButtons, styles.row, styles.centered)}>
																	<a className={styles.cancelLink} onClick={handleClose}><L p={p} t={`Close`}/></a>
																	<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
                              </div>
                          </li>
                      </ul>
                  </ModalDialog>
              </ModalContainer>
          </div>
      )
    }
}
