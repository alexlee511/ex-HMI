//common/constant/demand
import { dev_list , page_flag } from './ist' ;
import { getAlarm , getDemand , closeAlarm} from "network/demand";
var time_clock = 4 ;
export var alarm_flag_obj = false ;
export var alarm_obj = {};
export var demand_obj = {};
async function alarmupdate(){
    if(time_clock >= 5){
        if(alarm_flag_obj){
            let tmp = [];
            try{
                if(dev_list.length !=0){
                    for(let i of dev_list[page_flag]){
                        if(alarm_obj[demand_obj[i]] != null){
                            tmp.push(demand_obj[i])
                        }
                    }
                    if(tmp.length !=0){
                        let res = await getAlarm(tmp.join());
                        if(res['status'] == 'ok'){
                            for(let item of res['device_list']){
                                alarm_obj[item['dev_id']] =  item["mode"];
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        time_clock = 0;
    }
    else{
        time_clock += 1;
    }
}
export function alarm_flag(flag){
    alarm_flag_obj = flag ;
}
export async function CloseAlarm(devid){
    let res = await closeAlarm(demand_obj[devid]);
    return res
    
}
export async function getDemandList(devid){
    
    if(demand_obj[devid] != null){
        return {'status':'ok' , 'data':alarm_obj[demand_obj[devid]]};
    }else{
        return {'status':'fail'}
    }
    
}
export async function update_alarm(){
    let res = await getDemand();
    if(res['status'] == 'ok'){
        for(let item of res['device_list']){
            demand_obj[item['srcId']] =  item["dev_id"];
        }
    }
    let alarm = await getAlarm();
    if(alarm['status'] == 'ok'){
        for(let item of alarm['device_list']){
            alarm_obj[item['dev_id']] =  item["mode"];
        }
    }
    time_clock = 5
}
var time_alarm = window.setInterval(alarmupdate,1000); 