<template>
    <div class="main back" :Style='stylerwd()' @click='flag=false'>
        
        <div class='slaveC tmp' :Style='stylerwd(96,78,2,12)'>
            <datatable class='slaveM' :Style='stylerwd()'
                :table='table'
                :titel='title'
            />
        </div>

        <div    class="slaveL _32 text_item"   :Style='stylerwd(9.75,7,40,3.5)'> {{$t("GENERAL.REPORT_OPTION")}} </div>
        <select class="slaveL _32 objItem"     :Style='stylerwd(9.75,6,48,3.5)' 
            v-model="currentReportType" @click="changeReportType()">
            <option class="selectItem" v-for="(type, index) in reportType" :key="index" :value="type" :class="lock[index]">
				{{ type }}
			</option>
        </select>
        
        <div        class="slaveL _32 text_item" :Style='stylerwd(9.75,7,60,3.5)'> {{$t("GENERAL.REPORT_DATE")}} </div>
        <dateselect class="slaveL _22 objItem" 
            :mode='reportMode[currentReportMode]'
            :select_date='dataitem'
            :Style='stylerwd(19,6,68,3.5)'/>

        <div            class="slaveL _32 text_item" :Style='stylerwd(9.75,7,3,3.5)'> {{$t("GENERAL.DEVICE_OPTION")}} </div>
        <selectmultiple class="slaveL _24 buttonMain" 
            :item="info_item"
            :show_item="item_name"
            :select_item="devid"
            :Style='stylerwd(26,6,11.5,3.5)'/>

        <Button class="slaveC _24 buttonMain" :Style='stylerwd(7.75,7,90,3.25)' @click="draw()" >
            {{$t("GENERAL.ANALYZE_FIND")}}
        </Button>

        <div    class="slaveL _28 text"   :Style='stylerwd(15,7,2,92)'> {{attr_info.name}} ({{attr_info.unit}}) </div>

        <Button class="slaveC _24 buttonMain" :Style='stylerSize(8,7,89.5,92)' @click="printCSV">
            {{$t("GENERAL.EXPORT")}}.CSV
        </Button>
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
import { getAttributeInfo } from "@/common/constant/attribute";

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
            //三個xyz的按鈕顏色
            lock : {'0' : 'color: #FFFF33;' ,
                    '1' : 'color: #01ffff;' , 
                    '2' : 'color: #01ffff;'  },
            reportType : {
                '0': '時報表',
                '1': '日報表',
                '2': '月報表',
            },
            currentReportType : '時報表',
            currentReportMode : 0,
            reportMode :{
                '0' : 'day' , 
                '1' : 'month' , 
                '2' : 'year', 
            },
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
            this.table = []
            
            this.title = this.devid
            let index = 0
            //應該用 devid
            this.title = [this.$t('GENERAL.ANALYZE_TREND_T1')].concat(name);
            for(let i of Object.keys(new_data).sort()){
                this.table.push([i])
                //這邊之後會用devid
                
                for(let j of  name){
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
            let tmp_now = await this.$store.report.Consumption( this.devid , this.dataitem , this.reportMode[this.currentReportMode][0] )
            if(tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_0" + tmp_now.status)
				});
                return
            }
            let tmp = {}
            let name = Object.keys(tmp_now.data);
            for(let i of Object.keys(tmp_now.data)){
                for(let j of tmp_now.data[i]){
                    if(tmp[j.time] == undefined){
                        tmp[j.time] = {}
                    }
                    tmp[j.time][i] = j.value
                }
            }
            console.log(tmp)
            await this.queryExcel(tmp , name)
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
            link.setAttribute("download", "consumption.csv")
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