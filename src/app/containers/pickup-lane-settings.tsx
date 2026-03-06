import { useEffect } from 'react'
import PickupLaneSettingsView from '../views/PickupLaneSettingsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionPickupLane from '../actions/pickup-lane'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectPickupLanes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let pickupLanes = selectPickupLanes(state)

    let pickupLaneTables = pickupLanes && pickupLanes.length > 0 && pickupLanes.reduce((acc, m) => {
				let alreadyEntered = false
				acc && acc.length > 0 && acc.forEach(g => {
					  if (m.pickupLaneTableId === g.id) alreadyEntered = true
				})
				if (!alreadyEntered) {
						let option = {
								id: m.pickupLaneTableId,
								label: m.pickupLaneName
						}
						acc = acc ? acc.concat(option) : [option]
				}
				return acc
		}, [])

    let positionNumbers = []

    for(let i = 1; i < 30; i++) {
        let option = {id:i, label:i}
        positionNumbers = positionNumbers && positionNumbers.length > 0 ? positionNumbers.concat(option) : [option]
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        pickupLanes,
        pickupLaneTables,
        positionNumbers,
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getPickupLanes: (personId) => dispatch(actionPickupLane.getPickupLanes(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removePickupLaneDetail: (personId, pickupLaneDetailId) => dispatch(actionPickupLane.removePickupLaneDetail(personId, pickupLaneDetailId)),
    removePickupLaneTable: (personId, pickupLaneTableId) => dispatch(actionPickupLane.removePickupLaneTable(personId, pickupLaneTableId)),
    addOrUpdatePickupLaneDetail: (personId, pickupLaneDetail) => dispatch(actionPickupLane.addOrUpdatePickupLaneDetail(personId, pickupLaneDetail)),
		addOrUpdatePickupLaneTable: (personId, newPickupLaneName, pickupLaneTableId) => dispatch(actionPickupLane.addOrUpdatePickupLaneTable(personId, newPickupLaneName, pickupLaneTableId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getPickupLanes, personId} = props
            getPageLangs(personId, langCode, 'PickupLaneSettingsView')
            getPickupLanes(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Pick-up Lane Settings`})
        
  }, [])

  return <PickupLaneSettingsView {...props} />
}

export default Container
