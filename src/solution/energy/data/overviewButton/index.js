import {billingStatisticManager} from "../ston/callback"
export default {
  "name": "GENERAL.ENERGY_SOLUTION",
  "path": "/overview/energy",
  "id": "energy",
  "features": [
    {
      "name": "GENERAL.DEVICE_OVERVIEW",
      "path": "/overview/energy/deviceCard",
      "type": "overview"
    },
    {
    "name": "ENERGY.MOD2",
    "path": "/overview/energy/Advanced",
    "type": "Advanced",
    "sub" : [
      'Trend',
      'Ratio',
      'Proportion',
      'EnergySavingPerformance',
      'ElectricityPriceStructure',
      'BestContract',
      ]
	
    },
    {
    "name": "GENERAL.REPORT",
    "path": "/overview/energy/report",
    "type": "report",
    "func": billingStatisticManager,
    }
  ]
}