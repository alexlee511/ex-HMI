import { uciApi} from "network/uci";

export function formateUciString(dest, param, string) {

  return {
    async getResetInfo() {
      const res = await uciApi(
        "show" , `/etc/igw/${dest}` , `${param}`
      )
      // //console.log(res)
      const arr = res.output.filter(item => item)

      return arr.map(item => {
        const items = item.split("=")
        const statement = items[1].split(":")
        const originFormat = string.split(":")
        const obj = {}
        for (let i = 0; i < originFormat.length; i++) {
          const attr = originFormat[i].replace("<", "").replace(">", "")
          obj[attr] = statement[i]
        }
        obj.arrayIndex = items[0].split("[")[1].split("]")[0]
        return obj
      })
    },
    async deleteInfo(config) {
      const res = await uciApi(
        "delete" ,  `${param}[${config}]` , `/etc/igw/${dest}`
      )
      //console.log('刪除')
    },
    async setInfo() {
      const res = await uciApi (
        "commit" , '' , `/etc/igw/${dest}`
      )
      //console.log('套用')
    },
    async addInfo(config) {
      //console.log(`/bin/igw/uci -c /etc/igw/${dest} add ` + config)
      const res = await uciApi (
        "add" , config , `/etc/igw/${dest}`
      )
      //console.log('新增')
    }
  }
}