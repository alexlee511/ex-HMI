
export default {
    addFootText(state, payload) {
        state.footText = payload
    },
    addBackData(state, payload) {
        //對舊的資料與可能出現的新方案進行比對
        const newObj = {}
        let obj = state.connection.connection
        console.log(obj)
        console.log(payload)
        for (let key in obj) {
            newObj[key] = {};
            for (let card of obj[key].card) {
                if(payload.selectDevice.hasOwnProperty(card.cardId))
                    newObj[key][card.cardId] = payload.selectDevice[card.cardId];
                else newObj[key][card.cardId] = [];
            }
        }
        payload.selectDevice = newObj;
        //比對啟用中的方案是不是有不存在資料的
        //如果沒有資料則刪除該方案的啟用
        //如果沒有啟用中的方案則從現有方案中選出一個
        let enaArr = []
        for (let item of payload.solutionEnable) {
            if (state.route.routeList.hasOwnProperty(item)) {
                enaArr.push(item)
            }
        }
        if (enaArr.length === 0) {
            enaArr.push(Object.keys(state.route.routeList)[0])
        }
        payload.solutionEnable = enaArr
        state.backData = payload
        this.commit('setLang', payload.lang)
    },
    addAjaxState(state, payload) {
        state.Disconnected = payload
    },
    changePage(state, payload) {
        if (payload === "first") {
            state.pageNum = 1;
        }
        else if (payload === "next") {
            state.pageNum++;
        }
        else if (payload === "previous") {
            state.pageNum--;
        }
        else {
            state.pageNum = state.maxPageNum;
        }
    },
    addMaxPage(state, payload) {
        state.maxPageNum = payload
    },
    changeSchemeList(state, payload) {
        state.backData.selectDevice = payload
    },
    changeInfo(state, payload) {
        state.isChangeInfo = payload
    },
    setRouteList(state, data) {
        // 修改路由狀態
        state.hasGetRoute = true
    },
    setLang(state, data) {
        const mapping = {
            TW: 'zh-tw',
            EN: 'en'
        }
        state.backData.lang = data
        state.backData.back_lang = mapping[data];
        console.log('setLang', state.backData);
    },
    setSolutionEnable(state, data) {
        state.backData.solutionEnable = data
    },
    setPollingalarm(state, data) {
        state.polling.show = data
    },
    changeBack(state, data) {
        state.backData.backGroundImage = data
    },
    setSolutionData(state, data) {
        state.solutionData = data
    },
    setLoadingState(state, data) {
        state.loading = !state.loading
    },
    setLoadingProgress(state){
        console.log(state)
        state.totalLoading = 0;
        state.completeLoading = 0;
        state.loadingProgress = !state.loadingProgress;
    },
    addCompleteLoading(state ,count = 1){
        state.completeLoading += count;
    },
    setTotalLoading(state, data){
        state.totalLoading = data;
    },
    setLoadingMessage(state, message){
        state.message = message;
    },
    setIcon(state, data) { //設置ICON
        const { title, addr } = data
        state.backData[title] = addr
        console.log(state.backData[title])
    }
}