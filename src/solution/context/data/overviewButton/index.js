import {SceneList} from "../ston/data.js"
export default {
  "name": "GENERAL.SCENE_SOLUTION",
  "path": "/overview/context",
  "id": "context",
  "show": show,
  "features": [
    {
      "name": "GENERAL.OVERVIEW",
      "path": "/overview/context/deviceCard",
      "type": "overview",
      
    },
  ],
}
async function show() {
    if(SceneList.length > 0 ){
        return true
    }else{
        return false   
    }
}