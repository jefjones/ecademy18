
import { useNavigate } from 'react-router-dom'
import styles from './LunchReducedInstructionsView.css'
const p = 'LunchReducedInstructionsView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'

import classes from 'classnames'

function LunchReducedInstructionsView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  return (
        <div className={styles.container}>
            <div className={classes(globalStyles.pageTitle, styles.moreBottom)}>
                <L p={p} t={`Reduced Lunch Instructions`}/>
            </div>
            <div className={styles.subHeading}>There are a few things you should know.</div>
						<div className={classes(globalStyles.instructionsBig, styles.littleTop)}>
								{`If you received a letter from the school saying that your children were automatically approved (directly certified) for free meals for the 2020–2021
                    school year because someone in your household participates in Supplemental Nutrition Assistance Program (SNAP), Temporary Assistance for Needy Families (TANF),
                    or Food Distribution Program on Indian Reservations (FDPIR) then you do not need to submit an application.`}
						</div>
						<div className={classes(globalStyles.instructionsBig, styles.littleTop)}>
								{`We need only one application for all the children in your household that attend this school.`}
						</div>
            <div className={classes(styles.subHeading, styles.moreTop)}>Eligibility for free or reduced price school meal benefits is based on any one of these three things:</div>
						<div className={classes(globalStyles.instructionsBig, styles.littleTop)}>
								{`Your total household income and size in the month the application is filled out, or the month before, or`}
						</div>
            <div className={classes(globalStyles.instructionsBig, styles.littleTop)}>
								{`Your child’s individual status as foster, homeless, migrant or runaway, or`}
						</div>
            <div className={classes(globalStyles.instructionsBig, styles.littleTop)}>
								{`Participation in an assistance program by any member of your household.`}
						</div>
            <hr/>
            <div className={classes(globalStyles.instructionsBig, styles.littleTop)}>
								{`Your US citizenship or immigration status does not affect your eligibility for free and reduced price benefits.`}
						</div>
            <div className={classes(globalStyles.centered, styles.moreTop, styles.row)}>
                <ButtonWithIcon label={'Close'} icon={'checkmark_circle'} onClick={() => navigate(`/firstNav`)}/>
                <ButtonWithIcon label={'Next >'} icon={'checkmark_circle'} onClick={() => navigate(`/lunchReducedApply`)}/>
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
export default LunchReducedInstructionsView
