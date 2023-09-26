import { requestNode } from 'network';

export function ConfigEvent(cmd,conf) {
  return requestNode({
    method: 'GET',
    url: '/api/config/event',
    params: {
      cmd: cmd,
      conf : conf
    }
  })
}

export function uciApi(cmd,arg = "",conf = "") {
   let tmp = {cmd:cmd}
   if(arg!=""){
       tmp.arg = arg
   }
   if(conf !=""){
       tmp.conf = conf
   }
  return requestNode({
    method: 'GET',
    url: '/api/config/uci',
    params: tmp
  })
}
export function uciInstruction(cmd) {
  return requestNode({
    method: 'GET',
    url: '/api/instant/info',
    params: {
      file_name: cmd
    },
    retry: 0
  })
}
export function control(dev_id  , cmd , cav) {
  return requestNode({
    method: 'GET',
    url: '/api/control',
    params: {
      dev_id,
      cmd,
      cav
    },
    retry: 0
  })
}
var Cache = {}
export function setCache(info, filepath) {
    Cache[filepath] = info
}

export function getCache(filepath) {
  if(Cache.hasOwnProperty(filepath) != true){
      return {}
  }else{
      return Cache[filepath]
  }
  
}