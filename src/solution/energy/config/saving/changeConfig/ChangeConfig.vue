<template>
	<div class="main" :Style="stylerwd('100','100','0','0')">
        <div class="slaveM "  :Style="stylerwd('100','30','0','10')">
            <div class="slaveL _48 text_item"  :Style="stylerwd('18','28','30','10')">{{ $t("GENERAL.DEVICE_NAME") }}</div>
            <select  v-if="judge==false" class="slaveL _48 input_item" :Style="stylerwd('38','28','30','45')" v-model='currentName'>    
                <option  v-for="item in menu" :value="item.deviceId" :key="item.deviceId">{{ item.deviceName }}</option>
            </select>
            <select  v-else class="slaveL _48 input_item" :Style="stylerwd('38','28','30','45')">    
                <option disabled="disabled" selected>{{ temp }}</option>
            </select>
        </div>
        <div class="slaveM "  :Style="stylerwd('100','40','0','40')">
            <div class="slaveL _48 text_item " :Style="stylerwd('27','23','30' ,'0')">{{ $t("GENERAL.TARGET_SET_VALUE") }} (kWh)</div>
            <input class="slaveL _48 input_item disappearBar" :Style="stylerwd('30','22','30','27')" type="number" min="1" v-model="value" />  
        </div>
	</div>
</template>

<script>
import { true_config , show_config , Setsetting , Addsetting , deviceName} from "../../../data/ston/data";
import vm from "@/main"
export default {
	data(){
		return{
			currentName: "",
            value: "",
			deviceId: this.$route.query.devId,
            menu: [],
            temp: "",
            judge: false,
		};
	},
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                if(f=='0'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
                }else if(f=='1'){
                    let h_tmp = this.title +  this.text * Math.ceil(this.selectList[h].dev.length / this.len );
                    let x = parseInt(100 * this.title / h_tmp)
                    tmp = "width: "+w+"%;height:"+x+"%;left:"+k+"%;top:"+t+"%;"; 
                }
                return tmp 
            }
        },
    },
	mixins: [],
	async created(){
        for(let i of vm.$store.state.solutionData.energy.card){
            for(let j of i["device"]){
                this.menu.push(j)
            }
        }
        console.log(this.deviceId)

        if(this.deviceId !== undefined){
            this.judge = true
            this.temp = true_config[this.deviceId]["deviceName"]
            
        }
        console.log(true_config)
        //取得現在選擇的
        for(let devid of Object.keys(true_config)){
            console.log(devid)
            if(devid == this.deviceId){
                this.currentName = true_config[devid].devid;
                this.value = true_config[devid].value;
                break;
            }
        }
	},
	mounted() {
		this.$bus.$on("configLoad", () => {
			// 判斷無空欄位
            let zero_flag = -1
            let item = {
                'deviceName' : deviceName[this.currentName]?deviceName[this.currentName]:this.currentName,
                'device_ID' :this.currentName,
                'value'    : this.value,
                //'isModify'   : true,
                
            };
            if(this.deviceId == undefined){
                if(item["deviceName"] == '' || item["value"] == ''){
                    this.$notify({
                        type: 'error',
                        title: this.$t("GENERAL.ERROR_MSG_011"),
                        message: this.$t("GENERAL.ERROR_MSG_013")
                        //this.$t("MOTOR.ADD_FLIE"),
                    })
                    return
                }
                zero_flag = item["value"].indexOf("0")
                if(zero_flag == 0 || item["value"].indexOf("-") !== -1){
                    this.$notify({
                        type: 'error',
                        title: this.$t("GENERAL.ERROR_MSG_011"),
                        message: this.$t("GENERAL.ERROR_MSG_014")
                    })
                    return
                }
                
                //新增
                Addsetting(item);
                console.log(true_config)
            }else{
                //修改
                Setsetting(this.deviceId , item);
                this.currentName = true_config[this.deviceId]["device_ID"]
                
            }
            //console.log(true_config)
			this.$router.back();
		});

        if(show_config.length !== 0){
            for(let i of show_config){
                for(let j in this.menu){
                    if(this.menu[j]["deviceName"] == i["deviceName"]){
                        this.menu.splice(j,1)
                    }
                }
            }
        }
        //console.log(this.menu)

	},
	beforeDestroy() {
		this.$bus.$off("configLoad");
	},
	methods: {
        // 
	},
};
</script>
