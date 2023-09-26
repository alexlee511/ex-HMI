import mutations from "./mutations";
import actions from "./actions";

export const getDefaultState = () => {
    return {
        scheduleList: [],
        deleteList: [],
    }
}

const state = getDefaultState();

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}