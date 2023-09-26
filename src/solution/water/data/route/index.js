let path                = "solution/water/"
let meterdeviceInfo     = "overview/deviceCard/waterCard/deviceInfo/"
let analysisdeviceInfo  = "overview/Advanced/analysis/deviceInfo/"
let ReportdeviceInfo  = "overview/report/energyReport/reportInfo/"
let solution            = "water"
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
            "path": "Advanced",
            "component": path + "overview/Advanced/DeviceCard"
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
      },
      {
        "path": solution + "/saving",
        "component": path + "config/saving/configView/ConfigView"
      }
    ]
  },
  {
    "path": "/changeConfig",
    "component": "views/config/Config",
    "children": [
      {
        "path": solution + "/saving",
        "component": path + "config/saving/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        }
      }
    ]
  },
  {
    "path": "/" + solution + "/waterInfo", //系統功能
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
    "path": "/" + solution + "/analysis", //系統功能
    "component": path + analysisdeviceInfo + "DeviceInfo",
    "children": [
        {
            "path": "Ratio",
            "component": path + analysisdeviceInfo + "Ratio"
        },
        {
            "path": "Proportion",
            "component": path + analysisdeviceInfo + "Proportion"
        },
        {
            "path": "EnergySavingPerformance",
            "component": path + analysisdeviceInfo + "EnergySavingPerformance"
        },
        {
            "path": "Trend",
            "component": path + analysisdeviceInfo + "Trend"
        },
        {
            "path": "ElectricityPriceStructure",
            "component": path + analysisdeviceInfo + "ElectricityPriceStructure"
        },
        {
            "path": "BestContract",
            "component": path + analysisdeviceInfo + "BestContract"
        },
    ]    
  },
  {
    "path": "/" + solution + "/energyReport", //系統功能
    "component": path + ReportdeviceInfo + "DeviceInfo",
    "children": [
        {
          "path": "unusual",
          "component": path + ReportdeviceInfo + "unusual"
        },
        {
          "path": "billingStatistic",
          "component": path + ReportdeviceInfo + "billingStatistic"
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