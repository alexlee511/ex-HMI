
//一個func定時更新 ist(obj)
//一個func去更新 要詢問的devid
//一個func去撈取所需要的資訊
// 會去呼叫 getDeviceData(deviceId, module) 
// dev_list =[devid]

import vm from "@/main";
import { getDeviceDataApi , getDeviceDataApi_attr} from "network/solution";

export var ist_obj = {};
export var dev_list = [];
export var page_flag = 0 ;
export var time_clock = 14.5 ;
export let loop_function = undefined ;

var _callbacklist = {} ;
var tmp_flag = false ;


//翻頁
export function page_set(nb){
    page_flag = nb;
    time_clock = 14.5;
	tmp_flag = false;
}

export async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
export async function set_Device_Data(devid , _id ,_value){
    console.log("set_Device_Data")
    console.log(devid , _id , _value)
    let now = new Date()
    let month = now.getMonth()+1
    if(month<10){
        month = "0"+month
    }
    if(ist_obj.hasOwnProperty(devid)){
        for(let i in ist_obj[devid].data){
            if(Object.keys(vm.$store.state.deviceCommand.attrConnversionList).includes(_id)){
                _id = vm.$store.state.deviceCommand.attrConnversionList[_id]
            }
            if(ist_obj[devid].data[i].id == _id){
                ist_obj[devid].time = now.getFullYear() + "-" + month + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
                ist_obj[devid].data[i].value = _value
                return true;
            }
        }
    }
    return false;
    
}
export async function get_Device_Data(devid){
    let res = await getDeviceDataApi_attr(devid);
    if(res['status'] == 'ok'){
        for(let item of res['device_list']){
            if(ist_obj.hasOwnProperty(item['dev_id'])){
                if(new Date(ist_obj[item['dev_id']].time).getTime() >= new Date(item['time']).getTime()){
                    console.log('continue')
                    continue ;
                }
            }
            let tmp = {}
            tmp.dev_id          = item.dev_id
            tmp.time            = item.time
            tmp.count           = item.count
            tmp.connect         = item.connect_status
            tmp.data            = []
            for(let i of item.data){
                let data = {
                    id      : i.old_attr    ,
                    name    : i.name        ,
                    value   : i.value       ,
                    unit    : i.unit        ,
                    attr    : i.attr        ,
                }
                if(_attr[data.attr]!= undefined){
                    data = _attr[data.attr].setValue(data)
                }
                tmp.data.push(data)  
            }
            ist_obj[item.dev_id] = tmp
        }
    }
}
//定時更新(每0.1s刷新一次)
export async function update() {
    if(time_clock >=15){
        time_clock = 0;
        if(dev_list[page_flag] !== null){
            try{
                let tmp = dev_list[page_flag].join();
                await get_Device_Data(tmp);
                if(loop_function != undefined){
                    await loop_function();
                }
				ist_obj['status'] = 'ok'
            }catch(error){
				ist_obj['status'] = 'fail'
            }
        } 
        
    }else{
        time_clock += 0.1;
    }
}

//匯出卡片參數
export async function getDeviceData2(devid , moduel_name = ""){
    tmp_flag = true;
    await get_Device_Data(devid);
    if(ist_obj.hasOwnProperty(devid)){
        return JSON.parse(JSON.stringify(ist_obj[devid]))
    }
        return {'status':'fail','connect' : 0 ,'data': []};
}
export async function getDeviceData(devid , moduel_name = ""){
	if(!tmp_flag){
		time_clock = 15;
		await sleep(500);
		tmp_flag = true;
	}
	if(ist_obj[devid] != undefined){
        return JSON.parse(JSON.stringify(ist_obj[devid]));
    }else{
		return {'status':'fail','connect' : 0 ,'data': []};
    }
}

//更新方案中擁有的卡片與頁數
export function update_dev( dev_array ){
    // if(dev_array[0][0].deviceId===0) return;
    dev_list = [] ;
    let flag = -1;
    for(let item of dev_array){
        if( !item[0]['deviceId']) return; // not a device e.g. context
        flag += 1 ;
        dev_list.push([]) ;
        for(let card of item){
            dev_list[flag].push(card['deviceId']);
        }
    }
    time_clock = 14.5;
    page_flag = 0;
    tmp_flag = false;
}

//清空卡片與頁數
export function delete_all(){
    dev_list = [] ;
    ist_obj  = {} ;
    page_flag = 0 ;
	tmp_flag = false;
    loop_function = undefined;
}

export async function getMutiDeviceData(device_list){
    let res = await getDeviceDataApi_attr(device_list.join(","))
    if(res.status == "ok"){
        //vm.$store.commit("addCompleteLoading", device_list.length)
        return JSON.parse(JSON.stringify(res.device_list));
    }
    else{
        console.log("FAIL失敗")
        // for(let i = 0; i < res.device_list.length; i++){
        //     status.push({'status':'fail','connect_status' : 0 ,'data': []})
        // }
        //vm.$store.commit("addCompleteLoading", device_list.length)
        //return 
    }   
    
}



function unitChange(info){
    info.value = Number(info.value);
    let unit = info.unit
    while(Math.abs(info.value) >= 10000){
		switch(info.unit){
            case ( unit):
                info.unit = "K" + unit;
                info.value /= 1000;
                break;
            case ("K" + unit):
                info.unit = "M" + unit;
                info.value /= 1000;
                break;
            case "M" + unit:
                info.unit = "G" + unit;
                info.value /= 1000;
                break;
            case "G" + unit:
                info.unit = "T" + unit;
                info.value /= 1000;
                break;
            default:
                info.value = Number(Number(info.value).toFixed(2))
                return info
                break;
		}
	}
    info.value = Number(Number(info.value).toFixed(2))
	return info
}

let _attr = {
    //電流
	"500600": {
		"setValue": (info) => {
			info.value = Number(Number(info.value).toFixed(2));
			return info
		}
	},
    //功率
    "500900":{
        "setValue": (info) => {
			return unitChange(info)
		}
    },
    //累積電量(用電 + 發電)
    "503200" :{
        "setValue": (info) => {
			return unitChange(info)
		}
    },
    //累積電量(發電)
    "501300" :{
        "setValue": (info) => {
			return unitChange(info)
		}
    },
    //A相實功率
    "510500" :{
        "setValue": (info) => {
			return unitChange(info)
		}
    },
    //B相實功率
    "520500" :{
        "setValue": (info) => {
			return unitChange(info)
		}
    },
    //C相實功率
    "530500" :{
        "setValue": (info) => {
			return unitChange(info)
		}
    },
    //累積電量
	"501200": {
		"setValue": (info) => {
            info.unit   = 'Wh'
            info.value  *= 1000
			return unitChange(info)
		}
	},
	// 卡機
	"405600": {
		"setValue": (info) => {
			let newInfo = info
			if(info.length >= 10) newInfo = Number(info).toFixed(0);
			return newInfo
		}
	},
	// 卡機
	"602405": {
		"setValue": (info) => {
			info.value  = info.value.slice(-11)
			return info;
		}
	},
}