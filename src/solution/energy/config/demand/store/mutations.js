import * as types from "./mutation-types"
import { getDefaultState } from "./index"
import { deepCopy } from "common/utile/utile"

export default {
  [types.GET_DEMAND_LIST_ACTION] (state, payload) {
    state.demandList = payload
  },
  [types.DELETE_DEMAND_LIST_ACTION] (state, payload) {
    state.deleteList.push(state.demandList[payload])
    state.demandList.splice(payload, 1)
  },
  [types.GET_GATEWAY_ID] (state, payload) {
    payload = payload.substring(4);
    payload = payload.substring(0, payload.length - 2);
    state.gatewayId = payload
  },
  [types.GET_METER_LIST] (state, payload) {
    state.meterList = payload
  },
  [types.GET_CURRENT_DEVICE] (state, payload) {
    if (payload) {
      const currentDev = state.demandList.find(item => {
        return item.dev_id == payload
      })
      state.currentConfig = deepCopy(currentDev)
      state.currentConfig.isChange = true
    } else {
      state.currentConfig = {
        isChange: true,
        threshold:"200_180_190_160",
        mode:"1_1_1",
        off_dev: [],
        alarm: 0,
        system_alarm: 0,
        entity_alarm: []
      }
    }
  },
  [types.CLEAR_CURRENT_DEVICE] (state, payload) {
    state.currentConfig = {}
  },
  [types.CHANGE_DEMAND_VALUE] (state, payload) {
    state.currentConfig.threshold = payload
  },
  [types.CHANGE_DEMAND_ALARM] (state, payload) {
    state.currentConfig.system_alarm = payload
    state.currentConfig.alarm = payload
  },
  [types.CHANGE_DEMAND_MODE] (state, payload) {
    state.currentConfig.mode = payload
  },
  [types.CHANGE_DEMAND_OFFSET] (state, payload) {
    state.currentConfig.offset_val = payload
  },
  [types.ADD_ALARMLIST] (state, payload) {
    state.currentConfig.entity_alarm.push(payload);
  },
  [types.DELETE_ALARMLIST] (state, payload) {
    state.currentConfig.entity_alarm.splice(payload, 1);
  },
  // 修改卸載設定
  [types.CHANGE_OFFLOADLIST] (state, payload) {
    const { index, info } = payload
    state.currentConfig.off_dev[index] = info
  },
  [types.ADD_OFFLOADLIST] (state, payload) {
    state.currentConfig.off_dev.push(payload)
  },
  [types.DELETE_OFFLOADLIST] (state, payload) {
    state.currentConfig.off_dev.splice(payload, 1)
  },

  // 保存
  [types.MODIFY_DEMAND_LIST] (state, payload) {
    state.demandList = state.demandList.map(item => {
      if(item.dev_id == state.currentConfig.dev_id) {
        return state.currentConfig
      } else {
        return item
      }
    })
  },
  [types.ADD_DEMAND_LIST] (state, payload) {
    const idArr = state.demandList.map(x => Number(x.dev_id.substr(-2)))
    
    let id = 0
    while(idArr.indexOf(id) !== -1) {
      id = id + 1
    }
    const demandId = "IN15" + state.gatewayId + ('00' + id.toString()).substr(id.toString().length);
    state.currentConfig.dev_id = demandId
    state.demandList.unshift(state.currentConfig)
  },
  [types.RESET_STORE_DATA] (state, payload) {
    Object.assign(state, getDefaultState())
  }
}