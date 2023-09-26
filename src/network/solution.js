import Qs from 'qs'
import { requestNode } from 'network'
import { getDeviceData2 } from 'common/constant/ist'
import vm from "@/main"
/**
 * 與顯示裝置資料相關的網路請求
 */

async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
export function getDeviceData(deviceId, module) {
  return getDeviceData2(deviceId, module)
}
export function getDeviceDatatmp(deviceId, module) {
  return requestNode({
    method: 'get',
    url: "getData",
    params: {
      deviceId: deviceId,
      module: module
    },
    retry: 0 //ajax重試次數為0
  })
}
export function getDeviceDataApi(dev_id) {
  return requestNode({
    url: "api/instant/data_group",
    params: {
      dev_id
    },
    retry: 0
  })
}
export function getDeviceDataApi_attr(dev_id) {
  return requestNode({
    url: "/api/attr/instant/data",
    params: {
      dev_id
    },
    retry: 0
  },true)
}
//取得即時資料屬性
export function getDeviceAttrApi() {
  return requestNode({
    url: "api/instant/list",
    method: 'get',
    retry: 0
  })
}
export function getDeviceAttrApi_attr(lang) {
  return requestNode({
    url: "api/attr/instant/list",
    method: 'get',
    retry: 0,
    params:{lang}
  })
}
export async function getDeviceName(deviceId ) {
  return requestNode({
    method: "GET",
    url: "api/config/name",
    params: {
      cmd: "get",
      id: deviceId
    }
  })
}

export function getDeviceInfo(module) {
  return requestNode({
    method: "GET",
    url: "api/config/mbus/device/get",
    params: {
      name: module,
    }
  })
}

export async function getBackData() {
    let tmp =await requestNode({method: 'get',url: "api/hmi/config/backdata/get"})
    while(tmp == undefined){
        await sleep(5000)
        tmp =await requestNode({method: 'get',url: "api/hmi/config/backdata/get"})
    }
    return tmp
}

export function setBackData(info) {

  const version = new Date().getTime()
  let Enablesolution = []
  for(let i of info.solutionEnable){
    if(vm.$store.state.connection.connection[i].solutionType == "0" ||vm.$store.state.connection.connection[i].solutionType == undefined ){
                Enablesolution.push(i)
    }
  }
  // 更新時間戳紀錄
  window.version = version
    let params = {
        backGroundImage     : info.backGroundImage,
        homeIcon            : info.homeIcon,
        footerIcon          : info.footerIcon,
        copyrightTW         : info.copyrightTW,
        copyrightEN         : info.copyrightEN,
        lang                : info.lang,
        isCloudConnect      : info.isCloudConnect,
        solutionEnable      : Enablesolution.join(),
        subSolutionEnable  : info.subSolutionEnable,
    }
    let selectList = [];
    Object.keys(info.selectDevice).forEach((solution) => {
      selectList = selectList.concat(Object.keys(info.selectDevice[solution]));
    });
    params.selectList = selectList.join();

    for(let solution of Object.keys(info.selectDevice)){
      for(let cardId of Object.keys(info.selectDevice[solution])){
        try{
          let device = info.selectDevice[solution][cardId].map(dev => `${dev.dev_id}:${dev.order}`);
          params[cardId] = device.join();
        }
        catch(error){
          console.log(error)
        }
      }
    }
    
    requestNode({
        method: 'GET',
        url: "/api/hmi/config/version/set",
        params:{version:version}
    });
  return requestNode({  
    method: 'POST',
    url: "api/hmi/config/backdata/set",
    data: Qs.stringify(params)
  })
}

export async function getVersion() {
    let tmp =await requestNode({method: 'GET', url: "api/hmi/config/version/get"})
    while(tmp == undefined){
        await sleep(5000)
        tmp =await requestNode({method: 'GET', url: "api/hmi/config/version/get"})
    }
    return tmp
}

//取得電價分析順序
export function getAnaSettingord(solution_name){
	return requestNode({
		method: 'GET',
		url: "api/energy/analysis/order/get",
		params: {
		  solution_name
		},
	})

}

//設定電價分析順序
export function setAnaSettingord(solution_name,count,item_list){
	return requestNode({
		method: "GET",
		url: "api/energy/analysis/order/set",
		params: {
			solution_name,
			count,
			item_list
		}
	})
}

export async function getSubSolutionStatus(sol){
  return requestNode({
		method: "GET",
		url: "api/hmi/config/disable_subSolution/get",
		params: {
			sol
		}
	})
}

export async function setSubSolutionStatus(sol, sub_sol){
  return requestNode({
		method: "GET",
		url: "api/hmi/config/disable_subSolution/set",
		params: {
			sol,
      sub_sol
		}
	})
}