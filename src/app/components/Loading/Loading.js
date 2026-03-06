import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './Loading.css';
import classes from 'classnames';
import ButtonWithIcon from '../ButtonWithIcon';
const p = 'component';
import L from '../../components/PageLanguage';

export default class extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: '',
            indicator: '...',
            timerId: null,
            styleIndex: 0,
            styleArray: [styles.first, styles.second, styles.third, styles.fourth],
            direction: 'increasing',
						indexCount: 0,
        };

        this.showProgress = this.showProgress.bind(this);
    }

    componentDidMount() {
        this.setState({ timerId: setInterval(() => this.showProgress(), 1000) });
    }

    componentDidUpdate() {
        !this.props.isLoading && clearInterval(this.state.timerId);
    }

    componentWillUnmount() {
        clearInterval(this.state.timerId);
    }

    showProgress() {
        const {styleIndex, direction, styleArray, indexCount} = this.state;
        let nextIndex = styleIndex;
        nextIndex = direction === 'increasing' ? ++nextIndex : --nextIndex;
        if (nextIndex >= styleArray.length) {
            this.setState({ direction: 'decreasing', styleIndex: styleArray.length });
        } else if (nextIndex <= 0) {
            this.setState({ direction: 'increasing', styleIndex: 0 });
        } else {
            this.setState({ styleIndex: nextIndex });
        }
        this.setState({ indicator: this.state.indicator + '.', indexCount: indexCount + 1})
        if (styleArray && styleArray.length > 0 && styleIndex >= 0 && styleIndex <= styleArray.length && styleArray[styleIndex]) {
            if (this.loadingThing) this.loadingThing.className = styleArray[styleIndex];
				}
				// if (indexCount > 80) {
				// 		this.setState({ refreshMessage: true, timerId: '', indexCount: 0 })
				// 		clearInterval(this.state.timerId)
				// }
    }

    render() {
        const {isLoading, loadingText='Loading', className, refreshTo} = this.props;
        const {error, indicator, refreshMessage} = this.state;

        return (
            <div>
                {isLoading
										? refreshMessage
												? <div className={classes(styles.container, styles.label, className)}>
			                        <div className={styles.blue}><L p={p} t={`It's taking too long!`}/></div>
															<ButtonWithIcon icon={'sync'} label={<L p={p} t={`Refresh`}/>} onClick={refreshTo ? browserHistory.push(refreshTo) : () => browserHistory.goBack()} />
			                    </div>
												: <div className={classes(styles.container, styles.label, className)}>
			                        {error && <L p={p} t={`An Error Occurred`}/>}
			                        <span ref={ref => {this.loadingThing = ref}}>{loadingText} </span>
			                        <span>{indicator}</span>
			                    </div>
										: ''
                }
            </div>
				);
    }
}
