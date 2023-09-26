import { getDefaulState } from "./index"

export default{
    getStatisticsList(state, payload){
        state.statisticsList = payload;
    },
    addStatisticsList(state, payload){
        payload.isChange = true;
        state.addList.push(payload);
        state.statisticsList.push(payload);
    },
    modifyStatisticsList(state, { index, config, del_config }){
        //console.log(config,del_config);
        if(state.statisticsList[index].isChange){
            config.isChange = true;
            let config_item = state.statisticsList[index];
            state.statisticsList.splice(index, 1, config);
            state.addList.map(item => {
                return item.dev_id == config_item.dev_id ? config_item : item;
            });
            if(del_config.attr.length != 0){
                state.deleteList.push(del_config);
            }
        }
        else{
            config.isChange = true;
            let config_item = JSON.parse(JSON.stringify(state.statisticsList[index]))
            //console.log(config_item,config)
            state.statisticsList.splice(index, 1, config);
            state.addList.push(config);

            if(del_config.attr.length != 0){
                state.deleteList.push(del_config);
            }
        }
    },
    deleteStatisticsList(state, payload){
        let del_item = state.statisticsList[payload];
        state.deleteList.push(del_item);
        state.statisticsList.splice(payload, 1);
    },
    resetStatisticsList(state){
        Object.assign(state, getDefaulState());
    }
}