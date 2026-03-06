import React, {Component} from 'react';
import styles from './StandardDisplay.css';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../MessageModal';
import classes from 'classnames';
const p = 'component';
import L from '../../components/PageLanguage';

export default class StandardDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
				isShowingModal: false,
		}
	}

	handleDisplayOpen = (standard) => this.setState({ isShowingModal: true, description: standard.code + ' - ' + standard.name })
	handleDisplayClose = () => this.setState({ isShowingModal: false })

	render() {
			const {standards=[]} = this.props;
			const {description, isShowingModal } = this.state;

	    return (
					<div className={styles.container}>
							<hr/>
							{standards.map((s, i) =>
									<div key={i} className={classes(styles.text, (s.name && s.name.length > 100 ? globalStyles.link : ''))}
													onClick={s.name && s.name.length > 100 ? () => this.handleDisplayOpen(s) : () => {}}>
											{s.name && s.name.length > 100
													? s.code + ' - ' + s.name.substring(0, 100) + '...'
													: s.code + ' - ' + s.name
											}
									</div>
							)}
							<hr/>
							{isShowingModal &&
	                <MessageModal handleClose={this.handleDisplayClose} heading={<L p={p} t={`Standard Code and Name`}/>}
	                   explain={description} onClick={this.handleDisplayClose}/>
	            }
					</div>
	    )
	}
};
