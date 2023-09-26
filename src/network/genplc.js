import { requestNode } from 'network'

export function TemplateGet(tpl_name) {
    return requestNode({
        method: 'get',
        url: "api/config/genplc/template/get",
        params: {
            tpl_name
        },
        retry: 0 //ajax重試次數為0
    })
}

export function GenplcSubGet(dev_id) {
    return requestNode({
        method: 'get',
        url: "api/config/genplc/sub/get",
        params: {
            dev_id
        },
        retry: 0 //ajax重試次數為0
    })
}

export function GenplcSubSet(dev_id, tpl_name, config) {
    return requestNode({
        method: 'get',
        url: "api/config/genplc/sub/set",
        params: {
            dev_id,
            tpl_name,
            config
        },
        retry: 0 //ajax重試次數為0
    })
}

export function GenplcSubDelete(dev_id) {
    return requestNode({
        method: 'get',
        url: "api/config/genplc/sub/delete",
        params: {
            dev_id
        },
        retry: 0 //ajax重試次數為0
    })
}