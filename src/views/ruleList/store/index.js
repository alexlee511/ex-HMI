import actions from "./actions"
import mutations from "./mutations"

export const getDefaultState = () => {
  return {
    ruleList: [],     //存放取得的API
    addList : [],     //存放要新增的內容
    deleteList: [],
    deviceAttr: {}
  }
}

const state = getDefaultState()

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}