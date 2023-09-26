import { controlDevice } from "network/control"

const list = {
  on:{
    cmd: "B07",
    cav: "NULL_16_1",
  },
  off:{
    cmd: "B07",
    cav: "NULL_16_0",
  },

  // 模式
  fan:{
    cav: "NULL_18_2",
  },
  cool:{
    cav: "NULL_18_0",
  },
  dry:{
    cav: "NULL_18_1",
  },
  auto: {
    cav: "NULL_18_3",
  },

  // 溫度
  temp_18:{
    cav: "NULL_27_18",
  },
  temp_19:{
    cav: "NULL_27_19",
  },
  temp_20:{
    cav: "NULL_27_20",
  },
  temp_21:{
    cav: "NULL_27_21",
  },
  temp_22:{
    cav: "NULL_27_22",
  },
  temp_23:{
    cav: "NULL_27_23",
  },
  temp_24:{
    cav: "NULL_27_24",
  },
  temp_25:{
    cav: "NULL_27_25",
  },
  temp_26:{
    cav: "NULL_27_26",
  },
  temp_27:{
    cav: "NULL_27_27",
  },
  temp_28:{
    cav: "NULL_27_28",
  },

  // 風速
  wind_0: {
    cav: "NULL_19_0",
  },
  wind_1: {
    cav: "NULL_19_1",
  },
  wind_2: {
    cav: "NULL_19_2",
  },
  wind_3: {
    cav: "NULL_19_3",
  },
  wind_4: {
    cav: "NULL_19_4",
  },
  wind_5: {
    cav: "NULL_19_5",
  },
  wind_6: {
    cav: "NULL_19_6",
  },
  wind_7: {
    cav: "NULL_19_7",
  },
  wind_8: {
    cav: "NULL_19_8",
  },
  wind_9: {
    cav: "NULL_19_9",
  },
  wind_10: {
    cav: "NULL_19_10",
  },
  wind_11: {
    cav: "NULL_19_11",
  },
  wind_12: {
    cav: "NULL_19_12",
  },
  wind_13: {
    cav: "NULL_19_13",
  },
  wind_14: {
    cav: "NULL_19_14",
  },
  wind_15: {
    cav: "NULL_19_15",
  },
}

export const controlInstruction = async (devId, cav) => {
  if(list[cav]) {
    // //console.log( `/bin/igw/igw-agent -ctl -d ${devId} -cmd B10 -cav ${list[cav].cav}`)
    try {
      const res = await controlDevice(
        devId, "B07", list[cav].cav , list[cav].cav.split('_')[1]
      )
      return res
    } catch (error) {
      return //console.log(error)
    }
  }
  alert('out of range')
}

// {
//   "module_name": "23-TSAIRC",
//   "ctl_attr_list": [
//       {
//           "control_type": 0,
//           "writeCmd": "B07",
//           "attrId": "16",
//           "value_list": [
//               {
//                   "name": "Off",
//                   "value": "0"
//               },
//               {
//                   "name": "On",
//                   "value": "1"
//               }
//           ],
//           "description": "Power"
//       },
//       {
//           "control_type": 1,
//           "writeCmd": "B07",
//           "attrId": "18",
//           "value_list": [
//               {
//                   "name": "Cold",
//                   "value": "0"
//               },
//               {
//                   "name": "Wind",
//                   "value": "1"
//               },
//               {
//                   "name": "Dehumidify",
//                   "value": "2"
//               },
//               {
//                   "name": "Warm",
//                   "value": "3"
//               }
//           ],
//           "description": "OP-Mode"
//       }
  // ]