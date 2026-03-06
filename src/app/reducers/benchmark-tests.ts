import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.BENCHMARK_TESTS_INIT: {
            return action.payload
        }

         default:
            return state
    }
}

export const selectBenchmarkTests = (state) => state
