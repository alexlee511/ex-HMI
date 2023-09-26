import { DeviceName } from "@/common/constant/profile.js"
import { requestNode } from 'network'

export var cpDataList = []
var flagStopTimer = false

export async function getchargingdevlist() {
    let res = await requestNode({
        method: 'GET',
        url: 'api/ocpp/config/cp/get',
    });
    
    if(res.status!='ok') return []

    let s = res.data_list
    for(let i of s ){
        i.cardId = "chargingCard-01"
        i.cardType = "charging"
        i.cardName = "CHARGING.CHARGING_NORMAL"
        i.cpId = i.cp_id
        i.deviceId = i.dev_id
        i.extType = i.ext_type
        i.cntIdList = i.cnt_id_list
        i.pileNameList = []

        for(let cntId of i.cntIdList){
            let pileId = i.deviceId + '|' + cntId.padStart(2, '0')
            DeviceName[pileId] === undefined ? i.pileNameList.push(pileId) : i.pileNameList.push(DeviceName[pileId])
        }
        i.deviceName = DeviceName[i.deviceId] === undefined ? i.deviceId : DeviceName[i.deviceId]   
         
        delete i.cp_id
        delete i.dev_id
        delete i.ext_type
        delete i.cnt_id_list
    }
    return s
}

export async function getChargingPileTradeList( cnt_id, time){
    console.log(cnt_id, time)
    /*param cp_id: pad cnt_id*/
    return await requestNode({
        method: 'GET',
        url: 'api/ocpp/db/trade/get',
        params:{
            cnt_id,
            time
        }
    });
}

async function getDuration( start_time, end_time){
    //console.log('🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹', start_time, end_time)
    let st = new Date(start_time)
    let et = new Date(end_time)
    let d = et.valueOf() - st.valueOf()
    //console.log(st, et)
    return Math.floor(d/1000/60/60).toString().padStart(2, '0')+':'+ Math.floor(d/1000/60/60%1*60).toString().padStart(2, '0')
}

export async function remoteStart(cp_id, cnt_id){
    return await requestNode({
        method: 'GET',
        url: 'api/ocpp/control/remote_transaction/start',
        params:{
            cp_id,
            cnt_id
        }
    });
}

export async function remoteStop(cp_id){
    let res = await getChargingPileTradeList( cp_id, 'end1')
    let transaction_id = res.data[0].transaction_record[0].id
    return await requestNode({
        method: 'GET',
        url: 'api/ocpp/control/remote_transaction/stop',
        params:{
            cp_id,
            transaction_id
        }
    });
}

export async function remoteEnable(cp_id, cnt_id){
    return await requestNode({
        method: 'GET',
        url: 'api/ocpp/control/cnt_availability/enable',
        params:{
            cp_id,
            cnt_id
        }
    });
}

export async function remoteDisable(cp_id, cnt_id){
    return await requestNode({
        method: 'GET',
        url: 'api/ocpp/control/cnt_availability/disable',
        params:{
            cp_id,
            cnt_id
        }
    });
}

export async function remoteReset(cp_id){
    return await requestNode({
        method: 'GET',
        url: 'api/ocpp/control/cp_power/reset',
        params:{
            cp_id
        }
    });
}

var cpList = []
var cpDataObj = {}
var timer = null
var cnt_dev = 0

export async function start(){
    flagStopTimer = false
    loop()
}

export async function end(){
    //end looping
    flagStopTimer = true
    clearTimeout(timer)
    timer = null
    clear()
}

async function getCurrentDeviceAndPile(demandCpNumber) {
    let key=Object.keys(cpDataObj)[0], cur=0;
    //find current device
    for(let p of Object.keys(cpDataObj)){
        //find current pile
        for(let q in cpDataObj[p]){
            if(cpDataObj[p][q][0]==demandCpNumber) {
                key = p
                cur = q
                break
            }
        }
    }
    return [key, cur]
}

async function loop(){
    if(flagStopTimer) return
    /*Call API to get data*/
    let cnt = 0 //count for processed devices
    if(cpList && cpList.length > 0){
        let res = await getChargingPileTradeList(cpList.toString(), 'end1')
        for(let i in res.data){ //device by device
            cnt += 1
            let arr = await getCurrentDeviceAndPile(cnt)
            let key = arr[0] //current device
            let cur = arr[1] //current pile

            //If no transaction record
            if(res.data[i].transaction_record_count == 0){
                cpDataObj[key][cur] = [cnt,-1,-1]
                continue
            }

            //current device
            let dev = cpDataObj[res.data[i].transaction_record[0].cp_id]
            //replace old data, keep the device's number
            for(let j in dev){
                if(dev[j][0]==cnt){
                    cur = j
                    break
                }
            } dev[cur] = [cnt]

            //get transaction data
            for(let transaction of res.data[i].transaction_record){
                let st = transaction.start_trading_time
                let et = transaction.end_trading_time

                //if et unavailable ---> use current time
                if(et == "" || !et)
                    dev[cur].push(await getDuration(st, Date.now()))
                else
                    dev[cur].push(await getDuration(st, et))

                let stv = transaction.start_trading_value
                let etv = transaction.end_trading_value
                let val = parseInt(etv,10)-parseInt(stv,10)
                isNaN(val) ? dev[cur].push('-') : dev[cur].push(val)
            }
            cpDataObj[res.data[i].transaction_record[0].cp_id] = dev
        }
    }
    timer = setTimeout(()=>{loop()},5000);
}

export function setDevice( demandCpList, cntIdList){
    /* demandCpList = [cp_id1, cp_id2, ...]; 
       cntIdList    = [ [1,2], [1], ...];     */
    /* cpDataObj: { cp_id1: [[1, d1, c1],
                            [2, d2, c2]],
                    cp_id2: [[3, d3, c3]], ...} */
    clear()
    let tmp_cpIdList = []
    for(let i in demandCpList){
        cpDataObj[demandCpList[i]] = []
        for(let cntId of cntIdList[i]){
            cnt_dev +=1 //mark device number
            cpDataObj[demandCpList[i]].push([cnt_dev])
            let tmp = demandCpList[i] + '|' + cntId.padStart(2, '0')
            tmp_cpIdList.push(tmp)
        }
    }
    cpList = tmp_cpIdList
}

export async function getChargingPileTradeInfo(cpId){
    if(cpDataObj) return cpDataObj[cpId]
}

export function clear(){
    cpList = []
    cpDataObj = {}
    cnt_dev = 0
}