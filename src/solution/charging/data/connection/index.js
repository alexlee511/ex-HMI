import {getchargingdevlist} from "../data/data.js"
export default {
	"solutionName": "CHARGING.CHARGING_SOLUTION",
	"card": [
		{
			"cardId": "chargingCard-01",
			"cardType": "charging",
			"cardName": "CHARGING.CHARGING_NORMAL",
			"device": [],
            "funct" : getchargingdevlist ,
		},
	]
}