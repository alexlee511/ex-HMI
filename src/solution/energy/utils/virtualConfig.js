
import { uciApi } from "network/uci";

export const getVirtualDemand = async () => {
  const res = await uciApi( //取得所有需量控制器數據
    "show" ,  "VIRTUALDEMAND", "/etc/igw/15-VIRTUALDEMAND.list"
  )
  const arr = res.output;
  const arr2 = arr
    .map((item) => {
      return item.split(":");
    })
    .filter((item) => {
      return item.indexOf("") == -1 && item.indexOf("null") == -1;
    })
    .filter((item) => {
      return item[0].split("=")[1] == "1";
    })
    .map((item) => {
      // //console.log(item)
      const obj = {};
      obj.module = item[0].split("[")[0];
      obj.arrayIndex = item[0].split("[")[1].split("]")[0]
      obj.enable = item[0].split("=")[1];
      obj.devId = item[1];
      obj.srcId = item[2];
      obj.contractCap = item[3];
      obj.alarmValue = item[4];
      obj.alarmTime = item[5];
      obj.offloadValue = item[6];
      obj.resetValue = item[7];
      obj.offloadMode = item[8] ? item[8] : "4";
      obj.forecastMode = item[9] ? item[9] : "1";
      obj.judgeSource = item[10] ? item[10] : "0";
      return obj;
    });
  return arr2
}