import * as types from "../store/mutation-types"
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapDemandState, mapActions: mapDemandActions, mapMutations: mapDemandMutations } = createNamespacedHelpers('demand')


export default {
  computed: {
    ...mapDemandState([
      "currentConfig"
    ]),
    
  },
  methods: {
    ...mapDemandMutations([
      types.CHANGE_DEMAND_MODE
    ]),
    setMode(value, modeIndex) {
      const oldArr = this.currentConfig.mode.split("_")
      
      oldArr[modeIndex] = value
      const newString = oldArr.join("_")
      this[types.CHANGE_DEMAND_MODE](newString)
    },
    selectedUnload(modeIndex) {
      return this.currentConfig.mode && this.currentConfig.mode.split("_")[modeIndex]
    }
  }
}