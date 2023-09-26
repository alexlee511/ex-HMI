export function typeToKind(value){
    let changeValue = type_to_kind[value];
    if(changeValue !== undefined)
        return changeValue;
    [changeValue] = Object.keys(type_to_kind).filter((type) => type_to_kind[type] === value);
    if(changeValue !== undefined)
        return changeValue;
    else return undefined;
}

const type_to_kind = {
    "10": "SINGLE_PHASE_SINGLE_CIRCUIT_AC_METER",
    "11": "ALKALINE_SINGLE_CIRCUIT_AC_METER",
    "12": "MULTI_CIRCUIT_AC_METER",
    "15": "VIRTUAL_DEMAND_CONTROLLER",
    "21": "ENVIRONMENTAL",
    "29": "CIRCUIT_BREAKER",
    "23": "AIR_CONDITONING_EQUIPMENT",
    "35": "IO_TYPE_CONTROLLER",
    "L5": "COMPOSITE_STREET_LAMP_DEVICE",
    "98": "CONTEXT_SETTING", //2022/7/22
    "27": "POWER_SAVING_DEVICE",
    "34": "POWER_SAVING_CABINET"
}

// export const typeToKind = {
//   "SINGLE_PHASE_SINGLE_CIRCUIT_AC_METER": ["10"],
//   "ALKALINE_SINGLE_CIRCUIT_AC_METER": ["11"],
//   "ENVIRONMENTAL": ["21", "29"],
//   // : "斷路器",
//   "AIR_CONDITONING_EQUIPMENT": ["23"],
//   "IO_TYPE_CONTROLLER": ["35"],
//   "COMPOSITE_STREET_LAMP_DEVICE": ["L5"],
// }

export const typeToModule = { // 型號對應模組
    "CPM-20-MV": "11-CPM20",
    "EM1100-RX": "10-EM1100P",
    "EBI21R": "10-EBI21R",
    "AEMDRA": "12-AEMDRA",

    // 感測器
    "INS-IS-TH-R-01": "21-RS-WS",
    "INS-ISP-TH-R-01": "21-RS-WS-P",
    "INS-OS-THCO2-R-01": "21-RS-CO2",
    "INS-OS-PM2510-R-01": "21-RS-PM",

    // IR
    "INS-IRC-001-W": "23-HMIIRC",

    // IO
    // 燈控
    "RL-RX-E01-01": "L5-GWRS002IO",
    "RL-DM-003-01": "L5-GWRS002DIM",
    "BSRS001": "L5-BSRS001",

    //
    "XXXXX": "XXXXXXXX",

    // 新加入
    // "POWERTAG": "11-POWERTAG",
    // "PM5350": "11-PM5350",
    // "WM": "11-WM",
    // "PM5350": "11-PM5350",

    // "AQW-PM25": "21-AQW-PM25",
    // "CYHT-001": "21-CYHT-001",
    // "CYHTC": "21-CYHTC",
    // "HSR": "21-HSR",
    // "PKTH-100B": "21-PKTH-100B",
    // "RS15-1": "21-RS15-1",
    // "RS15-2": "21-RS15-2",
    // "RS15-3": "21-RS15-3",
    // "RS15-4": "21-RS15-4",
    // "RS20-1": "21-RS20-1",
    // "RS20-2": "21-RS20-2",
    // "RS20-3": "21-RS20-3",
    // "RS20-4": "21-RS20-4",
    // "RS20-5": "21-RS20-5",
    // "RS20-6": "21-RS20-6",
    // "RS20-7": "21-RS20-7",
    // "RS20-8": "21-RS20-8",
    // "RSDS13": "21-RSDS13",
    // "HTR02": "21-HTR02",
    "WSRT2_1": "21-WSRT2",
    "WSRT2_2": "21-WSRT2",
    "WSRT2_3": "21-WSRT2",
    "WSRT2_4": "21-WSRT2",
    "WSRT2_5": "21-WSRT2",
    "WSRT2_6": "21-WSRT2",

    // "MTZ": "29-MTZ",
    // "VARPLUS": "29-VARPLUS",
    // "NEOCR": "29-NEOCR",
}

// export const ModuleToNo = {
//   "CPM20": 11,
//   "RS-WS": 21,
//   "RS-WS-P": 21,
//   "21-RS-CO2": 21,
//   "21-RS-PM": 21,
//   "23-HMIIRC",
//   "XXXXX": "XXXXXXXX"
// }