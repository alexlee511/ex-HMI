import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"

import { typeToModule } from "common/constant/type"

export const getDefaultState = () => {
    return {
        isGetInfo: false, //獲取資料的狀態
        trueList: [],
        nameList: {},
        typeList: {},
        deletList: [], //待清除清單
        rtuList: [],
        rtu: "",

        exceptionList: [ //所有需要寫入的例外清單
            // {
            // 要寫入的表單 listAddress: "",
            // 要寫入的內容 content: []
            // }
        ],
        typeToModule,
        moduleAdavanceList: {}
    }
}

const state = getDefaultState()

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}