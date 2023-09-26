<template>
    <div class="main back" :Style='stylerwd()' @click='flag=false'>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div    class="slaveL _24 text_item"   :Style='stylerwd(10   ,6,51+0  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveL _24 text_item"   :Style='stylerwd(10.75,6,51+30 ,3)'>{{$t("GENERAL.ANALYZE_TIME_LEN")}}</div>
        <select class="slaveL _24 objItem" :Style='stylerwd(7    ,6,51+40 ,3)' v-model="daysel">
            <option class="selectItem" v-for="(index , it) in max_day[need_xyz]" :value="index"  :key="index">
				{{ index }}
			</option>
        </select>
        
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,39.25,12)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>
        
        <div class='slaveC tmp' :Style='stylerwd(47,74,2,22)'>
            <datatable class='slaveM' :Style='stylerwd(100,45,0,0)'
                :table='table'
                :titel='titel'
                :lenX ='lenX'
            />
            <div class='slaveM tmp'  :Style='stylerwd(100,45,0,48)'>
                <div class='slaveM chartView'  :Style='stylerwd(30,96,2,2)'>
                    <div class='slaveC titeltext _48'  :Style='stylerwd(100,50,0,0)'> {{$t("GENERAL.BAST_CONTRACT_T9")}}</div>
                    <div class='slaveC text_item  _40'  :Style='stylerwd(100,50,0,50)'> {{bast_tmp[0]}}</div>
                </div>
                <div class='slaveM chartView'  :Style='stylerwd(30,96,35,2)'>
                    <div class='slaveC titeltext _48'  :Style='stylerwd(100,50,0,0)'> {{$t("GENERAL.BAST_CONTRACT_T10")}}</div>
                    <div class='slaveC text_item  _40'  :Style='stylerwd(100,50,0,50)'> {{bast_tmp[1]}}</div>
                </div>
                <div class='slaveM chartView'  :Style='stylerwd(30,96,68,2)'>
                    <div class='slaveC titeltext _48'  :Style='stylerwd(100,50,0,0)'> {{$t("GENERAL.BAST_CONTRACT_T11")}}</div>
                    <div class='slaveC text_item  _40'  :Style='stylerwd(100,50,0,50)'> {{bast_tmp[2]}}</div>
                </div>
            </div>
            <div class='slaveC'  :Style='stylerwd(100,7,0,93)+"color:#908b8b"'>{{$t("GENERAL.BAST_CONTRACT_TI")}}</div>
        </div>
		<div class='slaveL tmp' :Style='stylerwd(47,86,51,10)'>
            <div class='slaveL chartView' v-loading="loading" 
                :Style='stylerwd()'
                element-loading-lock="true"
                element-loading-background="transparent"
                element-loading-text="Loading"
                element-loading-spinner="el-icon-loading"
                element-loading-custom-class="create-isLoading"
                >
                <data-chart ref="dataChart"/>
            </div>
        </div>
        
        <select class="slaveL _24 objItem " 
            v-model="devid"
            :Style='stylerwd(15.925,6,2 ,13)'>
            <option class="selectItem" v-for="(item , index) in info_item" :value="item.devid" >
				{{ item.name }}
			</option>
        </select>
        <select class="slaveL _24 objItem" 
            v-model="electricity"
            :Style='stylerwd(15.925,6,20.525 ,13)'>
            <option class="selectItem" v-for="(item , index) in electricity_list" :value="item.type" >
				{{ item.name }}
			</option>
        </select>
        <dateselect class="slaveL _24 objItem" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerwd(19   ,6,51+10 ,3)'/>
    </div>
</template>

<script>
//圖表
import DataChart from '@/components/common/dataChart/DataChart.vue';
//日期選擇器
import dateselect from "components/common/dateselect/dateselect";
//表格
import datatable from "components/common/datatable/datatable";
//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
		DataChart,
        dateselect,
        datatable,
	},
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	mixins: [],
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
                    'w' : 'color: #01ffff;' , 
                    'm' : 'color: #01ffff;' , 
                    'y' : 'color: #01ffff;'  },
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
            loading: false,
            lenX : 3,
            bast_tmp : ["","",""],
            attr : this.$route.query.attr,
		};
	},
	created(){
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
                type : 0
            },
            {
                name : "低壓-二段式" , 
                type : 1
            },
            {
                name : "高壓-二段式" , 
                type : 2
            },
            {
                name : "高壓-三段式" , 
                type : 3
            }]
        this.electricity = 0
        this.$store.advanced.setattr(devattr);
        //console.log(this.info_item)
        //console.log(this.$store.state)
	},
    methods: {
        __onclick(item){
            //console.log(item)
        },
        //切換XYZ軸
        _oncleck(envt){
            this.daysel = 1
            for(let tmp of Object.keys(this.lock)){
                this.lock[tmp] = 'color: #01ffff;';
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
                //console.error(error);
            }
            
        },
        //塞表格
        async queryExcel(new_data , totelcost){
            this.table = [
                [this.$t('GENERAL.BAST_CONTRACT_XB') , '-' , '-' , '-'],
                [this.$t('GENERAL.BAST_CONTRACT_YB') , '-' , '-' , '-'],
            ]
            for(let i of new_data){
                    for(let j of totelcost){
                        if(j.value == i.value){
                            this.table[0][i.type + 1 ] = i.value ;
                            this.table[1][i.type + 1 ] = j.cost  ;
                            break;
                        }
                    }
            }
            this.bast_tmp = ["20","10%","5,764"]
        },
        async getdata(){
            //0 = 基本 , 1 = 流動   , 2 = 超約 , 3 = 總成本曲線
            //0 = 最佳 , 1 = 無超約 , 2 = 現況BestContract
            let tmp_now = await this.$store.advanced.BestContract( this.devid , this.dataitem , this.daysel , this.need_xyz , this.electricity )
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + tmp_now.status)
				});
                return
            }
            
            await this.queryDate(  tmp_now.data.bar  , tmp_now.data.line)
            await this.queryExcel( tmp_now.data.bar  , tmp_now.data.line)
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            //console.log("🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍")
            //console.log(this.dataitem)
            await this.getdata()
            
            this.loading = false;
            
        }
    }

};
</script>

<style>
.create-isLoading .el-loading-spinner {
	top: 50%;
	left: 50%;
	margin-left: -55px;
	background: rgba(0, 0, 0, 0.7);
	padding: 20px;
	border-radius: 4px;
	width: auto;
	text-align: center;
	position: absolute;
}

.create-isLoading i {
  	color: #eee;
}

.create-isLoading .el-loading-text {
  	color: #eee;
}
</style>

<style scoped>
.text_item{
    color:#01FFFF;
}
.titeltext{
    display: flex;
    align-items: center;
    justify-content: center;
    color:#27ff00;
}
.back{
    box-shadow: 0px 0px 0px 3px #008593;
    background: #072047 !important;
}

.buttonMain {
    
    color:#01ffff;
    box-shadow: 0px 0px 0px 2px #192f6e;
    background: linear-gradient(#1f31b2, #2160B8 );
    border-radius:20px;
}
.buttonMain:hover {
  background: linear-gradient( #2160B8, #1f31b2);
}

.objItem {
	background: linear-gradient(#1f31b2,#2160B8);
	border: none;
	color: #01ffff;
	font-weight: bold;
	text-align: center;
	font-size: 2vmin;
	height: 4vh;
    width: 10vh;
	margin-right: 0.5vw;
}
.selectItem{
    background-color: #2160b8;
    color: #01ffff;
}
.tmp{
    background:#2c5694;
}
.chartView {
    box-shadow:inset 0px 0px 0px 3px #008593;
	background-color: #072047;
}
</style>