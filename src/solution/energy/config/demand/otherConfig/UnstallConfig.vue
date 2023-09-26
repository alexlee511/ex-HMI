<template>
  <div name="controllist_irc_view" class="slaveM overFlowY" :style='stylerSize(100,80,10,2)'>
    <span class="slaveC _36 font" :style="stylerSize(20,5,0,0)"> {{$t("GENERAL.UNLOAD_ORDER")}} </span>	
    <span class="slaveC _36 font" :style="stylerSize(15,10,25.5,0)"> {{$t("GENERAL.DEVICE_NAME")}} </span>
    <span class="slaveC _36 font" :style="stylerSize(20,10,52.5,0)"> {{$t("GENERAL.DEMAND_UNLOAD_RETURN_OPTION")}} </span>

    <unstall-select
      class="slaveC _36"
      v-for="(item, index) in offDevList"
      :key="index"
      :item-index="index"
      :item-info="item"
      :option-list="unselectedDeviceList"
      :style='stylerSize(100,10,0,12*index+7)'
    />

		<span class="slaveC _32 title" 
      :style='stylerSize(30,80,18,12*index+9)' 
      v-for="(item, index) in offDevList"
      :key="'dev_name'+index"> 
      {{ getDeviceName(item.offloadCmd.devId) }} 
    </span>

    <unstall-select class="slaveC _36" :style='stylerSize(100,10,0,12*count+7)' 
      :item-info="fakeItem"  
      :item-index= -1
      :option-list="unselectedDeviceList"
      @addOffloadList="addOffloadList" 
      ref="addSelect" v-if="addSelect"/>
    
  </div>
</template>


<script>
import UnstallSelect from "./UnstallSelect";

import demandStoreMixin from "../mixin/demandStoreMixin"
import * as demandtypes from "../store/mutation-types"

export default {
  components: {
    UnstallSelect
  },
  mixins: [
    demandStoreMixin, 
  ],
  data() {
    return {
      devId: this.$route.query.devId,
      addSelect: true,
      fakeItem: {
        resetCmd: "NULL",
        priority: "1",
        
      },
      count: 0,
      unselectedDeviceList: [],
    };
  },
  created() {
    this.$bus.$on("delete", (flag) => {
        if(flag == 1){
            this.count -= 1
        }
    })
    this.count = this.offDevList.length;
    
    let cmdDevList = this.$store.state.deviceCommand.commandDeviceList
    console.log(cmdDevList)
    for(let type of Object.keys(cmdDevList)){
      for(let item of cmdDevList[type]){
        let index = this.offDevList.findIndex( selected_item => {
          return item.dev_id === selected_item.offloadCmd.devId
        })
        if(index === -1) this.unselectedDeviceList.push({
          "dev_id"  : item.dev_id,
          "dev_name": item.dev_name
        });
      }
    }
    //20230427標章修改 20230907 標章結束 掰掰
    // this.unselectedDeviceList.push({
    //    "dev_id"  : "思納捷大樓B1_A充電樁",
    //    "dev_name": "思納捷大樓B1_A充電樁"
    // })
    // this.unselectedDeviceList.push({
    //    "dev_id"  : "思納捷大樓B1_B充電樁",
    //    "dev_name": "思納捷大樓B1_B充電樁"
    // })
  },
  computed: {
    offDevList() {
      return this.currentConfig.off_dev
    },
  },
  watch: {
    offDevList(){
      this.count = this.offDevList.length;
    }
  },
  methods: {
    async afterCreateStore() {
      // do nothing
    },
    addOffloadList(itemInfo) {
      this[demandtypes.ADD_OFFLOADLIST] ({...itemInfo})
      this.$nextTick(() => {
        this.addSelect = false
        this.addSelect = true
        this.$refs.addSelect.resetData()
      })
      this.count += 1;
    },
    getDeviceName(dev_id){
      return this.$store.state.deviceName[dev_id] || dev_id
    }
  },
};
</script>
