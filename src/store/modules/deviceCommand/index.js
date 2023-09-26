export const getDefaultState = () => {
    console.log('here')
    return {
        commandDeviceList: {},
        controlClassList: {},
        deviceControlList: {},
        deviceAttrList: {},
        moduleAttrList: {},
    }
}

const state = getDefaultState();

export default{
    namespaced: true,
    state,
}