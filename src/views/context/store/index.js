import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"


export const getDefaultState = () => {
  return {
    test: ["888"],
    controlType: [],
    list: [],
    deleteList: [],
    path: "",
  }
}

const state = getDefaultState()

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}