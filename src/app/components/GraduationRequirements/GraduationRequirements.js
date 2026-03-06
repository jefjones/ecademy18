import React, {Component} from 'react';  //PropTypes
import styles from './GraduationRequirements.css';
import MessageModal from '../../components/MessageModal';
import Icon from '../../components/Icon';
import Slider from 'rc-slider';
import { withAlert } from 'react-alert';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

class GraduationRequirements extends Component {
		constructor(props) {
				super(props);

				this.state = {
						isShowingModal_note: false,
						courseName: '',
						notes: '',
				}
		}

		handleNoteOpen = (courseName, notes) => this.setState({isShowingModal_note: true, courseName, notes })
    handleNoteClose = () => this.setState({isShowingModal_note: false, courseName: '', notes: '' })

    render() {
				const {emptyMessage, requirements, setContentAreaFilter} = this.props;
        const {isShowingModal_note, courseName, notes } = this.state;

        return (
            <div className={styles.container}>
								<table className={styles.tableClass}>
										<tbody>
												<tr>
														<th className={styles.header}><L p={p} t={`Requirement`}/></th>
														<th><div className={styles.headerNoLine}><L p={p} t={`Credits`}/></div><div className={styles.header}><L p={p} t={`required`}/></div></th>
														<th><div className={styles.headerNoLine}><L p={p} t={`Credits earned`}/><br/><u><L p={p} t={`or in progress`}/></u></div></th>
														<th><div className={styles.headerNoLine}><L p={p} t={`Scheduled for`}/></div><div className={styles.header}>{'2020-2021'}</div></th>
														<th><div className={styles.headerNoLine}><L p={p} t={`Remaining`}/></div><div className={styles.header}><L p={p} t={`required`}/></div></th>
												</tr>
												{requirements && requirements.length > 0 && requirements.map((m, i) => {
														let percentComplete = !m.creditsRequired ? 0 : Math.round((m.creditsEarnedOrInProgress || 0)/m.creditsRequired*100);
														return (
																<tr key={i}>
																		<td className={classes(styles.row, styles.cell)}>
																				{m.learningPathwayId
																						? <div className={styles.link} onClick={() => setContentAreaFilter(m.learningPathwayId)}>
																									{m.courseName}
																							</div>
																						: m.courseName
																				}
																				{m.notes &&
																						<div className={styles.link} onClick={() => this.handleNoteOpen(m.courseName, m.notes)}>
																								<Icon pathName={'info'} className={styles.iconSmall} />
																						</div>
																				}
																		</td>
																		<td className={styles.cellCentered}>{m.creditsRequired}</td>
																		<td className={styles.cellCentered}>
																				{!m.creditsEarnedOrInProgress || m.creditsEarnedOrInProgress === 0 ? '' : m.creditsEarnedOrInProgress}
																		</td>
																		<td className={styles.cellCentered}>{!m.scheduledForNextYear || m.scheduledForNextYear === 0 ? '' : m.scheduledForNextYear}</td>
																		<td className={styles.cellCentered}>{m.creditsRequired - m.creditsEarnedOrInProgress - m.scheduledForNextYear <= 0
																						? ''
																						: m.creditsRequired - m.creditsEarnedOrInProgress - m.scheduledForNextYear
																				}
																		</td>
																		<td className={styles.sliderCell}>
																				<div className={styles.sliderLine}>
																						<div className={styles.text}>{`${percentComplete}%`}</div>
																						<div className={styles.sliderWidth}>
																								<Slider step={5} disabled={true} value={percentComplete}/>
																						</div>
																				</div>
																		</td>
																</tr>
														)
												})}
												{(!requirements || requirements.length === 0) &&
													<tr>
															<td className={styles.cell}>{emptyMessage}</td>
													</tr>
												}
										</tbody>
								</table>
								{isShowingModal_note &&
		                <MessageModal handleClose={this.handleNoteClose} heading={courseName}
		                   explain={notes} onClick={this.handleNoteClose} />
		            }
            </div>
        )
    }
}

export default withAlert(GraduationRequirements);
