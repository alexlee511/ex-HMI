export default [
  {
    "path": "/home",
    "component": "views/home/Home",
    "children": [
      {
        "path": "ven",
        "component": "solution/ven/home/Home"
      }
    ]
  },
  {
    "path": "/overview",
    "component": "views/overview/Overview",
    "children": [
      {
        "path": "ven",
        "component": "solution/ven/overview/Overview",
        "children": [
          {
            "path": "deviceCard",
            "component": "solution/ven/overview/deviceCard/DeviceCard"
          }
        ]
      }
    ]
  },
  {
    "path": "/ven/venInfo",
    "component": "solution/ven/overview/deviceCard/venCard/deviceInfo/DeviceInfo",
    "children": [
      {
        "path": "deviceDetailed",
        "component": "solution/ven/overview/deviceCard/venCard/deviceInfo/deviceDetailed/DeviceDetailed"
      },
      {
        "path": "vennotevent",
        "component": "solution/ven/overview/deviceCard/venCard/deviceInfo/VenNotEvent/VenNotEvent"
      }
    ]
  }
]
