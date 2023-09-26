import {billingStatisticManager} from "../ston/callback"

export default {
  "name": "WATER.WATER_SOLUTION",
  "path": "/overview/water",
  "id": "water",
  "features": [
    {
      "name": "GENERAL.DEVICE_OVERVIEW",
      "path": "/overview/water/deviceCard",
      "type": "overview"
    },
    {
      "name": "WATER.MOD2",
      "path": "/overview/water/Advanced",
      "type": "Advanced",
      "sub" : [
        'Trend',
        'Ratio',
        'Proportion',
        'EnergySavingPerformance',
        //'BestContract',
        ]
    },
    {
      "name": "GENERAL.REPORT",
      "path": "/overview/water/report",
      "type": "report",
      "func": billingStatisticManager,
      /*"sub" : [
        'unusual',
        'timeAccumulation',
      ]*/
    }
  ]
}