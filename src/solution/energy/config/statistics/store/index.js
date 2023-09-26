import mutations from "./mutations";
import actions from "./actions";

export const getDefaulState = () => {
    return{
        statisticsList: [],
        deleteList: [],
        addList: [],
    }
}

const state = getDefaulState();

export default{
    namespaced: true,
    state,
    mutations,
    actions
}