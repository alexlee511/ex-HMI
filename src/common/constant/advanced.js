import vm from "@/main"

import { getAnalyticInfo, getTargetData, getChargeData, getElectricityPrice, getContractData, getOptimeData, getAbnormaleventData} from "network/adv";
import { getDemandConfig } from "network/demand"
import { getOldData } from "network/history"
//devidList 裝置列表  list
//devid     裝置序號  str
//starttime 開始時間  dict
//timeleng  時間長度  int
//starttime 開始時間  str

let deviceName;
var devattrlast = {}

function addz(num){   //日期小於10加0
    return num < 10 ? '0' + num : num ;
}

function getLastDate(y, m, d){ //取得上個月的日期
    if(m == 1){
        m = 12
        y -= 1
    }
    else{
        m -= 1
        
    }
    return {y: y, m: m, d: d}
}

//以開始與結束時間的間隔、日週月年統計的分別做處理
function DataCheck(starttime , timeleng , mod){     
    let d   = starttime.day
    let m   = starttime.month
    let y   = starttime.year
    let s   = ""
    let e   = ""
    let t   = "T00:00:00"
    timeleng -= 1

    if(mod === 'h'){
        s = y + '-' + addz(m) + '-' + addz(d) + "T00:30:00"

        let last_day = new Date(y , m , 0).getDate()
        if(d+1>last_day){
            d = 1
        }else{
            d += 1
        }

        e = y + '-' + addz(m) + '-' + addz(d) + "T00:30:00"
        return [{
            st: s,
            et: e,
            type: 2 //時統計
        }]
    }

    switch(mod){
        case 'y':
            m = 12
        case 'm':
            //找當月最後一天
            d = new Date(y , m , 0).getDate()
            break
        case 'w':
            let tmp = new Date(y , m - 1 , d).getDay()
            //周一為0
            if(tmp == 0){
                tmp = 6
            }else{
                tmp -- ;
            }
            d = new Date(y , m - 1 , 6 - tmp + d).getDate();
    }
    
    e = y + '-' + addz(m) + '-' + addz(d) + t

    let et_d = d
    let et_m = m
    let et_y = y
    let time = ''

    switch(mod){
        case 'y':
            time =  new Date( y - timeleng , 0 , 1) 
            break
        case 'm':
            time =  new Date( y , m - 1 - timeleng , 1) 
            break
        case 'w':
            time =  new Date( y , m - 1 , d - (timeleng + 1 ) * 7 + 1) 
            break
        case 'd':
            time =  new Date( y , m - 1 , d - timeleng) 
            break
    }

    y = time.getFullYear()
    m = time.getMonth() + 1
    d = time.getDate()
    s = y + '-' + addz(m) + '-' + addz(d) + t

    let type;
    let dict = []
    let now_day = new Date()
    let now_d = now_day.getDate()
    let now_m = now_day.getMonth()
    now_m+=1
    let now_y = now_day.getFullYear()

    console.log(now_d,now_m,now_y)
    console.log(et_d,et_m,et_y)
    if(mod=="m" || mod=="y"){        //月統計或年統計，因當月未結束要將當月分割出來另外處理
        if(now_y <= et_y && now_m <= et_m && now_d < et_d){

            let lastmonth = getLastDate(now_y, now_m, now_d);
            let lastDay = new Date(lastmonth.y, lastmonth.m, 0);
            let last_y = lastDay.getFullYear();
            let last_m = lastDay.getMonth();
            last_m+=1
            let last_d = lastDay.getDate();

            let now = now_y + '-' + addz(now_m) + '-' + addz(now_d) + t
            let tmp_time = last_y + '-' + addz(last_m) + '-' + addz(last_d) + t

            if(now_m == m && now_y == y){
                type = 1
                dict.push(
                    {
                        st: s,
                        et: now,
                        type: type
                    }
                )
            }
            else{ 
                type = 0 
                dict.push(
                    {
                        st: s,
                        et: tmp_time,
                        type: type
                    }
                )
                tmp_time = now_y + '-' + addz(now_m) + '-' + addz(1) + t
                type = 1 
                dict.push(
                    {
                        st: tmp_time,
                        et: now,
                        type: type
                    }
                )
            }
        }
        else{
            type = 0
            dict.push(
                {
                    st: s,
                    et: e,
                    type: type
                }
            )
        }
    }
    else if(mod=="w" || mod=="d"){        //週統計或日統計
        type = 1
        dict.push(
            {
                st: s,
                et: e,
                type: type
            }
        ) 
    }
    console.log(dict)

    return dict
}

function convertTime(starttime, endtime){  //轉換時間格式
    let s_d   = starttime.day
    let s_m   = starttime.month
    let s_y   = starttime.year
    let e_d   = endtime.day
    let e_m   = endtime.month
    let e_y   = endtime.year
    let t   = "T00:00:00"
    let s   = s_y + '-' + addz(s_m) + '-' + addz(s_d) + t
    let e   = e_y + '-' + addz(e_m) + '-' + addz(e_d) + t
    return{st: s, et: e}
    
}
//最佳契約分析
async function BestContract(devid , starttime , endtime , electricity ){
    // console.log("💔💔💔💔")
    // console.log(devid)
    // console.log(starttime)
    // console.log(endtime)
    // console.log(electricity)
    // console.log("💔💔💔💔")
    
    let rd = [      //格式範例
            /*{type : 0 , value : 20 , data : [ { cost : 30 },{ cost : 20 },{ cost : 40 }] },
            {type : 1 , value : 40 , data : [ { cost : 30 },{ cost : 10 },{ cost : 10 }] },
            {type : 2 , value : 60 , data : [ { cost : 30 },{ cost : 40 },{ cost : 30 }] },*/
        ]
    let rc = [
        /*{value : 10 ,cost: 120},
        {value : 20 ,cost: 90} ,
        {value : 30 ,cost: 65} ,*/
    ]
    let fined_zero_list = []
    let temp_dic = {}
    let res_index = -1
    let now_demand = ""
    let time = convertTime(starttime, endtime)
    console.log(time)

    let res = await getContractData(devid, devattrlast[devid], time["st"], time["et"], electricity)
    console.log(res)
    if(res['status'] == 'ok'){
        if(res["data"]["cost_list"].length == 0){
            vm.$notify({
                type: 'info',
                title: vm.$t("GENERAL.DATA_MISSING_STATISTICS"),
                message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //資料傳送失敗
            })
            return
        }
    }
    else{
        /*vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })*/
        return { status:16 , data : r}
    }

    let demand_res = await getDemandConfig(devid)
    console.log(demand_res)
    if(demand_res['status'] == 'ok'){
        if(demand_res["device_list"].length == 0){
            vm.$notify({
                type: 'info',
                title: vm.$t('GENERAL.NOTICE'),
                message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //資料傳送失敗
            })
            return
        }
        now_demand = demand_res["device_list"][0]["threshold"].split('_')[0]
    }
    else{
        vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })
    }
    let lost = [-1 , 0]
    if(res["data"]["cost_list"].length != 0){ 
        for(let i of res["data"]["cost_list"]){
            if(lost[0] == -1 || i["fined_cost"] < lost[1]){
                lost[1] = i["fined_cost"]
                lost[0] = i
            }
            rc.push({value: i["capacity_value"], cost: Math.round((i["base_cost"]+i["energy_cost"]+i["fined_cost"]) * 100) / 100})    //將資料格式對齊已註解範例
        }
    }
    fined_zero_list.push({value: lost[0]["capacity_value"], cost: Math.round((lost[0]["base_cost"]+lost[0]["energy_cost"]) * 100) / 100})
    console.log(rc)
    console.log(fined_zero_list)
    console.log(now_demand)

    temp_dic = contractCompute(res["data"]["cost_list"], rc, 0)
    rd.push(temp_dic)

    temp_dic = contractCompute(res["data"]["cost_list"], fined_zero_list, 1)
    rd.push(temp_dic)

    res_index = res["data"]["cost_list"].findIndex(e => e.capacity_value == Number(now_demand))
    rd.push({                                //將資料格式對齊宣告時範例
        type : 2 , value : res["data"]["cost_list"][res_index]["capacity_value"] , 
        data : [
                { cost : res["data"]["cost_list"][res_index]["base_cost"] },
                { cost : res["data"]["cost_list"][res_index]["energy_cost"] },
                { cost : res["data"]["cost_list"][res_index]["fined_cost"] }
            ] 
    })
    console.log(rd)

    let r = {bar : rd , line : rc}
    return { status:0 , data : r}
}

function contractCompute(cost_list, process_list, type){     //計算最佳契約所需的數值
    let process_index = -1
    let cost_index = -1

    process_index = process_list.findIndex(e => e.cost == Math.min.apply(Math, process_list.map(function(e) {return e.cost})))
    console.log("😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊")
    console.log(cost_list)
    console.log(process_list)
    console.log(process_index)
    cost_index =cost_list.findIndex(e => e.capacity_value == process_list[process_index]["value"])
    
    return{
        type : type , value : cost_list[cost_index]["capacity_value"] , 
        data : [
                { cost : cost_list[cost_index]["base_cost"] },
                { cost : cost_list[cost_index]["energy_cost"] },
                { cost : cost_list[cost_index]["fined_cost"] }
            ] 
    }
}

//電價結構分析
async function ElectricityPriceStructure(devid , starttime , endtime , price_type ){
    // console.log("💔💔💔💔")
    // console.log(devid)
    // console.log(starttime)
    // console.log(endtime)
    // console.log("💔💔💔💔")
    let r = [       //格式範例
        /*{name : '低壓-非時間電價'    , value : 135   },
        {name : '低壓-二段式'        , value : 530   },
        {name : '高壓-二段式'        , value : 805   },*/
    ]

    let type = []
    let check = []
    let price_table = {}
    let sum = 0
    let exp = 0
    let temp = 0
    let check_data = -1
    let time = convertTime(starttime, endtime)
    let new_data = []
    console.log(time)

    let electricity_price = await getElectricityPrice()
    console.log(electricity_price)
    if(electricity_price["status"] == "fail"){
        /*vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })*/
        return { status:16 , data : r}
    }
    
    for(let i of electricity_price["electricity_price"]){
        console.log(i)
        price_table[i["type"]] = i["name"]
        type.push(i["type"])
    }
    console.log(price_type)

    //判斷高壓或低壓
    if(price_type == 0){
        let loc = type.indexOf("03")
        type.splice(loc,1)
        loc = type.indexOf("04")
        type.splice(loc,1)

    }
    else if(price_type == 1){
        let loc = type.indexOf("01")
        type.splice(loc,1)
        loc = type.indexOf("02")
        type.splice(loc,1)
    }
    // console.log(price_table)
    // console.log(type)
    
    let data_list = []
    let now_res = await getChargeData(devid, devattrlast[devid], time["st"], time["et"], type.join(","));

    if(now_res['status'] == 'ok'){
        console.log(now_res)
        if(now_res["data_list"].length != 0){ 
            check_data++
        }
        data_list.push(now_res["data_list"])
        
    }
    else{
        vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })
    }
    
    console.log(data_list)

    for (let i of data_list){
        for(let j of i){
            if(check.indexOf(j["type"]) == -1){   //沒有同樣的type
                check.push(j["type"])
                sum = 0
                sum += Number(j['totalCharge'])
                new_data.push({type: price_table[check[check.length - 1]],  value: sum})
            }
            else{                                 //有同樣的type
                exp = 0
                exp += Number(j['totalCharge'])

                for (let k of new_data){
                    if (k["type"] == price_table[j["type"]]){
                        k["value"] += exp
                    }    
                }
            }
        }
        console.log(new_data)
    }

    let temp_data = [...new_data]     //暫存data以便於做刪除時不會影響到迴圈

    for(let j = 0; j < new_data.length; j++){
        for (let i of temp_data){    
            if(Number(i["value"]) > temp){
                temp = Number(i["value"])
            }

        }
        console.log(temp)
        
        let index = -1
        index = temp_data.findIndex(e => e.value == temp)
        if(index != -1){
            r.push({name: temp_data[index]["type"], value: Number(temp_data[index]["value"])})
            temp_data.splice(index, 1)
        }
        temp = 0

    }
    r = r.reverse()
    console.log(r)
    if(check_data == -1){

        return { status:22 , data : r}
    }

    return { status:0 , data : r}
    
}
//節能績效分析
async function EnergySavingPerformance(devidList ){
    // console.log("💔💔💔💔")
    // console.log(devidList)
    // console.log("💔💔💔💔")
    let status = 0
    let r = {         //格式範例
        /*'插座' : {now :350000 , tag : 700000 , old : 400000},
        '照明' : {now : 9000  , tag : 10000  , old : 10000},
        '空調' : {now :35000  , tag : 70000  , old : 50000},
        '動力' : {now :4500   , tag : 9000   , old : 9000},*/
    }

    if(devidList.length == 0){ 
        status = 12
        return { status: status , data : r}
    }

    let last_result = {}
    let now_result = {}
    let date = new Date()
    let y = date.getFullYear()
    let time = []
    let last_data_list = []
    let data_list = []
    let target_list = []
    let last_new_data = []
    let now_new_data = []
    let last_starttime = {day: 1, month: 1, year: (y-1)}
    let now_starttime = {day: 1, month: 1, year: (y)}

    time.push(DataCheck(last_starttime , 1 , "y"))   //取得去年開始與結束時間
    time.push(DataCheck(now_starttime , 1 , "y"))    //取得今年開始與目前時間

    console.log(time)

    let attrList = []
    for (let i of devidList){ attrList.push(devattrlast[i]) }
    //取得去年資料
    let last_y_res = await getAnalyticInfo(devidList.join(","), attrList.join(","), time[0][0]["st"], time[0][0]["et"], time[0][0]["type"]);
    //取得今年資料
    for(let j in time[1] ){
        console.log(j)
        let now_res = await getAnalyticInfo(devidList.join(","), attrList.join(","), time[1][j]["st"], time[1][j]["et"], time[1][j]["type"]);
        
        if(now_res['status'] == 'ok'){
            console.log("今年")
            console.log(now_res)
            data_list.push(now_res["data_list"])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
    }
    //取得節能目標值
    let target_res = await getTargetData()

    if(last_y_res['status'] == 'ok'){
        console.log("去年")
        console.log(last_y_res)
        last_data_list.push(last_y_res["data_list"])
    }
    else{
        vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })
    }

    console.log(data_list)

    if(target_res['status'] == 'ok'){
        console.log("目標值")
        console.log(target_res)
        if(target_res["data_list"].length == 0){
            target_list = []
        }
        for(let i of target_res["data_list"]){
            if(i["solution"] == vm.$route.query.solution){
                target_list = JSON.parse(JSON.stringify(i["target_list"]))
            }
        }        
        
    }
    else{
        vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })
    }

    //整理從API取得的結果中的data list
    last_new_data = dataListCompute(last_data_list)   
    now_new_data = dataListCompute(data_list)

    console.log(last_new_data)
    console.log(now_new_data)

    //取得本期與前期的用量數據
    last_result = periodDataProcess(last_new_data)    
    now_result = periodDataProcess(now_new_data)

    // console.log(last_result)
    // console.log(now_result)
    // console.log(target_list)
    let temp = {}
    let index = -1
    for(let i of Object.keys(last_result)){       //整理本期、目標、前期的數據格式
        console.log(i)
        if(target_list.length == 0){
            temp = {now: now_result[i]["value"], tag: "-", old: last_result[i]["value"]}
        }
        else if(Object.keys(target_list[0]).length == 0){
            temp = {now: now_result[i]["value"], tag: 0, old: last_result[i]["value"]}
        }
        else{
            console.log(deviceName[i])
            /*if(deviceName[i] != undefined){
                index = target_list.findIndex(e => e.devid == deviceName[i])
            }
            else{
                index = target_list.findIndex(e => e.devid == i)
            }*/
            index = target_list.findIndex(e => e.devid == i)
            console.log(index)
            if(index != -1){
                temp = {now: now_result[i]["value"], tag: Number(target_list[index]["value"]) / 1000, old: last_result[i]["value"]}
            }
            else{
                temp = {now: now_result[i]["value"], tag: "-", old: last_result[i]["value"]}
            }
        }
        
        r[i] = temp
    }
    
    r = checkName(r)    //檢查是否有對應的名稱，有的話替換成名稱
    console.log(r)
    return { status: status , data : r}
}
//佔比分析
async function Proportion(devidList , starttime , timeleng , mod  ){
    // console.log("💔💔💔💔")
    // console.log(devidList)
    // console.log(starttime)
    // console.log(timeleng)
    // console.log(mod)
    // console.log(devattrlast)
    // console.log("💔💔💔💔")
    let r = {}
    let status = 0
    if(devidList.length == 0){ 
        status = 12
        return { status: status , data : r}
    }

    let time = DataCheck(starttime , timeleng , mod)   //取得開始與結束時間
    console.log(time)

    //格式範例
    let rn = {
        /*'插座' : {value :520  },
        '照明' : {value :120  },
        '空調' : {value :320  },
        '動力' : {value :145  },*/
    }
    let ro = {
        /*'插座' : {value :320  },
        '照明' : {value :123  },
        '空調' : {value :88   },
        '動力' : {value :99   },*/
    }
    let check_data = -1
    let last_data_list = []
    let data_list = []
    let last_new_data = []
    let now_new_data = []
    let attrList = []
    
    for (let i of devidList){ attrList.push(devattrlast[i]) }

    for (let i in time){
        //取得去年資料
        let last_y_res = await getAnalyticInfo(devidList.join(","), attrList.join(","), String(Number(time[i]["st"].slice(0,4))-1)+time[i]["st"].slice(4,19), String(Number(time[i]["et"].slice(0,4))-1)+time[i]["et"].slice(4,19), time[i]["type"]);
        //取得今年資料
        let now_res = await getAnalyticInfo(devidList.join(","), attrList.join(","), time[i]["st"], time[i]["et"], time[i]["type"]);
        console.log(now_res);
        if(last_y_res['status'] == 'ok'){
            console.log("去年")
            console.log(last_y_res)
            if(last_y_res["data_list"].length == 0){
                check_data += 1
            }
            last_data_list.push(last_y_res["data_list"])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }

        if(now_res['status'] == 'ok'){
            console.log("今年")
            console.log(now_res)
            if(now_res["data_list"].length == 0){
                check_data += 1
            }
            data_list.push(now_res["data_list"])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
    }
    if(check_data == 1){
        vm.$notify({
            type: 'info',
            title: vm.$t("GENERAL.NOTICE"),
            message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
        })
        return
    }

    //整理從API取得的結果中的data list
    last_new_data = dataListCompute(last_data_list)
    now_new_data = dataListCompute(data_list)

    console.log(last_new_data)
    console.log(now_new_data)

    //取得本期與前期的用量數據
    ro = periodDataProcess(last_new_data)
    rn = periodDataProcess(now_new_data)

    
    rn = checkName(rn)
    ro = checkName(ro)
    console.log(rn)
    console.log(ro)
    r = {now : rn , yest : ro}
    return { status: status , data : r}
    
}

function dataListCompute(data_list){  
    let dev_data = []
    let new_data = []
    let check = []
    let sum = 0
    let check_data = -1
    let name = ""

    for (let i of data_list){           //去年同期數據處理
        for(let j of i){
            if(check.indexOf(j["dev_id"]) == -1){   //沒有同樣的dev_id
                check.push(j["dev_id"])
                sum = 0
                dev_data = []
                console.log(deviceName[j["dev_id"]])
                /*if(typeof(deviceName[j["dev_id"]]) == "undefined"){
                    name = j["dev_id"]
                }
                else{
                    name = deviceName[j["dev_id"]]
                }*/
                new_data[j["dev_id"]] = []
                if(j['data'].length != 0){ 
                    check_data++
                }
                console.log(j['data'])
                dev_data.push(j['data'])

                for (let i of dev_data){
                    for(let j of i){
                        sum += Number(j['sum'])
                    }
                }
                new_data[j["dev_id"]].push({value: sum})
                console.log("沒有同樣的dev_id")
            }
            else{                      //有同樣的dev_id
                dev_data = []
                if(j['data'].length != 0){ 
                    check_data++
                }
                dev_data.push(j['data'])
                console.log(new_data)
                for (let k of dev_data){
                    console.log(k)
                    for(let l of k){
                        new_data[j["dev_id"]][0]["value"] += Number(l["sum"])      //將同device_id的設備用量數據相加
                    }
                }
            }
            console.log(new_data)  
        }
    }
    console.log(check_data)
    /*if(check_data == -1){
        vm.$notify({
            type: 'info',
            title:'',
            message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
        })
    }*/
    return new_data
}

function periodDataProcess(data){       //同期的用量數據整理
    let result = {}
    for (let i in data){
        for (let k of data[i]){
            result[i] = {value: Math.round(Number(k['value']) * 100) / 100}
        }
    }
    console.log(result)
    return result
}

function checkName(obj){         //檢查ID與對應的名稱
    for(let i of Object.keys(obj)){
        if(Object.keys(deviceName).includes(i)){
            obj[deviceName[i]] = obj[i]
            delete obj[i]
        }
    }
    return obj
}

//比例分析
async function Ratio(devidList , starttime , timeleng , mod  ){
    let status = 0
    let r = [         //格式範例         
        /*{value:520 , name:'插座'},
        {value:120 , name:'照明'},
        {value:320 , name:'空調'},*/
    ]
    if(devidList.length == 0){
        status = 12
        return { status: status , data : r}
    }
    // console.log("💔💔💔💔")
    // console.log(devidList)
    // console.log(starttime)
    // console.log(timeleng)
    // console.log(mod)
    // console.log("💔💔💔💔")

    let time = DataCheck(starttime , timeleng , mod)
    let data_list = []
    let dev_data = []
    let new_data = []
    let sum = 0
    let exp = 0
    let attrList = []
    let check = []

    for (let i of devidList) attrList.push(devattrlast[i])

    for (let i in time){
        let res = await getAnalyticInfo(devidList.join(","), attrList.join(","), time[i]["st"], time[i]["et"], time[i]["type"]);
        console.log(res)
        if(res['status'] == 'ok'){
            //console.log(res)
            if(res["data_list"].length == 0){
                vm.$notify({
                    type: 'info',
                    title: vm.$t("GENERAL.NOTICE"),
                    message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
                })
                return
            }
            data_list.push(res["data_list"])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
    } 
    
    
    for (let i of data_list){
        for(let j of i){
            if(check.indexOf(j["dev_id"]) == -1){   //沒有同樣的dev_id
                check.push(j["dev_id"])
                dev_data = []
                sum = 0
                /*if(j['data'].length == 0){
                    continue
                }*/
                dev_data.push(j['data'])
                if(j['count_total'] !== '0'){
                    for (let i of dev_data){
                        for(let l of i){
                            sum += Number(l['sum'])
                        }
                    }
                }
                new_data.push({dev_id: check[check.length - 1],  value: sum})
            }
            else{                                               //有同樣的dev_id
                dev_data = []
                exp = 0
                /*if(j['data'].length == 0){
                    continue
                }*/
                dev_data.push(j['data'])
                for (let i of dev_data){
                    for(let l of i){
                        exp += Number(l['sum'])
                        
                    }
                }
                for (let i of new_data){
                    console.log(i)
                    if (i["dev_id"] == j["dev_id"]){
                        i["value"] += exp
                    }    
                }
            }
        }
    }
    console.log(new_data)

    for (let i of new_data){
        console.log(i)
        r.push({value: Math.round(Number(i["value"]) * 100) / 100, name: i["dev_id"]})
    }

    for(let i of r){
        if(Object.keys(deviceName).includes(i["name"])){
            i["name"] = deviceName[i["name"]]
        }
    }
    console.log(r)
    return { status: status , data : r}
}
//走勢分析
async function Trend(devidList , starttime , timeleng , mod  ){
    // console.log("💔💔💔💔")
    // console.log(devidList)
    // console.log(starttime)
    // console.log(timeleng)
    // console.log(mod)
    // console.log("💔💔💔💔")
    
    let r = {         //格式範例
        /*'插座' : [
            {time : '2021-11-01', value :520  },
            {time : '2021-11-02', value :123  },
            {time : '2021-11-03', value :535  },
            {time : '2021-11-04', value :785  },
        ], */  
    }
    let status = 0
    if(devidList.length == 0){ 
        status = 12
        return { status: status, data : r}
    }

    let time = DataCheck(starttime , timeleng , mod)
    let data_list = []
    let attrList = []
    let dev_data = []
    let check = []
    let tempTime = []
    let unifyTime = []
    let new_data = {}
    let week_temp_data = []
    let repeat = -1
    for (let i of devidList){ attrList.push(devattrlast[i]) }
    unifyTime = []
    for (let i in time){
        console.log(time[i])
        let res = await getAnalyticInfo(devidList.join(","), attrList.join(","), time[i]["st"], time[i]["et"], time[i]["type"]);
        if(res['status'] == 'ok'){
            if(res["data_list"].length == 0){
                vm.$notify({
                    type: 'info',
                    title:vm.$t("GENERAL.NOTICE"),
                    message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
                })
                return
            }
            if(mod == "m" || mod == "y"){
                tempTime = dateProcess(time[i]["st"], time[i]["et"], mod)     //回傳開始到結束日期的區間裡yyyy-mm格式的日期並統整進unifyTime裡
                console.log(tempTime)
                for(let i of tempTime){ 
                    repeat = unifyTime.findIndex(e => e.time == i["time"])
                    console.log(repeat)
                    if(repeat == -1){
                        unifyTime.push(i)
                    }
                }
            }
            if(mod == "w"){
                tempTime = dateProcess(time[i]["st"], time[i]["et"], mod)     //回傳開始到結束日期的區間裡yyyy-mm--dd格式的日期並統整進unifyTime裡
                console.log(tempTime)
                for(let i of tempTime){ 
                    unifyTime.push(i)
                }
            }
            console.log(res)
            data_list.push(res["data_list"])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
        
    }
    let index = -1
    let check_data = -1
    let sum = 0
    
    console.log(unifyTime)
    for (let i of data_list){
        for(let j of i){
            let check_flag = 1
            if(check.indexOf(j["dev_id"]) == -1){   //沒有同樣的dev_id
                check.push(j["dev_id"])
                dev_data = []
                new_data[j["dev_id"]] = []
                // console.log(j)
                // console.log("💔💔💔💔",check_flag)
                if(j["count_total"] == "0"){
                    if(mod == "m" || mod == "y" || mod == "w"){
                        for(let i of unifyTime){
                            console.log(i)
                            i["value"] = 0
                        }
                    }
                    // else{
                    //     //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: 0})
                    // }
                }
                else{
                    check_data+=1
                    // console.log(j['data'])
                    dev_data.push(j['data'])
                    // console.log(dev_data)
                    if(mod == "w"){    //週處理
                        for (let k of dev_data){
                            console.log(k)
                            for(let l of k){
                                console.log(l['time'].slice(0,10))
                                index = unifyTime.findIndex(e => e.time == l['time'].slice(0,10))
                                console.log(index)
                                if(index != -1){
                                    week_temp_data.push(l)
                                    console.log(check_flag)
                                    if(check_flag == 7){       //每七天加總一次，以一個星期的第一天的日期為時間標題
                                        console.log(sum)
                                        unifyTime[index-1]["value"] = sum
                                        sum = 0
                                        week_temp_data.length = 0
                                        week_temp_data.push(l)
                                        check_flag = 1
                                    }
                                    sum += (Math.round(Number(l['sum']) * 100) / 100)
                                    
    
                                }else{
                                    console.log(sum)
                                    sum += (Math.round(Number(l['sum']) * 100) / 100)
                                    console.log(sum)
                                    week_temp_data.push(l)
                                    check_flag += 1
                                    //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                                }
                                index = -1
                            }
                            //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                            console.log(sum)
                            sum = 0
                        }

                        sum = 0
                        for(let m of week_temp_data){
                            console.log(unifyTime[unifyTime.length-1])
                            sum += Math.round(Number(m['sum']) * 100) / 100
                            // if(m["time"].slice(0,10) == unifyTime[unifyTime.length-1]["time"]){
                            //     //new_data[j["dev_id"]].pop()
                            // }
                            //new_data[j["dev_id"]].push({time: m["time"].slice(0,10), value: Math.round(Number(m['sum']) * 100) / 100})
                        }

                        unifyTime[unifyTime.length-1]["value"] = sum


                        for(let m of unifyTime){ 
                            // console.log(m)
                            // console.log(j)
                            // console.log(new_data)
                            if(typeof(m["value"]) != "undefined"){
                                m["value"] = Math.round(Number(m["value"]) * 100) / 100
                                console.log(m["value"])
                            } 
                            new_data[j["dev_id"]].push({time: m["time"], value: m["value"]})
                            console.log(new_data)
                        }
                    }
                    else if(mod == "m" || mod == "y"){   //月與年處理
                        for (let k of dev_data){
                            console.log(k)
                            for(let l of k){
                                console.log(l)
                                index = unifyTime.findIndex(e => e.time == l['time'].slice(0,7))
                                console.log(index)
                                if(index != -1){
                                    sum += (Math.round(Number(l['sum']) * 100) / 100)
                                    unifyTime[index]["value"] = sum
                                    console.log(unifyTime[index]["value"])
                                    new_data[j["dev_id"]].push({time: unifyTime[index]['time'].slice(0,10),  value: Math.round(Number(sum) * 100) / 100})
                                    console.log(new_data)
    
                                }else{
                                    console.log(l['time'])
                                    //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                                }
                                index = -1
                                sum = 0
                            }
                            //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                            console.log(sum)
                            console.log(unifyTime)
                            sum = 0
                        }
                    }
                    else{             //日處理
                        for (let k of dev_data){
                            console.log(k)
                            for(let l of k){
                                index = unifyTime.findIndex(e => e.time == l['time'].slice(0,7))
                                console.log(index)
                                if(index != -1){
                                    sum += (Math.round(Number(l['sum']) * 100) / 100)
                                    unifyTime[index]["value"] = sum  
    
                                }else{
                                    new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                                }
                                index = -1
                            }
                            //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                            console.log(sum)
                            console.log(unifyTime)
                            sum = 0
                        }
                    }

                }
                console.log(week_temp_data)
                console.log(unifyTime)
                
            }
            else{  //有同樣的dev_id
                dev_data = []  
                console.log(j['data'])
                if(j['data'].length == 0){
                    // index = unifyTime.findIndex(e =>  e.time == l['time'].slice(0,7))
                    // if(index != -1){
                    //     unifyTime[index]["value"] = 0
                    // }
                    // index = -1
                    continue
                }
                else{
                    check_data+=1
                    dev_data.push(j['data'])
                    console.log(dev_data)
                    console.log(unifyTime)
                    console.log(new_data)
                    for (let k of dev_data){
                        console.log(k)
                        for(let l of k){
                            console.log("💔💔💔💔",l)
                            console.log(l['time'].slice(0,7))
                            index = unifyTime.findIndex(e =>  e.time == l['time'].slice(0,7))
                            if(index != -1){
                                sum += (Math.round(Number(l['sum']) * 100) / 100)
                                console.log(sum)
                                unifyTime[index]["value"] = sum

                            }
                            index = -1
                        }
                        console.log(sum)
                        sum = 0
                        console.log(unifyTime)
                    }

                    console.log(unifyTime)
                    if(mod == "m" || mod == "y"){
                        new_data[j["dev_id"]].push({time: unifyTime[unifyTime.length-1]["time"], value: Math.round(Number( unifyTime[unifyTime.length-1]["value"]) * 100) / 100})
                    }
                    else{
                        for(let m of unifyTime){ 
                            console.log(new_data)
                            new_data[j["dev_id"]].push({time: m["time"], value: Math.round(Number(m["value"]) * 100) / 100})
                        }     
                    }
                }
            }
            
        }
    }
    
    console.log(unifyTime)
    if(check_data == -1){  //無資料
        vm.$notify({
            type: 'info',
            title:'',
            message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
        })
    }
    else{      //若至少有一值則顯示其他空月
        if(mod == "m" || mod == "y"){
            for(let device of Object.keys(new_data)){
                for(let m of unifyTime){
                    let id = new_data[device].findIndex(e => e.time == m["time"])
                    if(id == -1){
                        new_data[device].push({time: m["time"], value: undefined})
                    }
                }
                new_data[device] = new_data[device].sort(function (a, b){
                    return a.time > b.time ? 1 : -1;
                });
            }
        }
    }
    console.log(new_data)
    r = JSON.parse(JSON.stringify(new_data))
    r = checkName(r)     //檢查有無對應的名稱
    return { status: status, data : r}
}


//進行開始與結束時間範圍內的日期處理
function dateProcess(starttime, endtime , mod){
    console.log(starttime)
    console.log(endtime)
    let date_result = []
    if(mod == "y" || mod == "m"){       //若為月、年統計，將區間內的日期以月為單位整理出來(yyyy-mm)
        let start_y = Number(starttime.slice(0,4))
        let start_m = Number(starttime.slice(5,7))
        let end_y = Number(endtime.slice(0,4))
        let end_m = Number(endtime.slice(5,7))
        console.log((endtime.slice(5,7)))
        let interval = 0

        if(end_y == start_y){
            interval = end_m - start_m + 1
        }
        else{
            interval = (end_m + (end_y - start_y) * 12) - start_m + 1
        }
        console.log(interval)
        if(interval == 1){
            date_result.push({time: start_y + "-" + addz(start_m)})
        }
        else{
            for(let i = 0; i<interval; i++){
                date_result.push({time: start_y + "-" + addz(start_m)})
                if(start_m == 12){
                    start_m = 1
                    start_y += 1
                }
                else{
                    start_m++
                }
            }
        }
    }
    if(mod == "w"){       //若為週統計，將區間內的日期以週為循環整理出來(yyyy-mm-dd)
        let now_date = new Date()
        let today = now_date.getFullYear() + "-" + addz((now_date.getMonth()+1)) + "-" + addz(now_date.getDate())
        let start_date = starttime.slice(0,10)
        let end_date = endtime.slice(0,10)
        let temp_date = ""
        const weekDayMilliSeconds  = 7*1000*60*60*24;

        if(new Date(end_date) > new Date(today) == true){
            end_date = today
        }
        console.log(start_date)
        console.log(end_date)

        let stMs = new Date(start_date).getTime()
        let edMs = new Date(end_date).getTime()
        console.log(stMs,edMs)

        for (stMs; stMs <= edMs; stMs += weekDayMilliSeconds){
            temp_date = new Date(stMs).getFullYear() + "-" + addz((new Date(stMs).getMonth()+1)) + "-" + addz(new Date(stMs).getDate())
            date_result.push({time: temp_date})
        }

    }
    
    console.log(date_result)
    return date_result

    
}

//進行開始與結束時間範圍內的日期處理，可整理以年為單位
function dateProcess_v2(starttime, endtime , mod){
    console.log(starttime)
    console.log(endtime)
    let date_result = []
    if(mod == "m"){
        let start_y = Number(starttime.slice(0,4))
        let start_m = Number(starttime.slice(5,7))
        let end_y = Number(endtime.slice(0,4))
        let end_m = Number(endtime.slice(5,7))
        console.log((endtime.slice(5,7)))
        let interval = 0

        if(end_y == start_y){
            interval = end_m - start_m + 1
        }
        else{
            interval = (end_m + (end_y - start_y) * 12) - start_m + 1
        }
        console.log(interval)
        if(interval == 1){
            date_result.push({time: start_y + "-" + addz(start_m)})
        }
        else{
            for(let i = 0; i<interval; i++){
                date_result.push({time: start_y + "-" + addz(start_m)})
                if(start_m == 12){
                    start_m = 1
                    start_y += 1
                }
                else{
                    start_m++
                }
            }
        }
    }
    if(mod == "y"){                 //若為年統計，將區間內的日期以年為單位整理出來(yyyy)
        let start_y = Number(starttime.slice(0,4))
        let end_y = Number(endtime.slice(0,4))

        let interval = 0

        if(end_y == start_y){
            date_result.push({time: String(start_y)})
        }
        else{
            interval = end_y - start_y
        }

        if(interval != 0){
            for(let i = 0; i<=interval; i++){
                date_result.push({time: String(start_y)})
                start_y+=1
                
            }
        }
    }
    if(mod == "w"){
        let now_date = new Date()
        let today = now_date.getFullYear() + "-" + addz((now_date.getMonth()+1)) + "-" + addz(now_date.getDate())
        let start_date = starttime.slice(0,10)
        let end_date = endtime.slice(0,10)
        let temp_date = ""
        const weekDayMilliSeconds  = 7*1000*60*60*24;

        if(new Date(end_date) > new Date(today) == true){
            end_date = today
        }
        console.log(start_date)
        console.log(end_date)

        let stMs = new Date(start_date).getTime()
        let edMs = new Date(end_date).getTime()
        console.log(stMs,edMs)

        for (stMs; stMs <= edMs; stMs += weekDayMilliSeconds){
            temp_date = new Date(stMs).getFullYear() + "-" + addz((new Date(stMs).getMonth()+1)) + "-" + addz(new Date(stMs).getDate())
            date_result.push({time: temp_date})
        }

    }
    
    console.log(date_result)
    return date_result

    
}

function __setattr__( dist ){
    devattrlast = dist ;
    deviceName = vm.$store.state.deviceName;
    console.log(deviceName)
    console.log(devattrlast)
}

//計費統計報表
async function BillingStatistic(devId_list, starttime, endtime, electricity_price, solution, devattr){
    deviceName = vm.$store.state.deviceName;
    let periodName = {
        offPeakCharge: vm.$t("GENERAL.OFF_PEAK_CHARGE"),
        offPeakUsage: vm.$t("GENERAL.OFF_PEAK_CHARGE"),
        peakCharge: vm.$t("GENERAL.PEAK_CHARGE"),
        peakUsage: vm.$t("GENERAL.PEAK_CHARGE"),
        partialPeakCharge: vm.$t("GENERAL.PARTIAL_PEAK_CHARGE"),
        partialPeakUsage: vm.$t("GENERAL.PARTIAL_PEAK_CHARGE"),
        totalCharge: vm.$t("GENERAL.NOT_IN_TIME"),
        totalUsage: vm.$t("GENERAL.NOT_IN_TIME"), 
    }
    let time = convertTime(starttime, endtime)
    let attrList = []
    for (let i of devId_list){ attrList.push(devattr[i]) }
    let data_list = []
    let new_data = []
    let index = -1
    let devidIndex = -1
    let periodIndex = -1
    let flag = 0
    let check = []

    index = vm.$store.state.overview.button[solution]["features"].findIndex(e => e.type == "report")
    // console.log(solution)
    // console.log(electricity_price)
    // console.log(attrList)
    if(index != -1){ 
        let res = await vm.$store.state.overview.button[solution]["features"][index]["func"](devId_list.join(","), attrList.join(","), time["st"], time["et"], electricity_price)
        console.log(res)
        if(res["status"] == "ok"){
            if(res["data_list"].length == 0){
                vm.$notify({
                    type: 'info',
                    title:'無統計資料',
                    message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     
                })
                return
            }
            for(let i of res["data_list"]){
                data_list.push(i)
            }
            
        }else{
            console.log("有問題")
            return
        }
        
        console.log(data_list)
        
    }
    index = -1
    let order = 0
    let null_flag = 0
    console.log(deviceName)
    for (let i of data_list){
        //電費計算
        if(solution == "energy"){
            check.push(i["devid"])
            //低壓-電力用戶非時間電價沒有尖峰、離尖峰數據，以flag作為其判斷
            if(Object.keys(i["energyCharge"]).includes("peakCharge")==true){
                flag = 1
            }
            new_data.push({name: i["devid"], datalist: []})
            for(let j of Object.keys(i["energyCharge"])){
                console.log(j)
                console.log(flag)
                if(flag == 1){
                    if(j == "totalCharge"){
                        continue
                    }
                    else{
                        new_data[order]["datalist"].push({period: periodName[j], dosage: i["energyCharge"][j]})
                        /*new_data.push({name: i["devid"], datalist: [
                            {period: periodName[j], dosage: i["energyCharge"][j]},
                        ]})*/
                    }
                }
                if(flag == 0){
                    if(j == "totalCharge"){
                        new_data[order]["datalist"].push({period: periodName[j], dosage: i["energyCharge"][j]})
                    }
                    else{
                        continue
                    }
                }
            }
            
            //處理用量
            console.log(new_data)
            devidIndex = new_data.findIndex(e => e.name == i["devid"])
            console.log(devidIndex)
            for(let j of Object.keys(i["energyUsage"])){
                periodIndex = new_data[devidIndex]["datalist"].findIndex(e => e.period == periodName[j])
                console.log(periodIndex)
                if(periodIndex != -1){
                    if(flag == 1){
                        if(j == "totalUsage"){
                            continue
                        }
                        else{
                            new_data[order]["datalist"][periodIndex]["amount"] = i["energyUsage"][j]

                        }
                    }
    
                    if(flag == 0){
                        if(j == "totalUsage"){
                            periodIndex = new_data[devidIndex]["datalist"].findIndex(e => e.period == periodName[j])
                            if(periodIndex != -1){
                                new_data[devidIndex]["datalist"][periodIndex]["amount"] = i["energyUsage"][j]
                                new_data[devidIndex]["datalist"][periodIndex]["amount"] = Math.round(new_data[devidIndex]["datalist"][periodIndex]["amount"] * 100) / 100
                            }
                        }
                        else{
                            continue
                        }
                    }
                }
                periodIndex = -1
            }
            devidIndex = -1
            flag = 0
            order += 1
        }
        //水費計算
        if(solution == "water"){
            let price_sum = 0
            let total_usage = 0

            if(check.indexOf(i["dev_id"]) == -1){   //沒有同樣的dev_id
                check.push(i["dev_id"])
                
                new_data.push({name: i["dev_id"], datalist: []})
                if(i["price_list"].length != 0){
                    null_flag += 1
                    for(let j of i["price_list"]){
                        for(let k of Object.keys(j)){
                            if(k == "total_usage"){
                                total_usage += j[k]
                            }
                            else{
                                price_sum += j[k]
                            }
                        }
                    }
                    //console.log("total_usage",total_usage,"price_sum",price_sum)
                    //水費計算直接以總量來看
                    new_data[order]["datalist"].push({period: vm.$t("GENERAL.TOTAL_ACCOUNT"), dosage: price_sum, amount: total_usage })
                    order += 1
                    total_usage = 0
                    price_sum = 0
                }
                else{
                    console.log("無資料")
                    continue
                }
                
            }
            else{                      //有同樣的dev_id
                console.log(new_data)
                devidIndex = new_data.findIndex(e => e.name == i["dev_id"])
                if(devidIndex != -1){
                    if(new_data[devidIndex]["datalist"].length != 0){
                        console.log(new_data[devidIndex])
                        if(i["price_list"].length == 0){
                            console.log("第二次後無資料")
                            continue
                        }
                        else{
                            null_flag += 1
                            for(let j of i["price_list"]){
                                for(let k of Object.keys(j)){
                                    if(k == "total_usage"){
                                        total_usage += j[k]
                                    }
                                    else{
                                        price_sum += j[k]
                                    }
                                    
                                }
                            }
                            periodIndex = new_data[devidIndex]["datalist"].findIndex(e => e.period == vm.$t("GENERAL.TOTAL_ACCOUNT"))
                            console.log(periodIndex)
                            if(periodIndex != -1){
                                new_data[devidIndex]["datalist"][periodIndex]["dosage"] += price_sum
                                new_data[devidIndex]["datalist"][periodIndex]["dosage"] = Math.round(new_data[devidIndex]["datalist"][periodIndex]["dosage"] * 100) / 100
        
                                new_data[devidIndex]["datalist"][periodIndex]["amount"] += total_usage
                                new_data[devidIndex]["datalist"][periodIndex]["amount"] = Math.round(new_data[devidIndex]["datalist"][periodIndex]["amount"] * 100) / 100
                            }
                            periodIndex = -1
                        }
                        devidIndex = -1
                        total_usage = 0
                        price_sum = 0
                    }
                    else{
                        if(i["price_list"].length == 0){
                            console.log("第二次後無資料")
                            continue
                        }
                        else{
                            null_flag += 1
                            for(let j of i["price_list"]){
                                for(let k of Object.keys(j)){
                                    if(k == "total_usage"){
                                        total_usage += j[k]
                                    }
                                    else{
                                        price_sum += j[k]
                                    }
                                    
                                }
                            }
                            
                            new_data[0]["datalist"].push({period: vm.$t("GENERAL.TOTAL_ACCOUNT"), dosage: price_sum, amount: total_usage }) 
                        }
                    }
                }
            }
            if(null_flag == 0){
                vm.$notify({
                    type: 'info',
                    title:'無統計資料',
                    message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     
                })
                return
            }
        } 
    }
    console.log(new_data)

    let tmp_now = {
        status: 0,
        data: [
            /*{          //格式範例
                name : "冰機",
                datalist : [
                    {
                        period : "尖峰",
                        dosage : 30,
                        amount : 50,
                    },
                    {
                        period : "半尖峰",
                        amount : 60,
                    },
                    {
                        period : "離峰",
                        dosage : 60,
                    }
                ]
            }, {
                name : "冷氣",
                datalist : [
                    {
                        period : "尖峰",
                        dosage : 1,
                        amount : 2,
                    },
                    {
                        period : "半尖峰",
                        dosage : 3,
                        amount : 4,
                    },
                    {
                        period : "離峰",
                        dosage : 5,
                        amount : 6,
                    }
                ]
            },*/
        ]
    }
    for(let i of new_data){
        if(Object.keys(deviceName).includes(i["name"])){
            i["name"] = deviceName[i["name"]]
        }
    }
    tmp_now["data"] = new_data
    console.log(tmp_now)

    return tmp_now
}

//設備運轉小時報表
async function TimeAccumulation(devid , starttime , timeleng , mod){

    let tmp_now = {
        status: 0,
        data: [       //格式範例
            /*{
                name: "大廳",
                time: [
                    {   date: "12/13",
                        hour: 11,
                        useRate: 10
                    },
                    
                    {   date: "12/15",
                        hour: 12,
                        useRate: 20
                    },
                    {
                        date: "12/17",
                        hour: 13,
                        useRate: 30
                    },
                    {
                        date: "12/19",
                        hour: 13,
                        useRate: 20
                    },
                    {
                        date: "12/21",
                        hour: 13,
                        useRate: 20
                    },
                    {
                        date: "12/23",
                        hour: 15,
                        useRate: 22
                    },
                ],
                totalHourss: "",
                totalRatess: "",
            },   
            {
                name: "警衛室",
                time: [
                    {   date: "12/13",
                        hour: 11,
                        useRate: 10
                    },
                    
                    {   date: "12/15",
                        hour: 12,
                        useRate: 20
                    },
                    {
                        date: "12/17",
                        hour: 13,
                        useRate: 30
                    },
                    {
                        date: "12/19",
                        hour: 13,
                        useRate: 20
                    },
                    {
                        date: "12/20",
                        hour: 13,
                        useRate: 20
                    },
                    {
                        date: "12/23",
                        hour: 15,
                        useRate: 22
                    },
                ],
                totalHourss: "",
                totalRatess: "",
            },*/ 
        ]
    }
    let time = DataCheck(starttime , timeleng , mod)         //取得開始與結束時間
    console.log(time)
    let data_list = []
    let attr = devattrlast[devid]
    console.log(attr)
    let tempTime = []
    let unifyTime = []
    let unifyMonth = []
    let new_data = {}
    let use_hour = 0
    let use_rate = 0
    let repeat = -1

    for (let i in time){
        console.log(time[i])
        let res = await getOptimeData(devid, attr, time[i]["st"], time[i]["et"], time[i]["type"]);
        console.log(res)
        if(res['status'] == 'ok'){
            if(res["data_list"].length == 0){
                vm.$notify({
                    type: 'info',
                    title:'無統計資料',
                    message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     
                })
                return
            }
            if(mod == "m" || mod == "y"){                    
                
                tempTime = dateProcess_v2(time[i]["st"], time[i]["et"], mod)          //回傳開始到結束日期的區間裡(yyyy-mm)或(yyyy)格式的日期並統整進unifyTime裡
                for(let i of tempTime){ 
                    console.log(i["time"])
                    repeat = unifyTime.findIndex(e => e.time == i["time"])
                    console.log(repeat)
                    if(repeat == -1){
                        unifyTime.push(i)
                    }
                }

                repeat = -1
                unifyMonth = dateProcess_v2(time[i]["st"], time[i]["et"], "m")
                console.log(unifyMonth)
            }
            if(mod == "w"){
                tempTime = dateProcess(time[i]["st"], time[i]["et"], mod)          //回傳開始到結束日期的區間裡yyyy-mm-dd格式的日期並統整進unifyTime裡
                console.log(tempTime)
                for(let i of tempTime){ 
                    unifyTime.push(i)
                }
            }
            console.log(res)
            data_list.push(res["data_list"][0])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
        
    }             
    //console.log("test", data_list)
    let index = -1
    let check_data = -1
    let lastDate_index = -1
    let monthData_index = -1
    
    console.log(unifyTime)
    for (let i of data_list){
        let check_flag = 1
        if(check_data == -1){
            console.log("第一次")
            new_data = {name: deviceName[i["dev_id"]], time: []}
        }
        
        
        if(mod == "m"){           //月處理
            for(let k of unifyTime){
                new_data["time"].push({date: k["time"], hour: "-", useRate: "-"})
            }
            for(let j of i["data"]){
                if(i["type"] == "1"){
                    console.log("第二次")
                    console.log(use_hour)
                    use_hour += (Math.round(Number(j['run_time']) / 3600 * 100) / 100)
                }
                else{
                    console.log(j["time"].slice(0,7))
                    use_hour = Number(j["run_time"]) / 3600 
                    let day = new Date(Number(j["time"].slice(0,4)),Number(j["time"].slice(5,7)),0).getDate()
                    use_rate = use_hour / (24 * day)

                    monthData_index = new_data["time"].findIndex(e => e.date == j["time"].slice(0,7))
                    if(monthData_index != -1){
                        new_data["time"][monthData_index]["hour"] = use_hour
                        new_data["time"][monthData_index]["useRate"] = (Math.round(Number(use_rate) * 100) / 100) * 100 + "%"
                    }
                    
                    console.log(new_data)
                }
                monthData_index = -1
                
            }
            if(i["type"] == "1"){
                console.log(use_hour)
                let day = new Date(Number(unifyTime[(unifyTime.length-1)]["time"].slice(0,4)),Number(unifyTime[(unifyTime.length-1)]["time"].slice(5,7)),0).getDate()
                use_rate = use_hour / (24 * day)
                monthData_index = new_data["time"].findIndex(e => e.date == unifyTime[(unifyTime.length-1)]["time"])
                new_data["time"][monthData_index]["hour"] = use_hour
                new_data["time"][monthData_index]["useRate"] = (Math.round(Number(use_rate) * 100) / 100) * 100 + "%"
                //new_data["time"].push({date: unifyTime[(unifyTime.length-1)]["time"], hour: use_hour, useRate: (Math.round(Number(use_rate) * 100) / 100) * 100 + "%"})
            
            }
            else{
                use_hour = 0
            }
            
            check_data += 1
            
        }
        if(mod == "d"){          //日處理
            for(let j of i["data"]){
                use_hour = Number(j["run_time"]) / 3600 
                use_rate = use_hour / 24


                new_data["time"].push({date: j["time"].slice(0,10), hour: use_hour, useRate: (Math.round(Number(use_rate) * 100) / 100) * 100 + "%"})
                console.log(new_data)
            }
        }
        if(mod == "w"){          //週處理
            for(let j of i["data"]){
                console.log(j['time'].slice(0,10))
                index = unifyTime.findIndex(e => e.time == j['time'].slice(0,10))
                console.log(index)
                console.log(check_flag)
                if(index != -1){
                    console.log(check_flag)
                    lastDate_index = index
                    if(check_flag == 7){
                        console.log(use_hour)
                        use_rate = use_hour / 168
                        new_data["time"].push({date: unifyTime[index-1]["time"], hour: use_hour, useRate: (Math.round(Number(use_rate) * 100) / 100) * 100 + "%"})
                        
                        use_hour = 0
                        check_flag = 1
                    }
                    use_hour += (Math.round(Number(j['run_time']) / 3600 * 100) / 100)
                    

                }else{
                    console.log(use_hour)
                    use_hour += (Math.round(Number(j['run_time']) / 3600 * 100) / 100)

                    console.log(use_hour)
                    check_flag += 1

                    console.log(time[(time.length-1)]["et"])
                    /*if(j['time'].slice(0,10) == time[(time.length-1)]["et"].slice(0,10)){
                        use_rate = use_hour / 168
                        new_data["time"].push({date: unifyTime[(unifyTime.length-1)]["time"], hour: use_hour, useRate: use_rate})
                    }*/
                    
                }
                index = -1
            }
            use_rate = use_hour / 168
            new_data["time"].push({date: unifyTime[lastDate_index]["time"], hour: use_hour, useRate: (Math.round(Number(use_rate) * 100) / 100) * 100 + "%"})
            
            for(let i = (lastDate_index+1); i<unifyTime.length; i++){
                new_data["time"].push({date: unifyTime[i]["time"], hour: "-", useRate: "-"})
            }
        }
        if(mod == "y"){           //年處理
            for(let j of i["data"]){
                if(i["type"] == "1"){
                    console.log("第二次")
                    console.log(use_hour)
                    use_hour += (Math.round(Number(j['run_time']) / 3600 * 100) / 100)
                }
                else{
                    use_hour = Number(j["run_time"]) / 3600 
                    let day = new Date(Number(j["time"].slice(0,4)),Number(j["time"].slice(5,7)),0).getDate()
                    use_rate = use_hour / (24 * day)


                    new_data["time"].push({date: j["time"].slice(0,7), hour: use_hour, useRate: Math.round(Number(use_rate) * 100) / 100})
                    console.log(new_data)
                }
                
            }
            if(i["type"] == "1"){
                console.log(use_hour)
                let day = new Date(Number(unifyTime[(unifyTime.length-1)]["time"].slice(0,4)),Number(unifyTime[(unifyTime.length-1)]["time"].slice(5,7)),0).getDate()
                use_rate = use_hour / (24 * day)
                new_data["time"].push({date: unifyMonth[(unifyMonth.length-1)]["time"], hour: use_hour, useRate: Math.round(Number(use_rate) * 100) / 100})
            
            }
            else{
                use_hour = 0
            }
            
            check_data += 1
            
        }

        console.log(new_data)
        new_data["totalHourss"] = ""
        new_data["totalRatess"] = ""
        
    }
    let year_data = {name: new_data["name"], time: []}
    if(mod == "y"){    //統整年統計的資料
        let y_index = -1
        let check_flag = 0
        use_hour = 0
        use_rate = 0
        console.log(new_data)
        for(let i of new_data["time"]){
            use_hour += (Math.round(Number(i['hour']) * 100) / 100)
            use_rate += (Math.round(Number(i['useRate']) * 100) / 100)
            check_flag += 1
            console.log(check_flag)
            if(check_flag == 12){
                y_index = unifyTime.findIndex(e => e.time == i["date"].slice(0,4))
                console.log(use_hour)
                year_data["time"].push({date: unifyTime[y_index]["time"], hour: use_hour, useRate: (Math.round((Number(use_rate) * 100) * 100) / 100) + "%"})
                use_hour = 0
                use_rate = 0
                check_flag = 0
            } 
        }
        year_data["time"].push({date: unifyTime[(unifyTime.length-1)]["time"], hour: use_hour, useRate: (Math.round((Number(use_rate) * 100) * 100) / 100) + "%"})
        console.log(year_data)
        tmp_now["data"].push(year_data)
        year_data["totalHourss"] = ""
        year_data["totalRatess"] = ""
    }
    else{
        tmp_now["data"].push(new_data)
    }
    
    console.log(tmp_now)
    return tmp_now
}

//異常報表
async function Unusual(devidList , starttime , endtime , startHour, endHour, status_type){

    let tmp_now = {
        status: 0,
        data: [
            /*{       //格式範例
                eventID: "IN001",
                status: "未讀",
                eventName: "電壓過低",
                deviceName: "空調電錶",
                lockDeviceName: "D11(電壓過低)",
                eventDate: "2021/12/17 8:20",
                handleDate: "2021/12/18 8:21",
                buttonitem: "show",
            },
            {
                eventID: "IN002",
                status: "已排除",
                eventName: "電壓過高",
                deviceName: "空調電錶",
                lockDeviceName: "D12(電壓過高)",
                eventDate: "2021/12/16 8:20",
                handleDate: "2021/12/19 8:21",
                buttonitem: "dontshow",
            },*/
            
        ]
    }
    console.log(deviceName)
    let type = []
    let statusClass = {
        0: vm.$t("GENERAL.UNREAD"),
        1: vm.$t("GENERAL.PROCESSING"),
        2: vm.$t("GENERAL.EXCLUDED"),
    }

    if(status_type == 3){
        type.push(0,1,2)
        console.log(type)
    }
    else{
        type.push(status_type)
    }
    //console.log(type.join(","))
    let time = convertTime(starttime, endtime)
    //console.log((time["st"].slice(0,11)+startHour+":00"), (time["et"].slice(0,11)+endHour+":00"))
    let now_res = await getAbnormaleventData(devidList.join(","), "rule", type.join(","), (time["st"].slice(0,11)+startHour+":00"), (time["et"].slice(0,11)+endHour+":00"));  //取得資料
    console.log(now_res)
    if(now_res['status'] == 'ok'){
        if(now_res["data_list"].length != 0){ 
            //check_data++
        }
        else{
            vm.$notify({
                type: 'info',
                title: vm.$t("GENERAL.NOTICE"),
                message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")
            });
            return
        }
        
    }
    else{
        vm.$notify({
            type: 'error',
            title:'',
            message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
        })
    }
    console.log(now_res["data_list"])
    
    let order = 0
    for (let i of now_res["data_list"]){        //整理從API取得的資料
        for(let j of i["data"]){
            tmp_now["data"][order] = {}
            tmp_now["data"][order]["deviceName"] = deviceName[i["dev_id"]]
            tmp_now["data"][order]["eventID"] = j["event_id"]
            tmp_now["data"][order]["status"] = j["state"]
            tmp_now["data"][order]["statusName"] = statusClass[j["state"]]
            if(j["name"].length == 0){
                tmp_now["data"][order]["eventName"] = "-"
            }
            else{
                tmp_now["data"][order]["eventName"] = j["name"]
            }
            tmp_now["data"][order]["lockDeviceName"] = j["control_target"]
            tmp_now["data"][order]["eventDate"] = j["ct"]
            tmp_now["data"][order]["handleDate"] = j["ut"]
            if(j["state"] == 2){
                tmp_now["data"][order]["buttonitem"] = "dontshow"
            }
            else{
                tmp_now["data"][order]["buttonitem"] = "show"
            }

            console.log(tmp_now["data"][order])
            order += 1
        }
        
    }
    console.log(tmp_now)
    return tmp_now
}

async function Consumption(devidList, starttime , mod){
    let timeleng;
    switch(mod){
        case'd':
            timeleng = 24
            mod = 'h'
            break;
        case'm':
            //獲取指定月份天數
            timeleng = new Date(starttime.year, starttime.month, 0).getDate()
            starttime.day = timeleng //設爲最後一天來獲取整個月的資料
            mod = 'd'
            break;
        case'y':
            starttime.month = 12 //設爲最後一月來獲取整年的資料
            timeleng = 12
            mod = 'm'
            break;
        default:
            break;
    }
    // console.log("💔💔💔💔")
    // console.log(devidList)
    // console.log(starttime)
    // console.log(timeleng)
    // console.log(mod)
    // console.log("💔💔💔💔")
    
    let r = {         //格式範例
        /*'插座' : [
            {time : '2021-11-01', value :520  },
            {time : '2021-11-02', value :123  },
            {time : '2021-11-03', value :535  },
            {time : '2021-11-04', value :785  },
        ], */  
    }
    let status = 0
    if(devidList.length == 0){ 
        status = 12
        return { status: status, data : r}
    }

    let time = DataCheck(starttime , timeleng , mod)
    let data_list = []
    let attrList = []
    let dev_data = []
    let check = []
    let tempTime = []
    let unifyTime = []
    let new_data = {}
    let week_temp_data = []
    let repeat = -1
    for (let i of devidList){ attrList.push(devattrlast[i]) }
    unifyTime = []
    for (let i in time){
        console.log("🍳",time[i])
        let res = await getAnalyticInfo(devidList.join(","), attrList.join(","), time[i]["st"], time[i]["et"], time[i]["type"]);
        if(res['status'] == 'ok'){
            if(res["data_list"].length == 0){
                vm.$notify({
                    type: 'info',
                    title:vm.$t("GENERAL.NOTICE"),
                    message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
                })
                return
            }
            if(mod == "m"){// || mod == "y"){
                tempTime = dateProcess(time[i]["st"], time[i]["et"], mod)     //回傳開始到結束日期的區間裡yyyy-mm格式的日期並統整進unifyTime裡
                console.log(tempTime)
                for(let i of tempTime){ 
                    repeat = unifyTime.findIndex(e => e.time == i["time"])
                    console.log(repeat)
                    if(repeat == -1){
                        unifyTime.push(i)
                    }
                }
            }
            // if(mod == "w"){
            //     tempTime = dateProcess(time[i]["st"], time[i]["et"], mod)     //回傳開始到結束日期的區間裡yyyy-mm--dd格式的日期並統整進unifyTime裡
            //     console.log(tempTime)
            //     for(let i of tempTime){ 
            //         unifyTime.push(i)
            //     }
            // }
            console.log(res)
            data_list.push(res["data_list"])
        }
        else{
            vm.$notify({
                type: 'error',
                title:'',
                message: vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
        
    }
    let index = -1
    let check_data = -1
    let sum = 0
    
    console.log(unifyTime)
    for (let i of data_list){
        for(let j of i){
            if(check.indexOf(j["dev_id"]) == -1){   //沒有同樣的dev_id
                check.push(j["dev_id"])
                dev_data = []
                new_data[j["dev_id"]] = []
                
                if(j["count_total"] == "0"){
                    if(mod == "m"){// || mod == "y" || mod == "w"){
                        for(let i of unifyTime){
                            console.log(i)
                            i["value"] = 0
                        }
                    }
                }
                else{
                    check_data+=1
                    dev_data.push(j['data'])
                    
                    if(mod == "m"){// || mod == "y"){   //月與年處理
                        for (let k of dev_data){
                            console.log(k)
                            for(let l of k){
                                console.log(l)
                                index = unifyTime.findIndex(e => e.time == l['time'].slice(0,7))
                                console.log(index)
                                if(index != -1){
                                    sum += (Math.round(Number(l['sum']) * 100) / 100)
                                    unifyTime[index]["value"] = sum
                                    console.log(unifyTime[index]["value"])
                                    new_data[j["dev_id"]].push({time: unifyTime[index]['time'].slice(0,10),  value: Math.round(Number(sum) * 100) / 100})
                                    console.log(new_data)
    
                                }else{
                                    console.log(l['time'])
                                    //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                                }
                                index = -1
                                sum = 0
                            }
                            //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                            console.log(sum)
                            console.log(unifyTime)
                            sum = 0
                        }
                    }
                    else if(mod == 'd'){             //日處理
                        for (let k of dev_data){
                            console.log(k)
                            for(let l of k){
                                index = unifyTime.findIndex(e => e.time == l['time'].slice(0,7))
                                console.log(index)
                                if(index != -1){
                                    sum += (Math.round(Number(l['sum']) * 100) / 100)
                                    unifyTime[index]["value"] = sum  
    
                                }else{
                                    new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                                }
                                index = -1
                            }
                            //new_data[j["dev_id"]].push({time: l['time'].slice(0,10),  value: Math.round(Number(l['sum']) * 100) / 100})
                            console.log(sum)
                            console.log(unifyTime)
                            sum = 0
                        }
                    }
                    else{ //hours
                        for (let k of dev_data){
                            console.log(k)
                            for(let l of k){
                                new_data[j["dev_id"]].push({time: l['time'].slice(11,16),  value: Math.round(Number(l['sum']) * 100) / 100})
                            }
                        }
                        if(new_data[j["dev_id"]].length==24){
                            new_data[j["dev_id"]][new_data[j["dev_id"]].length-1].time = "24:00"
                        }
                    }
                }
                // console.log(week_temp_data)
                // console.log(unifyTime)
            }
            else{  //有同樣的dev_id
                dev_data = []  
                console.log(j['data'])
                if(j['data'].length == 0){
                    // index = unifyTime.findIndex(e =>  e.time == l['time'].slice(0,7))
                    // if(index != -1){
                    //     unifyTime[index]["value"] = 0
                    // }
                    // index = -1
                    continue
                }
                else{
                    check_data+=1
                    dev_data.push(j['data'])
                    console.log(dev_data)
                    console.log(unifyTime)
                    console.log(new_data)
                    for (let k of dev_data){
                        console.log(k)
                        for(let l of k){
                            console.log("💔💔💔💔",l)
                            console.log(l['time'].slice(0,7))
                            index = unifyTime.findIndex(e =>  e.time == l['time'].slice(0,7))
                            if(index != -1){
                                sum += (Math.round(Number(l['sum']) * 100) / 100)
                                console.log(sum)
                                unifyTime[index]["value"] = sum

                            }
                            index = -1
                        }
                        console.log(sum)
                        sum = 0
                        console.log(unifyTime)
                    }

                    console.log(unifyTime)
                    if(mod == "m" || mod == "y"){
                        new_data[j["dev_id"]].push({time: unifyTime[unifyTime.length-1]["time"], value: Math.round(Number( unifyTime[unifyTime.length-1]["value"]) * 100) / 100})
                    }
                    else{
                        for(let m of unifyTime){ 
                            console.log(new_data)
                            new_data[j["dev_id"]].push({time: m["time"], value: Math.round(Number(m["value"]) * 100) / 100})
                        }     
                    }
                }
            }
            
        }
    }
    
    //console.log(unifyTime)
    if(check_data == -1){  //無資料
        vm.$notify({
            type: 'info',
            title:'',
            message: vm.$t("GENERAL.DATA_MISSING_STATISTICS")     //無統計資料
        })
    }
    else{      //若至少有一值則顯示其他空月
        if(mod == "m" || mod == "y"){
            for(let device of Object.keys(new_data)){
                for(let m of unifyTime){
                    let id = new_data[device].findIndex(e => e.time == m["time"])
                    if(id == -1){
                        new_data[device].push({time: m["time"], value: undefined})
                    }
                }
                new_data[device] = new_data[device].sort(function (a, b){
                    return a.time > b.time ? 1 : -1;
                });
            }
        }
    }
    //console.log(new_data)
    r = JSON.parse(JSON.stringify(new_data))
    r = checkName(r)     //檢查有無對應的名稱
    return { status: status, data : r}
}

async function HistoryReport(devidList , startTime , endTime){
    console.log(deviceName)
    console.log(startTime, endTime)

    let resultObj = {};
    let devAttrList = vm.$store.state.deviceCommand.deviceAttrList;
    for(let devid of devidList) {
        let index = devAttrList[devid].findIndex( attr_info => {return attr_info.attr === "501200"})
        let now_res = await getOldData(devid, devAttrList[devid][index].value, startTime, endTime);  //取得資料
        console.log(now_res)

        let dev_name = vm.$store.state.deviceName[devid] || devid;
        if(now_res['status'] == 'ok'){
            if(now_res["data"].length == 0){ 
                vm.$notify({
                    type: 'info',
                    title: vm.$t("GENERAL.NOTICE"),
                    message: dev_name + ' : ' + vm.$t("GENERAL.DATA_MISSING_STATISTICS")
                });
                resultObj[devid] = [];
            }else{
                resultObj[devid] = now_res.data;
            }
        }
        else{
            vm.$notify({
                type: 'error',
                title: vm.$t("GENERAL.NOTICE"),
                message: dev_name + ' : ' + vm.$t("GENERAL.ERROR_MSG_016")     //資料傳送失敗
            })
        }
    }
    console.log(resultObj)
    return resultObj;
}

export function __init__(){
    vm.$store.advanced = {}
    vm.$store.advanced.BestContract                 = BestContract              ;
    vm.$store.advanced.ElectricityPriceStructure    = ElectricityPriceStructure ;
    vm.$store.advanced.EnergySavingPerformance      = EnergySavingPerformance   ;
    vm.$store.advanced.Proportion                   = Proportion                ;
    vm.$store.advanced.Ratio                        = Ratio                     ;
    vm.$store.advanced.Trend                        = Trend                     ;
    vm.$store.advanced.setattr                      = __setattr__               ;
    vm.$store.report = {}
    vm.$store.report.BillingStatistic               = BillingStatistic          ;
    vm.$store.report.TimeAccumulation               = TimeAccumulation          ;
    vm.$store.report.Unusual                        = Unusual                   ;
    vm.$store.report.Consumption                    = Consumption               ;
    vm.$store.report.HistoryReport                  = HistoryReport              ;
}