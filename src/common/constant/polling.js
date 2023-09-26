import vm from "@/main"
let time_clock = 0
let polling_enable_list = []
let polling_enable_name = []
let alarmList = []
let flag = false
export async function polling_init(){
    vm.$store.state.polling.addalarm = addalarm ; 
    vm.$store.state.polling.delalarm = delalarm ; 
    for(let i of vm.$store.state.backData.solutionEnable){
        console.log(i)
        if(vm.$store.state.connection.connection[i] == undefined){
            continue ;
        }
        if(vm.$store.state.connection.connection[i].polling == undefined){
            continue ;
        }
        for(let j of vm.$store.state.connection.connection[i].polling ){
            polling_enable_list.push(j)
            polling_enable_name.push(j.name)
            await j.init();
        }
        
        
    }
}
function addalarm(key){
    if(polling_enable_name.indexOf(key)!= -1){
        alarmList.push(key)
    }
}
function delalarm(key){
    let index = alarmList.indexOf(key);
    if (index > -1) {
        alarmList.splice(index, 1);
        flag = false
    }
    
}
export async function polling(){
    //查看有哪些方案進入polling
    for(let i of polling_enable_list){
        if(time_clock % i.polling_time == 0){
            i.run()
        }
    }
    time_clock += 1;
    //有警報發生
    
    if(alarmList.length > 0){
        vm.$store.state.polling.template = polling_enable_list[polling_enable_name.indexOf(alarmList[0])].alarm_path
        if(!flag){
            vm.$store.commit("setPollingalarm" , false);
            flag = true
        }else{
            vm.$store.commit("setPollingalarm" , true);
        }
        
    }else{
        vm.$store.commit("setPollingalarm" , false);
        flag = false
    }
    //vm.$store.state.polling.template = polling_enable_list[0].alarm_path
    //vm.$store.commit("setPollingalarm" , true);
    //vm.$store.commit("setLoadingProgress");
    if(time_clock >=86400){
        time_clock = 0;
    }
}
