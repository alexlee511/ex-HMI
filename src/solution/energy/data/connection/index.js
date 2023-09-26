import { getDemandConfig } from "network/demand";
import vm from "@/main"

export default {
	"solutionName": "ENERGY.ENERGY_SOLUTION",
    "solutionEnableFunc" : getEnergyConfig,
	"card": [
		{
			"cardId": "energyCard-01",
			"cardType": "normalMeterCard",
			"cardName": "ENERGY.NORMAL_METER",
			"device": [
				"10", "11", "12"
			],
			"Ctl": false,
		},
		{
			"cardId": "energyCard-02",
			"cardType": "multiControlMeterCard",
			"cardName": "ENERGY.MUTIPLE_CONTROL_METER",
			"device": [
				"10", "11", "12"
			],
			"in": ["EM1100P","KEM513","DEMS","EM310"]
		},
		{
			"cardId": "energyCard-03",
			"cardType": "singleControlMeterCard",
			"cardName": "ENERGY.SINGLE_CONTROL_METER",
			"device": [
				"10","11", "12"
			],
			"in": [ "EBI21R" ]
		},
		
		
		
		// {
		//   "cardId": "energyCard-02",
		//   "cardType": "sensorCard",
		//   "cardName": "ENERGY.DEV_SENSOR",
		//   "device": [
		//     "21"
		//   ]
		// },
		// {
		//   "cardId": "energyCard-03",
		//   "cardType": "sensorCard",
		//   "cardName": "ENERGY.DEV_SENSOR",
		//   "device": [
		//     "21"
		//   ]
		// }
	]
}

async function getEnergyConfig(){
    let res =  await getDemandConfig()
	while(!res || res.status!='ok'){
		sleep(2000);
		res =  await getDemandConfig();
	}
	let ddobj = {}
    for(let dev of res.device_list){
		ddobj[dev.srcId] = {
			"vdemand_dev_id" : dev.dev_id,
			"offset_val"	 : dev.offset_val
		}
	}
	vm.$store.state.deviceDemand = ddobj
}
