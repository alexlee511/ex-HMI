//common/constant/genplc
import { TemplateGet, GenplcSubGet, GenplcSubSet, GenplcSubDelete } from "network/genplc";

var temp_obj = {}

export async function update_temp() {
    let res = await TemplateGet();
    if (res.status == 'ok') {
        for (let item of res.tpl_list) {
            temp_obj[item.tpl_name] = []
            for (let sub of item.sub_list) {
                temp_obj[item.tpl_name].push({ subId: sub.subId, ioType: sub.ioType })
            }
        }
    }
}

export function get_temp_obj(tmp_name) {
    if (tmp_name !== undefined) {
        if (temp_obj.hasOwnProperty(tmp_name)) {
            return temp_obj[tmp_name];
        }
    }
    return [];
}

export async function getGenplcSubInfo(deviceId) {
    if (!deviceId) return { code: 1, message: 'Not found.', data: {} };

    let response = await GenplcSubGet(deviceId);
    if (response.status == 'ok') {
        if (response.sub_list.length > 0) {
            return { code: 0, message: '', data: response.sub_list[0] };
        } else {
            return { code: 1, message: 'Not found.', data: {} };
        }
    } else {
        return { code: 2, message: 'API error.', data: {} };
    }
}

export function updateGenplcSubInfo(item) {
    let deviceId = item.dev_id;
    let tplName = item.data.module;
    let subList = item.data.subList;
    let params = [];

    for (let item of subList) {
        let status = (item.status) ? 'True' : 'False';
        params.push(`${item.subId}_${status}`);
    }
    return GenplcSubSet(deviceId, tplName, params.join());
}