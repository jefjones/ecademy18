import * as styles from './OneFJefFooterPenspring.css'
import PenspringLogo from '../../assets/penspring_medium.png'
import Slogan from '../../assets/Get an edge in word-wise_22.png'

export default () => (
    <div className={styles.sideNote}>
        <div className={styles.row}>
            &copy; {'2010 - 2020 one-f Jef, Inc.  All rights reserved.'}
            <img src={PenspringLogo} className={styles.logo} alt={`penspring`}/>
        </div>
        <div>
            <img src={Slogan} className={styles.logo} alt={`get an edge in word-wise`}/>
        </div>
        <div>
            {`How do you want us to make it work for you?  Email us: `}
            <a className={styles.link} href="mailto:Jef@penspring.com" data-rel="external">Jef@penspring.com</a>
        </div>
    </div>
)
