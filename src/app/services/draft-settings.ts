//Consider sending a flag indicating that we are already in the page that is reading ChapterText, so if there ARE NOT any changes, don't update!
//  Send back the value of "NO-UPDATE" and do not do anything with it in the reducer.
import {apiHost} from '../api_host'

export default (personId, workId, chapterId, languageId) => {
     chapterId = chapterId ? chapterId : 0
     return (
        fetch(`${apiHost}ebi/draftComparisons/list/` + personId + `/` + workId + `/` + chapterId + `/` + languageId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            }})
            .then(response => response.ok ? response.json() : Promise.reject(response))
)}
