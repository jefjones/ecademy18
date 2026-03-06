import { navigate, navigateReplace, goBack } from './'
import jwtDecode from 'jwt-decode'

export const hasAccess = (validRoles=[], accessRoles={}) => {
		// //validRoles is an array of strings:  admin, facilitator, learner, observer
		// //If validRoles is blank, everyone has access.
		// //If the user has any one of the validRoles, then they have access.  They don't have to have all access types that are listed.
		// let hasAccess = false;
		// if (validRoles.indexOf('all') > -1) hasAccess = true;
		// if (accessRoles.admin && validRoles.indexOf('admin') > -1) hasAccess = true;
		// if (accessRoles.facilitator && validRoles.indexOf('facilitator') > -1) hasAccess = true;
		// if (accessRoles.learner && validRoles.indexOf('learner') > -1) hasAccess = true;
		// if (accessRoles.observer && validRoles.indexOf('observer') > -1) hasAccess = true;
		//
		// const { exp } = jwtDecode(window.localStorage.getItem('authToken'));
		// let tokenValid = new Date().getTime() < (exp * 1000);
		// if (!hasAccess || !tokenValid) {
		// 		navigate('/login')
		// }
}
