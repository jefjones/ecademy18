import { useEffect } from 'react';import * as styles from './PreGateView.css'
import Logo from '../../assets/Penspring_medium.png'
import classes from 'classnames'

function PreGateView(props) {
  useEffect(() => {
    
          //window.location = "http://accelaserve.com/penspring";
      
  }, [])

  return (
      <section className={classes(styles.container, (props.personId ? styles.marginTop : ''))}>
          <div className={styles.logo}>
              <img src={Logo} className={styles.logo} alt={`penspring`}/>
          </div>
          <div className={styles.slogan}>
              {`get an edge in word-wise`}&trade
          </div>
      </section>
    )
}
export default PreGateView
