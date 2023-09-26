<template>
    <div class="main back" :Style='stylerwd()' @click='flag=false'>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div    class="slaveL _24 text_item text_center"   :Style='stylerwd(8   ,6,51+1  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveL _24 text_item text_center"   :Style='stylerwd(8,6,51+31 ,3)'>{{$t("GENERAL.ANALYZE_TIME_LEN")}}</div>
        
        <select class="slaveL _24 objItem" :Style='stylerwd(7    ,6,51+40 ,3)' v-model="daysel">
            <option class="selectItem" v-for="(index , it) in max_day[need_xyz]" :value="index"  :key="index">
				{{ index }}
			</option>
        </select>
        <div class="slaveL _24 text_item text_center"   :Style='stylerwd(9,8,2,12)'>狀態類型選擇</div>
        <select class="slaveL _24 objItem " :Style='stylerwd(15.925,6,2 + 10 ,13)' v-model="stats">
            <option class="selectItem" v-for="(statusClass , id) in statusClass">
				{{ statusClass }}
			</option>
        </select>

        <div class="slaveL _24 text_item text_center"   :Style='stylerwd(8,8,2+28,12)'>選擇設備</div>
        <select class="slaveL _24 objItem " :Style='stylerwd(15.925,6,2 + 36 ,13)' v-model="device">
            <option class="selectItem" v-for="(item , index) in deviceItem">
				{{ item }}
			</option>
        </select>

        <Button class="slaveC _24 buttonMain" :Style='stylerwd(9.75,8,56,12)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>


        
		<div class='slaveL chartView overFlowY' :Style='stylerwd(96,66,2,21)'>
            <div class='slaveC borderB' :Style='stylerwd(100,15,0,0)'>
                <div class="slaveC borderR text_item text_center" :Style='stylerwd(12.5, 100, 0+i*12.5, 0)' v-for="(title, i) in titleList">{{title}}</div>
            </div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,0,15+status*15)' v-for="(eventStatus, status) in itemList">{{eventStatus.status}}</div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,12.5,15+eventName*15)' v-for="(name, eventName) in itemList">{{name.eventName}}</div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,25,15+deviceName*15)' v-for="(device, deviceName) in itemList">{{device.deviceName}}</div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,37.5,15+loopName*15)' v-for="(loop, loopName) in itemList">{{loop.loopName}}</div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,50,15+lockDeviceName*15)' v-for="(lockDevice, lockDeviceName) in itemList">{{lockDevice.lockDeviceName}}</div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,62.5,15+eventDate*15)' v-for="(date, eventDate) in itemList">{{date.eventDate}}</div>
            <div class='slaveC borderRB text_center' :Style='stylerwd(12.5,15,75,15+handleDate*15)' v-for="(time, handleDate) in itemList">{{time.handleDate}}</div>
            <div class='slaveM borderRB' :Style='stylerwd(12.5,15,87.5,15+handleDate*15)' v-for="(button, handleDate) in itemList">
                <Button class='slaveC buttonMain' :Style='stylerwd(47,80,2,10)' v-if="button.buttonitem == 'show'">排除</Button>
                <Button class='slaveC buttonMain' :Style='stylerwd(47,80,51,10)' v-if="button.buttonitem == 'show'">處理</Button>
            </div>
        </div>

        <div class="slaveC _24 text_center" :Style='stylerwd(4,8,86.5,88)' >{{$t("GENERAL.EXPORT")}}</div>
        <Button class="slaveC _24 buttonMain" :Style='stylerwd(7.5,8,91,88)' @click="printCSV">.CSV</Button>

        
        <dateselect class="slaveL _24 objItem" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerwd(19   ,6,51+10 ,3)'/>
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
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	mixins: [],
	data() {
		return {
            titleList: [],
            itemList: {},        
            statusClass: [],
            deviceItem : [],
            //選擇的裝置
            device: '',
            //選擇的狀態
            stats: '',

            dataitem : {},
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
        
        this.titleList = ["狀態", "事件名稱", "設備名稱", "迴路名稱", "連動設備名稱", "發生時間", "處理時間", ""]
        this.statusClass = ["狀態一", "狀態二", "狀態三"]
        this.deviceItem = ["設備一", "設備二", "設備三"]
        


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
         
        },
        async getdata(){
            let tmp_now = {
                status: 0,
                data: [
                    this.itemList = [
                {
                    status: "未讀",
                    eventName: "電壓過低",
                    deviceName: "空調電錶",
                    loopName: "大冰機",
                    lockDeviceName: "D11(電壓過低)",
                    eventDate: "2021/12/17 8:20",
                    handleDate: "2021/12/18 8:21",
                    buttonitem: "show",
                },
                {
                    status: "已排除",
                    eventName: "電壓過高",
                    deviceName: "空調電錶",
                    loopName: "小冰機",
                    lockDeviceName: "D12(電壓過高)",
                    eventDate: "2021/12/16 8:20",
                    handleDate: "2021/12/19 8:21",
                    buttonitem: "dontshow",
                },
                {
                    status: "未讀",
                    eventName: "電壓過低",
                    deviceName: "空調電錶",
                    loopName: "大冰機",
                    lockDeviceName: "D11(電壓過低)",
                    eventDate: "2021/12/17 8:20",
                    handleDate: "2021/12/18 8:21",
                    buttonitem: "show",
                },
                {
                    status: "已排除",
                    eventName: "電壓過高",
                    deviceName: "空調電錶",
                    loopName: "小冰機",
                    lockDeviceName: "D12(電壓過高)",
                    eventDate: "2021/12/16 8:20",
                    handleDate: "2021/12/19 8:21",
                    buttonitem: "dontshow",
                },
                {
                    status: "未讀",
                    eventName: "電壓過低",
                    deviceName: "空調電錶",
                    loopName: "大冰機",
                    lockDeviceName: "D11(電壓過低)",
                    eventDate: "2021/12/17 8:20",
                    handleDate: "2021/12/18 8:21",
                    buttonitem: "show",
                },
                {
                    status: "已排除",
                    eventName: "電壓過高",
                    deviceName: "空調電錶",
                    loopName: "小冰機",
                    lockDeviceName: "D12(電壓過高)",
                    eventDate: "2021/12/16 8:20",
                    handleDate: "2021/12/19 8:21",
                    buttonitem: "dontshow",
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
            await this.queryDate( tmp_now.data )
            await this.queryExcel(tmp_now.data )
            this.viewHigh =  loopCount
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

</style>