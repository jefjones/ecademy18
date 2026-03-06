import * as types from './actionTypes';
import * as actionWorks from './works';

export const getLocalStorage = (dispatch) => {
    // let storage = localStorage.getItem("contacts")
    // storage && dispatch({type: types.CONTACTS_INIT, payload: JSON.parse(storage) });

    let storage = localStorage.getItem("works")
    actionWorks.setWorks(storage);
    //storage && dispatch({type: types.WORKS_INIT, payload: JSON.parse(storage) });

    storage = localStorage.getItem("workId_current")
    actionWorks.setWorkIdCurrent(storage);
    //storage && dispatch({type: types.WORK_CURRENT_SET_SELECTED, payload: JSON.parse(storage) });

    // storage = localStorage.getItem("languageId_current")
    // storage && dispatch({type: types.LANGUAGE_CURRENT_SET_SELECTED, payload: JSON.parse(storage) });
    //
    // // storage = localStorage.getItem("groups")
    // // storage && dispatch({type: types.GROUPS_INIT, payload: JSON.parse(storage) });
    // //
    // // storage = localStorage.getItem("groupId_current")
    // // storage && dispatch({type: types.GROUPS_CURRENT_SET_SELECTED, payload: JSON.parse(storage) });
    //
    // storage = localStorage.getItem("personConfig")
    // storage && dispatch({type: types.PERSON_CONFIG_INIT, payload: JSON.parse(storage) });
    //
    // storage = localStorage.getItem("groupEditReport")
    // storage && dispatch({type: types.GROUP_EDIT_REPORT_INIT, payload: JSON.parse(storage) });
}
