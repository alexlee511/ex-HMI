import { getDefaultState } from "./"

export default {
    setTrueList(state, payload) {
        state.trueList = payload
        if (!state.trueList) {
            state.trueList = []
        }
    },
    setNameList(state, payload) {
        state.nameList = payload
    },
    setTypeList(state, payload) {
        state.typeList = payload
    },
    setRtuList(state, payload) {
        state.rtuList = payload
    },
    setrtu(state, payload) {
        state.rtu = payload
    },
    changeTrueList(state, payload) { //改變裝置資料
        //改裝置資料
        for (let item of state.trueList) {
            if (item.dev_id === payload.deviceID) {

                if (!item.isAddInfo) { //如果沒有新增裝置的狀態
                    item.isChangInfo = true
                }

                item.deviceName = payload.deviceName; //裝置名稱
                item.name = payload.deviceType //裝置模組類型
                item.slave_id = payload.deviceSlave//裝置站號
                item.interface = payload.deviceConnect
                item.isIOController = payload.isIOController;
                item.otherData = payload.otherData;
                if (item.interface === "Modbus-TCP") {
                    item.interface = payload.deviceIP + ',' + payload.devicePort + ',' + '1000000'
                    item.addr = payload.deviceIP;
                    item.port = payload.devicePort;
                } else {
                    item.interface = payload.deviceIntreface //裝置連線方式
                }
            }
        }
        //改裝置名稱
        state.nameList[payload.deviceID] = payload.deviceName
    },
    addTrueList(state, payload) { //新增裝置資料
        const obj = {}
        obj.isAddInfo = true
        obj.dev_id = payload.deviceID //裝置ID
        obj.deviceName = payload.deviceName; //裝置名稱
        obj.name = payload.deviceType //裝置模組類型
        obj.slave_id = payload.deviceSlave//裝置站號
        obj.interface = payload.deviceConnect
        obj.isIOController = payload.isIOController;
        obj.otherData = payload.otherData;
        if (obj.interface === "Modbus-TCP") {
            obj.interface = payload.deviceIP + ',' + payload.devicePort + ',' + '1000000'
            obj.addr = payload.deviceIP;
            obj.port = payload.devicePort;
        } else {
            obj.interface = payload.deviceIntreface //裝置連線方式
        }
        state.trueList.push(obj)
        state.nameList[payload.deviceID] = payload.deviceName
    },
    deleteTrueList(state, payload) { //刪除陣列中的某個元素並放入待刪除清單
        if (!state.trueList[payload].isAddInfo) {  //如果沒有被新增的狀態
            state.deletList.push(state.trueList[payload])
        }
        let id = state.trueList[payload].dev_id
        delete state.nameList[id] //刪除名稱清單中的key
        state.trueList.splice(payload, 1)
    },
    resetState(state) { //重置資料
        Object.assign(state, getDefaultState())
    },
    handleExceptionList(state, payload) {
        // 判斷之前有沒有做過修改了 (判斷ID)
        const excIndex = state.exceptionList.findIndex(item => item.devId === payload.devId)
        state.exceptionList.splice(excIndex, 1)
        state.exceptionList.push(payload)
    },
    handleExceptionNameConfig(state, payload) {
        Object.assign(state.nameList, payload);
    },
    updateModuleAdvanceList(state, payload) {
        state.moduleAdavanceList = payload;
    }
}