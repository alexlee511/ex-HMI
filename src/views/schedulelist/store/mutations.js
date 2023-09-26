import { setScheduleList } from "@/network/schedule";
import { getDefaultState  } from "./index";

export default {
    // 刪除選的 schedule 資料
    deleteScheduleList(state, payload) { 
        if(typeof(payload)=='string'){ 
            //target schedule id to delete
            let tmp = payload.split(' ');
            state.deleteList.push([tmp[0], tmp[1]]);
        }else{
            //index chosen to be deleted
            if (state.scheduleList[payload].schedule_type=='cav')
                state.deleteList.push([state.scheduleList[payload].dev_id, state.scheduleList[payload].sid]);
            else
                state.deleteList.push([state.scheduleList[payload].scene_id, state.scheduleList[payload].sid]);
            state.scheduleList.splice(payload, 1);
        }
    },
    // 新增資料
    addScheduleList(state, payload) { //schedule
        payload.isChange = true;
        state.scheduleList.push(payload);
    },
    // 修改資料
    modifyScheduleList(state, payload) { //schedule
        payload.isChange = true;
        let newList = state.scheduleList.map(item => {
            return payload.sid === item.sid ? payload : item;
        });
        state.scheduleList = newList;
    },
    // 清除資料
    resetScheduleList(state, payload) {
        Object.assign(state, getDefaultState());
    }
}