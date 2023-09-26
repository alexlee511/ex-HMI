import { requestNode } from 'network'

export async function getFirstDevId(){
    return await requestNode({
        method: 'GET',
        url: 'api/hmi/solution/energy/index/get',
    });
}

export async function setFirstDevId(dev_id){
    return await requestNode({
        method: 'GET',
        url: 'api/hmi/solution/energy/index/set',
        params:{
            dev_id
        }
    });
}