var originalId;

export function setCurrentDemandId(info) {
    originalId = info;
}

export function getCurrentDemandId(deviceList) {
    let deviceIndex = 0;
    for (let device of deviceList) {
        if (originalId == device.deviceId) {
            return deviceIndex;
        }
        deviceIndex += 1;
    }
    return 0;
}