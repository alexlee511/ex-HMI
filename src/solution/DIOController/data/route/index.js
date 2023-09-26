let path                = "solution/DIOController/"
let meterdeviceInfo     = "overview/deviceCard/deviceInfo/"
let solution            = "DIOController"

export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": "DIOController",
        "component": "solution/DIOController/home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": "DIOController",
        "component": "solution/DIOController/overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": "solution/DIOController/overview/deviceCard/DeviceCard"
          }
        ]
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
      }
    ]
  },
]