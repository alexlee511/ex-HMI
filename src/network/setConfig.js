import { requestNode } from 'network'
//import { BASE_URL } from "network/baseUrl"
import axios from 'axios'
import Qs from 'qs'
export function getConfigList() {
    return requestNode({
        method: 'get',
        url: 'api/config/mbus/device/get'
    })
}

export async function setMbusDevice(item) {
    let deviceId = item.dev_id;
    let deviceType = item.name;
    let slaveId = item.slave_id;
    let inter, addr, port;

    if (item.interface.split(",").length > 1) {
        addr = item.interface.split(",")[0];
        port = item.interface.split(",")[1];
    } else {
        inter = item.interface;
    }

    return requestNode({
        method: 'GET',
        url: 'api/config/mbus/device/set',
        params: {
            name: deviceType,
            dev_id: deviceId,
            slave_id: slaveId,
            interface: inter,
            addr: addr,
            port: port,
            timeout: 1000000
        }
    });
}

export function deleteConfigList(deviceIds) {
    return requestNode({
        method: 'GET',
        url: 'api/config/mbus/device/delete',
        params: {
            dev_id: deviceIds.join()
        }
    })
}
export function setNameSync(id, cloud_sync = 1){
    return requestNode({
        method: "POST",
        url: "api/config/name",
        data: Qs.stringify({
            cmd : 'set_sync',
            id,
            cloud_sync
        })
    })
}
export function setNameData(info) {
    let id = []
    let name = []
    for (let tmp of Object.keys(info)) {
        id.push(tmp)
        name.push(info[tmp])
    }
    id = id.join()
    name = name.join()
    return requestNode({
        method: 'get',
        url: "api/config/name",
        params: {
            cmd: 'set',
            id,
            name
        }
    })
}

//UCI
export function setConfigName(deviceList) {
    let deviceIds = deviceList.map(item => item.dev_id);
    let deviceNames = deviceList.map(item => item.deviceName);
console.log(deviceIds, deviceNames)
    return requestNode({
        method: 'get',
        url: "api/config/name",
        params: {
            cmd: 'set',
            id: deviceIds.join(),
            name: deviceNames.join()
        }
    });
}

export function deleteConfigName(deviceIds) {
    return requestNode({
        method: 'get',
        url: "api/config/name",
        params: {
            cmd: 'delete',
            id: deviceIds.join()
        }
    });
}