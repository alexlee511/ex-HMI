<template>
    <div class="main back" :Style='stylerwd()' @click='flag=false'>

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
        
        <div class='slaveC tmp' :Style='stylerwd(96,78,2,12)'>
            <datatable class='slaveM' :Style='stylerwd()'
                :table='table'
                :titel='title'
            />
        </div>

        <Button class="slaveC _24 buttonMain" :Style='stylerwd(7.75,7,90,3.25)' @click="draw()" >
            {{$t("GENERAL.ANALYZE_FIND")}}
        </Button>
        
        <div    class="slaveL _32 text_item"   :Style='stylerwd(9.75,7,45,3.5)'> {{$t("GENERAL.DEVICE_OPTION")}} </div>
        <selectmultiple class="slaveL _24 buttonMain" 
            :item="info_item"
            :show_item="item_name"
            :select_item="devidList"
            :Style='stylerwd(20,6,54,3.5)'/>

        <Button class="slaveC _24 buttonMain" :Style='stylerSize(8,7,89.5,92)' @click="printCSV">
            {{$t("GENERAL.EXPORT")}}.CSV
        </Button>

        <div    class="slaveL _28 text"   :Style='stylerwd(15,7,2,92)'> {{attr_info.name}} ({{attr_info.unit}}) </div>
    </div>
</template>

<script>
//圖表
import DataChart from '@/components/common/dataChart/DataChart.vue';
//自定義選擇器
import selectmultiple from "components/common/selectmultiple/selectmultiple";
//日期選擇器
import DatePick from "components/common/datePick/DatePick";
//表格
import datatable from "components/common/datatable/datatable";
import analyzeDateMixin from "common/mixin/analyzeDateMixin";
import { getAttributeInfo } from "@/common/constant/attribute";

export default {
    mixins: [analyzeDateMixin],
	components: {
		DataChart,
		selectmultiple,
        DatePick,
        datatable,
	},
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
            }
        },
    },
	data() {
		return {
            solution: this.$route.query.solution,
            //可選擇的物件
            info_item : [],
            //顯示的名稱
            item_name : [],
            //選擇的devid
            devidList : [],
            dataitem : {},
            //三個xyz的按鈕顏色
            lock : {'0' : 'color: #FFFF33;' ,
                    '1' : 'color: #01ffff;' , 
                    '2' : 'color: #01ffff;'  },
            //讀取畫面flag
            table : [] ,
            title : [] ,
            attr : this.$route.query.attr,
            attr_info: {},
            CSV_data : [],
		};
	},
	async created(){
        let item = this.$store.state.solutionData[this.solution]
        //沒有方案
        if(item == undefined){
            return
        }
        let devattr = {}
        //要將所有設備都抓出來看看
        for(let i of item.card){
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
        this.attr_info = await getAttributeInfo(this.attr);
	},
    methods: {
        __onclick(item){
            //console.log(item)
        },
        //切換XYZ軸
        changeReportType(){
            for(let key of Object.keys(this.reportType)){
                if(this.reportType[key] === this.currentReportType){
                    this.currentReportMode = key;
                    break;
                }
            }

            for(let tmp of Object.keys(this.lock)){
                this.lock[tmp] = 'color: #01ffff;';
            }
            this.lock[this.currentReportMode] = 'color: #ffff33;';
        },
        //塞表格
        async queryExcel(new_data , name){
            console.log("Table data", new_data);
            this.table = []
            
            this.title = this.devidList
            let index = 0
            //應該用 devidList
            this.title = [this.$t('GENERAL.ANALYZE_TREND_T1')].concat(name);
            console.log("TITLE", this.title)
            for(let i of Object.keys(new_data).sort()){
                this.table.push([i])
                //這邊之後會用devid
                
                for(let j of name){
                    if(new_data[i][j] != undefined){
                        this.table[index].push(new_data[i][j])
                    }else{
                        this.table[index].push('-')
                    }
                }
                index ++ ;
            }
        },
        async getdata(){
            if(this.devidList.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_023")
				});
                return
            }

            let startDate = this.firstDay.getFullYear() + '-' + String(Number(this.firstDay.getMonth()+1)).padStart(2, '0') + '-' + String(this.firstDay.getDate()).padStart(2, '0') + 'T' + this.startTime+":00";
            let endDate = this.lastDay.getFullYear() + '-' + String(Number(this.lastDay.getMonth()+1)).padStart(2, '0') + '-' + String(this.lastDay.getDate()).padStart(2, '0') + 'T' + this.endTime+":00";

            if(this.startTime === this.endTime && startDate === endDate){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.SETTING_ERROR_TIME_INTERVAL_ZERO")
				});
                return
            }

            this.$store.state.loading = true;
            this.table = []
            let res = await this.$store.report.HistoryReport( this.devidList, startDate, endDate)
            
            let tmp = {}
            let name = [];
            let devAttrList = this.$store.state.deviceCommand.deviceAttrList;
            for(let devid of this.devidList){
                if(res[devid] == undefined) continue;
                if(!res[devid].length) continue;
                let index = devAttrList[devid].findIndex( e => {return e.attr === this.attr})
                let current_name = this.$store.state.deviceName[devid] || devid;
                name.push(current_name)
                for(let i of Object.keys(res[devid])){
                    let time = res[devid][i].timestamp.slice(0,16);
                    if(!tmp[time]) tmp[time] = {};
                    tmp[time][current_name] = {};
                    tmp[time][current_name] = res[devid][i][devAttrList[devid][index].value];
                }
            }
            //console.log(res)
            
            if(Object.keys(tmp).length) await this.queryExcel(tmp, name)
            
            this.$store.state.loading = false;
        },
        async draw(){
            await this.getdata()
        },
        printCSV(){
            console.log(this.titleList)
            console.log(this.title)
            console.log(this.table)
            if(this.table.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.DATA_MISSING_STATISTICS")
				});
                return
            }
            this.CSV_data = []
            this.CSV_data.push(this.title)
            for(let i of this.table){
                this.CSV_data.push(i)
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
            link.setAttribute("download", "history_report.csv")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
    }

};
</script>

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
	font-size: 2.5vmin;
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