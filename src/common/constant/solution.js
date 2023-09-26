export function translateSolution(value){
    let changeValue = solution_to_name[value];
    if(changeValue !== undefined) return changeValue;
    else return undefined;
}

export const solution_to_name = {
    "energy": "ENERGY_SOLUTION",
    "DIOController": "DIO_CONTROLLER_SOLUTION",
    "IRController": "IR_CONTROLLER_SOLUTION",
    "charging": "CHARGING_SOLUTION",
    "sensor": "SENSOR_SOLUTION",
    "water": "WATER_SOLUTION",
    "context": "SCENE_SOLUTION",
    "elec": "",
    "lightController": "",
    "motor": "",
    "ven": "",
    //AIR_COND_SOLUTION 空調？
}
    