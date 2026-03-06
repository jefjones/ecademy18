import {apiHost} from '../api_host'

export default (personId, workId, chapterId, languageId) => (
    fetch(`${apiHost}ebi/draftComparisons/chosen/` + personId + `/` + workId + `/` + chapterId + `/` + languageId, {
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
        .then(response =>
            response.ok ? response.json() : Promise.reject(response) )
        .then(res => {
            //Notice that we are sending in the ChapterText for the current draft (above in the parameter list).  So as we loop through the
            //  response, if it is the current draft setting then its chapterText is going to be blank so we need to pull
            //  in the currentChapterText.
            let comparisons =
                res.reduce((acc, {draftComparisonId, ...draftComparisons}) => {
                  acc = {
                       ...acc,
                      [draftComparisonId]: {
                          ...draftComparisons,
                          draftComparisonId,
                      }
                  }
                  return acc
              }, {})



                //If this is called, then that means that the draft view is set to "view".  There is a toggle function in the action in order to toggle it off when the user is done.
              let draftComparison = {
                  isDraftView: true,
                  chosenTab: res && res.length > 0 && res.filter(m => m.isCurrent === true)[0].draftComparisonId,
                  comparisons,
              }
              return draftComparison
          })
    )
