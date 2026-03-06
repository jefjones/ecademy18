import React from 'react';
import onefJef from '../../assets/onefJef_small_only_white.png';
import eCademy from '../../assets/logos/eCADEMYapp_LOGO_horizontal_footer.png';
import styles from './OneFJefFooter.css';
const p = 'component';
import L from '../../components/PageLanguage';

export default () => (
    <div className={styles.sideNote}>
        <div className={styles.row}>
            &copy; 2010 - 2021
						<a href={'https://www.one-fJef.com'}>
								<img src={onefJef} className={styles.logo} alt={`one-f Jef`}/>
						</a>
						<L p={p} t={`All rights reserved.`}/>
        </div>
        <div>
            <L p={p} t={`For help or feature requests, email `}/>
            <a className={styles.link} href="mailto:support@ecademy.app" data-rel="external">support@ecademy.app</a>
        </div>
			<div className={styles.reallySmall}>
            <L p={p} t={`one-f Jef is also known as Jef with one f.  Why?  Because how many f's does it take to make the f sound?`}/>
        </div>
				<img src={eCademy} alt={`eCademyApp`} />

    </div>
);
