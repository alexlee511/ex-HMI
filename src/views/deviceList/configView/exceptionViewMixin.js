//import { getCache } from "network/uci"
//import { loadDIO, setDIO, deleteDIOFile, getDIOConfigInit } from "common/utile/DIOfilter"
//import {
//    EM1100PgetResetInfo,
//    EM1100PdeleteInfo,
//    EM1100PsetInfo,
//    EM1100PaddInfo
//} from "views/deviceList/utils/formateConfig/billingMeterFilter"
//import {
//    EBI21RgetResetInfo,
//    EBI21RdeleteInfo,
//    EBI21RsetInfo,
//    EBI21RaddInfo
//} from "views/deviceList/utils/formateConfig/billingMeterFilter"
export default {
    data() {
        return {
            typeConfig: {}
        }
    },
    async created() {
        //const res = await getCache("record/type.json")
        //this.typeConfig = res
    },
    methods: {
        getKeyByValue(object, value) {
            return Object.keys(object).filter((key) => object[key] === value);
        },
        getTypeByModule(item) { // configView 讀取資料(型號)
            const typeName = item.dev_id.substring(2, 4) + '-' + item.name
            const arr = this.getKeyByValue(this.typeToModule, typeName)
            if (arr.length > 0) return this.typeConfig[item.dev_id] ? this.typeConfig[item.dev_id] : arr[0] || item.name
            return arr[0] || item.name
        },
    },
}