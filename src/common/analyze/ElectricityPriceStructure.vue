<template>
    <div class="main back" :Style='stylerSize()' @click='flag=false'>
        <!--Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div class="slaveL _24 text_item"  :Style='stylerSize(10 ,6,51+0 ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
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
            <datatable class='slaveM' :Style='stylerSize()'
                :table='table'
                :titel='titel'
            />
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

        <select class="slaveL _24 selectMain " 
            v-model="price_type"
            :Style='stylerSize(8,6,23 ,13)'>
            <option class="selectItem" v-for="(item , index) in type_item" :key="item.type" :value="item.type" >
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
        dateselect,
        DatePick,
        datatable,
	},
    computed:{

    },
	mixins: [analyzeDateMixin],
	data() {
		return {
            solution: this.$route.query.solution,
            //該卡片的資訊
            info_item : [],
            //選擇的devid
            devid : '',
            dataitem : {},
            //方案的名稱
            devName : null,
            //讀取畫面flag
            loading: false,
            daysel : 1,
            //三個xyz的按鈕顏色
            lock : {'d' : 'color: #FFFF33;' ,
                    'w' : 'color: #ffffff;' , 
                    'm' : 'color: #ffffff;' , 
                    'y' : 'color: #ffffff;'  },
            //選中的按鈕
            need_xyz : 'd',
            price_type: "",
            type_item:[
                {type: 0, name: "低壓"},
                {type: 1, name: "高壓"}
            ],
            aysel : 1,
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
                this.$t('GENERAL.STRUCTURE_T1'),
                this.$t('GENERAL.STRUCTURE_T2'),
                this.$t('GENERAL.STRUCTURE_T3')
            ] ,
            lenX : 10,
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
        this.price_type = 0
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
        async queryDate(new_data){
            try {
                this.$refs.dataChart.clearChart();
                let datalist = [{
                                    name:this.$t('GENERAL.STRUCTURE_T3'),
                                    data:[],
                                }]
                let item = []
                for(let i of new_data){
                    datalist[0].data.push({y_val:i.value,x_val:i.name})
                    item.push(i.name)
                }
                let ex = {
                    grid: {
                        top:'10%',
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: 'KWh',
                        }
                    ],
                }
                this.$refs.dataChart.createBar(datalist , item , 'bar' , {} , ex);
            } catch (error) {
                console.error(error);
            }
            
        },
        //塞表格
        async queryExcel(new_data){
            this.table = []
            let index  = 0 ;
            for(let i of new_data){
                this.table.push([index+1 , i.name , i.value.toCurrencyString() ])
                index ++ ;
            }
            this.lenX = index + 1;
            
        },
        async getdata(){
            let starttime = this.convertTime(this.$refs.firstDate.state.date)
            let endtime = this.convertTime(this.$refs.lastDate.state.date)
            let tmp_now = await this.$store.advanced.ElectricityPriceStructure( this.devid , starttime , endtime, this.price_type)
            if(typeof(tmp_now) == "undefined"){
                return
            }
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_0" + tmp_now.status)
				});
                
            }
            await this.queryDate( tmp_now.data )
            await this.queryExcel(tmp_now.data )
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
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

