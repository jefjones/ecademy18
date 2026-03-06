import React, {Component} from 'react';
import styles from './GradingRatingLegend.css';
import globalStyles from '../../utils/globalStyles.css';
import StandardsRatingColor from '../StandardsRatingColor';
import MessageModal from '../MessageModal';
import Icon from '../Icon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class GradingRatingLegend extends Component {
    constructor(props) {
        super(props);

        this.state = {
				}
		}

		handleOpen = () => {
				const { standardsRatings=[], standardsRatingTableId, gradingType } = this.props; //passFailRatings=[],

        let isLevelOnly = standardsRatings && standardsRatings.length > 0 && standardsRatings[0].isLevelOnly;

				let ratingLabel = gradingType === 'STANDARDSRATING'
						? ''
						: ['N', 'P', 'F']

				let localStandardsRatings = standardsRatings && standardsRatings.length > 0 && standardsRatings.filter(m => m.standardsRatingTableId === standardsRatingTableId);

				let showJSX = gradingType === 'STANDARDSRATING'
						? <div>
									{localStandardsRatings && localStandardsRatings.length > 0 && localStandardsRatings.map((m, i) =>
											<div className={styles.moreBottom} key={i}>
													<StandardsRatingColor keyIndex={i} label={isLevelOnly ? m.levelAbbrev : m.score} color={m.color} description={m.description} name={m.name} showName={true}/>
											</div>
									)}
							</div>
					 :	<div className={styles.row}>
								<button type={'button'} className={classes(globalStyles[`colorPassFail${0}`], styles.button)}>
										<div className={classes(styles.buttonText, (ratingLabel[0] === 'i' ? styles.littleLeft : ''))}>{ratingLabel[0]}</div>
								</button>
								<div className={styles.text}>Not started</div>
								<button type={'button'} className={classes(globalStyles[`colorPassFail${3}`], styles.button)}>
										<div className={classes(styles.buttonText, (ratingLabel[3] === 'i' ? styles.littleLeft : ''))}>{ratingLabel[1]}</div>
								</button>
								<div className={styles.text}>Pass</div>
								<button type={'button'} className={classes(globalStyles[`colorPassFail${4}`], styles.button)}>
										<div className={classes(styles.buttonText, (ratingLabel[2] === 'i' ? styles.littleLeft : ''))}>{ratingLabel[2]}</div>
								</button>
								<div className={styles.text}>Fail</div>
						</div>

				this.setState({ showJSX, isShowingModal: true });
		}
		handleClose = () => this.setState({ isShowingModal: false, showJSX: '' });

		render() {
				const {gradingType} = this.props;
				const {isShowingModal, showJSX} = this.state;

		    return (
		        <div className={classes(styles.container, styles.row)} onClick={this.handleOpen}>
										<Icon pathName={'document0'} premium={true} className={styles.icon} />
										<div className={classes(globalStyles.link, styles.littleTop)}><L p={p} t={`Show the standards grading legend`}/></div>
								{isShowingModal &&
										<MessageModal handleClose={this.handleClose} heading={gradingType === 'STANDARDSRATING' ? <L p={p} t={`Standards Based Rating`}/> : <L p={p} t={`Pass or Fail Rating`}/>}
											 explainJSX={showJSX} onClick={this.handleClose} />
								}
		        </div>
		    )
	  }
};
