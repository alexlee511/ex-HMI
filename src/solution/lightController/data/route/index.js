export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": "lightController",
        "component": "solution/lightController/home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": "lightController",
        "component": "solution/lightController/overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": "solution/lightController/overview/deviceCard/DeviceCard"
          },
        ]
      },
    ]
  },
  {
    "path": "/configView",
    "component": "views/config/Config",
    "children": [
      {
        "path": "lightController/syncControl",
        "component": "solution/lightController/config/syncConfig/configView/ConfigView",
        "meta": {
          "store": true,
          "other": true
        },
      }
    ]
  },
  {
    "path": "/changeConfig",
    "component": "views/config/Config",
    "children": [
      {
        "path": "lightController/syncControl",
        "component": "solution/lightController/config/syncConfig/changeConfig/ChangeConfig",
        "meta": {
          "store": true
        },
      },
    ]
  }
]