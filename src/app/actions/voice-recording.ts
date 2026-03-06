import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const getVoiceRecording = (personId, assessmentQuestionId) => {
    assessmentQuestionId = guidEmpty
    return dispatch =>
      fetch(`${apiHost}ebi/voiceRecording/` + personId + `/` + assessmentQuestionId, {
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
        //console.l og('response', response);
          dispatch({ type: types.VOICE_RECORDING_INIT, payload: response })
      })
}

export const addVoiceRecording = (personId, assessmentQuestionId, blobThing) => {

		// let count = 0;
		// while ((!reader || !reader.result) && count < 100000) {
		// 	console.l og('nothing to show yet', reader.result);
		// 	count++;
		// }

		return dispatch => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader()
		    reader.readAsBinaryString(blobThing.blob)
				reader.onloadend = (m => {
					//console.l og('inside onload end');
		      fetch(`${apiHost}ebi/voiceRecording/add/` + personId + `/` + assessmentQuestionId, {
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
		        body: JSON.stringify({blobThing: reader.result})
		      })
		      .then(response => {
		          if (response.status >= 200 && response.status < 400) {
		              return response.json()
		          } else {
		              const error = new Error(response.statusText)
		              error.response = response
		              throw error
		          }
		      })
		      .then(response => {
		        	//console.l og('response', response);
		          dispatch({ type: types.VOICE_RECORDING_INIT, payload: response })
		      })
					.catch(err => {
						console.warn(err)
					})
					//console.l og('after reader');
				})
			})
		}
}
//
//
// reader.onloadend = (m => {
// 	console.l og('inside onload end');
// 	return dispatch =>
// 		fetch(`${apiHost}ebi/voiceRecording/add/` + personId + `/` + assessmentQuestionId, {
// 			method: 'post',
// 			headers: {
// 					'Accept': 'application/json',
// 					'Content-Type': 'application/json',
// 					'Access-Control-Allow-Credentials' : 'true',
// 					"Access-Control-Allow-Origin": "*",
// 					"Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
// 					"Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
// 					"Authorization": "Bearer " + localStorage.getItem("authToken"),
// 			},
// 			body: JSON.stringify({blobThing: reader.result})
// 		})
// })
// console.l og('after reader');
