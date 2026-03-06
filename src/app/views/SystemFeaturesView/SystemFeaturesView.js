import React, {Component} from 'react';
import styles from './SystemFeaturesView.css';
const p = 'SystemFeaturesView';
import L from '../../components/PageLanguage';
import penspringSmall from '../../assets/Penspring_small.png';
import globalStyles from '../../utils/globalStyles.css';
import OneFJefFooter from '../../components/OneFJefFooter';
import Checkbox from '../../components/Checkbox';

class SystemFeaturesView extends Component {
    constructor(props) {
      super(props);

      this.state = {
      }
    }

		render() {
				const {personId, companyConfig={}, toggleCompanyFeature, toggleBenchmarkTests} = this.props;

		    return (
		        <div className={styles.container}>
		            <div className={globalStyles.pageTitle}>
		                <L p={p} t={`System Features`}/>
		            </div>
								<Checkbox
										id={'absenceExcused'}
										label={<L p={p} t={`Absence excused by parent (with doctor note upload)`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.absenceExcused) || false}
										onClick={() => toggleCompanyFeature(personId, 'absenceExcused')}
										className={styles.checkbox}/>
								<Checkbox
										id={'attendance'}
										label={<L p={p} t={`Attendance`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.attendance) || false}
										onClick={() => toggleCompanyFeature(personId, 'attendance')}
										className={styles.checkbox}/>
								<Checkbox
										id={'behaviorIncidents'}
										label={<L p={p} t={`Behavior Incidents`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.behaviorIncidents) || false}
										onClick={() => toggleCompanyFeature(personId, 'behaviorIncidents')}
										className={styles.checkbox}/>
								<Checkbox
										id={'benchmarkTests'}
										label={<L p={p} t={`Benchmark Tests`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.benchmarkTests) || false}
										onClick={() => {
												toggleBenchmarkTests(personId, !companyConfig.features.benchmarkTests);
												toggleCompanyFeature(personId, 'benchmarkTests');
										}}
										className={styles.checkbox}/>
								<Checkbox
										id={'billing'}
										label={<L p={p} t={`Billing and Credits`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.billing) || false}
										onClick={() => toggleCompanyFeature(personId, 'billing')}
										className={styles.checkbox}/>
								<Checkbox
										id={'calendarAndEvents'}
										label={<L p={p} t={`Calendar and Events`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.calendarAndEvents) || false}
										onClick={() => toggleCompanyFeature(personId, 'calendarAndEvents')}
										className={styles.checkbox}/>
								<Checkbox
										id={'carpool'}
										label={<L p={p} t={`Carpool`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.carpool) || false}
										onClick={() => toggleCompanyFeature(personId, 'carpool')}
										className={styles.checkbox}/>
								{/*<Checkbox
										id={'classPhotoGallery'}
										label={<L p={p} t={`Class Photo Gallery`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.classPhotoGallery) || false}
										onClick={() => toggleCompanyFeature(personId, 'classPhotoGallery')}
										className={styles.checkbox}/>*/}
								{/*<Checkbox
										id={'classroomSeatingAssignments'}
										label={<L p={p} t={`Classroom Seating Assignments`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.classroomSeatingAssignments) || false}
										onClick={() => toggleCompanyFeature(personId, 'classroomSeatingAssignments')}
										className={styles.checkbox}/>*/}
								<Checkbox
										id={'courses'}
										label={<L p={p} t={`Courses`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.courses) || false}
										onClick={() => toggleCompanyFeature(personId, 'courses')}
										className={styles.checkbox}/>
								<Checkbox
										id={'curbsideCheckInOut'}
										label={<L p={p} t={`Curbside Check-in or Check-out`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.curbsideCheckInOut) || false}
										onClick={() => toggleCompanyFeature(personId, 'curbsideCheckInOut')}
										className={styles.checkbox}/>
								{/*<Checkbox
										id={'facilitiesManagement'}
										label={<L p={p} t={`Facilities Management`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.facilitiesManagement) || false}
										onClick={() => toggleCompanyFeature(personId, 'facilitiesManagement')}
										className={styles.checkbox}/>*/}
								{/*<Checkbox
										id={'finance'}
										label={<L p={p} t={`Finance`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.finance) || false}
										onClick={() => toggleCompanyFeature(personId, 'finance')}
										className={styles.checkbox}/>*/}
                <Checkbox
										id={'galleryPhotos'}
										label={<L p={p} t={`Gallery Photos`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.galleryPhotos) || false}
										onClick={() => toggleCompanyFeature(personId, 'galleryPhotos')}
										className={styles.checkbox}/>
								<Checkbox
										id={'gradebook'}
										label={<L p={p} t={`Gradebook`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.gradebook) || false}
										onClick={() => toggleCompanyFeature(personId, 'gradebook')}
										className={styles.checkbox}/>
								<Checkbox
										id={'graduationRequirements'}
										label={<L p={p} t={`Graduation Requirement Status`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.graduationRequirements) || false}
										onClick={() => toggleCompanyFeature(personId, 'graduationRequirements')}
										className={styles.checkbox}/>
								<Checkbox
										id={'lockers'}
										label={<L p={p} t={`Lockers`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.lockers) || false}
										onClick={() => toggleCompanyFeature(personId, 'lockers')}
										className={styles.checkbox}/>
								<Checkbox
										id={'lunchMenu'}
										label={<L p={p} t={`Lunch Menu`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.lunchMenu) || false}
										onClick={() => toggleCompanyFeature(personId, 'lunchMenu')}
										className={styles.checkbox}/>
								<Checkbox
										id={'messagesAndReminders'}
										label={<L p={p} t={`Messages and Reminders`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.messagesAndReminders) || false}
										onClick={() => toggleCompanyFeature(personId, 'messagesAndReminders')}
										className={styles.checkbox}/>
                <Checkbox
										id={'penspring'}
										label={<div className={styles.row}>
                              <L p={p} t={`Essays, Papers, and Editing`}/>
                              <img className={styles.penspringLogo} src={penspringSmall} alt="penspring"/>
                           </div>
                    }
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.penspring) || false}
										onClick={() => toggleCompanyFeature(personId, 'penspring')}
										className={styles.checkbox}/>
                <Checkbox
										id={'pickupLane'}
										label={<L p={p} t={`Pick-up Lane (GPS Locations)`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.pickupLane) || false}
										onClick={() => toggleCompanyFeature(personId, 'pickupLane')}
										className={styles.checkbox}/>
								<Checkbox
										id={'registration'}
										label={<L p={p} t={`Registration`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.registration) || false}
										onClick={() => toggleCompanyFeature(personId, 'registration')}
										className={styles.checkbox}/>
								<Checkbox
										id={'safetyAlert'}
										label={<L p={p} t={`Safety Alert`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.safetyAlert) || false}
										onClick={() => toggleCompanyFeature(personId, 'safetyAlert')}
										className={styles.checkbox}/>
								<Checkbox
										id={'selfServiceStudentSignup'}
										label={<L p={p} t={`Self-service Student Class Sign-up`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.selfServiceStudentSignup) || false}
										onClick={() => toggleCompanyFeature(personId, 'selfServiceStudentSignup')}
										className={styles.checkbox}/>
								<div className={styles.muchLeft}>
                    <Checkbox
                        id={'turnOnCourseRecommendation'}
                        label={<L p={p} t={`Allow teacher to make course recommendations for the coming year`}/>}
                        labelClass={styles.checkboxLabel}
                        checked={(companyConfig.features && companyConfig.features.turnOnCourseRecommendation) || false}
                        onClick={() => toggleCompanyFeature(personId, 'turnOnCourseRecommendation')}
                        className={styles.checkbox}
                        disabled={!(companyConfig.features && companyConfig.features.selfServiceStudentSignup)}/>
										<Checkbox
												id={'courseAssignByAdmin'}
												label={<L p={p} t={`Course Assign by Admin (Required or suggested)`}/>}
												labelClass={styles.checkboxLabel}
												checked={(companyConfig.features && companyConfig.features.courseAssignByAdmin) || false}
												onClick={() => toggleCompanyFeature(personId, 'courseAssignByAdmin')}
												className={styles.checkbox}
												disabled={!(companyConfig.features && companyConfig.features.selfServiceStudentSignup)}/>
										<Checkbox
												id={'distributeCourseRequests'}
												label={<L p={p} t={`Distribute Course Requests`}/>}
												labelClass={styles.checkboxLabel}
												checked={(companyConfig.features && companyConfig.features.distributeCourseRequests) || false}
												onClick={() => toggleCompanyFeature(personId, 'distributeCourseRequests')}
												className={styles.checkbox}
												disabled={!(companyConfig.features && companyConfig.features.courseAssignByAdmin)}/>
								</div>
								{/*<Checkbox
										id={'sendStudentToOffice'}
										label={<L p={p} t={`Send Student to Office`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.sendStudentToOffice) || false}
										onClick={() => toggleCompanyFeature(personId, 'sendStudentToOffice')}
										className={styles.checkbox}/>*/}
								{/*<Checkbox
										id={'substituteTeacher'}
										label={<L p={p} t={`Substitute Teacher Request and Scheduler`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.substituteTeacher) || false}
										onClick={() => toggleCompanyFeature(personId, 'substituteTeacher')}
										className={styles.checkbox}/>*/}
								<Checkbox
										id={'teachers'}
										label={<L p={p} t={`Teachers`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.teachers) || false}
										onClick={() => toggleCompanyFeature(personId, 'teachers')}
										className={styles.checkbox}/>
								<Checkbox
										id={'transcripts'}
										label={<L p={p} t={`Transcripts`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.transcripts) || false}
										onClick={() => toggleCompanyFeature(personId, 'transcripts')}
										className={styles.checkbox}/>
								<Checkbox
										id={'volunteerHours'}
										label={<L p={p} t={`Volunteer Hours`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.volunteerHours) || false}
										onClick={() => toggleCompanyFeature(personId, 'volunteerHours')}
										className={styles.checkbox}/>
								{/*<Checkbox
										id={'votingAndSurveys'}
										label={<L p={p} t={`Voting and Surveys`}/>}
										labelClass={styles.checkboxLabel}
										checked={(companyConfig.features && companyConfig.features.votingAndSurveys) || false}
										onClick={() => toggleCompanyFeature(personId, 'votingAndSurveys')}
										className={styles.checkbox}/>*/}
								<OneFJefFooter />
		        </div>
		    )
		};
}

export default SystemFeaturesView;
