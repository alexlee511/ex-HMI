let path                = "solution/context/"
let solution            = "context"
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
                "component": path + "config/setting/configView/ConfigView",

            },
            {
                "path": solution + "/quickSetting",
                "component": path + "config/quickSetting/configView/ConfigView",

            },
        ]
    },
    {
        "path": "/changeConfig",
        "component": "views/config/Config",
        "children": [
            {
                "path": solution + "/setting",
                "component": path + "config/setting/changeConfig/ChangeConfig",
                "meta": {
                    "store": true
                },
            },
            {
                "path": solution + "/quickSetting",
                "component": path + "config/quickSetting/changeConfig/ChangeConfig",
                "meta": {
                    /*"store": true,
                    "other": true,*/
                    "disable": true,
                },
            },
            /*{
                "path": solution + "/quickSetting/OtherConfig",
                "component": path + "config/quickSetting/otherConfig/OtherConfig",
                "meta": {
                    "store": true
                },
            },*/
        ]
    },
    {
        "path": "/otherConfig",
        "component": "views/config/Config",
        "children": [
            {
                "path": solution + "/quickSetting",
                "component": path + "config/quickSetting/otherConfig/OtherConfig",
                "meta": {
                    "store": true
                },
            },
        ]
    },
]