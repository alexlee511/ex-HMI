import { getConfigList } from "network/setConfig"
import { getSerial, getModuleAdvance, updateDeviceAdvance } from "network/module"

export default {
    async getConfigList(context) {
        const nameList = context.rootState.deviceName;
        const configList = await getConfigList()
        const serial = await getSerial()
        let trueList = configList.device

        context.commit('setrtu', serial.serial[0].serial_port)
        context.commit('setRtuList', serial.serial.map(x => x.serial_port))
        context.commit('setNameList', nameList)
        context.commit('setTrueList', trueList)

        context.state.isGetInfo = true
    },
    getModuleAdvance(context, payload) {
        let lang = (payload) ? payload.lang : '';

        getModuleAdvance(lang).then((res) => {
            let response = {};
            if (res.status == 'ok') {
                for (let modeule of res.module_list) {
                    let deviceList = {};
                    for (let device of modeule.device_list) {
                        if (device.set_value.length > 0) {
                            deviceList[device.dev_id] = {};
                            for (let setting of device.set_value) {
                                deviceList[device.dev_id][setting.key] = setting.value;
                            }
                        }
                    }
                    response[modeule.module_name] = { adv_list: modeule.adv_list, device_list: deviceList };
                }
                context.commit('updateModuleAdvanceList', response);
            }
        });
    },
    updateDeviceAdvance(context, payload) {
        let deviceId = payload.dev_id;
        let keyValues = payload.data;
        return updateDeviceAdvance(deviceId, keyValues);
    },
    resetCartState({ commit }) {
        commit('resetState')
    },
}