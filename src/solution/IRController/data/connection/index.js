export default {
  "solutionName": "IRCONTROLLER.IR_SOLUTION",
  "card": [
     {
      "cardId": "IRControllerCard-01",
      "cardType": "IRControllerCard",
      "cardName": "IRCONTROLLER.DEV_IRCONTROL",
      "device": [
        "23"
      ],
      "out": ["TSAIRC" , "TECOAIRC"], // 不包含該模組
      "sub":false
    },
    {
      "cardId": "TSControllerCard-01",
      "cardType": "TSControllerCard",
      "cardName": "IRCONTROLLER.DEV_TSCONTROL",
      "device": [
        "23"
      ],
      "in": ["TSAIRC" , "TECOAIRC"], // 只包含該模組
      "sub":false
    },
  ],
}