import { getDeviceAttrApi , getDeviceAttrApi_attr } from "network/solution"
import { getAttributeList } from "network/attribute"
import vm from "@/main"

var moduleAttrList = {};
var deviceAttrList = {};

export async function updateAttr(lang){
    //console.log(lang)
    let res = await getDeviceAttrApi_attr(lang);
    // console.log("🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬")
    // console.log(res)
    if(res['status'] === 'ok'){
        for(let module of res.modules){
            let attr_list = [];
            for(let i of module.attr_list){
                attr_list.push({
                    attr  : i.attr      ,
                    name  : i.name      ,
                    unit  : i.unit      ,
                    value : i.old_attr  ,
                })
            }
            let moduleName = `${module.type}-${module.name}`;
            //get all attributes
            if(!moduleAttrList[moduleName]) {
                moduleAttrList[moduleName] = []
            }
            moduleAttrList[moduleName].push(...attr_list);
            for(let dev of module.dev_id){
                deviceAttrList[dev] = attr_list;
            }
        }
        //查看是否有相同attr
        // for(let module of Object.keys(moduleAttrList)){
        //     for(let j=0; j<moduleAttrList[module].length-2; j++){
        //         for(let k=j+1; k<moduleAttrList[module].length-1; k++){
        //             if(moduleAttrList[module][j].attr==moduleAttrList[module][k].attr)
        //                 console.log(moduleAttrList[module][j], moduleAttrList[module][k])
        //         }
        //     }
        // }
        
        //remove same attributes
        for(let module in moduleAttrList){
            Array.from(new Set(Array.from(moduleAttrList[module])))
        }

        let devCtrlList = vm.$store.state.deviceCommand.deviceControlList
        let attrConvList = vm.$store.state.deviceCommand.attrConnversionList
        for(let i of Object.keys(devCtrlList)){
            for(let j of Object.keys(devCtrlList[i])){
                for(let k of Object.keys(deviceAttrList)){
                    for(let l of deviceAttrList[k]){
                        if(devCtrlList[i][j]["writeCmd"] == "B07"){
                            if(Object.keys(attrConvList).includes(devCtrlList[i][j]["attrId"])){
                                if(l["attr"] == attrConvList[devCtrlList[i][j]["attrId"]]){
                                    l["value_list"] = []
                                    for(let tmp of devCtrlList[i][j]["value_list"]){
                                        l["value_list"].push(tmp)
                                    }
                                }
                            }
                        }
                        if(l["attr"] == devCtrlList[i][j]["attrId"]){
                            l["value_list"] = []
                            for(let tmp of devCtrlList[i][j]["value_list"]){
                                l["value_list"].push(tmp)
                            }
                        }
                    }
                }
            }
        }
        vm.$store.state.deviceCommand.deviceAttrList = deviceAttrList;
        vm.$store.state.deviceCommand.moduleAttrList = moduleAttrList;
    }
    console.log(deviceAttrList)
    console.log(moduleAttrList)
}

export function getDeviceAttr(dev_id){
    if(dev_id == undefined)
        return JSON.parse(JSON.stringify(deviceAttrList));
    if(deviceAttrList[dev_id])
        return JSON.parse(JSON.stringify(deviceAttrList[dev_id]));
    return undefined;
}

export function getModuleAttr(module){
    if(module == undefined)
        return moduleAttrList;
    if(moduleAttrList[module])
        return moduleAttrList[module];
    return undefined;
}

export async function getAttributeInfo(req_attr, type=undefined){
    console.log(req_attr)
    if(vm.$store.state.attributeList){
        if(vm.$store.state.attributeList[req_attr]){
            return vm.$store.state.attributeList[req_attr];
        }
    }

    //API可以獲得一連串的屬性，但目前僅有一次詢問一個屬性資訊的需求，故不處理
    let res = await getAttributeList( req_attr, type);
    let attrInfo = {}
    if(res){
        for(let data of res.data){
            attrInfo[data.new_attr] = {
                "name": data.name,
                "unit": data.unit
            }
        }
    }
    
    if(vm.$store.state.attributeList){
        vm.$store.state.attributeList = Object.assign( vm.$store.state.attributeList, attrInfo);
    }else{
        vm.$store.state.attributeList = attrInfo;
    }

    console.log("😎😎😎😎😎😎😎😎😎😎😎😎")
    console.log(vm.$store.state.attributeList )
    return vm.$store.state.attributeList[req_attr];
}