import { deepCopy } from "common/utile/utile"

export default {
    allList(state) {
        if (!state.trueList) {
            return []
        }
        return state.trueList && deepCopy(state.trueList).map(item => {
            if (state.nameList[item.dev_id]) {
                item.devName = state.nameList[item.dev_id]
                return item
            } else {
                item.devName = item.dev_id
                return item
            }
        })
    },
}