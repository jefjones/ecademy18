import {PEOPLE_INIT} from './actionTypes';
import getPeople from '../services/people.js';

function setPeople( people={}) {
    return { type: PEOPLE_INIT, payload: people };
}

export const init = () => dispatch => {
  return getPeople().then( n => dispatch(setPeople(n)))
};
