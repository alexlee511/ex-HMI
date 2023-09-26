import { uciApi} from "network/uci";

export const getDIOConfigInit = async (devId, name) => {
  // console.log(name)
  const res = await uciApi( //取得所有DIO控制器數據
    "show" ,  "", `/etc/igw/io-list/io.${devId}.list`
  )
  const arr = res.output;
  const arr2 = arr
    .map((item) => {
      return item.split(":");
    })
    .filter(item => {
      return item[0] !== ""
    })
    .map((item) => {
      const obj = {};
      obj.devNo = item[0].split("=")[1]; //編號
      obj.deviceId = devId
      obj.devType = item[1];
      obj.deviceName = name + "|" + obj.devNo
      return obj;
    });
  return arr2
}

export const getDIOConfig = async (devId, name) => {
  // console.log(name)
  const res = await uciApi( //取得所有DIO控制器數據
    "show" ,  "", `/etc/igw/io-list/io.${devId}.list`
  )
  const arr = res.output;
  const arr2 = arr
    .map((item) => {
      return item.split(":");
    })
    .filter(item => {
      return item[0] !== ""
    })
    .map((item) => {
      const obj = {};
      obj.devNo = item[0].split("=")[1]; //編號
      obj.deviceId = devId
      obj.devType = item[1];
      obj.deviceName = name + "|" + obj.devNo
      return obj;
    });
  return arr2
}

export const loadDIO = async (devId, config) => { //對裝置進行暫存 暫存是在讀取該檔案時能讀到新增的資料 但是實際上並未新增
  const res = await uciApi (
    "add" ,  config, `/etc/igw/io-list/io.${devId}.list`
  )
}

export const setDIO = async (devId) => { //對裝置進行套用
  const res = await uciApi (
    "commit" ,  "", `/etc/igw/io-list/io.${devId}.list`
  )
}

export const deleteDIOFile = async (devId) => {
    /*先緩緩，這部分等到時候用IO樣板就會自己刪掉了(O
  const res = await uciConfig (
    `rm -f /etc/igw/io-list/io.${devId}.list`
  )
  */
  return true
}