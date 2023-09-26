<template>
    <div class="main back" :style='stylerSize()' @click='flag=false'>

        <div class="slaveL _24 text_item"  :Style='stylerSize(7 ,6,2.5 ,4.5)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <date-pick class="slaveL _24" :Style='stylerSize(20,10,10,-41)' ref="firstDate" @pickDate="pickFirstDate"></date-pick>
        
        <div class="slaveL _24 text_item"  :Style='stylerSize(10 ,6,22.5 ,4.5)'>{{$t("GENERAL.ANALYZE_END_TIME")}}</div>
        <date-pick class="slaveL _24"  :Style='stylerSize(20,10,10,-41)' ref="lastDate" @pickDate="pickLastDate"></date-pick>

        <Button class="slaveC _24 buttonMain" :style='stylerSize(5,8,93,12)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>

        <div class="slaveL _24 text_item text_center" :Style='stylerSize(7 ,6,42 ,3.5)'>選擇設備</div>
        <div class="slaveL _24 text_item text_center" :Style='stylerSize(7 ,6,64 ,3.5)'>價表選擇</div>
        <select class="slaveC _24 selectMain " :Style='stylerSize(25,6,72.5,3.5)' v-model="price_type">
            <option class="selectItem" style="" v-for="(type_class , id) in cost_data['cost']" :key="type_class.type" :value="type_class.type">
				{{ type_class.name }}
			</option>
        </select>
        <!--select class="slaveC _24 selectMain " :Style='stylerSize(15.925,6,37,13)' v-if="solution == 'water'" >
            <option class="selectItem" v-for="(type_class , id) in item_name">
				{{ type_class }}
			</option>
        </select-->
        
		<div class='slaveM divcss divfocus ' :style='stylerSize(96,65,2,22)'
            v-loading="loading"
            element-loading-lock="true"
            element-loading-background="transparent"
            element-loading-text="Loading"
            element-loading-spinner="el-icon-loading"
            element-loading-custom-class="create-isLoading"
        >
            <div class='slaveC divcss titelCSS overFlowX' :style='stylerSize(15,10,0,0)'>
                <div class="slaveC" :style="stylerSize(100,50,0,20)">價表</div>
            </div>
            <div class='slaveC divcss titelCSS overFlowX' v-if='max!=0' :style='item(index)' v-for="(itemobj , index) of dataname">
                <div class="slaveC" :style="stylerSize(100,50,0,20)">{{itemobj.name}}</div>
            </div>
            
            
            <div class='slaveC divcss titelCSS overFlowX' :style='stylerSize(15,10,0,10)'>
                <div class="slaveC" :style="stylerSize(100,50,0,20)">設備資訊</div>
            </div>
            <div class='slaveC divcss titelCSS overFlowX' :style='stylerSize(w,10,15+index*w,10)' v-for="(itemobj , index) of titel">
                <div class="slaveC" :style="stylerSize(100,50,0,20)">{{itemobj}}</div>
            </div>
            <div class='slaveC divcss titelCSS overFlowX' :style='stylerSize(w,10,15+(index+dataname[0].len)*w  ,10)' v-for="(itemobj , index) of titel">
                <div class="slaveC" :style="stylerSize(100,50,0,20)">{{itemobj}}</div>
            </div>
            
            <div class='slaveC' :style='stylerSize(100,10,0,20 + index * 10)' v-for="(itemobj , index) of table">
                <div class='slaveC divcss titelCSS overFlowX' :style='stylerSize(15,100,0,0)' >
                    <div class="slaveC" :style="stylerSize(100,50,0,20)">{{itemobj[0]}}</div>
                </div>
                <div class='slaveC divcss tableCSS overFlowX' :style='stylerSize(w,100,15+(index-1)*w  ,0)' v-if='index!=0' v-for="(it , index) of itemobj">
                    <div class="slaveC" :style="stylerSize(100,50,0,20)">{{it}}</div>
                </div>
            </div>
        
        </div>
        <div class="slaveC _24 font" :style='stylerSize(4,8,86.5,89)' >{{$t("GENERAL.EXPORT")}}</div>
        <Button class="slaveC _24 buttonMain"  :style='stylerSize(7.5,8,91,88)' @click="printCSV">.CSV</Button>
        
        <selectmultiple class="slaveL _24 buttonMain" 
        :Style='stylerSize(12 ,5,50 ,4)'
        :item="info_item"
        :show_item="itemList"
        :select_item="deviceIdList"/>

        <!--dateselect class="slaveL _24 selectMain" 
            :mode='select_nb[need_xyz]'
            :select_date='dateitem'
            :style='stylerSize(19   ,6,51+7 ,3)'/-->
    </div>
</template>

<script>

//日期選擇器
import dateselect from "components/common/dateselect/dateselect";
import selectmultiple from "components/common/selectmultiple/selectmultiple";
import DatePick from "components/common/datePick/DatePick";
import analyzeDateMixin from "common/mixin/analyzeDateMixin";
//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
        DatePick,
        dateselect,
        selectmultiple,

	},
    computed:{

        //表格標題寬度
        item: function(){
            return function(r=0){
                
                let count = 0
                for(let i = 0 ; i < r ; i ++){
                    count += this.dataname[i].len ;
                }
                console.log(this.dataname[r])
                console.log(this.w)
                return "width: "+(this.w * this.dataname[r].len)+"%;height:10%;left:"+(this.w * count + 15)+"%;top:0%;"; 
                
            }
        },
        contentTitle: function(){
            return function(s=0, t=0){
                let contentW = 100 / this.dataname[s].len
                return "width: "+contentW+"%;height:100%;left:"+(t*contentW)+"%;top:0%;";
            }
        },
        contentValue: function(){
            return function(s=0, t=0){
                let contentW = 10
                if(this.max * 10  < 100){
                    contentW = 100 / this.max ;
                }
               
                return "width: "+contentW+"%;height:100%;left:"+(s+t*contentW)+"%;top:0%;";
            }
        },
     
        
        
    },
	mixins: [analyzeDateMixin],
	data() {
		return {
            dataname : [
                {name : "用量" , len : 0},
                {name : "金額" , len : 0}
            ] , 
            max : 0 ,
            price_type: "",
            itemList: [],
            cost_data: {},
            electricity_price: [],

            solution: this.$route.query.solution,
            //該卡片的資訊
            info_item : [],
            type_class: [],
            //選擇的devid
            devid : '',
            dateitem : {},
            deviceIdList: [],
            devattr: {},
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
            first_title : [],
            table : [] ,
            titel : [] ,
            loading: false,
            lenX : 10,
            attr : this.$route.query.attr,
            w : 0,
            tmp_now: {},
            CSV_data : [],

		};
	},
	created(){
        console.log(this.$store)
        this.cost_data = {
            energy: [
                {type: "01", name:"低壓-電力用戶非時間電價"}, 
                {type: "02", name: "低壓-電力用戶二段式時間電價"}, 
                {type: "03", name: "高壓-二段式時間電價"}, 
                {type: "04", name: "高壓-三段式時間電價"},
            ],
            water: [
                {type: "01", name:"水費"}, 
               
            ],
            cost: [],
        }
        /*this.electricity_price = [{type: "01", name:"低壓-電力用戶非時間電價"}, 
                                  {type: "02", name: "低壓-電力用戶二段式時間電價"}, 
                                  {type: "03", name: "高壓-二段式時間電價"}, 
                                  {type: "04", name: "高壓-三段式時間電價"},
        ]*/
        for(let i of this.cost_data[this.solution]){
            this.cost_data["cost"].push(i)
        }
        console.log(this.cost_data["cost"])

        let itme = this.$store.state.solutionData[this.solution]
        //沒有方案
        if(itme == undefined){
            return
        }
        this.info_item = []

        //要將所有設備都抓出來看看
        for(let i of itme.card){
            for(let j of i.device){
                if(this.$store.state.deviceCommand.deviceAttrList[j.deviceId] == undefined){
                    continue
                }
                let flag = true;
                for(let tmp of this.$store.state.deviceCommand.deviceAttrList[j.deviceId]){
                    if(tmp.attr == this.attr ){
                        console.log(tmp)
                        this.devattr[j.deviceId] = tmp.value
                        flag = false
                        break
                    }
                }
                if(flag)continue
                this.info_item.push(j.deviceId);
                console.log(this.info_item)
                if(this.$store.state.deviceName[j.deviceId] == undefined){
                    this.itemList.push(j.deviceId);
                }else{
                    this.itemList.push(this.$store.state.deviceName[j.deviceId]);
                }
            }
        }
        this.price_type = "01"
        console.log(this.itemList)
        console.log(this.devattr)
        console.log(this.need_xyz)
        console.log(this.deviceIdList)
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
            console.log(data)
            this.table = []
            this.titel = []
            this.first_title = []
            let index  = 0 ;
            for(let i of data){
                this.table.push([])
                this.table[index].push(i.name)
                let amountList   = [];
                let amounttotle  = 0;
                let dosageList   = [];
                let dosagetotle  = 0;
                for(let j of i.datalist){
                    if(!this.titel.includes(j.period)){
                        this.titel.push(j.period)
                    }
                    if(j.amount!=undefined){
                        amountList.push(j.amount)
                        amounttotle += j.amount
                    }else{
                        amountList.push('-')
                    }
                    if(j.dosage!=undefined){
                       dosageList.push(j.dosage)
                       dosagetotle += j.dosage
                    }else{
                       dosageList.push('-')
                    }
                }
                amountList.push(Math.round(Number(amounttotle) * 100) / 100)
                dosageList.push(Math.round(Number(dosagetotle) * 100) / 100)
                this.table[index] = this.table[index].concat(amountList)
                this.table[index] = this.table[index].concat(dosageList)
                index++
            }
            console.log(this.table)
            console.log(this.titel)
            this.titel.push('總和')
            this.first_title.push("價表")
            this.dataname[0].len = this.titel.length
            for(let i = 0; i<this.dataname[0].len; i++){
                this.first_title.push(this.dataname[0].name)
            }
            this.dataname[1].len = this.titel.length
            for(let i = 0; i<this.dataname[1].len; i++){
                this.first_title.push(this.dataname[1].name)
            }
            this.max = this.titel.length * 2
            this.w = 10
            if(this.max * 10  < 85){
                this.w = 85 / this.max ;
            }
        },
        async getdata(){
            /*let tmp_now = {
                status: 0,
                data: [
                    {
                        name : "冰機",
                        datalist : [
                            {
                                period : "尖峰",
                                dosage : 30,
                                amount : 50,
                            },
                            {
                                period : "半尖峰",
                                amount : 60,
                            },
                            {
                                period : "離峰",
                                dosage : 60,
                            }
                        ]
                    }, {
                        name : "冷氣",
                        datalist : [
                            {
                                period : "尖峰",
                                dosage : 1,
                                amount : 2,
                            },
                            {
                                period : "半尖峰",
                                dosage : 3,
                                amount : 4,
                            },
                            {
                                period : "離峰",
                                dosage : 5,
                                amount : 6,
                            }
                        ]
                    }, 
                ]
            }*/
            let starttime = this.convertTime(this.$refs.firstDate.state.date)
            let endtime = this.convertTime(this.$refs.lastDate.state.date)
            
            if(this.deviceIdList.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return
            }

            this.tmp_now = await this.$store.report.BillingStatistic(this.deviceIdList , starttime, endtime, this.price_type, this.solution, this.devattr)
            console.log(this.tmp_now)
            if(typeof(this.tmp_now) == "undefined"){
                return
            }
            if(this.tmp_now.status != 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_" + this.tmp_now.status)
				});
                return
            }
            await this.queryExcel(this.tmp_now.data)
        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            await this.getdata()
            this.loading = false;
        },
        printCSV(){
            console.log(this.tmp_now["data"]);
            if(typeof(this.tmp_now["data"]) == "undefined"){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.DATA_MISSING_STATISTICS")
				});
                return
            }
            let second_title = []
            second_title.push("設備資訊")
            for(let i = 0; i<this.dataname.length; i++){
                for(let j of this.titel){
                    second_title.push(j)
                }
            }
            console.log(second_title)

            this.CSV_data.push(this.first_title)
            this.CSV_data.push(second_title)
            for(let i of this.table){
                this.CSV_data.push(i)
            }
            
            let csvContent = "data:text/csv;charset=utf-8,\ufeff"
            this.CSV_data.forEach(function(rowArray) {
                let row = rowArray.join(",")
                csvContent += row + "\r\n"
            });
            var encodedUri = encodeURI(csvContent)
            var link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", "billingStatistic.csv")
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
