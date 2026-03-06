import { useState } from 'react'
import { navigate, navigateReplace, goBack } from './'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './PasswordResetAdminView.css'
import InputText from '../../components/InputText'
import InputDataList from '../../components/InputDataList'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function PasswordResetAdminView(props) {
  const [errors, setErrors] = useState({})
  const [userPersonId, setUserPersonId] = useState('')
  const [clave, setClave] = useState(target.value)

  const {personId, users, myFrequentPlaces, setMyFrequentPlace} = props
          
  
          return (
              <section className={styles.container}>
  								<form>
  										<div className={classes(globalStyles.pageTitle, styles.width)}>
  					              <L p={p} t={`Reset Password (Admin)`}/>
  					          </div>
                      <div className={classes(globalStyles.instructionsBigger, styles.maxwidth)}>
                          <L p={p} t={`The admin can set the password for students, parent/guardians, and teachers.`}/>
                      </div>
                      <div className={classes(globalStyles.instructionsBigger, styles.maxwidth)}>
                          <L p={p} t={`If the user has had trouble requesting to reset their password but they are not receiving email notifications, you can communicate their new password to them.`}/>
                      </div>
                      <div className={classes(globalStyles.instructionsBigger, styles.maxwidth)}>
                          <L p={p} t={`When the user logs in for the first time with this new password, they will be redirected to set a personal, private password for themselves.`}/>
                      </div>
                      <div className={styles.moreTop}>
                          <InputDataList
                              id={`userPersonId`}
                              label={<L p={p} t={`User`}/>}
                              value={chosenPerson || {}}
                              options={users}
                              className={styles.moreBottomMargin}
                              height={`medium`}
                              onChange={changePerson}
                              required={true}
                              whenFilled={chosenPerson}
                              error={errors.userPersonId}/>
                      </div>
  										<div>
  		                    <InputText
  														label={<L p={p} t={`New Password`}/>}
  		                        size={"medium-long"}
  		                        value={clave || ''}
  		                        id={"clave"}
  		                        name={"clave"}
  		                        onChange={changePassword}
  		                        onEnterKey={handleEnterKey}
  														autoComplete={'dontdoit'}
  														required={true}
  														whenFilled={clave}
  		                        error={errors.clave} />
  		                </div>
  		                <div className={styles.moreTop}>
  												<ButtonWithIcon label={<L p={p} t={`Reset Password`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  		                </div>
  								</form>
                    <MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Password Reset (Admin)`}/>} path={'passwordResetAdmin'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
                  <OneFJefFooter />
              </section>
          )
}

export default withAlert(PasswordResetAdminView)
