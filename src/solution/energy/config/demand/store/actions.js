import { getDemandConfig, setDemandConfig, deleteDemandConfig } from "network/demand"
import { getGetewayInfo } from "network/module"
import { module_filter } from "../../../data/demand/moduleFilter"

import * as types from "./mutation-types"
import vm from "@/main"

export default {
  async [types.GET_DEMAND_LIST_ACTION]({ commit }){ 
    const { device_list } = await getDemandConfig()
    const { gw_id } = await getGetewayInfo()
    for(let dev of device_list){
      let alarm_list = [];
      if(dev.entity_alarm.offloadCmd.length > 0 && dev.entity_alarm.resetCmd.length > 0){
        for(let i = 0; i < dev.entity_alarm.offloadCmd.length; i++){
          const offload = dev.entity_alarm.offloadCmd[i];
          const reset = dev.entity_alarm.resetCmd[i];
          alarm_list.push({
            type: offload.devId.substr(2, 2),
            dev_id: offload.devId,
            open_cmd: offload.cmdId,
            open_cav: offload.cav,
            close_cmd: reset.cmdId,
            close_cav: reset.cav
         });
       }
     }
     delete dev.entity_alarm;
     dev['entity_alarm'] = alarm_list;
    }
    commit(types.GET_GATEWAY_ID, gw_id)
    commit(types.GET_DEMAND_LIST_ACTION, device_list)
  },
  async [types.COMMIT_TO_LIST] ({state}, payload) {
    let isSetList = false
    for (let item of state.deleteList) {
      isSetList = true
      deleteDemandConfig(item.dev_id).then(res => {
        //console.log(res)
      })
    }
    for (let item of state.demandList) {
      if (item.isChange) {
        isSetList = true
        setDemandConfig(
          item.dev_id, 
          item.srcId, 
          item.threshold, 
          item.mode, 
          item.system_alarm, 
          item.alarm, 
          item.off_dev, 
          item.entity_alarm,
          item.offset_val).then(res => {
          //console.log(res)
        })
      }
    }
    return isSetList
  },
  async [types.GET_METER_LIST]({state, commit}, payload) {
    console.log(payload)
    let devId = payload;
    for (let item of vm.$store.state.solutionData.energy.card) {
      if (item.cardType == "normalMeterCard") {
        // 目標電錶只能有現有電錶 + 未被選擇的電錶
        let selectedList = state.demandList.map((x) => x.srcId);
        console.log("Selected Devices: ", selectedList)
        console.log(state.currentConfig)
        
        if (devId) {
          //檢查來源電表是否已被刪除
          // if(state.currentConfig.srcId){
            let currentSrc = item.device.findIndex( dev => { return dev.deviceId === devId});//state.currentConfig.srcId });
            if(currentSrc == -1){
              this.$notify({
                type: 'info',
                title: this.$t("GENERAL.NOTICE"),
                message: "此設備已被刪除。"
              })
            }
            selectedList = selectedList.filter((y) => y !== devId );//state.currentConfig.srcId );
          }
        // }
        
        let meterList = [];
        meterList = meterList.concat(item.device.filter((item) => {
          return selectedList.indexOf(item.deviceId) == -1 && module_filter(item.typename);
        }));

        // if(!devId && !state.currentConfig.srcId && meterList.length > 0) {
        //   state.currentConfig.srcId = meterList[0].deviceId
        // }
        console.log("METERLIST INIT")
        console.log(JSON.stringify(meterList, null, 4));
        commit(types.GET_METER_LIST, meterList);
      }
    }
  }
}