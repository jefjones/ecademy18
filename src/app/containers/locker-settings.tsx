import { useEffect } from 'react'
import LockerSettingView from '../views/LockerSettingView'
import * as actionLockers from '../actions/lockers'
import * as actionPageLang from '../actions/language-list'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { useSelector, useDispatch } from 'react-redux'
import { selectMe, selectLockers, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

		let levels = [
			{ id: '1', label: '1' },
			{ id: '2', label: '2' },
			{ id: '3', label: '3' },
			{ id: '4', label: '4' },
			{ id: '5', label: '5' },
			{ id: '6', label: '6' },
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				levels: levels,
        lockers: selectLockers(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getLockers: (personId) => dispatch(actionLockers.getLockers(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateLocker: (personId, locker) => dispatch(actionLockers.addOrUpdateLocker(personId, locker)),
    removeLocker: (personId, lockerId) => dispatch(actionLockers.removeLocker(personId, lockerId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, setMyVisitedPage, getLockers, personId} = props
          getPageLangs(personId, langCode, 'LockerSettingView')
          getLockers(personId)
          props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Locker Settings`})
      
  }, [])

  return <LockerSettingView {...props} />
}

export default Container
