import React from 'react';
import {Component} from 'react'
import styles from './PreGateView.css';
import Logo from '../../assets/Penspring_medium.png';
import classes from 'classnames';

export default class PreGateView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
      //window.location = "http://accelaserve.com/penspring";
  }

  render() {
    return (
      <section className={classes(styles.container, (this.props.personId ? styles.marginTop : ''))}>
          <div className={styles.logo}>
              <img src={Logo} className={styles.logo} alt={`penspring`}/>
          </div>
          <div className={styles.slogan}>
              {`get an edge in word-wise`}&trade;
          </div>
      </section>
    );
  }
}
