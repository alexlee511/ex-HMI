import { typeToKind } from "../../../common/constant/type"

export default {
    data() {
        return {
            typeConfig: {}
        }
    },
    methods: {
        async handleGetExceptionConfig(name) { // changeConfig 讀取資料(類型)
            const arr = Object.entries(this.typeToModule).find(item => {
                return item[1] === name;
            });
            this.deviceTypeText = (arr && arr[0]) || name.substr(3) // 有存就有 沒存選第一個
            const typeNo = this.typeToModule[this.deviceTypeText]?.substr(0, 2) || name.substr(0, 2)
            this.deviceKind = typeToKind(typeNo)
        },
    },
}