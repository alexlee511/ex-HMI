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
            <datatable class='slaveM' :Style='stylerwd()'
                :table='table'
                :titel='titel'
            />
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
                    'w' : 'color: #01ffff;' , 
                    'm' : 'color: #01ffff;' , 
                    'y' : 'color: #01ffff;'  },
            //選中的按鈕
            need_xyz : 'd',
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
            loading: false,
            lenX : 10,
            attr : this.$route.query.attr
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
                //console.error(error);
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
            let tmp_now = await this.$store.advanced.ElectricityPriceStructure( this.devid , this.dataitem , this.daysel , this.need_xyz )
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + tmp_now.status)
				});
                return
            }
            await this.queryDate( tmp_now.data )
            await this.queryExcel(tmp_now.data )
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
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