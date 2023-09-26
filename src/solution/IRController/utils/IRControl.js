
import { uciInstruction , control } from "network/uci";

const list = {
  on:{
    cav: "NULL_NULL_1",
  },
  off:{
    cav: "NULL_NULL_2",
  },
  fan:{
    cav: "NULL_NULL_3",
  },
  cool:{
    cav: "NULL_NULL_4",
  },
  dry:{
    cav: "NULL_NULL_5",
  },
  temp_20:{
    cav: "NULL_NULL_6",
  },
  temp_21:{
    cav: "NULL_NULL_7",
  },
  temp_22:{
    cav: "NULL_NULL_8",
  },
  temp_23:{
    cav: "NULL_NULL_9",
  },
  temp_24:{
    cav: "NULL_NULL_10",
  },
  temp_25:{
    cav: "NULL_NULL_11",
  },
  temp_26:{
    cav: "NULL_NULL_12",
  },
  temp_27:{
    cav: "NULL_NULL_13",
  },
  temp_28:{
    cav: "NULL_NULL_14",
  },
}
//改成API
export const getStatus = async (devId) => {
  //console.log(`cat /var/igw/info/${devId}.info`)
  const res = await uciInstruction(
    `${devId}`
    // `cat /var/igw/info/${devId}.info`
  )
  return res.data
}

export const controlInstruction = async (devId, cav) => {
  if(list[cav]) {
    //console.log( `/bin/igw/igw-agent -ctl -d ${devId} -cmd B10 -cav ${list[cav].cav}`)
    try {
      const res = await control(
        `${devId}` , 'B10' ,`${list[cav].cav}`
      )
      return res
    } catch (error) {
      return //console.log(error)
    }
  }
  alert('out of range')
}
