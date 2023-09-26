import { getDefaultState } from "./"

export default {
  changeList(state, payload) {
    state.list = payload
  },
  resetList(state) {
    // console.log(getDefaultState())
    console.log("重置store")
    Object.assign(state, getDefaultState())
  },
  modifyList(state, payload) {
    console.log(payload)
    
    // 有sceneId就合併
    if(payload.scene_id) {
      console.log(payload.scene_id)
      console.log(state.list)
      state.list = state.list.map(item => {
        if(item.scene_id === payload.scene_id) {
          return payload
        } else {
          return item
        }
      })
    } else { // 沒有則新增
      console.log(state.list)
      let id = (state.list.length+1)
      //payload.scene_id = Number(state.list[0].scene_id) + 1
      state.list.unshift(payload)
    }
  },

  deleteListDev(state, payload) {
    state.deleteList.push(state.list[payload])
    state.list.splice(payload, 1)
  }
}