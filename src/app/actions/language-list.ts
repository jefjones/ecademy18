import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {doSort} from '../utils/sort'

export const init = () => {
    return dispatch => {
				let storage = localStorage.getItem("languageList")
				!!storage && dispatch({ type: types.LANGUAGE_LIST_INIT, payload: JSON.parse(storage) })

        return fetch(`${apiHost}ebi/languagelist/`, {
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
			        .then(res => {
  								let result =
  		                res.map(lang => {
  		                    return {
  		                        id: lang.languageId,
  		                        value: lang.languageId,
  		                        label: lang.name,
  		                        code: lang.code,
  		                        localizedName: lang.localizedName,
  		                    }
  		              	})
                  result = doSort(result, {sortField: 'label', isAsc: true, isNumber: false})
  								dispatch({ type: types.LANGUAGE_LIST_INIT, payload: result })
  								localStorage.setItem("languageList", JSON.stringify(result))
			        })
			        //.catch(error => { console.l og('request failed', error); });
    }
}


export const getPageLangs = (personId, langCode, page) => {
    return dispatch => {
        return langCode === 'en' || personId === '00000000-0000-0000-0000-000000000000' ? null : fetch(`${apiHost}ebi/pageLangs/${personId}/${langCode || 'en'}/${page}`, {
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
  								dispatch({ type: types.PAGE_LANGS, payload: {page, langCode, pageLangs: response} })
			        })
			        //.catch(error => { console.l og('request failed', error); });
    }
}
