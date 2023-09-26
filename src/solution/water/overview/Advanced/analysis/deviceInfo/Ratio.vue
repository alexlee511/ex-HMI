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
        <!--<Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,28.5,12)'  @click="down()" >匯出</Button>
        -->
        <div class='slaveC tmp' :Style='stylerwd(47,74,2,22)' >
            <datatable class='slaveM' :Style='stylerwd()'
                :table='table'
                :titel='titel'
            />
            <!--<div class='slaveL _24' :Style='stylerwd()'>1</div>
            <div class='slaveR _24' :Style='stylerwd()'>2</div>
            <div class='slaveL _24' :Style='stylerwd(100,10,0,90)'>3</div>
            <div class='slaveR _24' :Style='stylerwd(100,10,0,90)'>4</div>-->
        </div>
		<div class='slaveL tmp' :Style='stylerwd(47,86,51,10)' id='canve'>
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
            :Style='stylerwd(26,6,2 ,13)'/>
        <dateselect class="slaveL _24 objItem" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerwd(19   ,6,51+10 ,3)'/>
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

import html2canvas from 'html2canvas'
import table2excel from 'js-table2excel'
export default {
	components: {
		DataChart,
		selectmultiple,
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
            //可選擇的物件
            info_item : [],
            //顯示的名稱
            item_name : [],
            //選擇的devid
            devid : [],
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
            daysel : 1 ,
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
                this.$t('GENERAL.ANALYZE_RATIO_T1'),
                this.$t('GENERAL.ANALYZE_RATIO_T2_KW'),
                this.$t('GENERAL.ANALYZE_RATIO_T3'),
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
        async queryDate(data){
            try {
                this.$refs.dataChart.clearChart();
                let datalist = []
                for(let i of data){
                    datalist.push({value:i.psa,name:i.name})
                    
                }
                this.$refs.dataChart.createPie(datalist);
            } catch (error) {
                //console.error(error);
            }
            
        },
        //塞表格
        async queryExcel(data){
            this.table = []
            for(let i of data){
                this.table.push([i.name,i.value,i.psa+'%'])
            }
            
        },
        async getdata(){
            let tmp_now = await this.$store.advanced.Ratio( this.devid , this.dataitem , this.daysel , this.need_xyz )
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + tmp_now.status)
				});
                return
            }
            let tmp = tmp_now.data
            let totle = 0;
            for(let i of tmp){
                totle += i.value
            }
            for(let i of tmp){
                i.psa = ((i.value/totle)*100).toFixed(2)
            }
            await this.queryDate(tmp)
            await this.queryExcel(tmp)
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            await this.getdata()
            this.loading = false;
            
        },
        async down(){
            var element = document.getElementById('canve');
            
            
            
            let canvas = await html2canvas(element, {logging:false })

            let ctx = canvas.getContext('2d')
            let page = document.createElement("canvas");
            page.width = canvas.width;
            page.height = canvas.height ;//可能內容不足一頁
            page.getContext('2d').putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height),0,0);
            //console.log(page);
            let t = page.toDataURL();
            //console.log(t)
            let column =[
            {
		          title: '時報標題', 
		          key: 'title',
		          type: 'text'
		        },{
                title : '123',
                key   : 'img',
                type   : 'image',
            } ]
            let data = [{
                title : '測試',
                img : 'https://avatar.csdnimg.cn/9/8/3/2_xiaoxiaojie12321',
            }]
            
            
            //console.log(table2excel(column , data , 'test01'))
            //this.test__ = false
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
.tmp123{
    box-shadow: inset 0px 0px 0px 3px #008593 !important;
    background:#2c5694 !important;
}
</style>