import {VEN_polling_init , VEN_polling_run} from '../ston/data.js'
export default {
  "solutionName": "VEN.VEN_SOLUTION",
  "card": [
    {
        "cardId": "venCard-01",
        "cardType": "venCard",
        "cardName": "VEN.VEN_SOLUTION",
        "device": []
    }
  ],
  "polling":[
        {
            "init"         : VEN_polling_init ,
            "run"          : VEN_polling_run,
            "name"         : "VEN_ALARM",
            "polling_time" : 30 ,
            "alarm_path"   : import("@/solution/ven/alarm/alarm")
        }
  ]
}
