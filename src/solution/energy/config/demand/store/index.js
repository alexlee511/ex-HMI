
import mutations from "./mutations"
import actions from "./actions"

export const getDefaultState = () => {
  return {
    demandList: [],
    deleteList: [],
    meterList: [],
    currentConfig: {},
    gatewayId: "",
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations,
  actions,
}