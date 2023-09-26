import { requestNode } from 'network'
import Qs from 'qs'

export function getAttributeOrder(){
    return requestNode({
        method: "GET",
        url: "api/data/attr/get",
    })
}

export function setAttributeOrder(module, count, attr_list , mode ){
    return requestNode({
        method: "POST",
        url: "api/data/attr/set",
        data: Qs.stringify({
            module_name: module,
            count: count,
            attr_list: attr_list,
            set_model : mode
        })
    })
}

export function getAttributeList( req_attr, type){
    return requestNode({
        method: "GET",
        url: "api/config/attrlist/get",
        params: {
            type: type,
            attr: req_attr
          },
    }, true)
}