//common/constant/profile

import { getProfile , getDeviceList } from "network/scence";
import { updateAttr } from "./attribute";
import { initStatis } from "solution/energy/config/statistics/statisType"
import { getDeviceName } from "network/solution";
import { complexGet } from "network/gateway";
import vm from "@/main"
var body_tmp = ''
var Profile_Lang = "";
export var Dev_List_Obj = {};
//module : control_type
export var Ctl_List_Obj = {};
export var type_to_module = {};
export var DeviceName = {};
export var complex = {};
//1張卡片
//    1.只匯入的moduel                             //in
//    2.不匯入的moduel                             //out
//    3.是否接受控制                              //Ctl true = 接受、false = 不接受、null =全接受
//    4.是否顯示主體                              //master true = 要、false = 不要、null =要
//    5.是否顯示子迴路                           //sub true = 要、false = 不要、null =要
//    6.複合裝置                                 //complex ID、null = 不支援
//    7.特殊讀法，會直接加入card裡              //funct null = 不支援

export function setLang(lang){
    if(lang === 'tw') Profile_Lang = 'zh-tw';
    else if(lang === 'en') Profile_Lang = 'en';
}
function gatcardobj(item){
    return {
        cardId   : item.cardId   ,
        cardType : item.cardType ,
        cardName : item.cardName ,
        
    }
}
export async function createCard(body = body_tmp, lang = Profile_Lang){
    body_tmp = body
    if(Object.keys(Dev_List_Obj).length === 0 || Object.keys(Ctl_List_Obj).length === 0){
        await updateProfile()
    }
    console.log(body);  
    const list = JSON.parse(JSON.stringify(body));
    let resulet = [];
    let devid_slave = {};
    let res = await getDeviceList();

    if(res.status !== 'ok'){
        return []
    }
    //處理devid:slave_id
    for(let item of res.device){
        
        devid_slave[item.dev_id] = item.slave_id
    }
    
    
    //第一層
    for(let pro of Object.keys(list)){
        for(let card of Object.keys(list[pro].card)){
            let need_type = list[pro].card[card].device;
            list[pro].card[card].device = []
            let cardobj   = list[pro].card[card]
            let _in             = list[pro].card[card].in
            let _out            = list[pro].card[card].out
            let _ctl            = list[pro].card[card].Ctl
            let _master         = list[pro].card[card].master
            let _sub            = list[pro].card[card].sub
            let _complex        = list[pro].card[card].complex
            let _func           = body[pro].card[card].funct
            let com ;
            //2021/11/11新增 如果需要複合裝置，就讀進來
            if(_complex !== undefined){
                com = complex[_complex];
                if (com == undefined) continue;
                for(let devlist of com.card_list){
                    let dev = gatcardobj(cardobj)
                    dev.deviceId = devlist.card_id
                    dev.type     = devlist.card_type
                    dev.typename = _complex
                    dev.complex  = []
                    if(DeviceName[devlist.card_id] === undefined){
                        dev.deviceName = devlist.card_id
                    }else{
                        dev.deviceName = DeviceName[devlist.card_id]
                    }
                    list[pro].card[card].device.push(dev)
                }
            }
            //2022/01/28新增自定義func 
            
            if(_func !== undefined){
                let itemlist =await _func();
                for(let it of itemlist){
                    list[pro].card[card].device.push(it)
                }
            }
            if(need_type.length !== 0){
                for(let type of need_type){
                    if(type_to_module[type] !== undefined){
                        for(let module_name of type_to_module[type]){
                            if (_out  && _out.includes(module_name)) continue;
                            if (_in && !_in.includes(module_name)) continue;
                            for(let device_data of Dev_List_Obj[type+'-'+module_name]){
                                if(_master || _master === undefined ){
                                    let nb = device_data.ctl_info.length
                                    if(_ctl ===  undefined || (_ctl && nb !== 0) || (!_ctl && nb === 0)){
                                        let tmp = gatcardobj(cardobj)
                                        let subid = device_data.dev_id
                                        tmp.deviceId = device_data.dev_id
                                        tmp.type = type
                                        tmp.typename = module_name
                                        tmp.slave = devid_slave[device_data.dev_id]
                                        if(DeviceName[device_data.dev_id] === undefined){
                                            tmp.deviceName = subid
                                        }else{
                                            tmp.deviceName = DeviceName[subid]
                                        }
                                        if(_complex !== undefined){
                                            //判斷dev_id有沒有在裡面
                                            if (com == undefined) continue;
                                            for(let dev of list[pro].card[card].device.keys()){
                                                for(let sube of com.card_list){
                                                    if(sube.card_id !==  list[pro].card[card].device[dev].deviceId)continue;
                                                    for(let GG of sube.sub_list){
                                                        if(GG.dev_id == tmp.deviceId){
                                                            let set = JSON.parse(JSON.stringify(tmp));
                                                            set.page_type = GG.page_type;
                                                            list[pro].card[card].device[dev].complex.push(set);
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }else{
                                            list[pro].card[card].device.push(tmp)
                                        }
                                    }
                                }
                                if((_sub || _sub === undefined ) && device_data.sub_list.length !== 0 ){
                                    for(let subDevice of device_data.sub_list){
                                        let nb = subDevice.sub_ctl_info.length
                                        if(_ctl ===  undefined || (_ctl && nb !== 0) || (!_ctl && nb === 0)){
                                            let tmp = gatcardobj(cardobj)
                                            let subid = subDevice.sub_id
                                            tmp.deviceId = subid
                                            tmp.type = type
                                            tmp.typename = module_name
                                            tmp.slave = devid_slave[device_data.dev_id]
                                            
                                            if(DeviceName[subid] === undefined){
                                                tmp.deviceName = subid
                                            }else{
                                                tmp.deviceName = DeviceName[subid]
                                            }
                                            tmp.setting = true;
                                            //判斷dev_id有沒有在裡面
                                            if(_complex !== undefined){
                                                //判斷dev_id有沒有在裡面
                                            if (com == undefined) continue;
                                                for(let dev of list[pro].card[card].device.keys()){
                                                    for(let sube of com.card_list){
                                                        if(sube.card_id !==  list[pro].card[card].device[dev].deviceId)continue;
                                                        for(let GG of sube.sub_list){
                                                            if(GG.dev_id == tmp.deviceId){
                                                                let set = JSON.parse(JSON.stringify(tmp));
                                                                set.page_type = GG.page_type;
                                                                list[pro].card[card].device[dev].complex.push(set);
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }else{
                                                list[pro].card[card].device.push(tmp)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("❤❤❤❤❤❤❤PROFILE START CREATE CARD❤❤❤❤❤❤❤❤")
    console.log(list)
    console.log("❤❤❤❤❤❤❤❤PROFILE END CREATE CARD❤❤❤❤❤❤❤")
    return list
}
//取得Dev_List_Obj
export async function getDevList(dev_id = '') {
    if(dev_id === '' ){
        return Dev_List_Obj
    }else if(Dev_List_Obj.hasOwnProperty(dev_id) ){
        return Dev_List_Obj[dev_id]
    }else{
        return {}
    }
}
//更新複合裝置
async function updateComplex(){
    let res = await complexGet();
    complex = {}
    if(res.status != 'ok'){
        return
    }
    for(let data of res.data){
        let complexName = data.plan_name;
        complex[complexName] = {}
        complex[complexName]['card_list'] = []
        for(let card_list of data.card_list){
            let id = card_list.card_id;
            let type = card_list.card_type;
            let item = {}
            item["card_id"]   = id
            item["card_type"] = type
            item["sub_list"]  = []
            for(let sub of card_list.sub_list){
                let page_type = sub.page_type
                for(let device of sub.device_list){
                    let dev = {}
                    dev['dev_id']    = device.dev_id
                    dev['page_type'] = page_type
                    item["sub_list"].push(dev)
                }
            }
            complex[complexName]['card_list'].push(item)
        }
    }
}

function updateTemper(Ctl_Obj){
    for(let i of Object.keys(Ctl_Obj)){
        for(let j of Object.keys(Ctl_Obj[i])){
            if(Ctl_Obj[i][j].attrId == "27" && Ctl_Obj[i][j].writeCmd == "B07"){
                Ctl_Obj[i][j].range = "1"

                let value_range = undefined;
                if(Ctl_Obj[i][j].value_range.includes('~')){
                    value_range = Ctl_Obj[i][j].value_range.split('~');
                }else{
                    value_range = Ctl_Obj[i][j].value_range.split('-');
                }
                for(let num = Number(value_range[0]); num <= Number(value_range[1]); num++){
                    Ctl_Obj[i][j].value_list.push({"name": String(num), "value": String(num)})
                }
                
            }
        }
    }
    return Ctl_Obj
}

//更新Profile
export async function updateProfile(dev_id = '', module_name = '' , lang = Profile_Lang) {
    console.log(lang)
    updateAttr(lang);
    initStatis();
    updateComplex();
    let res = await getDeviceName();
    if(res.status === 'ok'){
        for(let dev of res.content){
            if(dev.complete === 'yes')
                DeviceName[dev.id] = dev.name;
        }
        vm.$store.state.deviceName = DeviceName;
    }
    res = await getProfile(dev_id, module_name, lang);

    if(res['status'] == 'ok'){
        Dev_List_Obj = {}
        Ctl_List_Obj = {}
        type_to_module = {}
        let commandDev = {};
        let deviceControl = {};
        console.log("[MAIN PROFILE]",res)
        for(let item of res['module_list']){

            Dev_List_Obj[item['module_name']] =  item.device_list;
            if(item.ctl_attr_list.length > 0){
                let Ctl_Type_List = {};
                for(let ctl_type of item.ctl_attr_list){
                    Ctl_Type_List[ctl_type['control_type']] = ctl_type;
                    delete Ctl_Type_List[ctl_type['control_type']].control_type;
                }
                Ctl_List_Obj[item['module_name']] =  Ctl_Type_List;
            }
            if(type_to_module[item['module_name'].substring(0, 2)] == undefined){
                type_to_module[item['module_name'].substring(0, 2)] = []
            }
            type_to_module[item['module_name'].substring(0, 2)].push(item['module_name'].substring(3));
        }
        Ctl_List_Obj = updateTemper(Ctl_List_Obj)
        for(let moduleName of Object.keys(Dev_List_Obj)){
            let cmdDeviceList = new Array();
            for(let dev of Dev_List_Obj[moduleName]){
                if(dev.sub_list.length > 0){
                    for(let sub_dev of dev.sub_list){
                        let { sub_id, sub_ctl_info } = sub_dev;
                        if(sub_ctl_info.length == 0) continue;
                        let device_name = (DeviceName[sub_id] === undefined) ?
                            sub_id : DeviceName[sub_id];
                        cmdDeviceList.push({
                            'module_name': moduleName,
                            'dev_id': sub_id,
                            'dev_name': device_name,
                            'ctl_info': sub_ctl_info
                        });

                        let newDevInfo = {};
                        for(let sub_info of sub_ctl_info){
                            let { control_type, target_id, channel } = sub_info;
                            let new_info = JSON.parse(JSON.stringify(Ctl_List_Obj[moduleName][control_type]));
                            new_info['channel'] = channel;
                            new_info['target_id'] = target_id;
                            newDevInfo[control_type] = new_info;
                        }
                        deviceControl[sub_id] = newDevInfo;
                    }
                }
                if(dev.ctl_info.length > 0){
                    let deviceName = (DeviceName[dev.dev_id] === undefined) ?
                        dev.dev_id : DeviceName[dev.dev_id];
                    cmdDeviceList.push({
                        'module_name': moduleName,
                        'dev_id': dev.dev_id,
                        'dev_name': deviceName,
                        'ctl_info': dev.ctl_info
                    });

                    let newDevInfo = {};
                    for(let info of dev.ctl_info){
                        let { target_id, channel } = info;
                        let new_info = JSON.parse(JSON.stringify(Ctl_List_Obj[moduleName][info.control_type]));
                        new_info['target_id'] = target_id;
                        new_info['channel'] = channel;
                        newDevInfo[info.control_type] = new_info;
                    }
                    deviceControl[dev.dev_id] = newDevInfo;
                }
            }
            let mod_type = moduleName.substring(0, 2);
            if(mod_type in commandDev)
                commandDev[mod_type] = commandDev[mod_type].concat(cmdDeviceList);
            else commandDev[mod_type] = cmdDeviceList;
        }
        vm.$store.state.deviceCommand.commandDeviceList = commandDev;
        vm.$store.state.deviceCommand.controlClassList = Ctl_List_Obj;
        vm.$store.state.deviceCommand.deviceControlList = deviceControl;
        console.log('🉑🉑🉑🉑🉑🉑🉑🉑🉑UPDATE PROFILE🉑🉑🉑🉑🉑🉑🉑🉑🉑')
        console.log(commandDev)
        console.log(Ctl_List_Obj)
        console.log(deviceControl)
        console.log('🉑🉑🉑🉑🉑🉑🉑🉑🉑UPDATE PROFILE🉑🉑🉑🉑🉑🉑🉑🉑🉑')
        //取得所有主設備的子設備ID
        let allSubDevId = {}
        for(let module of res.module_list){
            for(let dev of module.device_list){
                if(dev.sub_list.length==0) continue;
                allSubDevId[dev.dev_id] = []
                for(let sub_dev of dev.sub_list){
                    allSubDevId[dev.dev_id].push(sub_dev.sub_id)
                }
            }
        }
        vm.$store.state.allSubDev = allSubDevId
    }

    console.log(vm.$store.state.deviceCommand)
    let attr_conversion_table = {
        "16": "100700",
        "18": "701400",
        "19": "701500",
        "20": "100600",
        "47": "100300",
        "48": "103600",
    }
    vm.$store.state.deviceCommand.attrConnversionList = attr_conversion_table

    for(let i of Object.keys(vm.$store.state.deviceCommand.deviceControlList)){
        for(let j of Object.keys(vm.$store.state.deviceCommand.deviceControlList[i])){
            for(let k of Object.keys(vm.$store.state.deviceCommand.deviceAttrList)){
                for(let l of vm.$store.state.deviceCommand.deviceAttrList[k]){
                    if(vm.$store.state.deviceCommand.deviceControlList[i][j]["writeCmd"] == "B07"){
                        if(Object.keys(vm.$store.state.deviceCommand.attrConnversionList).includes(vm.$store.state.deviceCommand.deviceControlList[i][j]["attrId"])){
                            if(l["attr"] == vm.$store.state.deviceCommand.attrConnversionList[vm.$store.state.deviceCommand.deviceControlList[i][j]["attrId"]]){
                                l["value_list"] = []
                                for(let tmp of vm.$store.state.deviceCommand.deviceControlList[i][j]["value_list"]){
                                    l["value_list"].push(tmp)
                                }
                            }
                        }
                    }
                    if(l["attr"] == vm.$store.state.deviceCommand.deviceControlList[i][j]["attrId"]){
                        l["value_list"] = []
                        for(let tmp of vm.$store.state.deviceCommand.deviceControlList[i][j]["value_list"]){
                            l["value_list"].push(tmp)
                        }
                    }
                }
            }
        }
    }
}

export function changeStatusName(info, dev_id){
    let data = []
    for(let item of info){
        let check = 0
        
        let index = vm.$store.state.deviceCommand.deviceAttrList[dev_id].findIndex(e => e.attr == item["attr"])
        if(index != -1){
            //this.attr_list[this.$store.state.deviceCommand.deviceAttrList[i][index]["name"]] = {}
            if(Object.keys(vm.$store.state.deviceCommand.deviceAttrList[dev_id][index]).includes("value_list")){
                for(let j of vm.$store.state.deviceCommand.deviceAttrList[dev_id][index]["value_list"]){
                    if(item.value == j.value){
                        item.value = j.name
                        check += 1
                    }
                    //this.attr_list[this.$store.state.deviceCommand.deviceAttrList[i][index]["name"]][j.value] = j.name
                }
                if(check == 0){
                    item.value = vm.$t("GENERAL.UNKNOWN")
                }
            }
        }
        data.push(item)
    }
    return data
}