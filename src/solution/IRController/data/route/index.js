export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": "IRController",
        "component": "solution/IRController/home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": "IRController",
        "component": "solution/IRController/overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": "solution/IRController/overview/deviceCard/DeviceCard"
          },
          {
            "path": "powerInfo",
            "component": "solution/IRController/overview/powerInfo/PowerInfo"
          },
        ]
      }
    ]
  },
  {
    "path": "/IRController/TSControllerInfo",
    "component": "solution/IRController/overview/deviceCard/TSCard/deviceInfo/DeviceInfo",
    "children": [
      {
        "path": "deviceDetailed",
        "component": "solution/IRController/overview/deviceCard/TSCard/deviceInfo/deviceDetailed/DeviceDetailed"
      },
      {
        "path": "deviceChart",
        "component": "solution/IRController/overview/deviceCard/TSCard/deviceInfo/deviceChart/DeviceChart"
      }
    ]
  }
]