import React from 'react';
import styles from './Error.css';
const p = 'component';
import L from '../../components/PageLanguage';

const NotFound = ({title=<L p={p} t={`Error...`}/>, subtitle, children}) => (
    <section className={styles.container}>
        <header className={styles.header}>
            <h1 className={styles.title}><L p={p} t={`Not Found`}/></h1>
            {subtitle && (
                <h2 className={styles.subtitle}>{subtitle}</h2>
            )}
        </header>
        <div>{children}</div>
    </section>
);



export default NotFound;
