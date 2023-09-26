<template>
    <div class="main back" :Style='stylerwd()' @click='flag=false'>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div    class="slaveL _24 text_item text_center"   :Style='stylerwd(6   ,6,51+0  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveL _24 text_item text_center"   :Style='stylerwd(6,6,51+27 ,3)'>{{$t("GENERAL.ANALYZE_TIME_LEN")}}</div>
        <select class="slaveL _24 objItem" :Style='stylerwd(7    ,6,51+34 ,3)' v-model="daysel">
            <option class="selectItem" v-for="(index , it) in max_day[need_xyz]" :value="index"  :key="index">
				{{ index }}
			</option>
        </select>
    
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(5,8,93,2)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>

        <div class="slaveL _24 text_item text_center"   :Style='stylerwd(9,8,2,12)'>設備選擇</div>
        <select class="slaveL _24 objItem " :Style='stylerwd(15.925,6,2 + 10 ,13)' v-model="stats">
            <option class="selectItem" v-for="(statusClass , id) in statusClass">
				{{ statusClass }}
			</option>
        </select>

		<div class='slaveM chartView overFlowY' :Style='stylerwd(96,65,2,21)'>
            <div class='slaveC  text_center text' :Style='stylerwd(20,100,0,0)'>
                <div class='slaveC borderRB text_center text_item' :Style='stylerwd(100,15,0,0)'>時間電價</div>
                <div class='slaveC borderRB text_center text_item' :Style='stylerwd(50,15,0,15)'>設備名稱</div>
                <div class='slaveC borderRB text_center text_item' :Style='stylerwd(50,15,50,15)'>迴路名稱</div>
            </div>
            <div class='slaveC borderRB text_center text_item' :Style='stylerwd(40,15,20,0)'>用量(kWH)</div>
            <div class='slaveC borderRB text_center text_item' :Style='stylerwd(40,15,60,0)'>金額</div>
     

        </div>
        <div class="slaveC _24 text_center" :Style='stylerwd(4,8,86.5,88)' >{{$t("GENERAL.EXPORT")}}</div>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(7.5,8,91,88)' @click="printCSV">.CSV</Button>
        
        <dateselect class="slaveL _24 objItem" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerwd(19   ,6,51+7 ,3)'/>
    </div>
</template>

<script>

//日期選擇器
import dateselect from "components/common/dateselect/dateselect";

//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {

        dateselect,

	},
    computed:{
        stylermax: function(){
            return function(l = 0 ,flag = 0 ){
                let count = 0;
                for(let i = 0 ; i < flag ; i ++){
                    count += this.reportList[i].loop.length;
                }
                let h = this.reportList[flag].loop.length * this.table_h
                return "width: 10%;height:"+h+"%;left:"+l+"%;top:"+(15+count * this.table_h)+"%;"; 
            }
        },
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },

        stylerH: function(){
            return function(t=0 , n = 0){
                let count = 0;
                for(let i = 0 ; i < n ; i ++){
                    count += this.reportList[i].loop.length;
                }
                let y = 100*this.table_h/(this.viewHigh*this.table_h +15);
                let ny = 100*15/(this.viewHigh*this.table_h +15);
                return "width: 100%;height:"+y+"%;left:0%;top:"+((t+count)*y+ny)+"%;"; 
            }
        },//要改
    },
	mixins: [],
	data() {
		return {
            viewHigh: 0,
            table_h : 10,
            titleList: [],
            reportList: {},

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
       
        //塞表格
        async queryExcel(data){
            this.table = []
            let index  = 0 ;
            for(let i of data){
                this.table.push([i.type])
            
            }
         
        },
        async getdata(){
            let tmp_now = {
                status: 0,
                data: [
                    this.reportList = [
                {
                    type: "照明電錶",
                    loop: [
                        {
                            name: "大廳",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 10
                                },
                                {
                                    date: "12/15",
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
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "警衛室",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 12,
                                    useRate: 49
                                },
                                {
                                    date: "12/15",
                                    hour: 13,
                                    useRate: 50
                                },
                                {
                                    date: "12/17",
                                    hour: 14,
                                    useRate: 51
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "桌球室",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 46
                                },
                                {
                                    date: "12/15",
                                    hour: 12,
                                    useRate: 47
                                },
                                {
                                    date: "12/17",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                    ],
                },
                {
                    type: "空調電錶",
                    loop: [
                        {
                            name: "大冰機",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 46
                                },
                                {
                                    date: "12/15",
                                    hour: 12,
                                    useRate: 47
                                },
                                {
                                    date: "12/17",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "小冰機",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 12,
                                    useRate: 49
                                },
                                {
                                    date: "12/15",
                                    hour: 13,
                                    useRate: 50
                                },
                                {
                                    date: "12/17",
                                    hour: 14,
                                    useRate: 51
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                    ],
                },
                {
                    type: "動力電錶",
                    loop: [
                        {
                            name: "大廳",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 10
                                },
                                {
                                    date: "12/15",
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
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "警衛室",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 12,
                                    useRate: 49
                                },
                                {
                                    date: "12/15",
                                    hour: 13,
                                    useRate: 50
                                },
                                {
                                    date: "12/17",
                                    hour: 14,
                                    useRate: 51
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "桌球室",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 46
                                },
                                {
                                    date: "12/15",
                                    hour: 12,
                                    useRate: 47
                                },
                                {
                                    date: "12/17",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                    ],
                },
                {
                    type: "插座電錶",
                    loop: [
                        {
                            name: "大廳",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 10
                                },
                                {
                                    date: "12/15",
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
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "警衛室",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 12,
                                    useRate: 49
                                },
                                {
                                    date: "12/15",
                                    hour: 13,
                                    useRate: 50
                                },
                                {
                                    date: "12/17",
                                    hour: 14,
                                    useRate: 51
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                        {
                            name: "桌球室",
                            time: [
                                {
                                    date: "12/13",
                                    hour: 11,
                                    useRate: 46
                                },
                                {
                                    date: "12/15",
                                    hour: 12,
                                    useRate: 47
                                },
                                {
                                    date: "12/17",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/19",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/21",
                                    hour: 13,
                                    useRate: 48
                                },
                                {
                                    date: "12/23",
                                    hour: 13,
                                    useRate: 20
                                },
                            ],
                            totalHourss: "",
                            totalRatess: "",
                        },
                    ],
                },
                
            ]
        

        

                ]
            }
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + tmp_now.status)
				});
                return
            }
            let loopCount = 0;
        for(let deviceType of this.reportList){
             loopCount +=  deviceType.loop.length
            //console.log(loopCount)
            for(let loopName of deviceType.loop){
                let totalHour = 0
                let totalRate = 0

                for(let recordDate of loopName.time){
                    if(!this.titleList.includes(recordDate.date)){
                        this.titleList.push(recordDate.date) 
                    }
                    
                    totalHour += recordDate.hour
                    totalRate += recordDate.useRate
                   
                }

                loopName.totalHourss = totalHour   
                loopName.totalRatess = totalRate
            
            }
            
        }
        this.viewHigh =  loopCount
            await this.queryDate( tmp_now.data )
            await this.queryExcel(tmp_now.data )
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            await this.getdata()
            
            this.loading = false;
        },

        printCSV(){
            //console.log(this.reportList);
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
    overflow: auto;
}
.borderRB {
    border-right:  3px solid #008593;
	border-bottom:  3px solid #008593;

}
.borderR{
    border-right:  3px solid #008593;
}
.borderB {
	border-bottom:  3px solid #008593;
}
.borderL {
	border-left:  3px solid #008593;
}
.text_center{
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-around;
}
.overFlowY{
    overflow-y: auto;
    overflow-x: hidden;
}

.overFlowY::-webkit-scrollbar {
  width  : 0.5vw;
  height : 1vh;
}

.overFlowY::-webkit-scrollbar-thumb {
  background-color: #8888FF !important;
  
}
.overFlowY::-webkit-scrollbar-track {
  background: #4285f4 !important;
}
.overFlowX{
    overflow-x: auto;
    overflow-y: hidden;
}

.overFlowX::-webkit-scrollbar {
    display: none;
}
.text{
    color: #ffff33;
}
</style>