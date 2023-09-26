export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": "sensor",
        "component": "solution/sensor/home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": "sensor",
        "component": "solution/sensor/overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": "solution/sensor/overview/deviceCard/DeviceCard"
          },
          {
            "path": "Advanced",
            "component": "solution/sensor/overview/advanced/Advanced"
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
        "path": "sensor/demand",
        "component": "solution/sensor/config/demand/configView/ConfigView"
      },
      {
        "path": "sensor/virtual",
        "component": "solution/sensor/config/virtual/configView/ConfigView"
      }
    ]
  },
  {
    "path": "/changeConfig",
    "component": "views/config/Config",
    "children": [
      {
        "path": "sensor/demand",
        "component": "solution/sensor/config/demand/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        }
      },
      {
        "path": "sensor/virtual",
        "component": "solution/sensor/config/virtual/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        }
      }
    ]
  },
  {
    "path": "/sensor/sensorInfo",
    "component": "solution/sensor/overview/deviceCard/sensorCard/deviceInfo/DeviceInfo",
    "children": [
      {
        "path": "deviceDetailed",
        "component": "solution/sensor/overview/deviceCard/sensorCard/deviceInfo/deviceDetailed/DeviceDetailed"
      },
      {
        "path": "deviceChart",
        "component": "solution/sensor/overview/deviceCard/sensorCard/deviceInfo/deviceChart/DeviceChart"
      }
    ]
  }
]