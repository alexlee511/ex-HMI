<template>
    <div class="main back" :Style='stylerSize()' @click='flag=false'>
        <!--Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div    class="slaveL _24 text_item"   :Style='stylerSize(10   ,6,51+0  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveL _24 text_item"   :Style='stylerSize(10.75,6,51+30 ,3)'>{{$t("GENERAL.ANALYZE_TIME_LEN")}}</div>
        <select class="slaveL _24 selectMain" :Style='stylerSize(7    ,6,51+40 ,3)' v-model="daysel">
            <option class="selectItem" v-for="(index , it) in max_day[need_xyz]" :value="index"  :key="index">
				{{ index }}
			</option>
        </select-->
        <div class="slaveL _24 text_item"  :Style='stylerSize(10 ,6,2 ,4)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <date-pick class="slaveL _24" :Style='stylerSize(20,10,10,-41)' ref="firstDate" @pickDate="pickFirstDate"></date-pick>
        
        <!--div class="slaveL _24 text_item text_center"  :Style='stylerSize(9,10,17,1.5)'>~</div-->
        <div class="slaveL _24 text_item"  :Style='stylerSize(10 ,6,30.5 ,4)'>{{$t("GENERAL.ANALYZE_END_TIME")}}</div>
        <date-pick class="slaveL _24"  :Style='stylerSize(20,10,18.5,-41)' ref="lastDate" @pickDate="pickLastDate"></date-pick>
        
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,39.25,12)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>
        
        <div class='slaveC tmp' :Style='stylerSize(47,74,2,22)'>
            <datatable class='slaveM' :Style='stylerSize(100,45,0,0)'
                :table='table'
                :titel='titel'
                :lenX ='lenX'
            />
            <div class='slaveM tmp'  :Style='stylerSize(100,45,0,48)'>
                <div class='slaveM chartView'  :Style='stylerSize(30,96,2,2)'>
                    <div class='slaveC titeltext _48'  :Style='stylerSize(100,50,0,0)'> {{$t("GENERAL.BAST_CONTRACT_T9")}}</div>
                    <div class='slaveC text_item  _40'  :Style='stylerSize(100,50,0,50)'> {{bast_tmp[0]}}</div>
                </div>
                <div class='slaveM chartView'  :Style='stylerSize(30,96,35,2)'>
                    <div class='slaveC titeltext _48'  :Style='stylerSize(100,50,0,0)'> {{$t("GENERAL.BAST_CONTRACT_T10")}}</div>
                    <div class='slaveC text_item  _40'  :Style='stylerSize(100,50,0,50)'> {{bast_tmp[1]}}</div>
                </div>
                <div class='slaveM chartView'  :Style='stylerSize(30,96,68,2)'>
                    <div class='slaveC titeltext _48'  :Style='stylerSize(100,50,0,0)'> {{$t("GENERAL.BAST_CONTRACT_T11")}}</div>
                    <div class='slaveC text_item  _40'  :Style='stylerSize(100,50,0,50)'> {{bast_tmp[2]}}</div>
                </div>
            </div>
            <div class='slaveC'  :Style='stylerSize(100,7,0,93)+"color:#908b8b"'>{{$t("GENERAL.BAST_CONTRACT_TI")}}</div>
        </div>
		<div class='slaveL tmp' :Style='stylerSize(47,86,51,10)'>
            <div class='slaveL chartView' v-loading="loading" 
                :Style='stylerSize()'
                element-loading-lock="true"
                element-loading-background="transparent"
                element-loading-text="Loading"
                element-loading-spinner="el-icon-loading"
                element-loading-custom-class="create-isLoading"
                >
                <data-chart ref="dataChart"/>
            </div>
        </div>
        
        <select class="slaveL _24 selectMain " 
            v-model="devid"
            :Style='stylerSize(15.925,6,2 ,13)'>
            <option class="selectItem" v-for="(item , index) in info_item" :value="item.devid" >
				{{ item.name }}
			</option>
        </select>
        <select class="slaveL _24 selectMain" 
            v-model="electricity"
            :Style='stylerSize(15.925,6,20.525 ,13)'>
            <option class="selectItem" v-for="(item , index) in electricity_list" :value="item.type" >
				{{ item.name }}
			</option>
        </select>

    </div>
</template>

<script>
//圖表
import DataChart from '@/components/common/dataChart/DataChart.vue';
//日期選擇器
import dateselect from "components/common/dateselect/dateselect";
import DatePick from "components/common/datePick/DatePick";
import analyzeDateMixin from "common/mixin/analyzeDateMixin";
//表格
import datatable from "components/common/datatable/datatable";
//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
		DataChart,
        DatePick,
        dateselect,
        datatable,
	},
    computed:{
        
    },
	mixins: [analyzeDateMixin],
	data() {
		return {
            solution: this.$route.query.solution,
            //該卡片的資訊
            info_item : [] ,
            //選擇的devid
            devid : '',
            //該電價的資訊
            electricity_list : [],
            //選擇的電價
            electricity : '',
            daysel : 1,
            dataitem : {},
            //方案的名稱
            devName : null,
            //讀取畫面flag
            loading: false,
            //三個xyz的按鈕顏色
            lock : {'d' : 'color: #FFFF33;' ,
                    'w' : 'color: #ffffff;' , 
                    'm' : 'color: #ffffff;' , 
                    'y' : 'color: #ffffff;'  },
            //選中的按鈕
            need_xyz : 'd',
            max_day : {
                'd':14,
                'w':12,
                'm':12,
                'y':3,
            },
            select_nb :{
                'd' : 'day' , 
                'w' : 'week' , 
                'm' : 'month', 
                'y' : 'year'
            },
            //讀取畫面flag
            table : [] ,
            titel : [  
                this.$t('GENERAL.BAST_CONTRACT_T5'),
                this.$t('GENERAL.BAST_CONTRACT_T6'),
                this.$t('GENERAL.BAST_CONTRACT_T7'),
                this.$t('GENERAL.BAST_CONTRACT_T8')
            ] ,
            lenX : 3,
            bast_tmp : ["","",""],
            attr : this.$route.query.attr,
		};
	},
	created(){
        console.log(this.$store.state.solutionData)
        console.log(this.$store.state.deviceCommand.deviceAttrList)
        let itme = this.$store.state.solutionData[this.solution]
        //沒有方案
        if(itme == undefined){
            return
        }
        //要將所有設備都抓出來看看
        let index = 0 ;
        let devattr = {}
        for(let i of itme.card){
            for(let j of i.device){
                if(this.$store.state.deviceCommand.deviceAttrList[j.deviceId] == undefined){
                    continue
                }
                let flag = true;
                for(let tmp of this.$store.state.deviceCommand.deviceAttrList[j.deviceId]){
                    if(tmp.attr == this.attr ){
                        devattr[j.deviceId] = tmp.value
                        flag = false
                        break
                    }
                }
                if(flag)continue
                if(index == 0 ){
                    this.devid = j.deviceId
                }
                this.info_item.push({});
                this.info_item[index].devid = j.deviceId
                
                if(this.$store.state.deviceName[j.deviceId] == undefined){
                     this.info_item[index].name  = j.deviceId;
                }else{
                     this.info_item[index].name  = this.$store.state.deviceName[j.deviceId];
                }
                index ++ ;
            }
            
        }
        //取得電價
        this.electricity_list = [
            {
                name : "低壓-非時間電價" , 
                type : "01"
            },
            {
                name : "低壓-二段式" , 
                type : "02"
            },
            {
                name : "高壓-二段式" , 
                type : "03"
            },
            {
                name : "高壓-三段式" , 
                type : "04"
            }]
        this.electricity = "01"
        this.$store.advanced.setattr(devattr);
        console.log(this.info_item)
        console.log(this.$store.state)
	},
    methods: {
        __onclick(item){
            console.log(item)
        },
        //切換XYZ軸
        _oncleck(envt){
            this.daysel = 1
            for(let tmp of Object.keys(this.lock)){
                this.lock[tmp] = 'color: #ffffff;';
            }
            this.lock[envt] = 'color: #ffff33;';
            this.need_xyz = envt
        },
        //繪圖
        async queryDate(new_data , totelcost){
            try {
                this.$refs.dataChart.clearChart();
                let xAxisData = [
                
                ]
                let data = [
                    [],
                    [],
                    [],
                    [],
                ]
                for(let i of totelcost){
                    xAxisData.push(i.value)
                    let d1 = 0
                    let d2 = 0
                    let d3 = 0
                    for(let j of new_data){
                        if(j.value == i.value){
                            d1 = j.data[0].cost
                            d2 = j.data[1].cost
                            d3 = j.data[2].cost
                            break;
                        }
                    }
                    data[0].push(d1)
                    data[1].push(d2)
                    data[2].push(d3)
                    data[3].push(i.cost)
                }
                let ex = {
                    grid: {
                        top:'10%',
                    },
                    legend: {
                        data: [
                            this.$t('GENERAL.BAST_CONTRACT_T1'), 
                            this.$t('GENERAL.BAST_CONTRACT_T2'), 
                            this.$t('GENERAL.BAST_CONTRACT_T3'), 
                            this.$t('GENERAL.BAST_CONTRACT_T4')
                        ],
                        textStyle: {
                                color: '#01ffff',
                                fontSize: 16,
                        },
                    },
                    yAxis: {
                        name: this.$t('GENERAL.BAST_CONTRACT_YB'),
                    },
                    xAxis: {
                        type: 'value',
                        name: this.$t('GENERAL.BAST_CONTRACT_XB'),
                        type: 'category',
                        data: xAxisData
                    },
                    series: [
                        {
                        name: this.$t('GENERAL.BAST_CONTRACT_T1'),
                        type: 'bar',
                        stack: 'one',
                        data: data[0],
                        itemStyle:{color:'#43f018'}
                        },
                        {
                        name: this.$t('GENERAL.BAST_CONTRACT_T2'),
                        type: 'bar',
                        stack: 'one',
                        data: data[1],
                        itemStyle:{color:'#f0ec18'}
                        },
                        {
                        name: this.$t('GENERAL.BAST_CONTRACT_T3'),
                        type: 'bar',
                        stack: 'one',
                        data: data[2],
                        itemStyle:{color:'#18f0ba'}
                        },
                        {
                        name: this.$t('GENERAL.BAST_CONTRACT_T4'),
                        type: 'line',
                        data: data[3],
                        smooth: true,
                        itemStyle:{color:'#18daf0'}
                        }
                    ]
                }
                this.$refs.dataChart.createBar([] , [] , 'bar' , {} , ex);
            } catch (error) {
                console.error(error);
            }
            
        },
        //塞表格
        async queryExcel(new_data , totelcost){

            let bestContract = 0
            let temp_cost = 0
            let decline_ratio = 0
            let saved_money = 0
            let index = -1

            this.table = [
                [this.$t('GENERAL.BAST_CONTRACT_XB') , '-' , '-' , '-'],
                [this.$t('GENERAL.BAST_CONTRACT_YB') , '-' , '-' , '-'],
            ]
            for(let i of new_data){
                console.log(i)
                for(let j of totelcost){
                    if(j.value == i.value){
                        this.table[0][i.type + 1 ] = i.value ;
                        this.table[1][i.type + 1 ] = j.cost  ;
                        break;
                    }
                    
                }
                if(i["type"] == 0){
                    bestContract = i["value"]
                    index = totelcost.findIndex(e => e.value == i["value"])
                    temp_cost = totelcost[index]["cost"]
                }
                //index = -1
                if(i["type"] == 2){
                    index = totelcost.findIndex(e => e.value == i["value"])
                    saved_money = Math.round((totelcost[index]["cost"] - temp_cost) * 100) / 100
                    decline_ratio = Math.round((saved_money / totelcost[index]["cost"]) * 100) / 100
                    break
                }
            }

            decline_ratio = (decline_ratio * 100).toFixed(2) + "%"
            this.bast_tmp = [bestContract,decline_ratio,saved_money]
        },
        async getdata(){
            //0 = 基本 , 1 = 流動   , 2 = 超約 , 3 = 總成本曲線
            //0 = 最佳 , 1 = 無超約 , 2 = 現況BestContract
            let starttime = this.convertTime(this.$refs.firstDate.state.date)
            let endtime = this.convertTime(this.$refs.lastDate.state.date)
            let tmp_now = await this.$store.advanced.BestContract( this.devid , starttime , endtime , this.electricity )
            console.log(tmp_now)
            if(typeof(tmp_now) == "undefined"){
                return
            }
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_0" + tmp_now.status)
				});
                return
            }
            
            await this.queryDate(  tmp_now.data.bar  , tmp_now.data.line)
            await this.queryExcel( tmp_now.data.bar  , tmp_now.data.line)
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            console.log("🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍")
            console.log(this.dataitem)
            await this.getdata()
            
            this.loading = false;
            
        },
        convertTime(date){
			let time = new Date(new Date(date).setDate(new Date(date).getDate()))
			return{year: time.getFullYear(), month: (time.getMonth()+1), day: time.getDate()}
		},
    }

};
</script>

