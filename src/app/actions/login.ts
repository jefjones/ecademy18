import * as types from './actionTypes'
import { navigate, navigateReplace, goBack } from './'
import * as loggedIn from './logged-in'
import * as studentSchedule from './student-schedule'
import * as intervals from './semester-intervals'
import * as gradeScale from './grade-scale'
import * as gradeLevels from './grade-level'
import * as registrationCustodies from './registration-custody'
import * as registration from './registration'
import * as student from './student'
import * as courses from '../actions/course-to-schedule'
import * as courseEntry from '../actions/course-entry'
import * as openRegistrations from '../actions/open-registrations'
import * as guardians from '../actions/guardians'
import * as mapDirections from '../actions/map-directions'
import * as safetyAlertTypes from '../actions/safety-alert-types'
import * as volunteerTypes from '../actions/volunteer-types'
import * as volunteerEvents from '../actions/volunteer-event'
import * as adminResponsePendings from '../actions/admin-response-pendings'
import * as behaviorIncidentTypes from '../actions/behavior-incident-types'
import * as colleges from '../actions/colleges'
import * as doctors from '../actions/doctors'

import * as courseRecommendation from '../actions/course-recommendation'
import * as gradRequirements from '../actions/grad-requirements'
import * as coursePrerequisites from '../actions/course-prerequisites'
import * as courseTypes from '../actions/course-types'
import * as classPeriods from '../actions/class-periods'
import * as learningPathways from '../actions/learning-pathways'
import * as department from '../actions/department'

import * as personConfig from './person-config'
import * as companyConfig from './company-config'
import * as countsMainMenu from './counts-main-menu'
import * as maritalStatus from './marital-status'
import * as relationTypes from './relation-types'
import * as duenos from '../actions/duenos'
import * as myFrequentPlaces from '../actions/my-frequent-places'
import * as myVisitedPages from '../actions/my-visited-pages'
import * as personConfigCalendar from '../actions/person-config-calendar'
import * as calendarEvents from '../actions/calendar-events'
import * as lang from '../actions/language-list'
import * as schoolYears from '../actions/school-years'

import * as myProfile from '../actions/my-profile'
import * as users from '../actions/users'
import moment from 'moment'
import {guidEmpty} from '../utils/guidValidate'
// //Penspring-related import
// import * as editorInvitePending from './editor-invite-pending';
//Registration related improts
import {apiHost} from '../api_host'

export function loginError(error) {
  return { error, type: types.LOGGED_FAILED }
}

export function logout() {
  return { type: types.LOGGED_OUT }
}

export function loginRequest(email, password) {
  const user = {email: email, password: password}
  return { user, type: types.LOGIN_ATTEMPT }
}

export function setLoggedSuccessfully(person) {
  return { type: types.LOGGED_SUCCESSFULLY, payload: person }
}

export function toggleBypassGradeRestriction() {
  return { type: types.BYPASS_GRADE_RESTRICTION, payload: null }
}

export function resetCache(personId) {
  return dispatch =>
    fetch(`${apiHost}ebi/resetCache/${personId}`, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
}

export function resetPasswordByAdmin(personId, userPersonId, password) {
  return dispatch =>
    fetch(`${apiHost}ebi/person/password/resetAdmin/${personId}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      body: JSON.stringify({ userPersonId, password })
    })
}

export function resetMyProfilePassword(userPersonId, password) {
  return dispatch =>
    fetch(`${apiHost}ebi/person/password/resetMyProfile/${userPersonId}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      body: JSON.stringify({ userPersonId, password })
    })
}

export function jefSendEmails(personId) {
  return dispatch =>
    fetch(`${apiHost}ebi/person/jefsendemails/` + personId, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
}

export function removeDemoRecords(personId) {
  return dispatch =>
    fetch(`${apiHost}ebi/person/company/deleteDemo/` + personId, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
}

export function forgotPassword(username, phone, salta) {
  username = username ? username : 'empty'
  phone = phone ? phone : 'empty'

  return dispatch =>
    fetch(`${apiHost}ebi/person/forgotPassword/` + username + `/` + phone, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.result === "GOTORESETPASSWORD" || salta === 'salta') {
          dispatch({ type: types.INITIAL_PASSWORD_VALIDATE, payload: response })
          navigate('/initStudentLogin/' + response.personId)
        } else {
          dispatch({ type: types.PASSWORD_RESET_REQUEST, payload: response.result })
        }
      })
}

export function hasInitialPassword(newLoginPersonId) {
  return dispatch =>
    fetch(`${apiHost}ebi/person/initialPassword/` + newLoginPersonId, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
      .then(response => response.json())
      .then(response => {
        dispatch({ type: types.INITIAL_PASSWORD_VALIDATE, payload: response })
        response && response.hasInitialPassword
          ? navigate(`/initStudentLogin/${newLoginPersonId}/${response.username}`)
          : navigate('/login')
      })
}

export function setPassword(newLoginPersonId, userData) {
  if (!userData.personId || userData.personId === 'null' || userData.personId === 'undefined' ) userData.personId = guidEmpty
  return dispatch =>
    fetch(`${apiHost}ebi/person/setpassword`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      body: JSON.stringify({
        personId: userData.personId,
        username: userData.username,
        password: userData.clave,
      }),
    })
      .then(response => {
        response && dispatch(login(userData))
      })
}

export function resetProfilePassword(newLoginPersonId, userData) {
  if (!userData.personId || userData.personId === 'null' || userData.personId === 'undefined' ) userData.personId = guidEmpty
  return dispatch =>
    fetch(`${apiHost}ebi/person/resetpassword/profile`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      body: JSON.stringify({
        personId: userData.personId,
        username: userData.username,
        password: userData.newClave,
        oldPassword: userData.oldClave,
      }),
    })
      .then(response => {
        response && dispatch(login(userData))
      })
}

export function setResetPasswordResponse(resetPasswordCode, emailAddress, password) {
  return dispatch =>
    fetch(`${apiHost}ebi/person/resetPassword/` + resetPasswordCode + `/` + emailAddress + `/` + password, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
      .then(response => response.json())
      .then(response => {
        dispatch({ type: types.PASSWORD_RESET_COMPLETE, payload: response })
        alert("Your password has been reset.  You will be redirected to the login page to sign in with your new password.")
        navigate('/login')
      })
}

export function isDuplicateUsername(username) {
  return dispatch =>
    fetch(`${apiHost}ebi/isDuplicateUsername/` + username, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(response => {
        dispatch({ type: types.IS_DUPLICATE_USERNAME, payload: response })
      })
}

export function initRecords(response, sendTo) {
  return dispatch => {
    let personId = response.loginPerson.personId
    dispatch(maritalStatus.init(personId))
    if (personId.toUpperCase() === '91E033D9-6D29-4A4C-A767-29D499A6D11D') dispatch(duenos.init(personId))
    dispatch(lang.getPageLangs(personId, response.loginPerson.langCode, "component"))
    dispatch(lang.getPageLangs(personId, response.loginPerson.langCode, "FirstNavView"))

    if (response.accessRoles.doctor) {
      dispatch(users.getUsers(personId))
      dispatch(personConfig.init(personId))
      dispatch(companyConfig.init(personId))
      dispatch(myFrequentPlaces.getMyFrequentPlaces(personId))
      dispatch(myVisitedPages.getMyVisitedPages(personId))
    } else {

      dispatch({ type: types.LOGGED_SUCCESSFULLY, payload: response.loginPerson })
      dispatch({ type: types.ACCESS_ROLES, payload: response.accessRoles })
      dispatch({ type: types.COMPANY_CONFIG_INIT, payload: response.companyConfig })
      dispatch(loggedIn.setLoggedIn(true))
      dispatch(openRegistrations.init(personId))
      dispatch(courses.getCoursesScheduled(personId, false, true))
      dispatch(courseEntry.getCoursesBase(personId))
      dispatch(lang.getPageLangs(personId, response.loginPerson.langCode, "component"))
      dispatch(lang.getPageLangs(personId, response.loginPerson.langCode, "FirstNavView"))
      dispatch(myProfile.getMyProfile(personId))

      if (response.companyConfig.urlcode !== 'Manheim') {
        dispatch(countsMainMenu.getCountsMainMenu(personId))
        dispatch(personConfigCalendar.getPersonConfigCalendar(personId))
        dispatch(calendarEvents.getCalendarEvents(personId, {fromDate: moment().format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD')}))
        dispatch(doctors.getDoctors(personId))
        dispatch(safetyAlertTypes.init(personId))
        dispatch(maritalStatus.init(personId))
        dispatch(gradeScale.init(personId))
        dispatch(volunteerTypes.init(personId))
      }

      dispatch(schoolYears.init(personId))
      dispatch(personConfig.init(personId))
      dispatch(companyConfig.init(personId))
      dispatch(student.getStudents(personId))
      dispatch(myFrequentPlaces.getMyFrequentPlaces(personId))
      dispatch(myVisitedPages.getMyVisitedPages(personId))
      dispatch(intervals.init(personId))
      dispatch(gradeLevels.init(personId))
      dispatch(schoolYears.init(personId))
      dispatch(users.getUsers(personId))


      if (response.accessRoles.admin || response.accessRoles.facilitator) {
        dispatch(guardians.init(personId))
        if (response.companyConfig.urlcode !== 'Manheim') {
          dispatch(behaviorIncidentTypes.init(personId))
          dispatch(behaviorIncidentTypes.getResponseTypes(personId))
          dispatch(colleges.init(personId))
        }
      }

      if (response.accessRoles.admin && response.companyConfig.urlcode !== 'Manheim') {
        dispatch(adminResponsePendings.getAdminResponsePendings(personId))
        dispatch(mapDirections.init(personId))
      } else if (response.accessRoles.observer) {
        dispatch(relationTypes.init())
        dispatch(registrationCustodies.init())
        dispatch(volunteerEvents.getVolunteerEvents(personId))
        dispatch(registration.getRegistration(personId, personId))
      }
      if (response.accessRoles.learner) {
        dispatch(studentSchedule.getStudentSchedule(personId, personId))
        dispatch(courseRecommendation.getCourseRecommendations(personId, 'Student'))
      }

      if (response.companyConfig.features.selfServiceStudentSignup) {
        dispatch(gradRequirements.init(personId))
        dispatch(coursePrerequisites.getCoursePrerequisites(personId))
        if (response.accessRoles.facilitator || response.accessRoles.admin || response.accessRoles.counselor) {
          dispatch(courseRecommendation.getCourseRecommendations(personId, 'Teacher'))
        }
      }

      if (response.companyConfig.urlcode === 'Manheim') {
        dispatch(courseTypes.init(personId))
        dispatch(classPeriods.init(personId))
        dispatch(learningPathways.init(personId))
        dispatch(department.init(personId))
      }
      // _______________________
      // dispatch({ type: types.LOGGED_SUCCESSFULLY, payload: response.loginPerson });
      // dispatch({ type: types.ACCESS_ROLES, payload: response.accessRoles });
      // dispatch({ type: types.COMPANY_CONFIG_INIT, payload: response.companyConfig });
      // dispatch(loggedIn.setLoggedIn(true));
      // dispatch(myProfile.getMyProfile(personId));
      // dispatch(schoolYears.init(personId));
      // dispatch(semesterIntervals.init(personId));
      // dispatch(gradeLevel.init());
      // dispatch(courseBase.getCoursesBase());
      // dispatch(coursesScheduled.getCoursesScheduled());
      // dispatch(learners.init(personId));
      //
      // if (response.companyConfig.urlcode !== 'Manheim') {
      //   dispatch(countsMainMenu.getCountsMainMenu(personId));
      //   dispatch(personConfigCalendar.getPersonConfigCalendar(personId));
      //   dispatch(calendarEvents.getCalendarEvents(personId, {fromDate: moment().format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD')}));
      // }
      //
      // dispatch(personConfig.init(personId));
      // dispatch(companyConfig.init(personId));
      // dispatch(myFrequentPlaces.getMyFrequentPlaces(personId));
      // dispatch(myVisitedPages.getMyVisitedPages(personId));
      // dispatch(users.getUsers(personId));
      //
      // if (response.accessRoles.admin || response.accessRoles.facilitator) {
      //   if (response.companyConfig.urlcode !== 'Manheim') {
      //   }
      // }
      //
      // if (response.accessRoles.observer) {
      //   dispatch(relationTypes.init());
      // }
    }
    sendTo && navigate(sendTo)
  }
}

export function login(userData, inviteResponse, salta) {
  //window.localStorage.setItem("isLoggingIn", true);
  return dispatch =>
    fetch(`${apiHost}ebi/person/login`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      },
      body: JSON.stringify({
        isNewAccount: userData.isNewAccount,
        orgName: userData.orgName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: userData.fullName,
        username: userData.emailAddress || userData.username,
        password: userData.clave,
        salta: userData.salta,
        type: userData.type,
        socialMediaId: userData.socialMediaId,
        socialMediaType: userData.socialMediaType,
        recaptchaResponse: userData.recaptchaResponse,
        demoDetails: userData.demoDetails,
        gradingType: userData.gradingType,
        intervalType: userData.intervalType,
      }),
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          dispatch({ type: types.LOGGED_FAILED})
        }
      })
      .then(response => {
        if (response.loginPerson.fullName === "MATCHING EMAIL ADDRESS FOUND") {
          dispatch({ type: types.LOGIN_MATCHING_RECORD, payload: "MATCHING EMAIL ADDRESS FOUND" })
        } else if (response.loginPerson.fullName === "NOTVALID") {
          dispatch({ type: types.LOGGED_FAILED })
        } else if (salta === 'salta') {
          response.loginPerson.salta = true
          localStorage.setItem("authToken", JSON.stringify(response.token).replace(/"/g, ''))
          localStorage.setItem("person", JSON.stringify(response))
          dispatch(initRecords(response, "/firstNav"))
        } else {
          localStorage.setItem("authToken", JSON.stringify(response.token).replace(/"/g, ''))
          localStorage.setItem("person", JSON.stringify(response))

          let personId = response && response.loginPerson && response.loginPerson.personId
          let sendTo = response.accessRoles.doctor
            ? '/doctorNoteAdd'
            : response.loginPerson.firstTimeLogin
              ? `/initStudentLogin/${personId}/${response.loginPerson.username}`
              : "/firstNav"

          dispatch(initRecords(response, sendTo))
        }
      })
      .catch(response => {
        debugger;  //Leave this one.
        dispatch({ type: types.LOGGED_FAILED})
      })
}
