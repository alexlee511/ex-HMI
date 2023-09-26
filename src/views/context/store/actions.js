import { getDeviceInfo } from "network/solution";
import {
  getSceneList,
  getControlAttr,
  setSceneList,
  deleteSceneList
} from "network/scence"

export default {
  async getList({ dispatch, commit, getters, rootGetters, state }, payload) {
    // 判斷有沒有緩存
    if(payload !== "re") {
      if(state.list.length) return
    }
    
    const { device: devList } = await getDeviceInfo()
    // console.log(devList)
    const res = await getSceneList()
    const sceneList = res.scene_profile
    console.log(getters.getCurrentLan)
    const { module_list: controlType } = await getControlAttr(null, getters.getCurrentLan)

    console.log(controlType)

    for(let scene of sceneList) {
      // console.log(scene)
      // console.log(controlType)
      for(let item of scene.control_list) {
        console.log(item)
        const { cmd, cav } = item
        const [ command, attr, value ] = cav.split("_")
        // console.log(command, attr, value)
        const dev = devList.find(x => { 
          const devId = item.dev_id.split("|")[0]
          return x.dev_id === devId
        })
        //console.log(dev)
        if(!dev) continue
        //split('-')
        let ctrList = [] ;
        for(let i of controlType){
            //console.log("SSSSSSSSSSSS",i.module_name.substr(i.module_name.indexOf('-' ) + 1))
            if(i.module_name.substr(i.module_name.indexOf('-' ) + 1) == dev.name){
                ctrList = i.ctl_attr_list
                break;
            }
        }
        let ctl_info = {} ;
        console.log(ctrList,cmd,attr)
        for(let i of ctrList){
            if(i.writeCmd == cmd && i.attrId == attr){
                ctl_info = i ;
                break;
            }
        }
        console.log("TTTT",ctl_info)
        if(Object.keys(ctl_info).length != 0){
            const { value_list: valueList, description, range } = ctl_info;
            if(ctl_info.range != 3){
                item.description = description
                item.name =  value;
                for(let i of valueList){
                    if(i.value == value){
                        item.name = i.name
                        break;
                    }
                }
            }
            else{
                item.description = description
                item.name = value
            }
          
        }
      }
    }
    // console.log(sceneList)
    commit("changeList", sceneList)
  },

  // <devid>_<cmd>_<cav>
  async saveList({commit, state}, payload) {
    // console.log(state.list)
    console.log(state.list, state.deleteList)
    for(let item of state.list) {
      // console.log(item)
      if(!item.isModify) continue
      let statement = "";
      for(let itemx of item.control_list) {
        statement = statement + `${itemx.dev_id}_${itemx.cmd}_${itemx.cav};`
      }
      // console.log(statement.substr(0, statement.length - 1))
      // console.log(statement)
      // console.log(item.scene_name, statement, item.scene_id)
      const res = await setSceneList(item.scene_name, statement.substr(0, statement.length - 1), item.scene_id)
      console.log(res)
    }

    if(state.deleteList.length > 0) {
      for(let item of state.deleteList) {
        await deleteSceneList(item.scene_id)
      }
    }

    return true
  },

  async resetAndGetList({commit}) {
    
    
  },

  // async deleteLsit() {
  //   state
  // }
}