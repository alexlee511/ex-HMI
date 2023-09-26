
import { control } from "network/uci";

export const turnOn = async (devId, config) => {
  try {
    const res = await control( //開啟IO控制器
      `${devId}` , 'B21' , `${config}_CTRL1_1`
    )
    return res
  } catch (error) {
    return //console.log(error)
  }
}

export const turnOff = async (devId, config) => {
  try {
    const res = await control( //關閉IO控制器
      `${devId}` , 'B21' , `${config}_CTRL1_0`
    )
    return res
  } catch (error) {
    return //console.log(error)
  }
}
