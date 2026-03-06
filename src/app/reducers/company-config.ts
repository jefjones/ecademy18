import * as types  from '../actions/actionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case types.COMPANY_CONFIG_INIT:
      return action.payload

		case types.COMPANY_CONFIG_UPDATE: {
				let newState = Object.assign({}, state)
				const feature = action.payload
				if (newState.features) {
						newState.features[feature] = !newState.features[feature]
				} else {
						newState.features = {}
						newState.features[feature] = true
				}
				return newState
		}

    case types.COMPANY_DOCUMENT_REMOVE: {
				let newState = Object.assign({}, state)
				const companyDocumentId = action.payload
        let companyDocuments = newState.companyDocuments
        companyDocuments = companyDocuments && companyDocuments.length > 0 && companyDocuments.filter(m => m.companyDocumentId !== companyDocumentId)
        newState.companyDocuments = companyDocuments
				return newState
		}

    default:
        return state
  }
}

export const selectCompanyConfig = (state) => state
