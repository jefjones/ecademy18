import * as types  from '../actions/actionTypes'

export default function(state=[], action) {
  switch (action.type) {
    case types.BOOKMARKS_INIT:
      return action.payload

    default:
        return state
  }
}

export const selectBookmarkOptions = (state) => state && state.length > 0 &&
    state.map(m => ({
        label: m.name,
        id: m.hrefId,
    })
)

export const selectBookmarks = (state) => state && state.length > 0 &&
    state.map(m => m.hrefId)
