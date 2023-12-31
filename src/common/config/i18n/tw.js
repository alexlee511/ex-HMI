const modules = {}

const files = require.context('@/solution', true, /index\.js$/); //找到對應資料夾底下的index對應出來的路徑
files.keys().filter(key => {
  const arr =  key.split('/');
  if(arr[2] === 'data' && arr[3] === 'lang' && arr[4] === 'tw' ) {
    return true
  }
}).map(key => {
  const modulePath = key.replace('./', '');
  const moduleName = modulePath.replace('/data/lang/tw/index.js', '');
  const module = require(`@/solution/${modulePath}`);
  modules[`${moduleName.toUpperCase()}`] = module.default;
})

let obj = {
  GENERAL: {
    //設定
    CORE_SETTINGS                           : "核心設定",
    DEVICE_SETTING                          : "裝置設定",
    ADVANCED_FEATURES                       : "進階功能",
    NEW_DEVICE                              : "新增裝置",
    NAME_SYNC                               : "名稱同步",
    PROGRAM_MANAGEMENT                      : "方案管理",
    TARGET_SET_VALUE                        : "目標設定值",           
    DEVICE_SELECT                           : "裝置選擇",
    SYSTEM_SETTING                          : "系統設定",
    CONTEXT_SETTING                         : "情境設定",
    RULE_SETTING                            : "規則引擎",
    SCHEDULE_SETTING                        : "排程設定",
    ATTRIBUTE_SETTING                       : "屬性設定",
    CHANNELNAME_SETTING                     : "裝備名稱設定",
    DEVICE_ADVANCED_SETTING                 : "進階設定",
    //overview_header           
    CSERVER_CONNECT_STATE                   : "雲端通訊狀態",
    CSERVER_CONNECT_STATE_OK                : "通訊正常",
    CSERVER_CONNECT_STATE_FAIL              : "斷線",
    CSERVER_CONNECT_STATE_NONE              : "未連線",
            
    CONNECT_STATE                           : "狀態",
    DEVICE_CONNECT_STATE                    : "設備狀態",
    DEVICE_CONNECT_STATE_OK                 : "通訊正常",
    DEVICE_CONNECT_STATE_FAIL               : "斷線",
            
    DEVICE_SETTING_METER                    : "電錶設定",
    DEVICE_SETTING_SENSOR                   : "感測器設定",
    DEVICE_SETTING_CONTROL                  : "控制器設定",
    DEVICE_SETTING_IRCONTROL                : "IR控制器設定",
            
    GATEWAY_SETTING_CServer                 : "雲端伺服器",
    GATEWAY_SETTING_NETWORK                 : "網路設定",
    GATEWAY_SETTING_MODULES_PERIOD          : "取樣密度",
        
    SYSTEM_SYNC_AIR_CON_STATUS              : "系統與空調狀態一致設定",
            
    // attributes setting       
    MODULE_SELECT                           : "選擇模組",
    ATTRIBUTES_ORDER                        : "輪播順序",
    ATTRIBUTES_DISABLE                      : "不顯示的屬性",
        
    // analysis settings
    ANALYSIS_SETTING                        : "啟用分析設定",
    SOLUTION_SELECT                         : "選擇方案",

    //water setting
    BASIC_PRICE                             : "基本費",
    CLASS_MIN                               : "級別(最小值)",
    CLASS_MAX                               : "級別(最大值)",
    PRICE_UNIT                              : "每度單價",
    PRICE_DIFF                              : "累進差額",
    FUNCTION                                : "功能",
    OTHER_PRICE                             : "其它",
    WATER_DEGREE                            : "元/度",
    WATER_DOLLARS                           : "元",

    // channel name setting     
    CHANNEL_INDEX                           : "迴路編號",
    MAIN_DEVICE_NAME                        : "主設備名稱",
    CHILD_DEVICE_NAME                       : "設備名稱",
    CHILD_DEVICE_ID                         : "設備ID",
                
    DEV_METER                               : "電錶",
    DEV_SENSOR                              : "感測器",
    DEV_CONTROL                             : "控制器",
    DEV_DICONTROL                           : "DI訊號",
    DEV_DOCONTROL                           : "DO控制器",
    DEV_IRCONTROL                           : "IR控制器",
    DEV_TSCONTROL                           : "TS控制器",
        
        
    APPLY                                   : "套用",
    ADD                                     : "新增",
    SAVE                                    : "暫存",
    SET                                     : "設定",
    LANG                                    : "語言",
    SEARCH                                  : "查詢",
    MAIN_METER                              : "總錶",
    ENTER_SYSTEM                            : "進入系統",
    DOMAIN_NAME                             : "網域名稱",
    INDEX                                   : "序號",
    MODBUS_SLAVE                            : "站號",
    DATA_OVERVIEW                           : "資訊總覽",
    OVERVIEW                                : "總覽",
    ENERGY_USED                             : "用電量",
    VOLTAGE                                 : "電壓",
    VOLTAGE_L1                              : "線電壓L1",
    VOLTAGE_L2                              : "線電壓L2",
    VOLTAGE_L3                              : "線電壓L3",
    CURRENT                                 : "電流",
    CURRENT_L1                              : "電流L1",
    CURRENT_L2                              : "電流L2",
    CURRENT_L3                              : "電流L3",
    POWER_FACTOR                            : "功因",
    FREQUENCY                               : "頻率",
    DEMAND                                  : "需量",
    POWER                                   : "功率",
    REAL_POWER                              : "實功率",
    APPARENT_POWER                          : "視在功率",
    REACTIVE_POWER                          : "虛功率",
    TEMPERATURE                             : "溫度",
    HUMIDITY                                : "濕度",
    CO2                                     : "二氧化碳",
    CO                                      : "一氧化碳",
    CURRENT_DEMAND                          : "目前需量",
    CONTRACT_CAPACITY                       : "契約容量",
    ALARM_VALUE                             : "警報值",
    UNLOAD_VALUE                            : "卸載值",
    RETURN_VALUE                            : "復歸值",
    ALL_OPEN                                : "全開",
    ALL_CLOSE                               : "全關",
    DEVICE_NAME                             : "設備名稱",
    DEVICE_TYPE                             : "設備型號",
    DEVICE_KIND                             : "設備類別",
    DEVICE_ID                               : "設備ID",
    DEVICE_MAC                              : "設備MAC",
    AIR_CON_SWITCH_CHECK                    : "空調啟(閉)狀態確認",
    DEMAND_SETTING                          : "需量設定",
    VALUE_SETTING                           : "數值設定",
    UNLOAD_SETTING                          : "卸載設定",
    DIO_SETTING                             : "DIO設定",
    DIO_IO_SETTING                          : "接點設定",
    ENABLE_CHANNEL_SETTING                  : "迴路設定",
    ALARM_OPEN                              : "開啟",
    ALARM_CLOSE                             : "關閉",
    ALARM_OPTION                            : "警報選項",
    DEVICE_UNLOAD                           : "設備卸載",
    UNLOAD_ORDER                            : "卸載順序",
    UNLOAD_DETAIL                           : "卸載細部資訊",
    UNLOAD_ACTION                           : "卸載動作",
    RETURN_ORDER                            : "復歸順序",
    RETURN_ACTION                           : "復歸動作",
    CONTROL_COUNT                           : "控制數量",
    HISTORY_CHART                           : "歷史圖表",
    STATISTICS_CHART                        : "資料統計",
    DEMAND_PRED                             : "需量預測",
    MAC_LIST                                : "MAC列表",
    WAIT_MSG                                : "請稍後...",
    CUSTOM_NAME                             : "自訂名稱",
    DEVICE_CONNECT_MODE                     : "連線方式",
    Modbus_RTU                              : "串列通訊",
    Modbus_TCP                              : "Modbus-TCP",
    SCHEDULE_NAME                           : "排程名稱",
    CONTROL_DEVICE_LIST                     : "控制設備",
    NO_DEVICE_SETTING                       : "沒有裝置可以控制",
    SCHEDULE_PERIOD                         : "排程週期",
    RULE_NAME                               : "事件名稱",
    CONDITIONAL_STATEMENT                   : "判斷",
    LINKAGE_CONTROL                         : "連動控制",
    MINUTE                                  : "分鐘",
    DEVICE_OPTION                           : "設備選擇",
        
    COPYRIGHT                               : "思納捷科技股份有限公司 版權所有 2019",
        
    CONTROL_SWITCH_TYPE                     : "開關類型",
    CONTROL_GENERAL_SWITCH                  : "一般開關",
    CONTROL_REVERSE_SWITCH                  : "反向開關",
        
    SPECIFIED_ACTION                        : "執行動作",
    SPECIFIED_TIME                          : "執行時間",
    CONTROL_STATUS_OPEN                     : "開啟",
    CONTROL_STATUS_CLOSE                    : "關閉",
        
    AIR_CON_MODE_FAN                        : "送風",
    AIR_CON_MODE_COOL                       : "冷房",
    AIR_CON_MODE_DRY                        : "除溼",
        
    ATTR_POWER                              : "功率",
    ATTR_ENERGY_USED                        : "用電量",
    ATTR_CURRENT_DEMAND                     : "目前需量",
    ATTR_CONTRACT_CAPACITY                  : "契約容量",
    ATTR_ALARM_VALUE                        : "警報值",
    ATTR_UNLOAD_VALUE                       : "卸載值",
    ATTR_RETURN_VALUE                       : "復歸值",
    
    ATTR_UNLOAD                             : "卸載",
    ATTR_RETURN                             : "復歸",
    NO_ATTR_RETURN                          : "不復歸",
    ATTR_RETURN_ASK                         : "是否復歸",
        
    DEMAND_UNLOAD_MODE                      : "卸載模式",
    DEMAND_UNLOAD_RETURN_OPTION             : "卸載與復歸選項",
    DEMAND_UNLOAD_MODE_1                    : "直接卸載",
    DEMAND_UNLOAD_MODE_2                    : "先卸載，先復歸",
    DEMAND_UNLOAD_MODE_3                    : "先卸載，後復歸",
    DEMAND_UNLOAD_MODE_4                    : "不卸載",
        
    DEMAND_PRED_MODE                        : "需量預測模式",
    DEMAND_PRED_MODE_1                      : "同步模式",
    DEMAND_PRED_MODE_2                      : "滑動模式",
    DEMAND_OFFSET_VALUE                     : "需量偏移值", 
        
    //DIALOG        
    DIALOG_PROMPT                           : "提示",
    DIALOG_OK                               : "確認",
    DIALOG_CANCEL                           : "取消",
        
    DIALOG_APPLY_CHECK                      : "是否套用新的設定檔?",
    DIALOG_APPLY_NONEW                      : "沒有新的設定檔可以套用",
        
    //DESC      
    DESC_DEMAND_ICON_1                      : "*圖示",
    DESC_DEMAND_ICON_2                      : "為需量總表",
        
    DESC_APPLY_PROC                         : "*設備變更後，需點擊⸢ 套用 ⸥使其更新至Gateway",
        
    NODATA_MSG                              : "查無相關設備",
        
    //ERROR MSG
    WARNING_TITLE                           : "警告",
    ERROR_MSG_001                           : "請輸入正確的Gateway IP位址",
    ERROR_MSG_002                           : "請輸入正確的Port(0~65535)",
    ERROR_MSG_003                           : "請輸入正確的設備MAC",
    ERROR_MSG_004                           : "請輸入正確的設備ID",
    ERROR_MSG_005                           : "請輸入正確的站號(1~255)",
    ERROR_MSG_006                           : "請輸入正確的IP位址",
    ERROR_MSG_007                           : "驗證失敗",
    ERROR_MSG_008                           : "請輸入正確的密碼",
    ERROR_MSG_009                           : "密碼程度錯誤",
    ERROR_MSG_010                           : "請輸入正確的密碼長度",
    ERROR_MSG_011                           : "請輸入正確的格式",
    ERROR_MSG_012                           : "請確認欄位是否輸入完整",
    ERROR_MSG_013                           : "欄位不可為空值或輸入數值有誤",
    ERROR_MSG_014                           : "目標設定值不可為0或0開頭數字、不可包含-號",
    ERROR_MSG_015                           : "資料傳送失敗，請檢查網路連線",
    ERROR_MSG_016                           : "部分資料傳送有誤",
    ERROR_MSG_017                           : "請輸入基本費用",
    ERROR_MSG_018                           : "請輸入其他費用",
    ERROR_MSG_019                           : "級別與每度單價設定值不可為0或低於0",
    ERROR_MSG_020                           : "每度單價不可大於1000000",
    ERROR_MSG_021                           : "啟用選項不可為空",
    ERROR_MSG_022                           : "無統計資料",
    ERROR_MSG_023                           : "選擇列表不可為空",
    ERROR_MSG_024                           : "設置名稱過長",
    NOTICE                                  : "提醒",
    NOTICE_AUTOLOGIN                        : "系統會幫您自動登入30天",
    NOTICE_REMEMBER                         : "系統會記住您的帳號密碼30天",
    LOGIN_FAIL                              : "登入失敗",
    DATA_MISSING                            : "資料缺失",
    SETTING_ERROR                           : "設定錯誤",
    ACCOUNT_PASSWORD_ERROR                  : "帳號密碼錯誤",
    DATA_MISSING_COMMAND                    : "無設定執行動作",
    DATA_MISSING_DEVICE_ID                  : "無設定控制設備",
    DATA_MISSING_ATTRIBUTE                  : "無設定量測屬性",
    DATA_MISSING_STATISTICS                 : "無統計資料",
    DATA_MISSING_ATTRIBUTE_DISPLAY          : "無設定顯示參數",
    SETTING_ERROR_STOP_DATE                 : "結束日期設定不能比開始日期早",
    SETTING_ERROR_COMMAND_INPUT             : "只能輸入數字",
    SETTING_ERROR_REPEAT_DEVICE             : "設備ID已存在",
    SETTING_ERROR_TIME_INTERVAL_ZERO        : "時間間隔必須大於零",


    //SUCCESS
    SUCCESS_TITLE                           : "成功",
    DATA_SEND_SUCCESS                       : "資料傳送成功",
    DATA_SET_SUCCESS                        : "資料設定成功",
    CONTROL_SUCCESS                         : "控制成功",
    SETTING_SUCCESS                         : "設定成功",

            
    SUNDAY                                  : "週日",
    MONDAY                                  : "週一",
    TUESDAY                                 : "週二",
    WEDNESDAY                               : "週三",
    THURSDAY                                : "週四",
    FRIDAY                                  : "週五",
    SATURDAY                                : "週六",
        
    PERIOD_ONCE                             : "單次",
    PERIOD_DAY                              : "每天",
    PERIOD_WEEK                             : "每週",
        
    START_DATE                              : "開始日期",
    END_DATE                                : "結束日期",
    ENERGY_SAVING_TARGET_SETTING            : "節能目標設定",
    // other        
    LOGIN                                   : "登入",
    USER_LOGIN                              : "用戶登入",
    AUTO_LOGIN                              : "自動登入",
    REMEMBER_ACCOUNT                        : "記住帳號",
    DEMAND_CONTROL_SETTING                  : "需量控制設定",
    VIRTUAL_TABLE_SETTING                   : "虛擬總表設定",
    DATA_STATISTICS_SETTING                 : "資料統計設定",
    DEVICE_OVERVIEW                         : "裝置總覽",
    ADVANCED_FEATURES                       : "進階功能",
    GET_IP_LOCATION_AUTO                    : "自動取得IP位置",
    STATICE_IP                              : "固定IP位置",
    SOURCE_METER_NAME                       : "來源電錶名稱",    
    RECIPROCAL_DEMAND                       : "需量倒數",
    REMAINING_TIME_IN_THIS_PERIOD           : "本時段剩餘時間",
    ELECTRICITY_STATS_MONTH                 : "用電統計(月)",
    ELECTRICITY_STATS_DAY                   : "用電統計(日)",
    ELECTRICITY_STATS_HOUR                  : "用電統計(時)",
    SCHEME_ORDER                            : "拖曳改變方案排序",
    DISABLE                                 : "停用",
    ENABLE                                  : "啟用",
    CHANGE_BACKGROUND                       : "更換背景",
    HOME_ICON_REPLACE                       : "首頁圖標更換",
    FOOTER_ICON_REPLACE                     : "底部圖標更換",
    CN_COPYRIGHT_REPLACE                    : "中文版權標示更換",
    EN_COPYRIGHT_REPLACE                    : "英文版權標示更換",
    SELECT                                  : "選擇圖片",
    RESET                                   : "重置圖片",
    SOLUTION_NAME                           : "方案名稱",
    SOLUTION_DEVICE                         : "方案裝置",
    PROTOCAL                                : "協定",
    IP_ADDRESS                              : "IP位置",
    SUBNET_MASK                             : "子網路遮罩",
    GATEWAY                                 : "閘道器",
    DNS_SERVICE                             : "DNS伺服器",
    EVENT_SETTING                           : "事件設定",
    TYPE                                    : "類型",
    RULE                                    : "規則",
    ATTRIBUTES                              : "量測屬性",
    ATTRIBUTES_SETTING                      : "設定屬性",
    METER_ATTRIBUTE                         : "電錶屬性",
    VALUE                                   : "數值",
    CONTROL                                 : "控制",
    MIN_VALUE                               : "最小值",
    MAX_VALUE                               : "最大值",
    AVG_VALUE                               : "平均值",
    SELECT_METER                            : "選擇電錶",
    TARGET_METER                            : "目標電錶",
    ALARM_SETTING                           : "警報設定",
    SYSTEM_ALARM                            : "系統警報",
    ENTITY_ALARM                            : "實體警報",
    SOURCE_RULE                             : "來源判斷",
    ADVANCED_SETTING                        : "進階設定",
    CONTROL_TYPE                            : "控制型態",
    DIO_IO                                  : "接點",
    DIO_NAME                                : "接點名稱",
    ENABLE_STATUS                           : "啟用狀態",
    ABOUT                                   : "關於",
    LEAVE_PAGE_MESSAGE                      : "離開當前頁面，不會保存已修改內容，確認離開?",
    CONFIRM_MESSAGE                         : "確認信息",
    HISTORY_ANALYSIS                        : "交叉分析",
    FFT_ANALYSIS                            : "FFT分析",
    DEV_NO                                  : "編號",
    GO                                      : "前往",
    CHOOSE                                  : "請選擇",
    NO_DATA                                 : "無資料",
    NO_MATCH_DATA                           : "無匹配資料",
    CHOOSE_ALL                              : "全選",
    CANCEL_ALL                              : "取消全選",
    SORT                                    : "排序",
    SETTING_FAIL                            : "設定失敗",
    CONTROL_FAIL                            : "控制失敗",
    UP_DATA                                 : "置頂",
    REORGANIZE                              : "重新整理",
    LARGER_THAN                             : "大於",
    SMALLER_THAN                            : "小於",
    EQUALS_TO                               : "等於",
    NOT_EQUALS_TO                           : "不等於",
    DECISION_PRINCIPLE                      : "判斷原則",
                    
    // 燈控 // 情境             
    CONTEXT_NAME                            : "情境名稱",
    INPUT_CONTEXT_NAME                      : "輸入情境名稱",
    DELETE_CONFIG                           : "刪除",
    CHECK_CONTEXT                           : "查看加入清單",
    CHECK_LIST                              : "查看清單",
    CONTROL_STATUS                          : "控制狀態",
    TRIGGER                                 : "觸發",
    SUB_DEVICE                              : "子迴路數量",
    CLASS                                   : "分類",
    CANCEL_ADVANCED_SETTING                 : "取消進階設定",
    ENABLE_ADVANCED_SETTING                 : "啟用進階設定",
    HINT_MESSAGE                            : "提示訊息",
    DELAY_TIME                              : "延遲時間",
    DEPENDENCY                              : "連動控制",
    UNIT_SECONDS                            : "秒",
    UNIT_MILLISECONDS                       : "毫秒",
    RESET_DEFAULT                           : "還原預設",

        
        
    // 卡機       
    STORED_VALUE                            : "餘額",
    CURRENT_MODE                            : "目前扣款模式",
    STORED_VALUE_METER                      : "上層儲值電錶",

    EXPAND                                  : "展開",
    CONDENSATION                            : "縮合",
    // 類型名稱
    // Single-phase single-circuit AC meter
    SINGLE_PHASE_SINGLE_CIRCUIT_AC_METER    : "單相單迴路交流電表",
    // Alkaline single circuit AC meter
    ALKALINE_SINGLE_CIRCUIT_AC_METER        : "三相單迴路交流電表",
    // Multi-circuit AC meter
    MULTI_CIRCUIT_AC_METER                  : "多迴路交流電表",
    // Environmental sensor
    ENVIRONMENTAL                           : "環境感測器",
    // 應該會改名
    CIRCUIT_BREAKER                         : "斷路器",
    // I/O type controller
    IO_TYPE_CONTROLLER                      : "I/O類型控制器",
    // Air conditioning equipment
    AIR_CONDITONING_EQUIPMENT               : "空調設備",
    // Infrared controller
    INFRARED_CONTROLLER                     : "冷氣控制器",
    // Virtual demand controller
    VIRTUAL_DEMAND_CONTROLLER               : "虛擬需量控制器",
    // Composite street lamp device
    COMPOSITE_STREET_LAMP_DEVICE            : "燈控裝置",
    POWER_SAVING_DEVICE                     : "儲能裝置",
    POWER_SAVING_CABINET                    : "儲能櫃",

    ADVANCED_LOAD_ID                        : "迴路代碼",
    ADVANCED_IO_TYPE                        : "IO型別",
    ADVANCED_ENABLED                        : "啟用",
    NO_NAME                                 : "沒有可以回報的設備名稱",
    Ratio                                   : "比例分析",
    Proportion                              : "佔比分析",
    Trend                                   : "走勢分析",
    ElectricityPriceStructure               : "電價結構分析",
    BestContract                            : "最佳契約分析",
    EnergySavingPerformance                 : "節能績效",
    Inanalysis                              : "進入分析",
    BA                                      : "進入報表",
    
    // 分析畫面文字
    SELECT_TEXT                             : "已選擇：",
    NO_DEVICE                               : "找不到裝置",
    //分析
    ANALYZE_STATISTICS_DAY                  : "統計(日)",
    ANALYZE_STATISTICS_WEEK                 : "統計(周)",
    ANALYZE_STATISTICS_MONTH                : "統計(月)",
    ANALYZE_STATISTICS_YEAR                 : "統計(年)",
    ANALYZE_START_TIME                      : "開始時間",
    ANALYZE_END_TIME                        : "結束時間",
    ANALYZE_TIME_LEN                        : "時間長度",
    ANALYZE_FIND                            : "查詢",
    ANALYZE_RATIO_T1                        : "裝置名稱",
    ANALYZE_RATIO_T2_KW                     : "用電量(kwh)",
    ANALYZE_RATIO_T3                        : "比例(%)",
    
    ANALYZE_PROPORTION_T1                   : "裝置名稱",
    ANALYZE_PROPORTION_T2                   : "本期",
    ANALYZE_PROPORTION_T3                   : "去年同期",
    
    ANALYZE_TREND_T1                        : "時間",
    
    STRUCTURE_T1                            : "排名",
    STRUCTURE_T2                            : "名稱",
    STRUCTURE_T3                            : "金額",
    
    //報表分析
    REPORT                                  : "報表",
    timeAccumulation                        : "設備運轉小時累計數報表",
    unusual                                 : "異常報表",
    transaction                             : "交易紀錄",
    billingStatistic                        : "計費統計報表",
    consumption                             : "設備累積用電 (時、日、月)報表",
    historyReport                           : "歷史報表",
    OFF_PEAK_CHARGE                         : "離峰",
    PEAK_CHARGE                             : "尖峰",
    PARTIAL_PEAK_CHARGE                     : "半尖峰",
    NOT_IN_TIME                             : "非時間",
    TOTAL_ACCOUNT                           : "總量",
    USE_RATE                                : "使用率",
    PRICE_TOTAL                             : "加總",
    UNREAD                                  : "未讀",
    PROCESSING                              : "處理中",
    EXCLUDED                                : "已排除",
    LOOP_NAME                               : "迴路名稱",
    EXPORT                                  : "匯出",     
    LIGHTING_METER                          : "照明電錶",
    HALL                                    : "大廳",
    REPORT_OPTION                           : "報表選擇",
    REPORT_DATE                             : "報表日期",
    
    PERFORMANCE_T1                            : "目標",
    PERFORMANCE_T2                            : "本期",
    PERFORMANCE_T3                            : "前期",
    PERFORMANCE_T4                            : "達成率",
    PERFORMANCE_T5                            : "成長率",
    PERFORMANCE_T6                            : "總和",
    
    BAST_CONTRACT_XB                          : "契約容量",
    BAST_CONTRACT_YB                          : "用電成本",
    BAST_CONTRACT_T1                          : "基本",
    BAST_CONTRACT_T2                          : "流動",
    BAST_CONTRACT_T3                          : "超約",
    BAST_CONTRACT_T4                          : "總成本曲線",
    BAST_CONTRACT_T5                          : "項目",
    BAST_CONTRACT_T6                          : "最佳(可超約)",
    BAST_CONTRACT_T7                          : "無超約",
    BAST_CONTRACT_T8                          : "現況",
    BAST_CONTRACT_T9                          : "最佳契約",
    BAST_CONTRACT_T10                         : "電價下降",
    BAST_CONTRACT_T11                         : "節省金額",
    BAST_CONTRACT_TI                          : "*契約調整一定有風險，調整前應詳細評估未來使用行為變化。",
    

    //API control error message(情境API錯誤代碼)
    CONTROL_ERROR_0                          : "成功",
    CONTROL_ERROR_1                          : "設備斷線",
    CONTROL_ERROR_2                          : "參數錯誤",
    CONTROL_ERROR_3                          : "無法連至主程式",
    CONTROL_ERROR_4                          : "未支援的指令",
    CONTROL_ERROR_5                          : "指定的裝置不存在",
    CONTROL_ERROR_6                          : "控制失敗",
    CONTROL_ERROR_7                          : "查詢失敗",

    //情境方案
    APPEND                                   : "加入",
    CONTROL_WARNING                          : "目前已有情境正在執行",
    FAIL_TITLE                               : "失敗",
    TOTAL                                    : "共",
    COUNT                                    : "筆",
    SEND_AGAIN                               : "再次傳送",
    INPUT_TEXT_LENGTH_OVER                   : "輸入超出限制長度",
    INPUT_TEXT_LIMIT                         : "限制長度為20，中文與中文標點符號為2單位，英文與英文符號或數字為1單位",
    APPEND_SUCCESS                           : "加入成功",
    NO_TYPE                                  : "無類型",
    MODE                                     : "模式",
    ORDER                                    : "順序",
    NEXT_STEP                                : "下一步",
    CHOOSE_DEVICE_TYPE                       : "選擇設備類型",
    ENABLE_CONTROL_DEVICE                    : "選擇可控設備",
    CHECK_SELECTED_LIST                      : "查看已選清單",
    CHECK_ALL_LIST                           : "查看所有清單",
    SEARCH_MATCH_NAME                        : "搜尋匹配名稱...",


    //空調方案
    INFORM                                   : "通知",
    COOL_STATUS                              : "冷氣切換成功",
    DRY_STATUS                               : "除濕切換成功",
    FAN_STATUS                               : "送風切換成功",
    AUTO_STATUS                              : "自動狀態切換成功",
    POWER_STATUS                             : "電源狀態",
    UPDATE_STATUS                            : "更新狀態",
    ACCOUNT                                  : "數量",
    POWER_OPEN                               : "電源開啟",
    POWER_CLOSE                              : "電源關閉",
    DISCONNECTION                            : "斷線",
    UNKNOWN                                  : "未知",
    CHECK                                    : "查看",
    OPENALL                                  : "全部開啟",
    CLOSEALL                                 : "全部關閉",
    ALL_DEVICE_CONTROL_SUCCESS               : "全部設備控制成功",
    UPDATE_STATUS_FIRST                      : "請先更新狀態",
    
    //方案名稱
    SENSOR_SOLUTION                         : "感測器方案",
    ENERGY_SOLUTION                         : "電能方案",
    WATER_SOLUTION                          : "感測器方案",
    CHARGING_SOLUTION                       : "充電站方案",
    DIO_CONTROLLER_SOLUTION                 : "DIO控制器方案",
    IR_CONTROLLER_SOLUTION                  : "IR控制器方案",
    WATER_SOLUTION                          : "用水方案",
    SCENE_SOLUTION                          : "情境方案",
    AIR_COND_SOLUTION                       : "空調方案",

    //提示使用者
    NO_DEVICE                               : "無相關設備",
    PLEASE_SELECT                           : "請選擇",
  },
}

const locale = {...obj, ...modules}

export { locale }