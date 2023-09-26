export default {
  "solutionName": "DIOCONTROLLER.DIO_SOLUTION",
  "card": [
     {
      "cardId": "DIControllerCard-01",
      "cardType": "DIControllerCard",
      "cardName": "DIOCONTROLLER.DEV_DICONTROL",
      "device": [
        "35"
      ],
      "Ctl":false,
      "master":false
    },
    {
      "cardId": "DOControllerCard-01",
      "cardType": "DOControllerCard",
      "cardName": "DIOCONTROLLER.DEV_DOCONTROL",
      "device": [
        "35"
      ],
      "Ctl":true,
      "master":false
    },
    {
      "cardId": "DOControllerCard-02",
      "cardType": "DOControllerCard",
      "cardName": "DIOCONTROLLER.DEV_DOCONTROL",
      "device": [
        "12"
      ],
      "Ctl":true,
      "master":false,
      "sub": true,
    },
    {
      "cardId": "MultiControllerCard-01",
      "cardType": "MultiControl",
      "cardName": "DIOCONTROLLER.DEV_DOCONTROL",
      "device": [
        "29"
      ],
      "in":["LB1500"],
      "Ctl":true,
    },
  ]
}

// DEV_METER: '電錶',
//  DEV_SENSOR: '感測器',
//  DEV_CONTROL: '控制器',
//  DEV_DICONTROL: 'DI訊號',
//  DEV_DOCONTROL: 'DO控制器',
//  DEV_IRCONTROL: 'IR控制器',