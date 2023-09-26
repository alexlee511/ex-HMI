import { getStatisticsAccApi, getStatisticsAvgApi, deleteStatisticsApi, setStatisticsApi } from "network/statistics"
import { statis_type, updateStatis } from "../statisType"
import vm from "@/main"

export default{
    async getStatisticsList({ commit, state }){
        const avg_res = await getStatisticsAvgApi();
        const acc_res = await getStatisticsAccApi();
        const deviceAttr = vm.$store.state.deviceCommand.deviceAttrList;

        let staticList = {};
        if(avg_res.status == 'ok'){
            for(let info of avg_res.data){
                if(info.enable == '1'){
                    const dev_id = (info.sub_id !== '0') ?
                    info.dev_id + '|' + (info.sub_id.length == 1 ? '0' + info.sub_id : info.sub_id) : info.dev_id;
                    staticList[dev_id] = [ info.attr ];
                }
            }
        }

        if(acc_res.status == 'ok'){
            for(let info of acc_res.data){
                if(info.enable == '1'){
                    const dev_id = (info.sub_id !== '0') ?
                    info.dev_id + '|' + (info.sub_id.length == 1 ? '0' + info.sub_id : info.sub_id) : info.dev_id;
                    if(staticList[dev_id] !== undefined)
                        staticList[dev_id] = staticList[dev_id].concat(info.attr);
                    else
                        staticList[dev_id] = [ info.attr ];
                }
            }
        }

        let output = [];
        for(let [dev, attr] of Object.entries(staticList)){
            if(deviceAttr[dev] !== undefined){
                let attrList = [];
                for(let item of attr){
                    let newAttr = deviceAttr[dev].find(_attr => {
                        return _attr.value == item;
                    });
                    attrList.push(newAttr);
                }
                output.push({
                    dev_id: dev,
                    attr: attrList,
                });
            }
            else{
                let attrList = staticList[dev].map(attr => {
                    return{
                        value: attr,
                        name: attr
                    }
                });
                state.deleteList.push({
                    dev_id: dev,
                    attr: attrList
                });
            }
        }

        output.forEach(item => {
            updateStatis(item.dev_id);
        })

        commit("getStatisticsList", output);
    },
    async setStatisticsList({ state, rootState }){
        rootState.totalLoading = 2 * (state.addList.length + state.deleteList.length);
        //console.log(state.deleteList)
        for(let del_stat of state.deleteList){
            let devId, subId;
            let isDelAvg = false;
            let isDelAcc = false;
            if(del_stat.dev_id.indexOf('|') != -1){
                [devId, subId] = del_stat.dev_id.split('|');
                subId = Number(subId).toString();
            }
            else{
                devId = del_stat.dev_id;
                subId = '0';
            }
            for(let attr of del_stat.attr){
                for(let [key, class_type] of Object.entries(statis_type)){
                    if(key.indexOf('-') != -1){
                        let [min , max] = key.split('-');
                        if(attr.value >= min && attr.value <= max){
                            if(class_type == 'avg' && !isDelAvg){
                                isDelAvg = true;
                                await deleteStatisticsApi({
                                    stats_type: class_type,
                                    dev_id: devId,
                                    sub_id: subId,
                                }).then(res => {
                                    //console.log(res);
                                    rootState.completeLoading += 1;
                                })
                            }
                            else if(class_type == 'acc' && !isDelAcc){
                                isDelAcc = true;
                                await deleteStatisticsApi({
                                    stats_type: class_type,
                                    dev_id: devId,
                                    sub_id: subId,
                                }).then(res => {
                                    //console.log(res);
                                    rootState.completeLoading += 1;
                                })
                            }
                        }
                    }
                    else if(key == attr.value){
                        if(class_type == 'avg' && !isDelAvg){
                            isDelAvg = true;
                            await deleteStatisticsApi({
                                stats_type: class_type,
                                dev_id: devId,
                                sub_id: subId,
                            }).then(res => {
                                //console.log(res);
                                rootState.completeLoading += 1;
                            })
                        }
                        else if(class_type == 'acc' && !isDelAcc){
                            isDelAcc = true;
                            await deleteStatisticsApi({
                                stats_type: class_type,
                                dev_id: devId,
                                sub_id: subId,
                            }).then(res => {
                                //console.log(res);
                                rootState.completeLoading += 1;
                            })
                        }
                    }
                }

                if(isDelAcc && isDelAvg) break;
            }
            if(isDelAcc ^ isDelAvg) rootState.totalLoading -= 1;
        }
        //console.log(state.addList)
        for(let add_stat of state.addList){
            let avgList = [];
            let accList = [];
            for(let attr of add_stat.attr){
                for(let [key, class_type] of Object.entries(statis_type)){
                    if(key.indexOf('-') != -1){
                        const [min, max] = key.split('-');
                        if(attr.value >= min && attr.value <= max){
                            if(class_type == 'avg')
                                avgList.push(attr.value);
                            else if(class_type == 'acc')
                                accList.push(attr.value);
                        }
                    }
                    else if(key == attr.value){
                        if(class_type == 'avg')
                            avgList.push(attr.value);
                        else if(class_type == 'acc')
                            accList.push(attr.value);
                    }
                }
            }
            //console.log(avgList)
            let devId, subId;
            let cnt = rootState.completeLoading;
            if(add_stat.dev_id.indexOf('|') != -1){
                [devId, subId] = add_stat.dev_id.split('-');
                subId = Number(subId).toString();
            }
            else{
                devId = add_stat.dev_id;
                subId = '0';
            }
            if(avgList.length > 0){
                await setStatisticsApi({
                    enable: '1',
                    stats_type: 'avg',
                    dev_id: devId,
                    sub_id: subId,
                    attr: avgList.join(',')
                }).then(res => {
                    //console.log(res);
                    rootState.completeLoading += 1;
                })
            }
            if(accList.length > 0){
                await setStatisticsApi({
                    enable: '1',
                    stats_type: 'acc',
                    dev_id: devId,
                    sub_id: subId,
                    attr: accList.join(',')
                }).then(res => {
                    //console.log(res);
                    rootState.completeLoading += 1;
                })
            }
            if(cnt + 1 == rootState.completeLoading)
                rootState.totalLoading -= 1;
        }
    }
}