import { requestNode } from 'network'
import vm from "@/main"
export let devicelist   = [];
export let dataflag = 0;
//console.log("👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧👩‍🔧")
devicelist = []
getadb()
//console.log("💨💨💨💨💨💨💨💨💨")
export function adbscan() {
  return requestNode({
    method: 'GET',
    url: '/api/special/adb/scan',
    params: {
        timeout: 86400*1000
    }
  });
}
export function adbrestart(ip) {
  return requestNode({
    method: 'GET',
    url: '/api/special/adb/restart',
    params: {
        ip,
        port:5555
    }
  });
}
export async function getadb(){
    dataflag = 0
    devicelist   = [];
    let r = await adbscan()
    dataflag = 1;
    if(r.status != 'ok'){
        return
    }
    for(let i of r.data){
        for(let j of i.result){
            if(j.port == "5555" && j.state == "open"){
                devicelist.push({
                    'cardType'   : 'elecCard',
                    'deviceId'   : i.ip,
                    'deviceName' : i.ip,
                    'slave'      : 'X',
                })
                break
            }
        }
    }
    
}
export function restart(ip) {
  return {'status' : 'ok'}
}
