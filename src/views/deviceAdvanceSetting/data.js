import { getModuleAdvance } from '@/network/module.js'
import vm from "@/main"

var moduleDeviceList = {};

export async function getAdvSettingInfo(){
    let res = await getModuleAdvance(vm.$store.state.backData.back_lang);
    if(res){
        let advInfoList = {}
        for(let module of res.module_list){
            advInfoList[module.module_name] = module.adv_list;
            moduleDeviceList[module.module_name] = [];
        }
        initModuleDeviceList();
        return advInfoList;
    }else{
        return []
    }
}

async function initModuleDeviceList(){
    let solutionData = vm.$store.state.solutionData
    for(let solution of Object.keys(solutionData)){
        for(let card of solutionData[solution].card){
            for(let dev of card.device){
                if(!dev.type || !dev.typename) continue;
                let modulename = dev.type + '-' + dev.typename;
                let index = Object.keys(moduleDeviceList).findIndex( key => {
                    return key === modulename;
                })
                if(index !== -1){
                    moduleDeviceList[modulename].push(dev.deviceId);
                }
            }
        }
    }
    // console.log("[ModuleDeviceList]", JSON.stringify(moduleDeviceList, null, 2));
}

export function getModuleDeviceList(){
    return moduleDeviceList[CurrentModule] || [];
}

export var CurrentModule = "";
export function setCurrentModule(moduleName){
    CurrentModule = moduleName;
}

export var SettingConfig = [];
export function setSettingConfig(payload){
    SettingConfig = payload;
}