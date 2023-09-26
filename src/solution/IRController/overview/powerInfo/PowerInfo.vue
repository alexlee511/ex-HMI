<template>
  <div class="main" :style='stylerSize()'>
    <div class="slaveM" :style='stylerSize(100,10,0,0)'>
      <Button class="slaveC _36 buttonMain" :style='stylerSize(13,75,44.5,60)' @click="update_status">{{ $t("GENERAL.UPDATE_STATUS") }}</Button>
    </div>
    <hr class="setting_hr slaveM" :style='stylerSize(100,0.2,0,15)' color="#000000" />
    <div
      class="devicelist_view__title_item slaveM"
      :style='stylerSize(100,15,0,15)'
    >
      <div class="slaveL _36" :style='stylerSize(15,80,15,23)'>{{ $t("GENERAL.CONNECT_STATE") }}</div>
      <div class="slaveL _36" :style='stylerSize(10,80,46,23)'>{{ $t("GENERAL.ACCOUNT") }}</div>
    </div>
    <div class="slaveM overFlowY" :style='stylerSize(100,55,0,31)'>
        <div
          class="slaveC "
          v-for="(item, index) in Object.keys(infoList)"
          :key="item"
          :value="item"
          :style='stylerSize(100,25,0,25*index)'
          
        >
            <div class="slaveC _36 title" :style='stylerSize(15,40,15,0)'>{{ temp_name[item] }}</div>
            <span class="slaveC _36 title" :style='stylerSize(10,40,46,0)'>{{infoList[item]["account"]}}</span>
            
            <Button class="slaveC _32 hmi_setting_content_button" :style='stylerSize(7,40,75,0)' style="opacity:0.5; pointer-events: none;" v-if="infoList[item].account == 0" @click="check_list(item)">{{ $t("GENERAL.CHECK") }}</Button>
            <Button class="slaveC _32 hmi_setting_content_button" :style='stylerSize(7,40,75,0)' v-else @click="check_list(item)">{{ $t("GENERAL.CHECK") }}</Button><!--v-if="infoList[item].account != '-'"-->
        
            
        
        </div>
        <el-dialog custom-class="dialog-class" :visible.sync="statusVisible" :append-to-body="true" >
            <div class="dialog_size" >
                <div class="main" :style='stylerSize()'>
                    <div class="slaveM" :style='stylerSize(100,20,0,0)'>
                        <span class="slaveC _36" :style='stylerSize(100,40,0,0)'>{{$t("GENERAL.CONNECT_STATE")}}： {{ now_status_name }}</span>

                        <Button class="slaveC _32 buttonMain" :style='stylerSize(25,35,38,40)' v-if="isShowButton==true" @click="allpowerControl(infoList[now_status].data_list, on_off_button)">{{ temp_buttonName }}</Button>

                    </div>
                    <div class="slaveM overFlowY" :style='stylerSize(100,80,0,20)'>
                        <div
                            class="slaveM "
                            v-for="(device, index) in infoList[now_status].data_list"
                            :key="index"
                            :value="index"
                            :style='stylerSize(100,15,0,index*15)'
                        >
                        
                            <span class="slaveC _32" :style='stylerSize(40,60,10,5)'>{{ device["deviceName"]}}</span>
                            <div class="slaveC _32" :style='stylerSize(25,60,60,5)' v-if="isShow">
                                <Button :style='stylerSize(60,80,0,0)' v-if=" device.control_type == false " class="_28 context-button" @click="powerControl(device, on_off_button)">{{ on_off_button }}</Button>
                                <span class="_32 yellow" :style='stylerSize(100,60,0,0)' v-else> 控制成功 </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog custom-class="dialog-class" :visible.sync="controlResVisible" :append-to-body="true">
            <div class="select-item">
                <span >{{$t("GENERAL.CONNECT_STATE")}}： {{ $t("GENERAL.CONTROL_FAIL") }}</span>
                
            </div>
            <div
                class=""
                v-for="(device, index) in control_fail_list"
                :key="index"
                :value="index"
            >
                <span class="select-item">
                    <span>{{ device["deviceName"]}}</span>
                </span>
            </div>
        </el-dialog>
    </div>

    
  </div>
</template>

<script>
//import deviceCardMixin from "common/mixin/deviceCardMixin";
import { sleep, getMutiDeviceData, delete_all} from "common/constant/ist";
import { controlInstruction } from "solution/IRController/utils/TSControl"
import { mapGetters, mapState } from "vuex";

export default {
    
    mixins: [],
    data() {
        return {
            temp_name:{0: this.$t("GENERAL.POWER_CLOSE"), 1: this.$t("GENERAL.POWER_OPEN"), 2: this.$t("GENERAL.DISCONNECTION"), 3: this.$t("GENERAL.UNKNOWN")},
            infoList: {
                0: {"data_list": [], "account": "-"},
                1: {"data_list": [], "account": "-"},
                2: {"data_list": [], "account": "-"},
                3: {"data_list": [], "account": "-"},
            },
            idToName: {},
            statusVisible: false,
            controlResVisible: false,
            now_status_name: "",
            temp_buttonName: "",
            on_off_button:"",
            isShow: false,
            isShowButton: false,
            card: [],
            unknown_value: false,
            unknown_list: {"data_list":[], "account": 0},
            now_status: 0,
            group_num: 16,        //進度條跑條時每次讀取數量
            control_fail_list: [],
            allControlSuccess: false,

        };
    },
    beforeCreate(){
        this.$store.commit("addMaxPage", 0);

    },

    created() {
        /*this.$store.commit("addMaxPage", 0);
		this.$store.state.pageNum = 1;*/
        /*for(let i of this.temp_name){
            this.infoList[i] = {}
            this.$set(this.infoList[i], "data_list", [])
            this.$set(this.infoList[i], "account", "-")
            //   this.infoList[i]["data_list"] = []
            //   this.infoList[i]["account"] = "-"
        }*/


    },
    mounted() {
        
    },
    beforeDestroy() {
		delete_all();
		this.$store.state.pageNum = 1;
        
	},
    computed: {
        ...mapState({
            solutionData: state => state.solutionData,
            selectDevice: state => state.backData.selectDevice
        }),
    },
    methods: {
        handleExceptionId(item) {

            return item.deviceId
        },

        async update_status(){
            let array = []
            this.allControlSuccess = false
            this.unknown_value = false
            for(let i = 0; i < Object.keys(this.infoList).length; i++){
                this.infoList[i]["data_list"] = []
                this.infoList[i]["account"] = 0
            }
            this.unknown_list = {
                "data_list":[], 
                "account": 0
            }
            this.getCard("IRController");     //更新空調卡片
            //console.log(this.card)
            array = this.to2DArray(this.card)
            //console.log(array)

            this.$store.commit("setLoadingProgress");
            this.$store.commit("setTotalLoading", this.card.length)
            for(let i in array){
                await this.processInfoList(array[i])
                this.$store.commit("addCompleteLoading", array[i].length)
            }

            if(this.unknown_value){    //狀態:未知
                this.infoList[3] = {"data_list": [], "account": "-"}
                this.infoList[3]["data_list"] = JSON.parse(JSON.stringify(this.unknown_list["data_list"]))
                this.infoList[3]["account"] = this.unknown_list["account"]
            }

            this.$store.commit("setLoadingProgress");
            this.$forceUpdate();
        },

        async processInfoList(list){
            const res = await getMutiDeviceData(list)
            //console.log(res)
            for(let j of res){
                if (j.connect_status == 1){
                    for(let info of j.data){
                        if(info.attr == "100700" || info.attr == "101000"){
                            if(info.value == 0){          //狀態: 電源關閉
                                this.infoList[0]["data_list"].push({dev_id: j["dev_id"], value: info.value, deviceName: this.idToName[j["dev_id"]], control_type: false})
                                this.infoList[0]["account"] = this.infoList[0]["data_list"].length
                            }
                            else if(info.value == 1){     //狀態: 電源開啟
                                this.infoList[1]["data_list"].push({dev_id: j["dev_id"], value: info.value, deviceName: this.idToName[j["dev_id"]], control_type: false})
                                this.infoList[1]["account"] = this.infoList[1]["data_list"].length
                            }
                            else{
                                this.unknown_value = true
                                // console.log("值有問題")
                                this.unknown_list["data_list"].push({dev_id: j["dev_id"], value: info.value, deviceName: this.idToName[j["dev_id"]]})
                                this.unknown_list["account"] = this.unknown_list["data_list"].length
                            }
        
                        }
                    }
                }
                else if(j.connect_status == 0 || j.data.length == 0){    //狀態:斷線
                    this.infoList[2]["data_list"].push({dev_id: j["dev_id"], value: undefined, deviceName: this.idToName[j["dev_id"]]})
                    this.infoList[2]["account"] = this.infoList[2]["data_list"].length
                    //continue
                }
            }
        },
        //查看對應狀態的設備
        check_list(item){
            if(this.infoList[item]["account"] == "-"){
                this.$notify({
                    type: 'warning',
                    title: this.$t("GENERAL.INFORM"),
                    message: this.$t("GENERAL.UPDATE_STATUS_FIRST")
                })
                return
            }
            this.statusVisible = true
            this.isShow = false
            this.isShowButton = false
            this.now_status = item
            //console.log(this.now_status)
            this.now_status_name = this.temp_name[item]
            if(item == 1){         //狀態:電源開啟
                this.temp_buttonName = this.$t("GENERAL.CLOSEALL")
                this.on_off_button = "off"
                if(this.infoList[item]["data_list"].length == 0){
                    this.isShow = false
                    this.isShowButton = false
                }
                else{ 
                    this.isShow = true
                    if(this.allControlSuccess == true){
                        this.isShowButton = false
                    }
                    else{
                        this.isShowButton = true
                    }
                }
                
            }
            else if(item == 0){         //狀態:電源關閉
                this.temp_buttonName = this.$t("GENERAL.OPENALL")
                this.on_off_button = "on"
                if(this.infoList[item]["data_list"].length == 0){
                    this.isShow = false
                    this.isShowButton = false
                }
                else{ 
                    this.isShow = true
                    if(this.allControlSuccess == true){
                        this.isShowButton = false
                    }
                    else{
                        this.isShowButton = true
                    }
                }
            }
        },
        //控制單個設備開(關)
        async powerControl(device,status){
            this.statusVisible = false
            this.$store.commit("setLoadingState");
            let res = await this.handleLoading(device["dev_id"],status)
            this.$store.commit("setLoadingState");
            if(!res){
                return
            }
            else{
                device["control_type"] = true
            }
            this.statusVisible = true
        },
        //控制全部設備開(關)
        async allpowerControl(deviceList,status){
            let all_success = 0
            //console.log(deviceList)
            this.statusVisible = false
            this.$store.commit("setLoadingProgress");
            this.$store.commit("setTotalLoading", deviceList.length)
            for(let i of deviceList){
                let res = await controlInstruction( i["dev_id"], status)
                //console.log(res)
                if(res.status !== "ok") {
                    this.control_fail_list.push(i)
                    all_success -= 1
                }
                else{
                    i["control_type"] = true
                }
                this.$store.commit("addCompleteLoading", 1)
            }
            
            this.$store.commit("setLoadingProgress");
            if(all_success == 0){
                this.isShowButton = false
                this.allControlSuccess = true
                this.$notify({
                    type: 'success',
                    title: this.$t("GENERAL.SUCCESS_TITLE"),
                    message: this.$t("GENERAL.ALL_DEVICE_CONTROL_SUCCESS")
                })
            }
            else{
                this.$notify({
                    type: 'fail',
                    title: this.$t("GENERAL.FAIL_TITLE"),
                    message: this.$t("GENERAL.ERROR_MSG_015")
                })
                this.controlResVisible = true
            }
        },

        async handleLoading(deviceId,arg) {
			// 跑loading
            const res = await controlInstruction( deviceId, arg)
            //console.log(res)
            if(res.status !== "ok") {
                this.$notify({
                    type: 'fail',
                    title: this.$t("GENERAL.FAIL_TITLE"),
                    message: this.$t("GENERAL.ERROR_MSG_015")
                })
                return false
            }
            return true
		},
        //更新空調卡片
        getCard(cardType) {
            if(!this.solutionData[cardType]) return;
            let deviceOrder = [];
            for(let cardId of Object.values(this.selectDevice[cardType]))
                deviceOrder = deviceOrder.concat(cardId);
            deviceOrder.sort((a, b) => Number(a.order) - Number(b.order));

            let newArr = [];
            for(let dev of deviceOrder){
                for(let card of this.solutionData[cardType].card){
                    let dev_info = card.device.find(item => {
                        return this.handleExceptionId(item) === dev.dev_id;
                    });
                    if(dev_info != undefined) newArr.push(dev_info);
                }
            }
            this.card = newArr;
        },

        to2DArray(dataList){   //將資料整理成二維陣列
            let array = []
            let arrtemp = []
            Object.keys(this.idToName).length = 0
            for(let i in dataList){
                var index = i % this.group_num
                if(index == 0){
                    arrtemp = []
                    array[array.length] = arrtemp
                }
                arrtemp[index] = dataList[i]["deviceId"]

                this.idToName[dataList[i]["deviceId"]] = dataList[i]["deviceName"]
            }
            return array

        }
    },
};
</script>
<style scoped>

.select-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.select-item span {
  text-align: center;
}

.context-button {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  /*font-size: 2vw;
  margin-top: 5px;
  margin-bottom: 16px;
  padding: 4px 20px;*/
  /* height: 20%;
  width: 30%; */
}

.dialog_size{
    /*width: 50%;*/
    height: 75vh;
}

.dialog-class {
  /*width: 50%;*/
  font-weight: bold;
  background: linear-gradient(rgba(19, 60, 131, 0.8), rgba(7, 118, 118, 0.8));
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
  border-radius: 10px;
  border-width: 1.5px;
  border-style: solid;
  -o-border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image-slice: 1;
  border-left-style: none;
  border-right-style: none;
}
</style>>