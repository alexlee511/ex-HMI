const modules = {}

const files = require.context('@/solution', true, /index\.js$/); //找到對應資料夾底下的index對應出來的路徑
files.keys().filter(key => {
  const arr =  key.split('/');
  if(arr[2] === 'data' && arr[3] === 'lang' && arr[4] === 'en' ) {
    return true
  }
}).map(key => {
  const modulePath = key.replace('./', '');
  const moduleName = modulePath.replace('/data/lang/en/index.js', '');
  const module = require(`@/solution/${modulePath}`);
  modules[`${moduleName.toUpperCase()}`] = module.default;
})



// en.js
const obj = {
  GENERAL: {
        ADVANCED_FEATURES : 'Advanced features',
        NEW_DEVICE : "new device",
        NAME_SYNC : "name synchronization",

    
    
    //overview_header
    CSERVER_CONNECT_STATE: 'CServer Status',
    CSERVER_CONNECT_STATE_OK: 'OK',
    CSERVER_CONNECT_STATE_FAIL: 'FAIL',
    CSERVER_CONNECT_STATE_NONE: '-',

    CONNECT_STATE: "Status",
    DEVICE_CONNECT_STATE: 'Device Status',
    DEVICE_CONNECT_STATE_OK: 'OK',
    DEVICE_CONNECT_STATE_FAIL: 'FAIL',

    DEVICE_SETTING_METER: 'Meter Setting',
    DEVICE_SETTING_SENSOR: 'Sensor Setting',
    DEVICE_SETTING_CONTROL: 'Controller Setting',
    DEVICE_SETTING_IRCONTROL: 'IR_Controller Setting',

    GATEWAY_SETTING_CServer: 'CServer Setting',
    GATEWAY_SETTING_NETWORK: 'Network Setting',
    GATEWAY_SETTING_MODULES_PERIOD: 'Modules Period Setting',

    SYSTEM_SYNC_AIR_CON_STATUS: 'Air conditioning Status Sync',
    RULE_SETTING: 'Rule Setting',
    SCHEDULE_SETTING: 'Schedule Setting',
    ATTRIBUTE_SETTING: 'Attrbutes Setting',
    CHANNELNAME_SETTING : 'Channel Name Setting',

    // attributes setting
    MODULE_SELECT: 'Module Select',
    ATTRIBUTES_ORDER: 'Attributes Order',
    ATTRIBUTES_DISABLE: 'Disable Attributes',

    // channel name setting
    CHANNEL_INDEX: 'Channel Index',
    MAIN_DEVICE_NAME: 'Main Device Name',
    CHILD_DEVICE_NAME: 'Child Device Name',
    CHILD_DEVICE_ID: 'Chilf Device ID',

    DEV_METER: 'Meter',
    DEV_SENSOR: 'Sensor',
    DEV_CONTROL: 'Controller',
    DEV_DICONTROL: 'DI_Controller',
    DEV_DOCONTROL: 'DO_Controller',
    DEV_IRCONTROL: 'IR_Controller',
    DEV_TSCONTROL: 'TS_Controller',


    APPLY: 'Apply',
    ADD: 'Add',
    SAVE: 'Save',
    SET: 'Set',
    LANG: 'Lang',
    SEARCH: 'Search',
    MAIN_METER: 'Main Meter',
    ENTER_SYSTEM: 'Enter System',
    DOMAIN_NAME: 'Domain Name',
    INDEX: 'Index',
    MODBUS_SLAVE: 'Slave',
    OVERVIEW: 'Overview',
    ENERGY_USED: 'Energy Used',
    VOLTAGE: 'Vol',
    VOLTAGE_L1: 'Vol L1',
    VOLTAGE_L2: 'Vol L2',
    VOLTAGE_L3: 'Vol L3',
    CURRENT: 'Cur',
    CURRENT_L1: 'Cur L1',
    CURRENT_L2: 'Cur L2',
    CURRENT_L3: 'Cur L3',
    POWER_FACTOR: 'PF',
    FREQUENCY: 'Frequency',
    DEMAND: 'Demand',
    POWER: 'Power',
    REAL_POWER: 'Real Power',
    APPARENT_POWER: 'Apparent Power',
    REACTIVE_POWER: 'Reactive Power',
    TEMPERATURE: 'Temp',
    HUMIDITY: 'Humidity',
    CO2: 'CO2',
    CO: 'CO',
    CURRENT_DEMAND: 'Current Demand',
    CONTRACT_CAPACITY: 'Contract Capacity',
    ALARM_VALUE: 'Alarm Val',
    UNLOAD_VALUE: 'Unload Val',
    RETURN_VALUE: 'Return Val',
    ALL_OPEN: 'All Open',
    ALL_CLOSE: 'All Close',
    DEVICE_NAME: 'Device Name',
    DEVICE_TYPE: 'Device Type',
    DEVICE_KIND: 'Device Kind',
    DEVICE_ID: 'Device ID',
    DEVICE_MAC: 'Device MAC',
    AIR_CON_SWITCH_CHECK: 'Air conditioning Switch Status',
    DEMAND_SETTING: 'Demand Setting',
    VALUE_SETTING: 'Val set',
    DIO_SETTING: 'Set DIO',
    UNLOAD_SETTING: 'Unload Setting',
    DIO_IO_SETTING: 'Set IO',
    ENABLE_CHANNEL_SETTING: 'Set Channel',
    ALARM_OPEN: 'Open',
    ALARM_CLOSE: 'Close',
    ALARM_OPTION: 'Alarm Option',
    DEVICE_UNLOAD: 'Unload Device',
    UNLOAD_ORDER: 'Unload Order',
    UNLOAD_DETAIL: 'Unload Detail',
    UNLOAD_ACTION: 'Unload Action',
    RETURN_ORDER: 'Return Order',
    RETURN_ACTION: 'Return Action',
    CONTROL_COUNT: 'Ctrl Count',
    HISTORY_CHART: 'History Chart',
    STATISTICS_CHART: 'Statistics Chart',
    DEMAND_PRED: 'Demand PRED',
    MAC_LIST: 'MAC List',
    WAIT_MSG: 'Waiting...',
    CUSTOM_NAME: 'Custom Name',
    DEVICE_CONNECT_MODE: 'Connect Mode',
    Modbus_RTU: 'Modbus_RTU',
    Modbus_TCP: 'Modbus-TCP',
    SCHEDULE_NAME: 'Schedule Name',
    CONTROL_DEVICE_LIST: 'Control Device',
    NO_DEVICE_SETTING: 'No Device Can Setting',
    SCHEDULE_PERIOD: 'Schedule Period',
    RULE_NAME: 'Rule Name',
    CONDITIONAL_STATEMENT: 'Conditional',
    LINKAGE_CONTROL: 'Linkage Control',

    COPYRIGHT: 'Copyright © 2018 InSynerger Inc. All rights reserved',

    CONTROL_SWITCH_TYPE: 'Switch Type',
    CONTROL_GENERAL_SWITCH: 'General Switch',
    CONTROL_REVERSE_SWITCH: 'Reverse Switch',

    SPECIFIED_ACTION: 'Specified action',
    SPECIFIED_TIME: 'Specified time',
    CONTROL_STATUS_OPEN: 'Open',
    CONTROL_STATUS_CLOSE: 'Close',

    AIR_CON_MODE_FAN: 'Fan',
    AIR_CON_MODE_COOL: 'Cool',
    AIR_CON_MODE_DRY: 'Dry',

    ATTR_POWER: 'Power',
    ATTR_ENERGY_USED: 'Energy Used',
    ATTR_CURRENT_DEMAND: 'Current Demand',
    ATTR_CONTRACT_CAPACITY: 'Contract Capacity',
    ATTR_ALARM_VALUE: 'Alarm Val',
    ATTR_UNLOAD_VALUE: 'Unload Val',
    ATTR_RETURN_VALUE: 'Return Val',

    ATTR_RETUEN: 'Return',
    NO_ATTR_RETURN: 'No Return',

    DEMAND_UNLOAD_MODE: 'Unload Mode',
    DEMAND_UNLOAD_OPTION: 'Unload Option',
    DEMAND_RETURN_OPTION: 'Return Option',
    DEMAND_UNLOAD_MODE_1: 'Directly Unload',
    DEMAND_UNLOAD_MODE_2: 'First uninstall, first return',
    DEMAND_UNLOAD_MODE_3: 'Unload first, then return',
    DEMAND_UNLOAD_MODE_4: 'no Unload',

    DEMAND_PRED_MODE: 'Demand PRED Mode',
    DEMAND_PRED_MODE_1: 'Sync',
    DEMAND_PRED_MODE_2: 'Slide',

    //DIALOG
    DIALOG_PROMPT: 'Prompt',
    DIALOG_OK: 'OK',
    DIALOG_CANCEL: 'Cancel',

    DIALOG_APPLY_CHECK: 'Apply New profiles?',
    DIALOG_APPLY_NONEW: 'No new profiles can be applied',

    //DESC
    DESC_DEMAND_ICON_1: '*Icon',
    DESC_DEMAND_ICON_2: 'is Demand Meter',

    DESC_APPLY_PROC: '*After the device is changed, you need to click⸢ Apply ⸥ to update it to Gateway',

    NODATA_MSG: 'NO DATA',

    //ERROR MSG
    ERROR_MSG_001: 'Please enter the correct Gateway IP address',
    ERROR_MSG_002: 'Please enter the correct port (0~65535)',
    ERROR_MSG_003: 'Please enter the correct device MAC',
    ERROR_MSG_004: 'Please enter the correct device ID',
    ERROR_MSG_005: 'Please enter the correct station number (1~255)',
    ERROR_MSG_006: 'Please enter the correct IP address',
    ERROR_MSG_007: 'Authentication password failed',
    ERROR_MSG_008: 'Please enter the correct password',
    ERROR_MSG_009: 'Password\'s length too long',
    ERROR_MSG_010: 'Please enter the correct password\'s length',
    ERROR_MSG_011: 'Please enter the correct format',
    ERROR_MSG_012: 'Please enter the correct data',
    NOTICE: 'Notice',
    NOTICE_AUTOLOGIN: 'System will login automatically for 30 days',
    NOTICE_REMEMBER: 'System will remember your account and password for 30 days',
    LOGIN_FAIL: 'Login Fail',
    DATA_MISSING: 'Data Missing',
    SETTING_ERROR: 'Setting Error',
    ACCOUNT_PASSWORD_ERROR: 'The account or the password is wrong',
    DATA_MISSING_COMMAND: 'Not set specified action',
    DATA_MISSING_DEVICE_ID: 'Not set device ID',
    DATA_MISSING_ATTRIBUTE: 'Not set device detected attribute',
    DATA_MISSING_STATISTICS: 'No statistics data',
    DATA_MISSING_ATTRIBUTE_DISPLAY: 'Not set attibutes displayed',
    SETTING_ERROR_STOP_DATE: 'The stop date before start date',
    SETTING_ERROR_COMMAND_INPUT: 'Only can enter numbers',
    SETTING_ERROR_REPEAT_DEVICE: 'Having the device ID already',
    
    SUNDAY: 'SUN',
    MONDAY: 'MON',
    TUESDAY: 'TUE',
    WEDNESDAY: 'WED',
    THURSDAY: 'THU',
    FRIDAY: 'FRI',
    SATURDAY: 'SAT',

    PERIOD_ONCE: 'Once',
    PERIOD_DAY: 'Each Day',
    PERIOD_WEEK: 'Each Week',

    START_DATE: 'Start Date',
    END_DATE: 'End Date',

    // other
    LOGIN: 'Login',
    USER_LOGIN: 'User Login',
    AUTO_LOGIN: 'Auto Login',
    REMEMBER_ACCOUNT: 'Remember Account',
    ENERGY_SOLUTION: "Energy",
    DEMAND_CONTROL_SETTING: "Demand Control",
    VIRTUAL_TABLE_SETTING: "Virtual Table",
    DATA_STATISTICS_SETTING: "Data Satatistics",
    SENSOR_SOLUTION: "Sensor",
    DEVICE_OVERVIEW: "Overview",
    ADVANCED_FEATURES: "Advanced",
    GET_IP_LOCATION_AUTO: "Get IP location automatically",
    STATICE_IP: "Fixed IP address",
    SOURCE_METER_NAME: "Source meter name",

    RECIPROCAL_DEMAND: "Reciprcal",
    REMAINING_TIME_IN_THIS_PERIOD: "the remaining time",
    ELECTRICITY_STATS_MONTH: "stats(M)",
    ELECTRICITY_STATS_DAY: "stats(D)",
    ELECTRICITY_STATS_HOUR: "stats(H)",
    CORE_SETTINGS: "Core settings",
    PROGRAM_MANAGEMENT: "Program setting",
    DEVICE_SETTING: "Device setting",
    DEVICE_SELECT: "Device select",
    SYSTEM_SETTING: "System setting",
    SCHEME_ORDER: "Drag to change scheme order",
    DISABLE: "Disable",
    ENABLE: "Enable",
    CHANGE_BACKGROUND: "Change background",
    HOME_ICON_REPLACE: "Home icon replacement",
    FOOTER_ICON_REPLACE: "Footer icon replacement",
    CN_COPYRIGHT_REPLACE: "CN copyright replacement",
    EN_COPYRIGHT_REPLACE: "EN copyright replacement",
    SELECT: "Select",
    RESET: "Reset",
    SOLUTION_NAME: "Solution name",
    SOLUTION_DEVICE: "Solution device",
    PROTOCAL: "Protocal",
    IP_ADDRESS: "IP address",
    SUBNET_MASK: "Subnet mask",
    GATEWAY: "Gateway",
    DNS_SERVICE: "DNS service",
    EVENT_SETTING: "Event setting",
    TYPE: "Type",
    RULE: "Rule",
    ATTRIBUTES: "Attributes",
    ATTRIBUTES_SETTING: "Attributes Setting",
    METER_ATTRIBUTE: "Meter Attribute",
    VALUE: "Value",
    CONTROL: "Control",
    MIN_VALUE: "Min Value",
    MAX_VALUE: "Max Value",
    AVG_VALUE: "Avg Value",
    SELECT_METER: "Select meter",
    TARGET_METER: "Target meter",
    ALARM_SETTING: "Alarm setting",
    SYSTEM_ALARM: "System alarm",
    ENTITY_ALARM: "Entity alarm",
    SOURCE_RULE: "Source rule",
    ADVANCED_SETTING: "Advanced",
    CONTROL_TYPE: "Control type",
    DIO_IO: "I/O",
    DIO_NAME: "I/O name",
    ENABLE_STATUS: "Enable status",
    ABOUT: "About",
    LEAVE_PAGE_MESSAGE: "If you leave the current page, the modified content will not be saved. Are you sure to leave?",
    CONFIRM_MESSAGE: "Confirm information",
    CONTEXT_SETTING: "Context setting",
    HISTORY_ANALYSIS: "Cross analysis",
    FFT_ANALYSIS: "FFT analysis",
    DEV_NO: "No",
    GO: "Go",
    CHOOSE: "Please Choose",
    NO_DATA: "No Data",
    NO_MATCH_DATA: "No Match Data",
    CHOOSE_ALL: "Choose All",
    CANCEL_ALL: "Cancel All",
    SORT: "Sort",
    SETTING_FAIL: "Setting Fail",
    CONTROL_FAIL: "Conitrol Fail",
    SETTING_SUCCESS: "Setting Success",

    // 燈控 // 情境
    CONTEXT_NAME: "Scence name",
    DELETE_CONFIG: "Delete",
    CHECK_CONTEXT: "Check selected",
    CHECK_LIST: "Check list",
    CONTROL_STATUS: "Control state",
    TRIGGER: "Trigger",
    SUB_DEVICE: "Sub device",
    CLASS: "Class",
    SCENE_SOLUTION: "Scene",

    // 卡機
    STORED_VALUE: "Stored value balance",
    CURRENT_MODE: "Current mode",
    STORED_VALUE_METER: "Stored value meter",

    // 馬達
    MOTOR: "MOTOR",
    X_AXIS: "X Axis",
    Y_AXIS: "Y Axis",
    Z_AXIS: "Z Axis",
    X_RMS: "x-axis RMS",
    Y_RMS: "y-axis RMS",
    Z_RMS: "z-axis RMS",
    X_KURTOSIS: "x-axis kurtosis",
    Y_KURTOSIS: "y-axis kurtosis",
    Z_KURTOSIS: "z-axis kurtosis",

    // 類型名稱
    // Single-phase single-circuit AC meter
    SINGLE_PHASE_SINGLE_CIRCUIT_AC_METER: "Single-phase single-circuit AC meter",
    // Alkaline single circuit AC meter
    ALKALINE_SINGLE_CIRCUIT_AC_METER: "Alkaline single circuit AC meter",
    // Multi-circuit AC meter
    MULTI_CIRCUIT_AC_METER: "Multi-circuit AC meter",
    // Environmental sensor
    ENVIRONMENTAL: "Environmental sensor",
    // I/O type controller
    IO_TYPE_CONTROLLER: "I/O type controller",
    // Air conditioning equipment
    AIR_CONDITONING_EQUIPMENT: "Air conditioning equipment",
    // Infrared controller
    INFRARED_CONTROLLER: "Infrared controller",
    // Composite street lamp device
    COMPOSITE_STREET_LAMP_DEVICE: "Composite street lamp device",
    ADVANCED_LOAD_ID: 'Load Id',
    ADVANCED_IO_TYPE: 'IO Type',
    ADVANCED_ENABLED: 'Enabeld',
    NO_NAME: '沒有可以回報的設備名稱'
  },
}

const locale = {...obj, ...modules}

// console.log(locale)

export { locale }