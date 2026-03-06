import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.BENCHMARK_TEST_CLASS_COMPARISON:
            return action.payload

        default:
            return state
    }
}

export const selectBenchmarkTestClassComparison = (state) => state
