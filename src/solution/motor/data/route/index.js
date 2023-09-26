export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": "motor",
        "component": "solution/motor/home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": "motor",
        "component": "solution/motor/overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": "solution/motor/overview/deviceCard/DeviceCard"
          }
        ]
      }
    ]
  },
  {
    "path": "/configView",
    "component": "views/config/Config",
    "children": [
      {
        "path": "motor/virtual",
        "component": "solution/motor/config/device/ConfigView",
        "meta": {
          "store": false
        }
      }
    ]
  }, 
  {
    "path": "/changeConfig",
    "component": "views/config/Config",
    "children": [
      {
        "path": "motor/virtual",
        "component": "solution/motor/config/device/ChangeConfig",
        "meta": {
          "store": true
        }
      }
    ]
  },
  {
    "path": "/configView",
    "component": "views/config/Config",
    "children": [
      {
        "path": "motor/demand",
        "component": "solution/motor/config/demand/configView/ConfigView"
      },
      {
        "path": "motor/virtual",
        "component": "solution/motor/config/virtual/configView/ConfigView"
      }
    ]
  },
  {
    "path": "/changeConfig",
    "component": "views/config/Config",
    "children": [
      {
        "path": "motor/demand",
        "component": "solution/motor/config/demand/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        }
      },
      {
        "path": "motor/virtual",
        "component": "solution/motor/config/virtual/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        }
      }
    ]
  },
  {
    "path": "/motor/motorInfo",
    "component": "solution/motor/overview/deviceCard/motorCard/deviceInfo/DeviceInfo",
    "children": [
      {
        "path": "deviceDetailed",
        "component": "solution/motor/overview/deviceCard/motorCard/deviceInfo/deviceDetailed/DeviceDetailed"
      },
      {
        "path": "deviceChart",
        "component": "solution/motor/overview/deviceCard/motorCard/deviceInfo/deviceChart/DeviceChart"
      },
      {
        "path": "deviceInfo",
        "component": "solution/motor/overview/deviceCard/motorCard/deviceInfo/deviceInfo/DeviceInfo"
      },
      {
        "path": "deviceFFT",
        "component": "solution/motor/overview/deviceCard/motorCard/deviceInfo/deviceFFT/DeviceFFT"
      }
    ]
  }
]