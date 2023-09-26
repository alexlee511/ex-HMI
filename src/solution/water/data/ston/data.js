import vm from "@/main"
export let show_config   = [];
export let true_config   = [];
export let add_config    = [];
export let del_config    = [];
export let deviceName    = [];

let devInfo = [];
for(let i of vm.$store.state.solutionData.water.card){
    for(let j of i["device"]){
        console.log(j)
        devInfo.push(j)
    }
}
deviceName = vm.$store.state.deviceName

restart()

//釋放空間
export function restart(){  
    //show_config   = [];
    true_config   = [];
    add_config    = [];
    del_config    = [];  
}

//刪除
export function Delsetting(data) {
    let del = del_config.indexOf(data)
    let sho = show_config.indexOf(data)
    let detector = true_config.indexOf(data)

    console.log(data)

    let index = -1

    if(add_config.length !== 0){     //若刪除的值在修改的list裡已經有了，就刪掉
        index = add_config.findIndex(e => e.devid == data["devid"])
        if (index != -1) {
            add_config.splice(index, 1)
        }
    }

    if(sho != -1){
        show_config.splice(sho, 1)
    }
    //console.log(show_config)

    if(del == -1){
        del_config.push(data)
        //console.log(del_config)
    }
    //console.log(detector)
    if(detector != -1){
        true_config.splice(detector, 1)
    }
    //console.log(del_config)
    //console.log( true_config)
    //console.log(add_config)
}
//編輯
export function Setsetting(tag ,data) {
    console.log(data)
    console.log(devInfo)
    let name_check = 0

    let sho = show_config.indexOf(tag)
    //console.log(add_config)

    for(let i of devInfo){
        if(i["deviceId"] == data.device_ID){
            data["devid"] = i["deviceId"]
            data["deviceName"] = i["deviceName"]
            name_check += 1
        }
    }

    true_config[tag] = data;
    let index = -1;
    //console.log(data)
    
    if(add_config.length !== 0){
        index = add_config.findIndex(e => e.devid == data["devid"])
        if (index != -1) {
            add_config[index]["value"] = data["value"]
        }
        else{
            add_config.push(data)
        }
    }
    else{
        add_config.push(data)
    }

    if(sho == -1){
        show_config.push(tag)
    }

}
//新增
export function Addsetting(data) {
    console.log(data)
    console.log(devInfo)
    let name_check = 0

    for(let i of devInfo){
        if(i["deviceId"] == data.device_ID){
            data["devid"] = i["deviceId"]
            data["deviceName"] = i["deviceName"]
            name_check += 1
        }
    }
    console.log(data)
    true_config = show_config
    //console.log(show_config)
    show_config = []
    true_config.push(data) ; 
    for(let i in true_config){
        show_config.push(i)
    
    }
    if(add_config.length != 0){
        for(let i of add_config){
            if(i["devid"] != data["devid"]){
                add_config.push(data)
            }
        }
    }
    else{
        add_config.push(data)
    }
   
    for(let i in del_config){
        if(data["devid"] == del_config[i]["devid"]){
            del_config.splice(i,1)
        }
            
    }
}