
import * as styles from './RegInstructionsView.css'
const p = 'RegInstructionsView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function RegInstructionsView(props) {
  return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                <L p={p} t={`Registration Instructions`}/>
            </div>
						<div className={styles.red}>
								<L p={p} t={`Important: Please verify that you are logged in as a parent and not as your child.`}/>
						</div>
						<div className={styles.instructions}>
								<L p={p} t={`As part of the registration process, an account will be created for your child linking your child's account to each guardian included in the registration. Login information will be sent to students (and other guardians) prior to the start of classes.`}/>
						</div>
						<div className={styles.instructions}>
								<L p={p} t={`Please contact the office if you have any questions.`}/>
						</div>
            <OneFJefFooter />
      </div>
    )
}


// <div className={styles.instructions}>
// 		{`During the registration process, you will enroll students individually. If you were enrolled the previous year, the enrollment wizard should retrieve your child's information and pre-populate it. Please verify all information and ensure that each child is enrolled correctly. `}
// </div>
// <div className={styles.instructions}>
// 		{`After enrolling the children, you will add parents/guardians. You may add all those that you would like to take part in the schooling of your child.`}
// </div>
export default RegInstructionsView
