<template>
    <div class="main back" :Style='stylerSize()' @click='flag=false'>
        <date-pick class="slaveL _24" :Style='stylerSize(20,10,2,-41)' ref="firstDate" @pickDate="pickFirstDate"></date-pick>
        <select class="filter__picker_item slaveL _24" :Style='stylerSize(7,5.2,13,4)' v-model="startTime">
            <option class="selectItem" v-for="(item, index) in hour" :key="index" :value="item">
                {{ item }}
            </option>
        </select>
        <div class="slaveC _24 text_item text_center"  :Style='stylerSize(2,10,20.5,1.5)'>~</div>
        <date-pick class="slaveL _24"  :Style='stylerSize(20,10,3,-41)' ref="lastDate" @pickDate="pickLastDate"></date-pick>
        <select class="filter__picker_item slaveL _24" :Style='stylerSize(7,5.2,34,4)' v-model="endTime">
            <option class="selectItem" v-for="(item, index) in hour" :key="index" :value="item">
                {{ item }}
            </option>
        </select>
        <!--/div-->
        <div class="slaveL _24 text_item text_center"   :Style='stylerSize(8,8,43,3)'>狀態類型選擇</div>
        <select class="slaveL _24 selectMain " :Style='stylerSize(10,5.5,2 + 51 ,4)' v-model="stats">
            <option class="selectItem" v-for="(statusClass , id) in statusClass" :value="statusClass.type">
                {{ statusClass.status }}
            </option>
        </select>
        
        <div class="slaveL _24 text_item text_center"   :Style='stylerSize(8,8,3+61,3)'>選擇設備</div>
        
        <!--select class="slaveL _24 selectMain " :Style='stylerSize(10,6,3+70 ,4)' v-model="device">
            <option class="selectItem" v-for="(item , index) in deviceItem">
				{{ item }}
			</option>
        </select-->

        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,87,3)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>
		<div class='slaveM chartView overFlowY divcss' :Style='stylerSize(96,70,2,15)' 
            v-loading="loading"
            element-loading-lock="true"
            element-loading-background="transparent"
            element-loading-text="Loading"
            element-loading-spinner="el-icon-loading"
            element-loading-custom-class="create-isLoading"
        >
            <div class='slaveM borderB' :Style='stylerSize(100,15,0,0)'>
                <div class="slaveC borderR text_item titelCSS _20 overFlowX" :Style='stylerSize(12.5, 100, 0+i*12.5, 0)' v-for="(title, i) in titleList">
                    <div class="slaveC" :style="stylerSize(100,50,0,20)">{{title}}</div>
                </div>
            </div>
            <div class='slaveM' :Style='stylerSize(100,100,0,0)'>
                <div v-for="(eventStatus, status) in table" :key="eventStatus.eventID" :value="eventStatus.eventID">
                    <div class='slaveC borderRB tableCSS_V2 _20 overFlowX' :Style='stylerSize(12.5,15,0,15+status*15)'>
                        <div class="slaveC" :style="stylerSize(100,50,0,20)">{{eventStatus.statusName}}</div>
                    </div>
                    <div class='slaveC borderRB tableCSS_V2 _20 overFlowX' :Style='stylerSize(12.5,15,12.5,15+status*15)'>
                        <div class="slaveC" :style="stylerSize(100,50,0,20)">{{eventStatus.eventName}}</div>
                    </div>
                    <div class='slaveC borderRB tableCSS_V2 _20 overFlowX' :Style='stylerSize(12.5,15,25,15+status*15)'>
                        <div class="slaveC" :style="stylerSize(100,50,0,20)">{{eventStatus.deviceName}}</div>
                    </div>
                    <div class='slaveC borderRB tableCSS_V2 _20 overFlowX' :Style='stylerSize(12.5,15,37.5,15+status*15)'>
                        <div class="slaveC" :style="stylerSize(100,50,0,20)">{{eventStatus.lockDeviceName}}</div>
                    </div>
                    <div class='slaveC borderRB tableCSS_V2 _20 overFlowX' :Style='stylerSize(12.5,15,50,15+status*15)'>
                        <div class="slaveC" :style="stylerSize(100,50,0,20)">{{eventStatus.eventDate}}</div>
                    </div>
                    <div class='slaveC borderRB tableCSS_V2 _20 overFlowX' :Style='stylerSize(12.5,15,62.5,15+status*15)'>
                        <div class="slaveC" :style="stylerSize(100,50,0,20)">{{eventStatus.handleDate}}</div>
                    </div>
                    <div class='slaveM borderRB' :Style='stylerSize(25,15,75,15+status*15)'>
                        <Button class='slaveC buttonMain  _20' :Style='stylerSize(35,80,11,10)' v-if="eventStatus.buttonitem == 'show'" @click="getEventStatusExclude(eventStatus.eventID)">排除</Button>
                        <Button class='slaveC buttonMain  _20' :Style='stylerSize(35,80,54,10)' v-if="eventStatus.buttonitem == 'show' && eventStatus.statusName == '未讀'" @click="getEventStatusProcess(eventStatus.eventID)">處理</Button>
                    </div>
                </div>
            </div>
        </div>

        <div class="slaveC _24 text_center" :Style='stylerSize(4,8,86.5,88)' >{{$t("GENERAL.EXPORT")}}</div>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(7.5,8,91,88)' @click="printCSV">.CSV</Button>
        
        <selectmultiple class="slaveL _24 buttonMain" 
        :item="info_item"
        :show_item="deviceItem"
        :select_item="deviceIdList"
        :Style='stylerSize(12,5,73,4.5)'/>
        
        <!--dateselect class="slaveL _24 selectMain" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerSize(19   ,6,51+10 ,3)'/-->
    </div>
</template>

<script>

//日期選擇器
import dateselect from "components/common/dateselect/dateselect";
import DatePick from "components/common/datePick/DatePick";
import selectmultiple from "components/common/selectmultiple/selectmultiple";
import { formatDate } from "common/utile/utile";
import analyzeDateMixin from "common/mixin/analyzeDateMixin";
import { setAbnormaleventData } from "network/adv";

//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
        DatePick,
        dateselect,
        selectmultiple,

	},
    computed:{
        
    },
	mixins: [analyzeDateMixin],
	data() {
		return {
            titleList: [],
            itemList: {},
            tmp_now: {},
            report_list: {},
            CSV_data: [],
            statusClass: [],
            info_item: [],
            deviceItem : [],
            solution: this.$route.query.solution,
            //選擇的裝置
            device: '',
            //選擇的狀態
            stats: 0,
            process_flag: 0,
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
            attr : this.$route.query.attr,
            deviceIdList: [],
            //////////////////////////////////////////////////////////////
            
		};
	},
	created(){
        
        this.titleList = ["狀態", "事件名稱", "設備名稱", "連動設備名稱", "發生時間", "處理時間"]
        this.statusClass = [{type: 0, status: "未讀"}, 
                            {type: 1, status: "處理中"},
                            {type: 2, status: "已排除"},
                            {type: 3, status: "全選"},
        ]
        //this.deviceItem = ["設備一", "設備二", "設備三"]
        console.log(this.stats)

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
                console.log(this.info_item)
                if(this.$store.state.deviceName[j.deviceId] == undefined){
                    this.deviceItem.push(j.deviceId);
                }else{
                    this.deviceItem.push(this.$store.state.deviceName[j.deviceId]);
                }
            }
        }
        console.log(this.deviceItem)
        this.$store.advanced.setattr(devattr);

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
       
        //塞表格
        async queryExcel(data){
            this.table = []
            let index  = 0 ;
            console.log(data)
            this.table = data
            
        },
        async getdata(){
            /*let tmp_now = {
                status: 0,
                data: [
                    {
                        eventID: "IN001",
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
                        eventID: "IN002",
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
            }*/
            if(this.deviceIdList.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return
            }
            console.log(this.stats)
            console.log(this.deviceIdList)
            let starttime = this.convertTime(this.$refs.firstDate.state.date)
            let endtime = this.convertTime(this.$refs.lastDate.state.date)
            this.tmp_now = await this.$store.report.Unusual(this.deviceIdList, starttime, endtime, this.startTime, this.endTime, this.stats) 
            if(typeof(this.tmp_now) == "undefined"){
                /*this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.DATA_MISSING_STATISTICS")
				});*/
                return
            }
            this.report_list = this.tmp_now["data"]

            console.log(this.tmp_now)
            if(this.tmp_now["status"] != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + this.tmp_now.status)
				});
                return
            }
            await this.queryExcel(this.tmp_now.data )
            //this.viewHigh = loopCount
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            await this.getdata()
            
            this.loading = false;
        },

        async getEventStatusExclude(eventID){
            //API
            console.log(eventID)
            let res = await setAbnormaleventData(eventID, 2)
            console.log(res)

            let index = -1
            let now = new Date()

            index = this.table.findIndex(e => e.eventID == eventID)
            if(index != -1){
                //this.table[index]["handleDate"] = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
                this.table[index]["statusName"] = "已排除"
                this.table[index]["status"] = 2
                this.table[index]["buttonitem"] = "dontshow"
            }
        },
        async getEventStatusProcess(eventID){
            //API
            console.log(eventID)
            let res = await setAbnormaleventData(eventID, 1)
            console.log(res)

            let index = -1
            let now = new Date()

            index = this.table.findIndex(e => e.eventID == eventID)
            if(index != -1){
                this.table[index]["handleDate"] = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate() + "  " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
                this.table[index]["statusName"] = "處理中"
                this.table[index]["status"] = 1
                this.process_flag = 1
            }
        },

        printCSV(){
            console.log(this.tmp_now);
            if(typeof(this.tmp_now) == "undefined" || Object.keys(this.tmp_now).length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.DATA_MISSING_STATISTICS")
				});
                return
            }
            console.log(this.titleList)
            this.CSV_data.push(this.titleList)
            for(let i of this.tmp_now.data){
                console.log(i)
                this.CSV_data.push([i.statusName, i.eventName, i.deviceName, i.lockDeviceName, i.eventDate, i.handleDate])
            }
            console.log(this.CSV_data)

            let csvContent = "data:text/csv;charset=utf-8,\ufeff"
            this.CSV_data.forEach(function(rowArray) {
                let row = rowArray.join(",")
                csvContent += row + "\r\n"
            });

            var encodedUri = encodeURI(csvContent)
            var link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", "unusual_data.csv")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },

        convertTime(date){
			let time = new Date(new Date(date).setDate(new Date(date).getDate()))
			return{year: time.getFullYear(), month: (time.getMonth()+1), day: time.getDate()}
		},
        
    }

};
</script>
