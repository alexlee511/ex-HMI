let path                = "solution/energy/"
let meterdeviceInfo     = "overview/deviceCard/meterCard/deviceInfo/"
let analysisdeviceInfo  = "overview/Advanced/analysis/deviceInfo/"
let ReportdeviceInfo  = "overview/report/energyReport/reportInfo/"
let solution            = "energy"

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
        "path": solution + "/demand",
        "component": path + "config/demand/configView/ConfigView"
      },
      {
        "path": solution + "/virtual",
        "component": path + "config/virtual/configView/ConfigView"
      },
      {
        "path": solution + "/statistics",
        "component": path + "config/statistics/configView/ConfigView"
      },
      {
        "path": solution + "/saving",
        "component": path + "config/saving/configView/ConfigView"
      },
    ]
  },
  {
    "path": "/changeConfig",
    "component": "views/config/Config",
    "children": [
      {
        "path": solution + "/demand",
        "component": path + "config/demand/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        },
      },
      {
        "path": solution + "/demand/alarmConfig",
        "component": path + "config/demand/otherConfig/AlarmConfig",
        "meta": {
          "store": true,
          "other": true
        },
      },
      {
        "path": solution + "/demand/unstallConfig",
        "component": path + "config/demand/otherConfig/UnstallConfig",
        "meta": {
          "store": true,
          "other": true
        },
      },
      {
        "path": solution + "/virtual",
        "component": path + "config/virtual/changeConfig/ChangeConfig",
        "meta": {
          "store": true,
        }
      },
      {
        "path": solution + "/statistics",
        "component": path + "config/statistics/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        }
      },
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
    "path": "/" + solution + "/meterInfo", //系統功能
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
      {
        "path": "deviceDemand",
        "component": path + meterdeviceInfo + "deviceDemand/DeviceDemand"
      },
      {
        "path": "deviceStatistics",
        "component": path + meterdeviceInfo + "deviceStatistics/DeviceStatistics",
        "children": [
          {
            "path": '',
            "redirect": "/" + solution + "/meterInfo/deviceStatistics/hour"
          },
          {
            "path": "hour",
            "component": path + meterdeviceInfo + "deviceStatistics/childComps/statisicsHour"
          },
          {
            "path": "date",
            "component": path + meterdeviceInfo + "deviceStatistics/childComps/statisicsDate"
          },
          {
            "path": "month",
            "component": path + meterdeviceInfo + "deviceStatistics/childComps/statisicsMonth"
          },
        ]
      }
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
          "path": "timeAccumulation",
          "component": path + ReportdeviceInfo + "timeAccumulation"
        },
        {
          "path": "unusual",
          "component": path + ReportdeviceInfo + "unusual"
        },
        {
          "path": "billingStatistic",
          "component": path + ReportdeviceInfo + "billingStatistic"
        },
        {
          "path": "consumption",
          "component": path + ReportdeviceInfo + "consumption"
        },
        {
          "path": "historyReport",
          "component": path + ReportdeviceInfo + "historyReport"
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