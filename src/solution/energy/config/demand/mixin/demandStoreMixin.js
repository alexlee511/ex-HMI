import demanStore from "../store"
import * as types from "../store/mutation-types"

import { createNamespacedHelpers } from 'vuex'
const { mapState: mapDemandState, mapActions: mapDemandActions, mapMutations: mapDemandMutations } = createNamespacedHelpers('demand')

export default {
  async created() {
    // 註冊store
    if(!this.$store.hasModule("demand")) {
      this.createDemandStore()
      await this[types.GET_DEMAND_LIST_ACTION]()
    }
    // 創建store之後的鉤子 
    await this.afterCreateStore();
  },
  beforeDestroy() {
    const routePathArr = this.$route.path.split("/")
    //清空暫存資料
    if(Object.keys(this.currentConfig).length) {
      if (this.$route.query.devId !== this.currentConfig.dev_id) {
        this[types.CLEAR_CURRENT_DEVICE] ()
      }
    }

    //銷毀store
    let thisPath =
      routePathArr[3]
    if (thisPath !== "demand") {
      this[types.RESET_STORE_DATA] ()
      this.$store.unregisterModule("demand");
    }
  },
  computed: {
    ...mapDemandState([
      "demandList",
      "currentConfig",
      "meterList",
    ]),
  },
  methods: {
    ...mapDemandMutations([
      types.DELETE_DEMAND_LIST_ACTION,
      types.GET_CURRENT_DEVICE,
      types.CLEAR_CURRENT_DEVICE,
      types.ADD_OFFLOADLIST,
      types.ADD_DEMAND_LIST,
      types.MODIFY_DEMAND_LIST,
      types.ADD_ALARMLIST,
      types.DELETE_ALARMLIST,
      types.RESET_STORE_DATA,
      types.DELETE_OFFLOADLIST,
    ]),
    ...mapDemandActions([
      types.GET_DEMAND_LIST_ACTION,
      types.COMMIT_TO_LIST,
      types.GET_METER_LIST,
    ]),
    createDemandStore() {
      this.$store.registerModule("demand", demanStore);
    }
  }
};
