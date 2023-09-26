<template>
    <div class="main back" :Style='stylerSize()' @click='flag=false'>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div    class="slaveL _24 text_item"   :Style='stylerSize(10   ,6,51+0  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveL _24 text_item"   :Style='stylerSize(10.75,6,51+30 ,3)'>{{$t("GENERAL.ANALYZE_TIME_LEN")}}</div>
        <select class="slaveL _24 selectMain" :Style='stylerSize(7    ,6,51+40 ,3)' v-model="daysel">
            <option class="selectItem" v-for="(index , it) in max_day[need_xyz]" :value="index"  :key="index">
				{{ index }}
			</option>
        </select>
        
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,39.25,12)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>
        
        <div class='slaveC tmp' :Style='stylerSize(47,74,2,22)'>
            <datatable class='slaveM' :Style='stylerSize()'
                :table='table'
                :titel='titel'
            />
            <!--<div class='slaveL _24' :Style='stylerSize()'>1</div>
            <div class='slaveR _24' :Style='stylerSize()'>2</div>
            <div class='slaveL _24' :Style='stylerSize(100,10,0,90)'>3</div>
            <div class='slaveR _24' :Style='stylerSize(100,10,0,90)'>4</div>-->
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
        
        <selectmultiple class="slaveL _24 buttonMain" 
            :item="info_item"
            :show_item="item_name"
            :select_item="devid"
            :Style='stylerSize(26,6,2 ,13)'/>
        <dateselect class="slaveL _24 selectMain" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerSize(19   ,6,51+10 ,3)'/>
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
            //顯示的名稱
            item_name : [],
            //選擇的devid
            devid : [],
            dataitem : {},
            time: {},
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
                this.$t('GENERAL.ANALYZE_PROPORTION_T1'),
                this.$t('GENERAL.ANALYZE_PROPORTION_T2'),
                this.$t('GENERAL.ANALYZE_PROPORTION_T3')
            ] ,
            loading: false,
            attr : this.$route.query.attr,
		};
	},
	created(){
        let itme = this.$store.state.solutionData[this.solution]
        //沒有方案
        if(itme == undefined){
            return
        }
        let devattr = {}
        //要將所有設備都抓出來看看
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
                this.info_item.push(j.deviceId);
                if(this.$store.state.deviceName[j.deviceId] == undefined){
                    this.item_name.push(j.deviceId);
                }else{
                    this.item_name.push(this.$store.state.deviceName[j.deviceId]);
                }
            }
        }
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
        async queryDate(new_data,old_data){
            try {
                this.$refs.dataChart.clearChart();
                let datalist = [{
                                    name:this.$t('GENERAL.ANALYZE_PROPORTION_T2'),
                                    data:[],
                                },{
                                    name:this.$t('GENERAL.ANALYZE_PROPORTION_T3'),
                                    data:[],
                                }]
                let item = this.devid
                //暫時先用new_data的KEYS
                item = Object.keys(new_data)
                //0 = 今年 1 = 去年
                for(let i of Object.keys(new_data)){
                    datalist[0].data.push({y_val:new_data[i].value,x_val:i})
                    if(old_data[i] != undefined){
                        datalist[1].data.push({y_val:old_data[i].value,x_val:i})
                    }
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
        async queryExcel(new_data,old_data){
            this.table = []
            let index = 0;
            let old_sum = 0
            let new_sum = 0
            //應該用 devid
            for(let i of Object.keys(new_data)){
                console.log(new_data)
                this.table.push([])
                this.table[index].push(i)
                if(new_data[i] != undefined){
                    this.table[index].push(new_data[i].value)
                    new_sum += new_data[i].value
                }else{
                    this.table[index].push('-')
                }
                if(old_data[i] != undefined){
                    this.table[index].push(old_data[i].value)
                    old_sum += old_data[i].value
                }else{
                    this.table[index].push('-')
                }
                
                index ++ ;
            }
            this.table.push([])
            this.table[index].push('總和', Math.round(Number(new_sum) * 100) / 100, Math.round(Number(old_sum) * 100) / 100)

            
        },
        async getdata(){
            let tmp_now = await this.$store.advanced.Proportion( this.devid , this.dataitem , this.daysel , this.need_xyz )
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
            console.log(tmp_now)
            await this.queryDate(tmp_now.data.now  , tmp_now.data.yest)
            await this.queryExcel(tmp_now.data.now , tmp_now.data.yest)
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            console.log("🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍")
            console.log(this.dataitem)
            await this.getdata()
            
            this.loading = false;
            
        }
    }

};
</script>
