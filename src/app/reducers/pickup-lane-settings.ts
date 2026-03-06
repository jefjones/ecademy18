import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.PICKUP_LANE_INIT:
            return action.payload

				case types.PICKUP_LANE_REMOVE: {
						let newState = Object.assign([], state)
						const pickupLaneDetailId = action.payload
						newState = newState && newState.length > 0 && newState.filter(m => m.pickupLaneDetailId !== pickupLaneDetailId)
						return newState
				}

        default:

            return state
    }
}

export const selectPickupLanes = (state) => state
