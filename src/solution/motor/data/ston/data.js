import { requestNode } from 'network'
import vm from "@/main"
export let show_config   = [];
export let true_config   = {};
export let change_config = [];
export let add_config    = [];
export let del_config    = [];
let flag = 0;
restart()
export function restart(){
    let tmp = JSON.parse(JSON.stringify(vm.$store.state.solutionData.motor.card[0].device));
    show_config   = [];
    true_config   = {};
    change_config = [];
    add_config    = [];
    del_config    = [];
    flag = 0;
    for(let list of tmp){
        show_config.push(list.deviceId)
        true_config[list.deviceId] = {
            'complex'    : list.complex ,
            'deviceName' : list.deviceName ,
        }
    }
    //釋放空間
    tmp = '';
}

export function getFFT(devid = "" , axis = 'x') {
  return requestNode({
    method: 'GET',
    url: '/api/fft/get',
    params: {
        devid,
        axis
    }
  });
}
//設定相關(非正規)
export function Delsetting(devid) {
    let add = add_config.indexOf(devid)
    let del = del_config.indexOf(devid)
    let cha = change_config.indexOf(devid)
    let sho = show_config.indexOf(devid)
    
    if(add != -1){
        add_config.splice(add , 1)
    }
    if(sho != -1){
        show_config.splice(sho, 1)
    }
    if(del == -1){
        del_config.push(devid)
    }
    if(cha == -1){
        change_config.push(devid)
    }
}
export function Setsetting(tag ,data) {
    
    true_config[tag] = data;
    let add = add_config.indexOf(tag)
    let sho = show_config.indexOf(tag)
    let cha = change_config.indexOf(tag)
    if(add == -1){
        add_config.push(tag)
    }
    if(sho == -1){
        show_config.push(tag)
    }
    if(cha == -1){
        change_config.push(tag)
    }
}
export function Addsetting(data) {
    add_config.push(flag.toString())
    show_config.push(flag.toString())
    change_config.push(flag.toString())
    true_config[flag.toString()] = data ; 
    flag ++ ;
}