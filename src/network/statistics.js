import { requestNode } from "network"

export function getStatisticsAvgApi(){
    return requestNode({
        url: "api/data/stats/stream/get?stats_type=avg"
    });
}

export function getStatisticsAccApi(){
    return requestNode({
        url: "api/data/stats/stream/get?stats_type=acc"
    });
}

export function setStatisticsApi(config){
    return requestNode({
        url: "api/data/stats/stream/set",
        params: {
            ...config,
        }
    });
}

export function deleteStatisticsApi(config){
    return requestNode({
        url: "api/data/stats/stream/delete",
        params: {
            ...config,
        }
    })
}

export function getStatisticsAcc_get(dev_id, attr_id, start_date, end_date, statis_mode){
    return requestNode({
        url: "api/data/stats/acc_get",
        params: {
            dev_id: dev_id,
            attr: attr_id,
            st: start_date,
            et: end_date,
            type: statis_mode
        }
    });
}

export function getStatisticsAvg_get(dev_id, attr_id, start_date, end_date, statis_mode){
    return requestNode({
        url: "api/data/stats/avg_get",
        params: {
            dev_id: dev_id,
            attr: attr_id,
            st: start_date,
            et: end_date,
            type: statis_mode
        }
    })
}