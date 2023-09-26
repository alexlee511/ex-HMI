import { getStatisticsAccApi, getStatisticsAvgApi } from "network/statistics"

export var deviceStatisList = [];
export var deviceStatisattr = {};

export async function initStatis(){
    //Object.keys(deviceStatisattr).length = 0
    for(let i of Object.keys(deviceStatisattr)){
        //console.log(i)
        delete deviceStatisattr[i]
    }
    //deviceStatisList.length = 0
    let res = await getStatisticsAccApi();
    //console.log(res)
    if(res.status == 'ok'){
		for(let item of res.data){
			if(item.enable != 1){
				continue
			}
            deviceStatisattr[item.dev_id] = []
			const dev_id = (item.sub_id !== '0') ? item.dev_id + '|' +
                (item.sub_id.length == 1 ? '0' + item.sub_id : item.sub_id) : item.dev_id

			if(deviceStatisList.indexOf(dev_id) == -1 )
                deviceStatisList.push(dev_id);

            for(let i of item.attr.split(",")){
                if(deviceStatisattr[item.dev_id].includes(i) == false){
                    deviceStatisattr[item.dev_id].push(i)
                }
            }
		}
        //deviceStatisList = deviceStatisList.concat(res.data.map(item =>{
        //    return (item.sub_id !== '0') ? item.dev_id + '|' +
        //        (item.sub_id.length == 1 ? '0' + item.sub_id : item.sub_id) : item.dev_id;
        //}));
    }
    
    res = await getStatisticsAvgApi();
    //console.log(res)
    if(res.status == 'ok'){
		for(let item of res.data){
			if(item.enable != 1){
				continue
			}
            const dev_id = (item.sub_id !== '0') ? item.dev_id + '|' +
                (item.sub_id.length == 1 ? '0' + item.sub_id : item.sub_id) : item.dev_id;
            if(deviceStatisList.indexOf(dev_id) == -1 )
                deviceStatisList.push(dev_id);
            if(Object.keys(deviceStatisattr).includes(item.dev_id)){
                for(let i of item.attr.split(",")){
                    if(deviceStatisattr[item.dev_id].includes(i) == false){
                        deviceStatisattr[item.dev_id].push(i)
                    }
                }
            }
            else{
                deviceStatisattr[item.dev_id] = []
                for(let i of item.attr.split(",")){
                    if(deviceStatisattr[item.dev_id].includes(i) == false){
                        deviceStatisattr[item.dev_id].push(i)
                    }
                }
            }
		}
    }
    //console.log(deviceStatisattr)
}

export function updateStatis(dev_id){
    if(deviceStatisList.indexOf(dev_id) != -1 || deviceStatisList.length == 0)
        deviceStatisList.push(dev_id);
}

export function checkStatis(dev_id){
    //console.log(deviceStatisList)
    //console.log("😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢😢")
    return deviceStatisList.indexOf(dev_id) != -1;
}

export const statis_type = {
    "5": "avg",
    "8": "acc",
    "500900-500999": "avg",
    "501200": "acc"
}

export function allStatisAttr(){
    return Object.keys(statis_type);
}

export function attrToClass(attr){
    for(let [key, class_type] of Object.entries(statis_type)){
        if(key.indexOf('-') != -1){
            const [min, max] = key.split('-');
            if(attr >= min && attr <= max)
                return class_type;
        }
        else if(key == attr)
            return class_type;
    }
    return undefined;
}