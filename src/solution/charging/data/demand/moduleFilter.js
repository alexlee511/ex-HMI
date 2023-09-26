const module = [
    "EM1100P",
    "EBI21R"
];

export function module_filter(value){
    return module.indexOf(value) == -1;
}