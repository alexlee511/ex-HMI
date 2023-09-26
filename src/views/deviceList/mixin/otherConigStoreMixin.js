/**
 * 創造一個臨時狀態 管理進階設定的緩存
 */

export default {
    created() {
        if (!this.$store.state.otherConfigModule) {
            this.$store.registerModule("otherConfigModule", {
                namespaced: true,
                state: {
                    configData: null,
                    otherData: null,
                    childDev: null,
                    statementArr: []
                },
                mutations: {
                    handleConfigData(state, payload) {
                        state.configData = payload;
                    },
                    handleOtherData(state, payload) {
                        state.otherData = payload;
                    },
                    addStatementArr(state, payload) {
                        statementArr.push(payload)
                    }
                },
            });
        }
    },
}