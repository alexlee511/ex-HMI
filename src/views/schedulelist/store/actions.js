import { getScheduleList, deleteScheduleList, setScheduleList } from "network/schedule"
import { Dev_List_Obj, Ctl_List_Obj, DeviceName } from "common/constant/profile"
import vm from "@/main"

function ModuleNameSearch(dev_id){
    for(let module_name of Object.keys(Ctl_List_Obj)){
        for(let dev_info of Object.keys(Dev_List_Obj[module_name])){
            if(dev_info.sub_list.length){
                for(let sub_dev of dev_info.sub_list){
                    if(sub_dev.sub_ctl_info[0].target_id === dev_id)
                        return module_name;
                }
            }
            if(dev_info.ctl_info.length && dev_info.ctl_info[0].target_id === dev_id)
                return module_name;
        }
    }
    return '-1';
}

let EnabledDevices = {}
function initSelectedDevice(){
    let tempEnabledDevices = JSON.parse(JSON.stringify(vm.$store.state.backData.selectDevice));
    let ReadOnlyEnabledDevices = vm.$store.state.backData.selectDevice;
    //將長度等於0的先拿掉
    for(let solution of Object.keys(ReadOnlyEnabledDevices)){
        for(let card of Object.keys(ReadOnlyEnabledDevices[solution])){
            if(!ReadOnlyEnabledDevices[solution][card].length){
                delete tempEnabledDevices[solution][card];
            }
        }
        if(Object.keys(tempEnabledDevices[solution]).length === 0){
            delete tempEnabledDevices[solution];
        }
    }
    EnabledDevices = tempEnabledDevices;
    console.log(EnabledDevices)
}

function CheckDeviceEnabled(dev_id){
    for(let solution of Object.keys(EnabledDevices)){
        for(let card of Object.keys(EnabledDevices[solution])){
            for(let device of EnabledDevices[solution][card]){
                if(device.dev_id === dev_id){
                    return true;
                }
            }
        }
    }
    return false;
}

export default {
    async GetScheduleList( {state} ) {
        const { schedule } = await getScheduleList();
        let hmi_schedule = schedule.filter(item => {
            return item.request_type === 'HMICTL';
        });
        hmi_schedule.sort(function(a, b){
            return a.sid < b.sid;
        });
        console.log("[HMI][schedulelist][store][GetScheduleList][hmi_schedule]",hmi_schedule)

        initSelectedDevice();

        let scheduleList = [];
        for(let schedule of hmi_schedule){
            let testError = false;
            
            /*context scheduling*/
            let Context = [];
            for(let c of vm.$store.state.solutionData.context.card){
                for(let context of c.device){
                    Context.push(context)
                }
            }
            if(schedule.schedule_type=='scene'){
                //情境可能已被刪除，則相關排程也需要被刪除
                let index = Context.findIndex( context => { 
                    return context.scene_id === schedule.scene_id;
                });
                if(index === -1) {
                    deleteScheduleList(schedule.scene_id+'|'+schedule.sid);
                    continue;
                }
                schedule.type = '98';
                schedule.scene_name = Context[index].scene_name;
                schedule.control_dev_list = Context[index].control_list;
                scheduleList.push(schedule);
                continue;
            }

            /*device scheduling*/
            //沒被啟用的設備要隱藏起來
            let sub = schedule.cav.split('_')[0];
            if( sub != "NULL" && !CheckDeviceEnabled(schedule.dev_id + '|' + sub)){
                console.log("continue1")
                continue;
            }
            else if( sub == "NULL" && !CheckDeviceEnabled(schedule.dev_id)){
                continue;
            }

            if(schedule.type && schedule.name){
                schedule['module_name'] = schedule.type + "-" + schedule.name;
                delete schedule.name;
            }
            else{
                schedule['module_name'] = ModuleNameSearch(schedule.dev_id);
                schedule.type = schedule.module_name.substr(0, 2);
            }

            let del_id = [(schedule.scene_id||schedule.dev_id), schedule.sid];
            if(schedule.module_name === '-1' || Ctl_List_Obj[schedule.module_name] === undefined){
                state.deleteList.push(del_id);
                continue;
            }
            let cavObj = {};
            let cmdObj = {};
            let cavArr = schedule.cav.split('/');
            let cmdArr = schedule.cmd.split('/');
            for(let i = 0; i < cavArr.length; i++){
                let attr = cavArr[i].split('_')[1];
                for(let [ctl_type, ctl_info] of Object.entries(Ctl_List_Obj[schedule.module_name])){
                    if(ctl_info.attrId === attr && ctl_info.writeCmd === cmdArr[i]){
                        if(Ctl_List_Obj[schedule.module_name][ctl_type].range === '1'){
                            let test = Ctl_List_Obj[schedule.module_name][ctl_type].value_list.find(ctl => {
                                return ctl.value === cavArr[i].split('_')[2];
                            });
                            if(test === undefined){
                                state.deleteList.push(del_id);
                                testError = true;
                            }
                        }
                        else if(Ctl_List_Obj[schedule.module_name][ctl_type].range === '2'){
                            let test = cavArr[i].split('_')[2].match(/[^\d]+/);
                            if(test !== 'NULL'){
                                state.deleteList.push(del_id);
                                testError = true;
                            }
                        }
                        else if(Ctl_List_Obj[schedule.module_name][ctl_type].range === '3'){
                            let value = cavArr[i].split('_')[2];
                            // let {min, max} = [...Ctl_List_Obj[schedule.module_name][ctl_type].value_range.split('-')];
                            let [min, max] = Ctl_List_Obj[schedule.module_name][ctl_type].value_range.includes('~') ?
                                             Ctl_List_Obj[schedule.module_name][ctl_type].value_range.split('~')    : 
                                             Ctl_List_Obj[schedule.module_name][ctl_type].value_range.split('-')    ;
                            if(value > max || value < min){
                                state.deleteList.push(del_id);
                                testError = true;
                            }
                        }
                        if(testError) continue;
                        cavObj[ctl_type] = cavArr[i];
                        cmdObj[ctl_type] = cmdArr[i];
                    }
                }
            }
            if(testError) continue;
            if(Object.keys(cavObj).length > 0){
                schedule.cav = cavObj;
                schedule.cmd = cmdObj;
                let channel = Object.values(schedule.cav)[0].split('_')[0];
                schedule.dev_name = (channel !== 'NULL') ? schedule.dev_id + "|" + channel : schedule.dev_id;
                schedule.dev_name = DeviceName[schedule.dev_name] || schedule.dev_name
            }
            scheduleList.push(schedule);
        }
    console.log("[HMI][schedulelist][store][GetScheduleList][scheduleList]",scheduleList)
        state.scheduleList = scheduleList;
    },
    async SetScheduleList( {state} ) {
        // 刪除行程
        let delStr = ''
        for(let del_schedule of state.deleteList){
            if(del_schedule.isChange === undefined){
                console.log("DELETING...",del_schedule)
                delStr += del_schedule[0] + '|' + del_schedule[1] + ','
            }
        }
        if(delStr.length) await deleteScheduleList(delStr.slice(0,-1)) //remove last comma
        // 新增
        for(let new_schedule of state.scheduleList){
            if(new_schedule.isChange){
                new_schedule.enable = new_schedule.enable;
                if(new_schedule.stop_date === '*') delete new_schedule.stop_date;
                delete new_schedule.isChange;
                //delete new_schedule.module_name;
                delete new_schedule.control_dev_list;
                if(new_schedule.trigger_mode!='period') 
                    delete new_schedule.day_of_week
                new_schedule['request_type'] = 'HMICTL';
                if(new_schedule.scene_id){
                    new_schedule['schedule_type'] = "scene";
                    delete new_schedule.dev_id;
                    delete new_schedule.scene_name;
                    delete new_schedule.cav
                    delete new_schedule.cmd
                }else{
                    let cavStr = Object.values(new_schedule.cav).join('/');
                    let cmdStr = Object.values(new_schedule.cmd).join('/');
                    new_schedule.dev_id = new_schedule.dev_id.split('|')[0];
                    new_schedule['cav'] = cavStr;
                    new_schedule['cmd'] = cmdStr;
                    delete new_schedule.dev_name;
                    delete new_schedule.scene_id;
                }
                await setScheduleList(new_schedule).then(res => {
                    new_schedule.isChange = false
                })
            }
        }
    },
}