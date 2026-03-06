import * as types from './actionTypes'
import getGenreList from '../services/genre-list'


function setGenreList( genres={}) {
    return { type: types.GENRE_LIST_INIT, payload: genres }
}

export const init = () => dispatch =>
    getGenreList().then( n => dispatch( setGenreList(n)) )
