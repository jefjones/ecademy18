import React, {Component} from 'react';
import styles from './GradRequirementAccordion.css';
import globalStyles from '../../utils/globalStyles.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import GraduationRequirements from '../../components/GraduationRequirements';
import Slider from 'rc-slider';
import Icon from '../Icon';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {
  constructor ( props ) {
      super( props );

      this.state = {
      }
  }

	handleModalOpen = () => this.setState({ isShowingModal: true });
	handleModalClose = () => this.setState({ isShowingModal: false });

	handleExpansionChange = panel => (event) => this.setState({ expanded: !this.state.expanded, isOpen: !this.state.isOpen })

  render() {
		const {personId, gradRequirements } = this.props;
    const {expanded} = this.state;

		let requiredTotal = 0;
		let completedOrInProgress = 0;
		gradRequirements && gradRequirements.length > 0 && gradRequirements.forEach(m => {
				requiredTotal += m.creditsRequired;
				completedOrInProgress += m.creditsEarnedOrInProgress;
		});
		let percentComplete = !requiredTotal ? 0 : Math.round(completedOrInProgress/requiredTotal*100);

    return (
        <div className={styles.container}>
						<ExpansionPanel expanded={expanded} onClick={this.handleExpansionChange}>
								<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={styles.flipped}/>}>
										<div className={classes(styles.row, styles.graduationHeader)}>
												<Icon pathName={'graduation_hat'} className={styles.iconHigher} premium={true}/>
												<span className={styles.header}><L p={p} t={`Graduation Status`}/></span>
												<Slider step={5} disabled={true} value={percentComplete} marks={{[percentComplete]: `${percentComplete}%` }}/>
                        <div className={classes(globalStyles.link, styles.showDetails)}><L p={p} t={`Show details`}/></div>
										</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
										<GraduationRequirements  personId={personId} requirements={gradRequirements} setContentAreaFilter={this.setContentAreaFilter}
												emptyMessage={<L p={p} t={`No graduation requirements found`}/>} handleExpansionChange={this.handleExpansionChange} expanded={expanded}/>
								</ExpansionPanelDetails>
						</ExpansionPanel>
        </div>
    )
}};
