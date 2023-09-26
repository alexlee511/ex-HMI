// filter modules that can not be set

const moduleFilter = {
    10: [
        "VIRTUALMETER",
    ],
    15: [
        "VIRTUALDEMAND",
    ],
    29: [
        "VIRTUALVEN",
    ]
}

export function module_filter(type, module){
    if(type in moduleFilter)
        return moduleFilter[type].indexOf(module) != -1;
    else return false;
}