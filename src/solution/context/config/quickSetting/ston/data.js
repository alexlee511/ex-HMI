import vm from "@/main"
export let cur_obj       = {};
//export let show_config   = [];
export let true_config   = [];   //總列表
export let add_config    = [];
export let del_config    = [];
export let sceneName     = "";
export let temp_type     = {};
export let advanced_data = {
    message: "",
    delay: "",
    dependency: "",
    dependency_delay_time: "",
};

//釋放空間
export function restart(){  
    //show_config = [];
    true_config = [];
    //add_config = [];
    del_config = [];
    sceneName = "";
    advanced_data = {
        message: "",
        delay: "",
        dependency: "",
        dependency_delay_time: "",
    };
    for(let i of Object.keys(cur_obj)){
        delete cur_obj[i];
    }
}

export function saveTempType(obj){
    temp_type = JSON.parse(JSON.stringify(obj))
}
export function resetTempType(){
    for(let i of Object.keys(temp_type)){
        delete temp_type[i];
    }
}

export function saveName(name){
    sceneName = name
}

//傳送保留的設定
export function sendCurrentConfig(obj){
    cur_obj = JSON.parse(JSON.stringify(obj))
    temp_type.type = obj.type
    temp_type.description = obj.description
    temp_type.model = obj.model
    temp_type.isChange = "false"
}

export function draggableList(list){
    true_config = list
}

//刪除
export function Delsetting(data) {
    let del = del_config.indexOf(data)
    let detector = true_config.indexOf(data)

    if(del == -1){
        if(Object.keys(data).includes("isModify")){
        }
        else{
            del_config.push(data)
        }
    }

    if(detector != -1){
        console.log("刪掉")
        true_config.splice(detector, 1)
    }
    //console.log( true_config)
}
//編輯
export function Setsetting(tag ,data) {

    true_config[tag] = data;
    let index = -1;

}
//新增
export function Addsetting(data) {

    console.log(data)
    
    true_config.push(data) ; 

    console.log(true_config)
    
}
