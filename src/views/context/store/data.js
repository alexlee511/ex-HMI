import vm from "@/main"
export let show_config   = [];
export let true_config   = [];
export let change_config = [];
export let order_config  = [];
export let add_config    = [];
export let del_config    = [];
export let deviceName    = [];

let devInfo = JSON.parse(JSON.stringify(vm.$store.state.solutionData.energy.card[0].device))
deviceName = vm.$store.state.deviceName

restart()

export function restart(){  
    //show_config   = [];
    //true_config   = [];
    //change_config = [];
    //add_config    = [];
    //del_config    = [];
    //flag = 0;
    //釋放空間
    
}

//設定相關(非正規)
export function Delsetting(data) {
    console.log(add_config)
    let del = del_config.indexOf(data)
    let cha = change_config.indexOf(data)
    let sho = show_config.indexOf(data)
    let detector = true_config.indexOf(data)
    console.log(del)
    console.log(data)

    let index = -1

    /*if(add_config.length !== 0){
        index = add_config.findIndex(e => e.scene_id == data["scene_id"])
        console.log(index)
        if (index != -1) {
           
            add_config.splice(index, 1)
        }
    }*/

    if(sho != -1){
        show_config.splice(sho, 1)
    }
    console.log(show_config)

    if(del == -1){
        if(Object.keys(data).includes("isModify")){
            console.log("不push")
        }
        else{
            del_config.push(data)
        }
        
        console.log(del_config)
    }
    if(cha == -1){
        change_config.push(data)
    }
    console.log(detector)
    if(detector != -1){
        true_config.splice(detector, 1)
    }
    console.log(del_config)
    console.log( true_config)
    console.log(add_config)
}
export function Setsetting(tag ,data) {
    console.log(data)

    let sho = show_config.indexOf(tag)
    let cha = change_config.indexOf(tag)
    console.log(add_config)

    true_config[tag] = data;
    let index = -1;
    console.log(data)
    
    /*if(add_config.length !== 0){
        // index = add_config.findIndex(e => e.devid == data["devid"])
        // console.log(index)
        if (index != -1) {
            // console.log("1111")
            // add_config[index]["value"] = data["value"]
        }
        else{
            add_config.push(data)
        }
    }
    else{
        add_config.push(data)
    }*/

    if(sho == -1){
        show_config.push(tag)
    }
    if(cha == -1){
        change_config.push(tag)
    }
}
export function Addsetting(data) {
    
    /*let name_check = 0

    for(let i of devInfo){
        if(i["deviceName"] == data.deviceName){
            data["devid"] = i["deviceId"]
            name_check += 1
        }
    }
    console.log(name_check)
    if(name_check == 0){
        data["devid"] = data.deviceName
    }*/

    console.log(data)
    
    
    true_config = show_config
    console.log(show_config)
    show_config = []
    change_config.push(data)
    true_config.push(data) ; 
    for(let i in true_config){
        console.log(i)
        show_config.push(i)
    
    }
    /*if(add_config.length !== 0){
        for(let i of add_config){
            console.log(i)
            if(i["scene_id"] != data["scene_id"]){
                add_config.push(data)
            }
        }
    }
    else{
        add_config.push(data)
    }*/
   

    /*for(let i in del_config){
        console.log(i)
        console.log(data["scene_id"])
        console.log(del_config[i]["scene_id"])
        if(data["scene_id"] == del_config[i]["scene_id"]){
            console.log("1111", del_config)
            del_config.splice(i,1)
        }
            
    }*/
    console.log(del_config)
    console.log(add_config)
    console.log(show_config)
    //flag ++ ;
}