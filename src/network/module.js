import { requestNode } from 'network'
export function getGetewayInfo() { //HMI資料
    return requestNode({
        methods: 'GET',
        url: 'api/profile'
    })
}

export function getSerial() {
    return requestNode({
        methods: 'GET',
        url: 'api/config/mbus/serial/get'
    })
}

export function getModuleAdvance(lang = 'en') {
    let params = { lang };
    return requestNode({
        methods: 'GET',
        url: 'api/config/module/adv_setting/get',
        params
    });
}

export function deleteModuleAdvance(dev_id, adv_key){
    return requestNode({
        method: 'GET',
        url: 'api/config/module/adv_setting/delete',
        params: {
            dev_id: dev_id,
            adv_key: adv_key,
        },
    })
}

export function updateDeviceAdvance(deviceId, keyValues) {
    let keys = keyValues.map(item => item.key);
    let params = {
        dev_id: deviceId,
        adv_key: keys.join(),
    };
    for (let item of keyValues) {
        let isType1 = Array.isArray(item.values[0]);
        if (!isType1) {
            params[item.key] = item.values.map(item => item.value).join(':');
        } else {
            params[item.key] = item.values.map(item => item.map(item => item.value).join(':')).join(';');
        }
    }
    return requestNode({
        methods: 'GET',
        url: 'api/config/module/adv_setting/set',
        params
    });
}