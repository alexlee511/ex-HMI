<template>
    <div class="main back" :Style='stylerSize()' @click='flag=false'>
        <div    class="slaveC _24 text_item"   :Style='stylerSize(8,6,1  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveC _24 text_item"   :Style='stylerSize(8,6,31 ,3)'>{{$t("GENERAL.ANALYZE_END_TIME")}}</div>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,85,3)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>
        
        <div class='slaveC tmp' :Style='stylerSize(96,84,2,12)'>
            <datatable class='slaveM' :Style='stylerSize()'
                :table='table'
                :titel='titel'
                :lenY='5'
                :size="24"
                :autosize="autosize"
            />
        </div>
        
        <selectmultiple class="slaveL _24 buttonMain" 
            :item="info_item"
            :show_item="item_name"
            :select_item="devid"
            
            :Style='stylerSize(20,6,60 ,3)'/>
        <dateselect class="slaveL _24 selectMain" :sid='"1"' :select_date='stdataitem' :Style='stylerSize(19,6,9 ,3)'/>
        <dateselect class="slaveL _24 selectMain" :sid='"2"' :select_date='etdataitem' :Style='stylerSize(19,6,40 ,3)'/>
    </div>
</template>

<script>
//圖表
import DataChart from '@/components/common/dataChart/DataChart.vue';
//自定義選擇器
import selectmultiple from "components/common/selectmultiple/selectmultiple";
//日期選擇器
import dateselect from "components/common/dateselect/dateselect";
//表格
import datatable from "components/common/datatable/datatable";
import {getChargingPileTradeList} from "@/solution/charging/data/data/data";
//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
		DataChart,
		selectmultiple,
        dateselect,
        datatable,
	},
    computed:{

    },
	mixins: [],
	data() {
		return {
            solution: this.$route.query.solution,
            //可選擇的物件
            
            info_item : [],
            info_devid : [],
            //顯示的名稱
            item_name : [],
            //選擇的devid
            devid : [],
            stdataitem : {},
            etdataitem : {},
            time: {},
            daysel : 1,
            max_day : {
                'd':14,
                'w':12,
                'm':12,
                'y':3,
            },
            //讀取畫面flag
            table : [] ,
            autosize : [ 10 , 20 , 20 , 5 , 5 , 5 , 5 , 10 , 10 , 5                                         ],
            titel    : ["日期" , "裝置ID" ,"裝置名稱" ,"充電卡號" ,"累積時間" ,"充電電量(KWH)" , "服務費" ,"開始時間" ,"結束時間"  ,"停止原因"] ,
		};
	},
	created(){
        this.$store.state.solutionData
        console.log(this.info_item)
        console.log(this.$store.state)
        console.log("------------------")
        console.log(this.$store.state.solutionData.charging.card[0].device)
        for(let i of this.$store.state.solutionData.charging.card[0].device){
            for(let j in i.cntIdList){
                console.log(i.cntIdList[j])
                console.log(i.pileNameList[j])
                console.log(j)
                this.info_item.push(i.cpId + "|" + parseInt( i.cntIdList[j]).toZS(2))
                this.info_devid.push(i.deviceId + "|" + parseInt( i.cntIdList[j]).toZS(2))
                this.item_name.push(i.pileNameList[j])
                
            }
        }
	},
    methods: {
        //塞表格
        async queryExcel(data){
            this.table = []
            for(let i of data){
                i.transaction_record
                for(let j of i.transaction_record){
                    let stt = j.start_trading_time.replace('.000Z' , '')
                    let ett = j.end_trading_time.replace('.000Z' , '')
                    let sth = stt.split('T')
                    let eth = ett.split('T')
                    let std = sth[0].split('-').concat(sth[1].split(':'))
                    let etd = eth[0].split('-').concat(eth[1].split(':'))
                    console.log(std , etd)
                    let st = new Date(parseInt(std[0]), parseInt(std[1]), parseInt(std[2]), parseInt(std[3]), parseInt(std[4]), parseInt(std[5]));
                    let et = new Date(parseInt(etd[0]), parseInt(etd[1]), parseInt(etd[2]), parseInt(etd[3]), parseInt(etd[4]), parseInt(etd[5]));
                    let totle =  (et - st) / 1000
                    console.log(totle)
                    let totletime = parseInt(totle / (60*60)).toZS(2)
                    totle %= 60*60
                    totletime    += ":" + parseInt(totle / 60).toZS(2)
                    totle %= 60
                    totletime    += ":" + totle.toZS(2)
                    let kwh = j.end_trading_value - j.start_trading_value
                    let rea = j.reason
                    let tag = j.tag_id
                    let fee = j.fee
                    let cntID = j.cp_id + "|" + parseInt( j.cnt_id).toZS(2)
                    let name  = ""
                    let devid  = ""
                    for(let k = 0 ; k < this.info_item.length ; k ++){
                        console.log(this.info_item[k]  , cntID )
                        console.log(this.info_item[k] ==cntID )
                        if(this.info_item[k] ==cntID ){
                            name = this.item_name[k]
                            devid = this.info_devid[k]
                            break
                        }
                    }
                    console.log(sth[0] , devid , name , tag  , stt , ett , totletime ,  kwh , fee , rea , cntID)
                    if(name == "")continue
                    console.log(sth[0] , devid , name , tag  , stt , ett , totletime ,  kwh , fee , rea)
                    this.table.push([sth[0] , devid , name , tag , totletime ,  kwh , fee  , stt.replace('T' , ' ') , ett.replace('T' , ' ') , rea])
                    
                }
            }
            this.table.sort((a,b)=> Date.parse(b[7]) - Date.parse(a[7]))
            console.log(this.table)
            console.log(data)

            
        },
        gettime(ob){
            console.log(ob)
            console.log(ob.year)
            return ob.year.toZS(4) + '-' + ob.month.toZS(2) + '-' + ob.day.toZS(2)
        },
        async getdata(){
            if(this.devid.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_023")
				});
                return
            }
            console.log(this.gettime(this.stdataitem))
            console.log(this.gettime(this.etdataitem))
            let st =this.gettime(this.stdataitem) + "T00:00:00"
            let et =this.gettime(this.etdataitem) + "T23:59:59"
            
            console.log(st + "," + et)
            console.log(this.devid.join(','))
            let req = await getChargingPileTradeList(this.devid.join(',') , (st + "," + et))
            if(req.status == 'ok'){
                console.log(req.data)
                req.data.reverse()
                console.log(req.data)
                await this.queryExcel(req.data)
            }else{
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: "網路異常"
				});
                return
            }
            //await this.queryExcel()
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            console.log("🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍")
            console.log(this.devid)
            console.log(this.dataitem)
            console.log(this.stdataitem)
            console.log(this.etdataitem)
            await this.getdata()
            
            this.loading = false;
            
        }
    }

};
</script>
