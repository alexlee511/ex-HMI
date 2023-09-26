let path                = "solution/elec/"
let meterdeviceInfo     = "overview/deviceCard/elecCard/deviceInfo/"
let analysisdeviceInfo  = "overview/Advanced/analysis/deviceInfo/"
let solution            = "elec"
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
          }
        ]
      }
    ]
  }
]