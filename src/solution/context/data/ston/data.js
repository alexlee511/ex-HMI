import {getSceneList} from "network/scence"
import vm from "@/main"
export let show_config   = [];
export let true_config   = [];
export let change_config = [];
export let order_config  = [];
export let add_config    = [];
export let del_config    = [];
//export let deviceName    = [];
export let SceneList     = [];

//deviceName = vm.$store.state.deviceName

export async function getScene(){
    let req = await getSceneList()
    if(req.status != 'ok'){
        return false
    }
    SceneList = []
    for(let i of req.scene_profile){
        if(i.scene_enable == '1'){
            for(let j of i.control_list){
                let [ c, a, v ] = j.cav.split("_")
                //沒有CAV
                if(c == undefined || a == undefined || v == undefined){
                    j.name = vm.$t("GENERAL.NO_TYPE")
                    j.description = vm.$t("GENERAL.NO_TYPE")
                    continue
                }
                
                //如果有C 就把它加到devid內
                let devid = j.dev_id
                if(c != "NULL" && !devid.includes('|')){
                    devid += '|' + c
                }
                //沒有控制
                if(vm.$store.state.deviceCommand.deviceControlList[devid] == undefined){
                    j.name = vm.$t("GENERAL.NO_TYPE")
                    j.description = vm.$t("GENERAL.NO_TYPE")
                    continue
                }
                //找到他的控制
                for(let m in vm.$store.state.deviceCommand.deviceControlList[devid]){
                    let k =  vm.$store.state.deviceCommand.deviceControlList[devid][m]
                    if(j.cmd == k.writeCmd && a == k.attrId && j.dev_id.split('|')[0] == k.target_id){
                        
                        j.description = k.description
                        if(k.range != '3' ){
                            for(let l of k.value_list){
                                if(l.value == v){
                                    j.name = l.name 
                                    break
                                }
                            }
                        }else{
                            j.name = v
                        }
                        
                        break
                    }
                }
            }
            SceneList.push(i)  
        }
    }

    console.log(vm.$store.state.solutionData.context)
    console.log("[GET SCENE]", SceneList)
    //update SceneList
    vm.$store.state.solutionData.context.card[0].device = SceneList;
    return true
}
export async function getSceneInit(){
    if(!await getScene()){
        return false
    }
    if(SceneList.length == 0){
        return false
    }else{
        return true
    }
}


export function restart(){  
    //show_config   = [];
    true_config   = [];
    //change_config = [];
    //add_config    = [];
    del_config    = [];
    //釋放空間
}

//設定相關(非正規)
export function Delsetting(data) {
    //console.log(add_config)
    let del = del_config.indexOf(data)
    let cha = change_config.indexOf(data)
    let sho = show_config.indexOf(data)
    let detector = true_config.indexOf(data)
    //let index = -1

    /*if(add_config.length !== 0){
        index = add_config.findIndex(e => e.scene_id == data["scene_id"])
        //console.log(index)
        if (index != -1) {
           
            add_config.splice(index, 1)
        }
    }*/

    if(sho != -1){
        show_config.splice(sho, 1)
    }
    //console.log(show_config)

    if(del == -1){
        if(Object.keys(data).includes("isModify")){
            //console.log("不push")
        }
        else{
            del_config.push(data)
        }
    }
    if(cha == -1){
        change_config.push(data)
    }

    if(detector != -1){
        true_config.splice(detector, 1)
    }
}
export function Setsetting(tag ,data) {
    console.log("Setting", data)
    let sho = show_config.indexOf(tag)
    let cha = change_config.indexOf(tag)
    //console.log(add_config)

    true_config[tag] = data;

    if(sho == -1){
        show_config.push(tag)
    }
    if(cha == -1){
        change_config.push(tag)
    }
}
export function Addsetting(data) {
    console.log("Adding", show_config, data)
    true_config = show_config
    
    show_config = []
    change_config.push(data)
    true_config.push(data) ; 
    for(let i in true_config){
        //console.log(i)
        show_config.push(i)
    
    }
    /*if(add_config.length !== 0){
        for(let i of add_config){
            //console.log(i)
            if(i["scene_id"] != data["scene_id"]){
                add_config.push(data)
            }
        }
    }
    else{
        add_config.push(data)
    }*/
   
}
