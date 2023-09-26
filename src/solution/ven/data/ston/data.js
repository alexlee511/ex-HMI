import { requestNode } from 'network'
import vm from "@/main"
import { ConfigEvent } from "network/uci"
export function getVenData() {return requestNode({
    method: 'GET',
    url: 'api/ven/config/get',

  });
}
export function getVenEnv(venId = "") {
  return requestNode({
    method: 'GET',
    url: 'api/ven/out_data/get',
    params: {
        venId
    }
  });
}
export function setVenEnv(venId = "" , date) {
  return requestNode({
    method: 'GET',
    url: 'api/ven/out_data/set',
    params: {
        venId,
        date
    }
  });
}
export async function VEN_polling_init(){
    //console.log("__INIT__")
    runupdate()
    
}
export async function VEN_polling_run(){
    //console.log("VEN_polling_run")
    await upvendata("" ,  true)
    for(let i of ven_card){
        //console.log(i)
        //如果有事件
        if(i.alarm){
            if(i.eid == -1 ){
                i.alarm = false
            }else if(i.on_time - i.time <= 0){
                stop_alarm()
                i.alarm = false
            }
        }else{
            if(i.eid != -1 ){
                // console.log("🙌🙌🙌🙌🙌🙌")
                // console.log(i.on_time - i.time)
                if(!(i.on_time - i.time <= 0)){
                    let alarm_obj = {}
                    var st = time_font(i.st )
                    var et = time_font(i.st ,parseInt(i.duSec) / 60)
                    alarm_obj.alarm_time = st + '-' + et
                    alarm_obj.alarm_id   = i.venId
                    alarm_list.push(alarm_obj)
                    //彈出警告視窗
                    vm.$store.state.polling.addalarm('VEN_ALARM') ; 
                    i.alarm = true
                }
            }
        }
    }
    //vm.$store.state.polling.delalarm('VEN_ALARM') ; 
}
export function stop_alarm(){
    vm.$store.state.polling.delalarm('VEN_ALARM') ; 
    
    
}
export let alarm_list = []
function time_font(time_text ,add = 0){//M
    let d = new Date(time_text);
    let H = ((d.getHours() + parseInt(add / 60))%24).toString()
    let M = (d.getMinutes() + add % 60).toString()
    let date_format_str = (H.length==2?H:"0"+H)+":"+(M.length==2?M:"0"+M)
    return date_format_str
}
let flag = false;
export let ven_card = [] ;
let time_flag = 0;
let default_value = {
    "time"      : "VEN.DEFTIME",
    "status"    : "VEN.DEFSTATUS",
    "duSec"     : 0,
    "undefined" : "VEN.UNDEFINED",
    "eid"       : -1,
    "planId"    : "VEN.UNNO",
    "itvList"   : [],
    "1"         : "VEN.TYPE1",
    "2"         : "VEN.TYPE2",
    "3"         : "VEN.TYPE3",
    "unit1"     : "(kw)",
    "unit2"     : "",
    "unit3"     : "(°C)",
    "endstatus" : "VEN.ENDSTATUS",
    "whatstatus": "VEN.WHATSTATUS",
    "type2_0":"VEN.TYPE2_0",
    "type2_1":"VEN.TYPE2_1",
    "st":"",
    "alarm":false,
    
};
let ven_card_nb = [];

export async function upvendata(devid = "" , retry = false){
    if(time_flag % 60 == 0 || retry){
        let req = {'status' : "false"};
        while(req.status != "ok"){
            req = await getVenData();
        }
        for(let i of req.venlist){
            let nb = ven_card_nb.indexOf(i.venId);
            if(nb == -1){
                //加入即可
                let tmp = {};
                tmp.cardType    = "venCard" ;
                tmp.eid         = get(i , 'eid' , default_value.eid ) ;
                tmp.duSec       = get(i , 'duSec' , default_value.duSec );
                tmp.itvList     = get(i , 'itvList' , default_value.itvList ) ;
                tmp.planId      = get(i , 'planId' , default_value.planId ) ;
                tmp.planType    = get(i , 'planType' , default_value.planType ) ;
                tmp.Type        = get(default_value ,get(i, 'planType' , default_value.undefined) , default_value.undefined ) ;
                tmp.st          = get(i , 'st' , default_value.st ) ==  default_value.st ?  default_value.st : settime(i.st);
                tmp.alarm       = default_value.alarm;
                tmp.on_time     = 0;
                
                tmp.venId       = i.venId ;
                tmp.status      = default_value.status
                tmp.time        = default_value.time
                tmp.unit        = get(default_value , "unit"+get(i , 'planType', default_value.undefined ) , "") ;
                ven_card.push(tmp);
                ven_card_nb.push(i.venId);
                nb = ven_card_nb.indexOf(i.venId)
                if(get(i , 'eid' , default_value.eid ) == default_value.eid)continue;
            }else{
                // console.log(get(i , 'eid' , default_value.eid ))
                // console.log(i)
                if(get(i , 'eid' , default_value.eid ) == default_value.eid){
                    if(ven_card[nb].eid  != -1){
                        ven_card[nb].eid    = default_value.eid;
                        ven_card[nb].time   = "0";
                        ven_card[nb].status = default_value.endstatus;
                        ven_card[nb].unit   = "";
                    }
                    
                    continue
                }
                if(get(i , 'eid' , default_value.eid ) != ven_card[nb]["eid"]){
                    ven_card[nb].cardType    = "venCard" ;
                    ven_card[nb].eid         = get(i , 'eid' , default_value.eid ) ;
                    ven_card[nb].duSec       = get(i , 'duSec' , default_value.duSec );
                    ven_card[nb].itvList     = get(i , 'itvList' , default_value.itvList ) ;
                    ven_card[nb].planId      = get(i , 'planId' , default_value.planId ) ;
                    ven_card[nb].planType      = get(i , 'planType' , default_value.planType ) ;
                    ven_card[nb].Type        = get(default_value ,get(i , 'planType' , default_value.undefined) , default_value.undefined ) ;
                    ven_card[nb].st          = get(i , 'st' , default_value.st ) ==  default_value.st ?  default_value.st : settime(i.st);
                    ven_card[nb].unit        = get(default_value , "unit"+get(i , 'planType', default_value.undefined ) , "") ;
                }
                
                
            }
            let tmp_list = [];
            for(let j of ven_card[nb].itvList){
                j.uid = parseInt(j.uid,10);
                j.iduSec = parseInt(j.iduSec,10);
                
                tmp_list[j.uid] = j;
            }

            let flag = ven_card[nb].itvList.length - 1;
            var value__ = 0 ;
            while( flag > 0 ){
                ven_card[nb].itvList[flag].iduSec = value__;
                value__ += ven_card[nb].itvList[flag-1].iduSec
                flag -- ;
            }
            ven_card[nb].itvList[flag].iduSec = value__;
        }
    }
    if(time_flag % 1 == 0 || retry){
        var Nowtime = new Date();
        //更新該卡片資訊
        for(let i of ven_card){
            //判斷有沒有事件
            if(get(i , 'eid' , default_value.eid ) == default_value.eid)continue;
            let time  = new Date(i.st);
            // console.log(time.getTime() - Nowtime.getTime())
            // console.log(( time.getTime() - Nowtime.getTime() )/(1000*60))
            // console.log(Math.ceil(( time.getTime() - Nowtime.getTime() )/(1000*60)))
            let on_time = Math.ceil(( time.getTime() - Nowtime.getTime() )/(1000*60)) + parseInt(i.duSec / 60) //(min)
            i.on_time = on_time;
            //如果超時了
            if(on_time <= 0){
                i.eid    = default_value.eid;
                i.time   = "0";
                i.status = default_value.endstatus;
                i.unit   = "";
            }else if(on_time > ( i.duSec / 60) ){//還沒到時間
                i.time   = i.duSec / 60;
                i.status = default_value.whatstatus;
                
            }else{//正在時間賽跑
                //修改倒數時間
                i.time = on_time;
                for(let j of i.itvList){
                    if(on_time > j.iduSec/ 60){
                        switch(i.Type){
                            case default_value['1']:
                            case default_value['3']: 
                                i.status = j.value;
                                break;
                            case default_value['2']:
                                i.status = get(default_value,"type2_"+(parseInt(j.value)).toString(),"");
                                break;  
                        }
                        break;
                    }
                }
            }
        }
    }
    if(!retry){
        time_flag ++;
        if(time_flag >= 86400){
            time_flag = 0;
        }
        if(flag)window.setTimeout( upvendata,1000);
    }
    
    
}
function settime(time){
    let time_array = time.split('-');
    let time_req  = (  time_array[0]+'-'+
                        time_array[1]+'-'+
                        time_array[2]+' '+
                        time_array[3]+':'+
                        time_array[4]+':'+
                        time_array[5]);
    return time_req
}
function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}
export async function runupdate(){
    time_flag = 60;
    if(!flag){
        
        flag = true;
        await upvendata();
    }
    
}