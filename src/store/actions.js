// import { getBackData } from "network/store"
import { getBackData, getSubSolutionStatus } from "network/solution"
import { createCard, setLang } from "common/constant/profile"
import { polling , polling_init } from "common/constant/polling"

import vm from "@/main"
let flag = true 
const backDataInit = {
  "lang": "TW",
  "solutionEnable": [
    "energy"
  ],
  "subSolutionEnable": [],
  "selectDevice": {
    "energy": {}
  },
  "backGroundImage": "img/overview_bkg.47925307.png",
  "homeIcon": "",
  "footerIcon": "",
  "copyrightTW": "思納捷科技股份有限公司 版權所有 2020",
  "copyrightEN": "Copyright © 2020 InSynerger Inc. All rights reserved",
  "isCloudConnect": true
}

export default {
  pushNormalData(context, payload) {
    if (!context.state.check) {
      context.state.check = true
      context.state.error = 0
      setTimeout(() => {
        if (context.state.error === 0) {
          context.commit('addAjaxState', false)
        }
        context.state.check = false
      }, 10000)
    }
  },
  pushErrorData(context, payload) {
    context.state.error++
    setTimeout(() => {
      if (context.state.error !== 0) {
        context.commit('addAjaxState', true)
      }
    }, 3000)
  },
  async getRouteList(context, payload) {
    let res = await getBackData()
    if(res.status == 'fail') {
        res = backDataInit
    }
    for(let i in context.state.connection.connection){
        if(context.state.connection.connection[i].solutionType == "1"){
            res.solutionEnable.push(i)
        }
    }
    context.commit('addBackData', res)
    let lang = res.lang.toLowerCase()
    vm.$i18n.locale = lang; //更改參數
    setLang(lang);
    context.commit('setRouteList')
  },
  resetRoute(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('setSolutionEnable', payload)
      resolve()
    })
  },
  async getSolutionData(context, payload) {
    setLang(vm.$i18n.locale)
    context.state.isProgressProfile = true;
    //let enablelist = {}
    //let connection = context.state.connection.connection
    //for(let i of vm.$store.state.backData.solutionEnable){
    //    console.log(i)
    //    if(connection[i] != undefined ){
    //        enablelist[i] = connection[i]
    //    }
    //    
    //}
    //const res = await createCard(enablelist);
    const res = await createCard(context.state.connection.connection);
    for(let i of context.state.backData.solutionEnable){
        if( context.state.connection.connection[i].solutionEnableFunc != undefined ){
            context.state.connection.connection[i].solutionEnableFunc()
        } 
    }
    console.log("這裡是總action這裡")
    console.log(res)
    console.log(context)
    context.state.isProgressProfile = false;
    context.commit('setSolutionData', res)
    //20220613新增polling
    if(flag){
        await polling_init();
        window.setInterval(polling,1000); 
        flag = false
    }
    await getSubSolutionData();
    
    context.state.loading = false;
  },
}

async function getSubSolutionData(){
  let solution = vm.$store.state.backData.solutionEnable
  let res = await getSubSolutionStatus(solution.toString())
  while(res == undefined){
    await sleep(3000)
    res = await getSubSolutionStatus(solution.toString())
  }

  let subSolObj = {}
  if(res.data){
    for(let solution of res.data){
      subSolObj[solution.sol] = solution.sub_sol_list
    }
    //put enabled subsol into store
    let subSolEnabled = {}
    let button = vm.$store.state.overview.button
    for(let sol of Object.keys(button)){
      if(button[sol].features.length===1) continue;
      subSolEnabled[sol] = []
      for(let feature of button[sol].features){
        if(!feature.type) continue;
        let disabled = false

        if(subSolObj[sol]){
          for(let subsol_type of subSolObj[sol]){
            if(feature.type == subsol_type){
              disabled = true
              break
            }
          }
        }

        if(!disabled)
          subSolEnabled[sol].push(feature.type)
      }
      if(subSolEnabled[sol].length == 0) delete subSolEnabled[sol]
    }
    vm.$store.state.backData.subSolutionEnable = subSolEnabled
  }
}