<template>
    <div class="main back" :Style='stylerSize()' @click='flag=false'>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,2    ,2)+lock["d"]'@click="_oncleck('d')">{{$t("GENERAL.ANALYZE_STATISTICS_DAY")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,14.35,2)+lock["w"]'@click="_oncleck('w')">{{$t("GENERAL.ANALYZE_STATISTICS_WEEK")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,26.7 ,2)+lock["m"]'@click="_oncleck('m')">{{$t("GENERAL.ANALYZE_STATISTICS_MONTH")}}</Button>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(9.75,8,39.25,2)+lock["y"]'@click="_oncleck('y')">{{$t("GENERAL.ANALYZE_STATISTICS_YEAR")}}</Button>
        <div    class="slaveL _24 text_item text_center"   :Style='stylerSize(6   ,6,51+0  ,3)'>{{$t("GENERAL.ANALYZE_START_TIME")}}</div>
        <div    class="slaveL _24 text_item text_center"   :Style='stylerSize(6,6,51+27 ,3)'>{{$t("GENERAL.ANALYZE_TIME_LEN")}}</div>
        <select class="slaveL _24 selectMain" :Style='stylerSize(7    ,6,51+34 ,3)' v-model="daysel">
            <option class="selectItem" v-for="(index , it) in max_day[need_xyz]" :value="index"  :key="index">
				{{ index }}
			</option>
        </select>
    
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(5,8,93,2)' @click="draw()" >{{$t("GENERAL.ANALYZE_FIND")}}</Button>

        <div class="slaveL _24 text_item text_center"   :Style='stylerSize(9,8,2,12)'>設備選擇</div>
        <select class="slaveL _24 selectMain " :Style='stylerSize(15.925,6,2 + 10 ,13)' v-model="deviceID">
            <option class="selectItem" v-for="(deviceClass , id) in info_item" :value="deviceClass.devid">
				{{ deviceClass.name }}
			</option>
        </select>
    
        <div class='slaveC' :Style='stylerSize(96,65,2,21)' v-loading="loading"
            element-loading-lock="true"
            element-loading-background="transparent"
            element-loading-text="Loading"
            element-loading-spinner="el-icon-loading"
            element-loading-custom-class="create-isLoading"
        >
            <datatable class='slaveM' :Style='stylerSize()'
                :table='table'
                :titel='title'
            />
        </div>
		
        <div class="slaveC _24 text_center" :Style='stylerSize(4,8,86.5,88)' >{{$t("GENERAL.EXPORT")}}</div>
        <Button class="slaveC _24 buttonMain" :Style='stylerSize(7.5,8,91,88)' @click="printCSV">.CSV</Button>
        
        <dateselect class="slaveL _24 selectMain" 
            :mode='select_nb[need_xyz]'
            :select_date='dataitem'
            :Style='stylerSize(19   ,6,51+7 ,3)'/>
    </div>
</template>

<script>

//日期選擇器
import dateselect from "components/common/dateselect/dateselect";
import datatable from "components/common/datatable/datatable";

//this.$t("GENERAL.DATA_MISSING")
export default {
	components: {
        datatable,
        dateselect,

	},
    computed:{
        /*stylermax: function(){
            return function(l = 0 ,flag = 0 ){
                let count = 0;
                for(let i = 0 ; i < flag ; i ++){
                    count += this.reportList[i].length;
                }
                let h = this.reportList[flag].length * this.table_h
                return "width: 10%;height:"+h+"%;left:"+l+"%;top:"+(15+count * this.table_h)+"%;"; 
            }
        },

        stylerH: function(){
            return function(t=0 , n = 0){
                let count = 0;
                for(let i = 0 ; i < n ; i ++){
                    count += this.reportList[i].length;
                }
                let y = 100*this.table_h/(this.viewHigh*this.table_h +15);
                let ny = 100*15/(this.viewHigh*this.table_h +15);
                return "width: 100%;height:"+y+"%;left:0%;top:"+((t+count)*y+ny)+"%;"; 
            }
        },//要改*/
    },
	mixins: [],
	data() {
		return {
            viewHigh: 0,
            table_h : 10,
            titleList: [],
            reportList: {},
            CSV_data: [],
            deviceID: '',
            table: [],
            title: [],
            testtt: [],
            //deviceClass: [],

            solution: this.$route.query.solution,
            //該卡片的資訊
            info_item : [],
            item_name: [],
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
            table : [] ,
            titel : [  
                this.$t('GENERAL.STRUCTURE_T1'),
                this.$t('GENERAL.STRUCTURE_T2'),
                this.$t('GENERAL.STRUCTURE_T3')
            ] ,
            loading: false,
            lenX : 10,
            attr : this.$route.query.attr,
            tmp_now: {}

		};
	},
	created(){
        //this.deviceClass = ["設備一", "設備二", "設備三"]
        console.log(this.tmp_now)


        let itme = this.$store.state.solutionData[this.solution]
        //沒有方案
        if(itme == undefined){
            return
        }
        console.log(this.$store.state.deviceCommand.deviceAttrList)

        let devattr = {}
        let index = 0
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
        console.log(devattr)
        console.log(this.info_item)
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
        async queryExcel(){
            let check_index = -1
            let index = 0
            this.table.length = 0

            for(let deviceType of this.reportList){
                console.log(deviceType)
                this.table.push([]) 
                this.table[index].push(deviceType.name)
                for(let i of this.titleList){
                    check_index = deviceType.time.findIndex(e => e.date == i)
                    if(check_index != -1){
                        this.table[index].push(deviceType.time[check_index]["hour"], deviceType.time[check_index]["useRate"])
                    }
                    else{
                        this.table[index].push("-", "-")
                    }
                    check_index = -1
                }
                this.table[index].push(deviceType.totalHourss, deviceType.totalRatess)
                index += 1
            }     
         
        },
        async getdata(){
            console.log(this.daysel)
            console.log(this.need_xyz)
            console.log(this.deviceID)
            console.log(this.dataitem)
            if(this.deviceID == ""){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return
            }

            this.tmp_now = await this.$store.report.TimeAccumulation(this.deviceID , this.dataitem , this.daysel , this.need_xyz)
            console.log(this.tmp_now)
            if(typeof(this.tmp_now) == "undefined"){
                return
            }
            this.table.length = 0
            if(this.tmp_now.status != 0){
                this.$notify({
                    type: 'info',
                    title: this.$t("GENERAL.NOTICE"),
                    message: this.$t("GENERAL.ERROR_MSG_" + this.tmp_now.status)
                });
                return
            }
            
            this.reportList = this.tmp_now["data"]
            this.titleList.length = 0

            //let loopCount = 0;
            for(let deviceType of this.reportList){
                //loopCount += deviceType.length
                let totalHour = 0
                let totalRate = 0

                for(let recordDate in deviceType.time){
                    if(!this.titleList.includes(deviceType.time[recordDate]["date"])){
                        this.titleList.push(deviceType.time[recordDate]["date"])
                    }
                    if(deviceType.time[recordDate].hour == "-" || deviceType.time[recordDate].useRate == "-"){
                        continue
                    }
                    else{
                        totalHour += deviceType.time[recordDate].hour
                        totalRate += Number(deviceType.time[recordDate].useRate.slice(0, deviceType.time[recordDate].useRate.length-1))
                    }
                    

                }
                deviceType.totalHourss = totalHour   
                deviceType.totalRatess = totalRate + "%"
                console.log(deviceType.totalHourss)
            }

            this.titleList.sort()
            console.log(this.titleList)
            this.title = JSON.parse(JSON.stringify(this.titleList))
            
            for(let i=1; i<=this.title.length; i+=2 ){
                this.title.splice(i,0,"使用率")
            }
            
            //this.viewHigh =  loopCount
            this.title.unshift("迴路名稱")
            this.title.push(this.$t("GENERAL.PRICE_TOTAL"), "總使用率")
            console.log(this.title)

            await this.queryExcel()
            console.log(this.table)

        },
        async draw(){
            if(this.loading) return;
            this.loading = true;
            await this.getdata()
            
            this.loading = false;
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
            link.setAttribute("download", "timeAccumulation.csv")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        }
    }

};
</script>
