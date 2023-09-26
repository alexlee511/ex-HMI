<template>
    <div class="main back" :Style='stylerwd()' @click='flag=false'>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,39.25,2)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>
        
        <div class='slaveC tmp' :Style='stylerwd(47,84,2,12)'>
            <datatable class='slaveM' :Style='stylerwd()'
                :table='table'
                :titel='titel'
            />
            <!--<div class='slaveL _24' :Style='stylerwd()'>1</div>
            <div class='slaveR _24' :Style='stylerwd()'>2</div>
            <div class='slaveL _24' :Style='stylerwd(100,10,0,90)'>3</div>
            <div class='slaveR _24' :Style='stylerwd(100,10,0,90)'>4</div>-->
        </div>
		<div class='slaveL tmp' :Style='stylerwd(47,94,51,2)'>
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
        
        <selectmultiple class="slaveL _24 buttonMain" 
            :item="info_item"
            :show_item="item_name"
            :select_item="devid"
            :Style='stylerwd(26,6,2 ,3)'/>
    </div>
</template>

<script>
//圖表
import DataChart from '@/components/common/dataChart/DataChart.vue';
//自定義選擇器
import selectmultiple from "components/common/selectmultiple/selectmultiple";
//表格
import datatable from "components/common/datatable/datatable";
//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
		DataChart,
		selectmultiple,
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
            //可選擇的物件
            info_item : [],
            //顯示的名稱
            item_name : [],
            //選擇的devid
            devid : [],
            //方案的名稱
            devName : null,
            //讀取畫面flag
            loading: false,
            //讀取畫面flag
            table : [] ,
            titel : [  
                this.$t('GENERAL.ANALYZE_RATIO_T1'),
                this.$t('GENERAL.PERFORMANCE_T1'),
                this.$t('GENERAL.PERFORMANCE_T4'),
                this.$t('GENERAL.PERFORMANCE_T2'),
                this.$t('GENERAL.PERFORMANCE_T5'),
                this.$t('GENERAL.PERFORMANCE_T3')
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
        //console.log(this.info_item)
        //console.log(this.$store.state)
	},
    methods: {
        //繪圖
        async queryDate(new_data){
            try {
                this.$refs.dataChart.clearChart();
                let ex = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                        }
                    },
                    grid: {
                        top:'15%',
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        name: 'KWh',
                    },
                     yAxis: {
                        type: 'category',
                        data: [this.$t('GENERAL.PERFORMANCE_T1'),this.$t('GENERAL.PERFORMANCE_T2'),this.$t('GENERAL.PERFORMANCE_T3')]
                    },
                    series: [
                    ]
                }
                for(let i of Object.keys(new_data)){
                    let dict = {
                        name: i,
                        type: 'bar',
                        data: [new_data[i].tag, new_data[i].now , new_data[i].old ]
                    }
                    ex.series.push(dict)
                }
                this.$refs.dataChart.createBar([] , [] , 'bar' , {} , ex);
            } catch (error) {
                //console.error(error);
            }
            
        },
        //塞表格
        async queryExcel(new_data){
            this.table = []
            let index = 0;
            let totle_now = 0
            let totle_tag = 0
            let totle_old = 0
            for(let i of Object.keys(new_data)){
                this.table.push([])
                //名稱
                this.table[index].push(i)
                //目標
                this.table[index].push(new_data[i].tag)
                //達成率
                if(new_data[i].tag == 0){
                    this.table[index].push('-')
                }else{
                    this.table[index].push(((new_data[i].now / new_data[i].tag  )*100).toFixed(2)+'%')
                }
                //本期
                this.table[index].push(new_data[i].now)
                //成長率
                if(new_data[i].old == 0){
                    this.table[index].push('-')
                }else{
                    this.table[index].push((((new_data[i].now - new_data[i].old) /  new_data[i].old )*100).toFixed(2)+'%')
                }
                //前期
                this.table[index].push(new_data[i].old)
                //加總
                totle_now += new_data[i].now
                totle_tag += new_data[i].tag
                totle_old += new_data[i].old
                index ++ ;
            }
            this.table.push([])
            //名稱
            this.table[index].push(this.$t('GENERAL.PERFORMANCE_T6'))
            //目標
            this.table[index].push(totle_tag)
            //達成率
            if(totle_tag == 0){
                this.table[index].push('-')
            }else{
                this.table[index].push(((totle_now / totle_tag  )*100).toFixed(2)+'%')
            }
            //本期
            this.table[index].push(totle_now)
            //成長率
            if(totle_old == 0){
                this.table[index].push('-')
            }else{
                this.table[index].push((((totle_now - totle_old ) /  totle_old )*100).toFixed(2)+'%')
            }
            //前期
            this.table[index].push(totle_old)
            index ++ ;
            
        },
        async getdata(){
            let tmp_now = await this.$store.advanced.EnergySavingPerformance( this.devid )
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + tmp_now.status)
				});
                return
            }
            await this.queryDate(tmp_now.data)
            await this.queryExcel(tmp_now.data)
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