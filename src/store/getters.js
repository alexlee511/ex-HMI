export default {
  getTrueRoutes(state) { //不知道為甚麼計算路由在緩存屬性中不能進行 似乎是緩存屬性無法抓到函數的變化?
    let routerList = []
    //篩選路由
    for (let item of state.backData.solutionEnable) {
      for (let key in state.route.routeList) {
        if (item === key) {
          routerList.push(...state.route.routeList[key])
        }
      }
    }
    return routerList
  },
  getTrueHome(state) { //如果不存在該方案必須是取現有方案的第一個
    return state.backData.solutionEnable[0]
  },
  getCopyRight(state) {
    let text = 'copyright' + state.backData.lang
    let copyrigt = state.backData[text]
    return copyrigt
  },
  getTypeRule(state) { //列出卡片類型規則表
    let newArr = []
    for (let key in state.connection.connection) {
      for (let item of state.connection.connection[key].card) {
        newArr.push(item)
      }
    }
    const origin = newArr.map(item => item.cardType)
    const result = newArr.filter((item, index, arr) => {
      return origin.indexOf(item.cardType) === index;
    });
    let typeArr = []
    for (let item of result) {
      for (let itemx of item.device) {
        const obj = {}
        obj.key = itemx
        obj.value = item
        typeArr.push(obj)
      }
    }
    return typeArr
  },
  getType(state) { // 列出所有卡片類型
    let newArr = []
    for (let key in state.solutionData) {
      for (let item of state.solutionData[key].card) {
        newArr.push(item)
      }
    }
    const origin = newArr.map(item => item.cardType)
    const result = newArr.filter((item, index, arr) => {
      return origin.indexOf(item.cardType) === index;
    });
    return result
  },
  getControlDevList(state, getters) { // 列出能被控制的裝置
    let connectDeviceList = []
    for (let item of getters.getType) {
      switch (item.cardType) {
        case "DOControllerCard":
          const DIOControllerList = item.device.filter((item) => {
            return item.setting;
          });
          connectDeviceList.push(...DIOControllerList);
          break;
        case "IRControllerCard":
          connectDeviceList.push(...item.device);
          break;
        case "meterCard":
          const meterControllerList = item.device.filter(item => {
            return item.typename === "EM1100P" || item.typename === "EBI21R"
          })
          connectDeviceList.push(...meterControllerList);
          break;
      }
    }
    return connectDeviceList
  },
  getBackLang(state) {
    const obj = {
      TW: 'zh-tw',
      EN: 'en'
    }
    return obj[state.backData.lang]
  }
}
