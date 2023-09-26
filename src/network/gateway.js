import { requestNode } from 'network'
import Qs from 'qs'
export function restart() {
  return requestNode({
    method: 'GET',
    url: 'api/restart'
  })
}

export function getZigbeeConfig() {
  return requestNode({
    method: 'GET',
    url: 'api/zigbee/config/get'
  })
}

export function getNetworkConfig() {
  return requestNode({
    method: 'GET',
    url: 'api/config/network/get'
  })
}

export function setNetworkConfig(protocol, static_ipaddr, static_netmask, static_gateway, static_dns) {
  return requestNode({
    method: 'GET',
    url: '/api/config/network/set',
    params: {
      protocol: protocol,
      static_ipaddr: static_ipaddr,
      static_netmask: static_netmask,
      static_gateway: static_gateway,
      static_dns: static_dns
    }
  })
}

export function getCloudSetting() {
  return requestNode({
    method: 'GET',
    url: 'api/config/get'
  })
}

export function setCloudSetting(cs_addr, cs_port) {
  return requestNode({
    method: 'GET',
    url: 'api/config/set',
    params: {
      cs_addr: cs_addr,
      cs_port: cs_port
    }
  })
}

export function getSystemStatus() {
  return requestNode({
    method: 'GET',
    url: 'api/status/system',
    retry: 0 //ajax重試次數為0
  })
}
export function setCsConnect (cs_connect) {
  return requestNode({
    method: 'GET',
    url: 'api/config/set',
    params : {
        cs_connect
    },
    retry: 0 //ajax重試次數為0
  })
}
export function webRestart(){
  return requestNode({
    method: 'GET',
    url: 'api/status/webrestart'
  })
}
//取得複合式裝置
export function complexGet(card_id , plan_name){
  return requestNode({
    method: 'GET',
    url: 'api/config/complex/get',
    params : {
        card_id,
        plan_name
    },
  })
}
export function complexSet(plan_name , page_list , page_name , name , card_id ){
    let params           = page_name ;
    params.card_id   = card_id ;
    params.plan_name = plan_name ;
    params.page_list = page_list ;
    params.name      = name ;
  return requestNode({
    method: 'GET',
    url: 'api/config/complex/set',
    params : params,
  })
}
export function complexDel(card_id ){
  return requestNode({
    method: 'GET',
    url: 'api/config/complex/delete',
    params : {
        card_id,
    },
  })
}
export class Network {
  constructor(info) {
    this.static_broadcast = info.static_broadcast? info.static_broadcast: "",
    this.static_dns = info.static_dns,
    this.static_gateway = info.static_gateway,
    this.static_ipaddr = info.static_ipaddr,
    this.static_netmask = info.static_netmask,
    this.protocol = info.protocol
  }
}
//2023 06 16 新增

export function formulaGet(type , module_name ){
  return requestNode({
    method: 'GET',
    url: 'api/config/formula/template',
    params : {
        type: type,
        module_name: module_name,
    },
  })
}
export function formulaSet(type , module_name , op_count , op ){
  return requestNode({
    method: 'POST',
    url: 'api/config/formula/template',
    data: Qs.stringify({
        type: type,
        module_name: module_name,
        op_count: op_count,
        op: op,
        override : 0
    })
  })
}

export function deviceformulaGet(type , module_name , dev_id ){
  return requestNode({
    method: 'GET',
    url: 'api/config/formula/device',
    params : {
        type , 
        module_name , 
        dev_id,
    },
  })
}
export function deviceformulaSet(type , module_name , dev_id , attr , formula_id){
  return requestNode({
    method: 'POST',
    url: 'api/config/formula/device',
    data: Qs.stringify({
        type: type,
        module_name: module_name,
        attr: attr,
        dev_id: dev_id,
        formula_id : formula_id
    })
  })
}
export function deviceformulaDel(type , module_name , dev_id ){
  return requestNode({
    method: 'DELETE',
    url: 'api/config/formula/device',
    params : {
        type , 
        module_name , 
        dev_id,
    },
  })
}