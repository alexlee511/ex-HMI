let path                = "solution/charging/"
let meterdeviceInfo     = "overview/deviceCard/chargingCard/deviceInfo/"
let analysisdeviceInfo  = "overview/Advanced/analysis/deviceInfo/"
let ReportdeviceInfo    = "overview/report/energyReport/reportInfo/"
let solution            = "charging"
export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": solution,
        "component":  path + "home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": solution,
        "component": path + "overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": path + "overview/deviceCard/DeviceCard"
          },
          {
            "path": "report",
            "component": path + "overview/report/DeviceCard"
          },
        ]
      }
    ]
  },
  {
    "path": "/configView",
    "component": "views/config/Config",
    "children": [
      {
        "path": solution + "/setting",
        "component": path + "config/setting/setting",
        "meta": {
          "other": true,
          "apply": true,
          "store" : true
        },
      }
    ]
  },
  {
    "path": "/" + solution + "/chargingInfo", //系統功能
    "component": path + meterdeviceInfo + "DeviceInfo",
    "children": [
      {
        "path": "deviceDetailed",
        "component": path + meterdeviceInfo + "deviceDetailed/DeviceDetailed"
      },
      {
        "path": "deviceChart",
        "component": path + meterdeviceInfo + "deviceChart/DeviceChart"
      },
    ]
  },
  {
    "path": "/" + solution + "/report", //系統功能
    "component": path + ReportdeviceInfo + "DeviceInfo",
    "children": [
        {
          "path": "transaction",
          "component": path + ReportdeviceInfo + "transaction"
        },
    ]    
  },
  
  // {
  //   "path": "/energy/sensorInfo",
  //   "component": path + "overview/deviceCard/sensorCard/deviceInfo/DeviceInfo",
  //   "children": [
  //     {
  //       "path": "deviceDetailed",
  //       "component": path + "overview/deviceCard/sensorCard/deviceInfo/deviceDetailed/DeviceDetailed"
  //     },
  //     {
  //       "path": "deviceChart",
  //       "component": path + "overview/deviceCard/sensorCard/deviceInfo/deviceChart/DeviceChart"
  //     }
  //   ]
  // }
]