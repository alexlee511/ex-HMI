<template>
    <div class="main white_view" :Style="stylerwd()">
        <div class="slaveM" :Style="stylerwd('100','15','0' ,'0')">
            <div class="slaveC title_item _60" :Style="stylerwd('40','20','0' ,'0')">{{ $t("GENERAL.DEVICE_NAME") }}</div>
            <div class="slaveC title_item _60" :Style="stylerwd('40','100','40' ,'0')">{{ $t("GENERAL.TARGET_SET_VALUE") }} (kWh)</div>
        </div>
        <div class="slaveM" :Style="stylerwd('100','85','0' ,'15')">
            <div class="slaveM" v-for="(item, index) in configList" :key="index" :Style="stylerwd('100','15','0' , index, '1')" >
                    <div class="slaveC  _48 " :Style="stylerwd('40','100','0' ,'0' )" :class="classwd(item)">{{ item["deviceName"] }}</div>
                    <div class="slaveC  _48 " :Style="stylerwd('40','100','40','0' )" :class="classwd(item)">{{ item["value"] }}</div>
                    <img class="slaveC     " :Style="stylerwd('5' ,'80' ,'80','10')" src="~assets/images/modify.png" @click="goChange(item)"     />
                    <img class="slaveC     " :Style="stylerwd('5' ,'80' ,'90','10')" src="~assets/images/remove.png" @click="deleteDevice(item)" />
            </div>
        </div>
    </div>
</template>

<script>
import { show_config , true_config , add_config , Delsetting , restart , del_config , deviceName} from "../../../data/ston/data";
import { setTargetData , getTargetData , deleteTargetData} from "network/adv";
import { updateProfile  } from "common/constant/profile";

export default {
    data() {
        return {
            configList: [],
            temp: "",
            
        };
    },
    mixins: [],
    async created() {
        //this.configList = []
        this.init()
    },
    computed:{
        classwd: function(){
            return function(item){
                let index = add_config.findIndex(e => e.device_ID == item.devid)
                if( index != -1){
                    return 'change_item' ;
                }else{
                    return 'text_item' ;
                }
            }
        },
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                if(f=='0'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
                }else if(f=='1'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+ t * 15+"%;"; 
                }
                return tmp 
            }
        }
    },
     mounted() {
        this.$bus.$on("configApply", () => {
            this.add();    //套用
            
        });
        this.$bus.$on("previousPage", () => {
            restart();
            //重製
        });
    },
    beforeDestroy() {
        this.$bus.$off("configApply");
        this.$bus.$off("previousPage");
    },
    methods: {
        async init(){
            show_config.length = 0
            this.configList = []
            //判斷總List裡有沒有值，若無則從API獲取資料新增
            if(true_config.length == 0){
                let target_res = await getTargetData()
                if(target_res["status"] == "ok"){
                    //console.log(this.configList)
                    for(let i of target_res["data_list"]){
                        if(i["solution"] == "energy"){
                            for(let j of i["target_list"]){
                                if(typeof(deviceName[j["devid"]]) == "undefined"){
                                    j["deviceName"] = j["devid"]
                                    j["value"] = Number(j["value"]) / 1000 
                                }
                                else{
                                    j["deviceName"] = deviceName[j["devid"]]
                                    j["value"] = Number(j["value"]) / 1000 
                                }

                                this.configList.push(j)
                            }
                        }                   
                    }
                }
            }
            else{
                //console.log(true_config)
                this.configList = true_config
            }
            console.log(true_config)
            console.log(this.configList)
            for(let i of this.configList){
                show_config.push(i)
            }
        },
        async add(){
            //套用
            this.$store.commit("setLoadingState");
            let add_flag = 0
            let del_flag = 0
            
            console.log(add_config)
            console.log(del_config)
            if(add_config.length !== 0){
                for(let i of add_config){
                    console.log(i)
                    let add_res = await setTargetData("energy", i["devid"], (Number(i["value"]) * 1000))
                    if(add_res['status'] !== 'ok'){
                        add_flag++
                    }      
                }
            }
            //判斷有無要刪除的資訊
            if(del_config.length !== 0){
                for(let i of del_config){
                    let del_res = await deleteTargetData("energy", i["devid"])
                    //console.log(del_res)
                    if(del_res['status'] !== 'ok'){
                        del_flag++
                    }

                }  
            }
            await updateProfile()
            this.$store.commit("setLoadingState");
            await this.$store.dispatch("getSolutionData")

            if(add_flag != 0 || del_flag != 0){
                this.$notify({
                    type: 'error',
                    title:'',
                    message: this.$t("GENERAL.ERROR_MSG_016")     //部分資料傳送失敗
                })
                
            }
            if(add_config.length == add_flag && del_config.length == del_flag){
                this.$notify({
                    type: 'error',
                    title: '',
                    message: this.$t("GENERAL.ERROR_MSG_015")    //全部資料傳送失敗
                })
            }
            if(add_flag == 0 && del_flag == 0){
                this.$notify({
                    title: this.$t("GENERAL.DATA_SEND_SUCCESS"),  //傳送成功
                })
                restart()
                this.init()
            }
        },
        //刪除
        deleteDevice(item) {
            //console.log(item)
            if(true_config.length == 0){
                for(let i of this.configList){
                    true_config.push(i)
                }
            }
            Delsetting(item)
            this.configList = true_config
        },
        //編輯
        goChange(item) {
            let path = this.$route.path.replace(/configView/i, "ChangeConfig")
            //console.log(item)
            if(true_config.length == 0){
                for(let i of this.configList){
                    true_config.push(i)
                }
            }
            let truIndex = 0
            truIndex = true_config.indexOf(item)
            this.$router.push({
                path: path,
                query: {
                    devId: truIndex,
                },
            });
        },
    },
};
</script>
