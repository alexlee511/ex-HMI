<template>
  <div class="main white_view" :style='stylerSize()'>
    <div
      id="general_devicelist_title"
      class="slaveM title_item"
      :style='stylerSize(100,15,0,3)'
    >
      <div class="slaveC _36" :style='stylerSize(15,80,8,0)'>{{ $t("GENERAL.SOURCE_METER_NAME") }}</div>
      <div class="slaveC _36" :style='stylerSize(10,80,37.5,0)'>{{ $t("GENERAL.DEVICE_TYPE") }}</div>
      <div class="slaveC _36" :style='stylerSize(10,80,65,0)'>{{ $t("GENERAL.DEVICE_ID") }}</div>
    </div>
    <div class="slaveM overFlowY" :style='stylerSize(100,85,0,15)'>
        <div
          class="slaveM"
          v-for="(item, index) in demandList"
          :class="item.isChange && 'change_item'"
          :key="index"
          :style='stylerSize(100,25,0,20*index+3)'
        >
            <div class="slaveC _36" :style='stylerSize(25,30,3,0)'>{{ changeDevName(item.srcId) }}</div>
            <div class="slaveC _36" :style='stylerSize(25,30,30,0)'>VIRTUALDEMAND</div>
            <div class="slaveC _36" :style='stylerSize(28,30,55,0)'>{{ item.dev_id }}</div>
            <img class="slaveC" :style='stylerSize(4,37,87,0)' src="~assets/images/modify.png" @click="goChange(item)"/>
            <img class="slaveC" :style='stylerSize(4,37,93,0)' src="~assets/images/remove.png" @click="deleteDevice(index)"/>
        </div>
    </div>
  </div>
</template>

<script>
import demandStoreMixin from "../mixin/demandStoreMixin"
import * as types from "../store/mutation-types"

import { restart } from "network/gateway"

export default {
  mixins: [demandStoreMixin],
  data() {
    return {
    };
  },
  async created(){
    //將初始化動作放在創建store之後 => afterCreateStores
  },
  mounted() {
    this.$bus.$on("configApply", () => {
      this.$store.commit("setLoadingState");
      this[types.COMMIT_TO_LIST]().then( res => {
        if (!res) {
          alert('error')
        } else {
          this.$router.back();
          restart()
        }
        this.$store.commit("setLoadingState");
      }) 
    });

    this.$bus.$on("configAdd", () => {
      console.log(JSON.stringify(this.$store.state.setCacheModule, null, 4), "configAdd");
      if(this.meterList.length == 0){
        this.$notify({
          type: 'info',
          title: this.$t("GENERAL.NOTICE"),
          message: this.$t("GENERAL.NO_DEVICE"),
        })
      }
    })
  },
  beforeDestroy() {
    // console.log(JSON.stringify(this.$store.state.setCacheModule, null, 4), "beforeDestroy");
    this.$bus.$off("configApply");
    this.$bus.$off("configAdd");
  },
  destroyed(){
    delete this.$store.state.emergencyDisabled;
  },
  computed: {},
  methods: {
    async afterCreateStore() {
      // 預防新增設定時無來源電表，避免跳轉到ChangConfig用
      await this[types.GET_METER_LIST]();
      if(this.meterList.length == 0){
        console.log("==================METER LIST EMPTY========================")
        this.$store.state.emergencyDisabled = true;
      }
    },
    async goChange(item) {
      let devId = item.dev_id;
        let path = this.$route.path.replace(/configView/i, "changeConfig");
        this.$router.push({
          path: path,
          query: {
            devId: devId,
          },
        });
    },
    deleteDevice(index) {
      this[types.DELETE_DEMAND_LIST_ACTION](index)
    },
    changeDevName(dev_id){
      const dev_name = this.$store.state.deviceName[dev_id];
      return dev_name ? dev_name : dev_id;
    }
  },
};
</script>
