import {getSceneInit , SceneList} from "../ston/data.js"
export default {
	"solutionName": "CONTEXT.CONTEXT_SOLUTION",
    "solutionType": "1",
    "solutionEnableFunc" : getContext,
	"card": [
		{
			"cardId": "contextCard-01",
			"cardType": "context",
			"cardName": "CONTEXT.CONTEXT_NORMAL",
			"device": [
				//"27"
			],
            "funct" :getContextcard,
			//"in": ["EM1100P", "EBI21R"]
		},
	]
}
async function getContextcard() {
    return SceneList ;
}
async function getContext() {
    return await getSceneInit()
}
